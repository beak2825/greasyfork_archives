// ==UserScript==
// @name         MZ - Training Report Checker
// @namespace    douglaskampl
// @version      4.91
// @description  Checks (periodically) if the training report is already out for the current day
// @author       Douglas
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     trainingReportCheckerStyles https://mzdv.me/mz/userscript/other/trainingReport.css
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494191/MZ%20-%20Training%20Report%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/494191/MZ%20-%20Training%20Report%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(GM_getResourceText('trainingReportCheckerStyles'));

    const CONFIG = {
        CHECK_INTERVAL: 200000, /* [in ms] */
        TIMEZONE_OFFSET: -3,
        FETCH_URL_REPORT: 'https://www.managerzone.com/ajax.php?p=trainingReport&sub=daily&sport=soccer&day=',
        READY_ICON_HTML: '<span class="report-icon ready"><i class="fa fa-unlock"></i></span>',
        NOT_READY_ICON_HTML: '<span class="report-icon not-ready"><i class="fa fa-lock"></i></span>',
        STORAGE_KEY: 'reportCheckedDate',
    };

    const DAY_MAP = {
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: null
    };

    class TrainingReportChecker {
        constructor() {
            this.linkId = 'shortcut_link_trainingreport';
            this.modalId = 'training_report_modal';
            this.balls = null;
            this.ballPlayers = [];
            this.hovering = false;
            this.isSoccer = false;
        }

        init() {
            this.verifySportIsSoccer();
            if (!this.isSoccer) return;
            if (this.isSaturday()) return;

            this.addTrainingReportLink();
            this.updateModalContent(false);
            this.checkTrainingReport();
        }

        verifySportIsSoccer() {
            const sportLink = document.querySelector('#shortcut_link_thezone');
            if (!sportLink) {
                 const pageSportMeta = document.querySelector('meta[name="mz-sport"]');
                 if(pageSportMeta && pageSportMeta.content === 'soccer') {
                    this.isSoccer = true;
                 }
                 return;
            }
            const sport = new URL(sportLink.href).searchParams.get('sport');
            if (sport === 'soccer') {
                this.isSoccer = true;
            }
        }

        isSwedishDSTActive() {
            const now = new Date();
            const year = now.getUTCFullYear();

            const getLastSundayOfMonthUTC = (month) => {
                const lastDay = new Date(Date.UTC(year, month + 1, 0));
                const dayOfWeek = lastDay.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                const date = lastDay.getUTCDate() - dayOfWeek;
                return new Date(Date.UTC(year, month, date, 1, 0, 0)); // DST change occurs at 1:00 UTC
            };

            const dstStart = getLastSundayOfMonthUTC(2); // March (Month is 0-indexed)
            const dstEnd = getLastSundayOfMonthUTC(9);   // October

            const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

            return nowUTC >= dstStart.getTime() && nowUTC < dstEnd.getTime();
        }

        addTrainingReportLink() {
            const targetDiv = document.getElementById('pt-wrapper');
            if (!targetDiv) return;

            const link = document.createElement('a');
            link.id = this.linkId;
            link.href = '/?p=training_report';
            link.title = '';
            link.innerHTML = CONFIG.NOT_READY_ICON_HTML;
            targetDiv.appendChild(link);

            this.createModal();
            link.addEventListener('mouseenter', () => this.showModal());
            link.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
            const modal = document.getElementById(this.modalId);
            modal.addEventListener('mouseenter', () => {
                this.hovering = true;
            });
            modal.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        }

        updateModalContent(isReady) {
            const modal = document.getElementById(this.modalId);
            if (!modal) return;

            const todayStr = this.getBrDate();
            let content;
            const currentDayIsSaturday = this.getBrTime().getDay() === 6 && !this.isExtendedFriday();

             if (currentDayIsSaturday) {
                 return;
             }

            if (this.isExtendedFriday()) {
                if (isReady) {
                    content = `Training report is out for ${todayStr} (Friday).`;
                    if (this.balls !== null && this.balls > 0 && this.ballPlayers.length > 0) {
                        content += '<br>Training balls earned today: <br>';
                        content += '<ul style="list-style-type: none; padding: 0; margin: 5px 0;">';
                        this.ballPlayers.forEach(player => {
                            content += `<li style="margin: 2px 0;">${player.name} (${player.skill})</li>`;
                        });
                        content += '</ul>';
                    }
                    modal.className = 'ready';
                } else {
                    content = `Training report is not out yet for ${todayStr} (Friday).`;
                    modal.className = 'not-ready';
                }
            } else if (isReady) {
                content = `Training report is out for ${todayStr}!`;
                 if (this.balls !== null && this.balls > 0 && this.ballPlayers.length > 0) {
                    content += '<br>Training balls earned today: <br>';
                    content += '<ul style="list-style-type: none; padding: 0; margin: 5px 0;">';
                    this.ballPlayers.forEach(player => {
                        content += `<li style="margin: 2px 0;">${player.name} (${player.skill})</li>`;
                    });
                    content += '</ul>';
                }
                modal.className = 'ready';
            } else {
                content = `Training report is not out yet for ${todayStr}.`;
                modal.className = 'not-ready';
            }
            modal.innerHTML = content;
        }

        async checkTrainingReport() {
             if (!this.isWithinCheckWindow()) {
                 if(!this.hasReportBeenCheckedToday()){
                    setTimeout(() => this.checkTrainingReport(), CONFIG.CHECK_INTERVAL);
                 }
                 return;
             }

            const now = this.getBrTime();
            let day = now.getDay();
            if (this.isExtendedFriday()) day = 5;
            const dayIndex = DAY_MAP[day];

            if (!dayIndex) {
                 this.updateModalContent(false);
                 return;
             }

            if (this.hasReportBeenCheckedToday()) {
                const link = document.getElementById(this.linkId);
                if (link) {
                    link.innerHTML = CONFIG.READY_ICON_HTML;
                }
                await this.fetchEarnedBalls();
                this.updateModalContent(true);
                return;
            }

            try {
                const response = await fetch(CONFIG.FETCH_URL_REPORT + dayIndex + '&sort_order=desc&sort_key=modification&player_sort=all');
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const table = doc.querySelector('body > table:nth-child(3)');

                if (table && this.isReportReady(table)) {
                    this.markReportAsChecked();
                    this.updateModalContent(true);
                } else {
                     const link = document.getElementById(this.linkId);
                     if (link) {
                          link.innerHTML = CONFIG.NOT_READY_ICON_HTML;
                     }
                     this.updateModalContent(false);
                     setTimeout(() => this.checkTrainingReport(), CONFIG.CHECK_INTERVAL);
                }
            } catch (_e) {
                 setTimeout(() => this.checkTrainingReport(), CONFIG.CHECK_INTERVAL);
            }
        }

        getBrDate() {
            const date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            const brTime = new Date(utc + (3600000 * CONFIG.TIMEZONE_OFFSET));
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(brTime);
        }

        getBrTime() {
            const date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            return new Date(utc + (3600000 * CONFIG.TIMEZONE_OFFSET));
        }

        isExtendedFriday() {
            const now = this.getBrTime();
            return now.getDay() === 6 && now.getHours() < 1;
        }

        isSaturday() {
             const now = this.getBrTime();
             return now.getDay() === 6 && !this.isExtendedFriday();
        }

        isWithinCheckWindow() {
            const now = this.getBrTime();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const currentDay = now.getDay();

            if (this.isSaturday()) return false;

            if (this.isExtendedFriday()) return true;

            let startHour, startMinute;
            const endHour = 23;
            const endMinute = 59;

            if (this.isSwedishDSTActive()) {
                startHour = 19;
                startMinute = 0;
            } else {
                startHour = 20;
                startMinute = 0;
            }

            const startTime = startHour * 60 + startMinute;
            const checkEndTime = endHour * 60 + endMinute;
            const currentTime = hour * 60 + minute;

            return currentTime >= startTime && currentTime <= checkEndTime;
        }

        createModal() {
            const modal = document.createElement('div');
            modal.id = this.modalId;
            document.body.appendChild(modal);
        }

        positionModal() {
            const icon = document.getElementById(this.linkId);
            const modal = document.getElementById(this.modalId);
            if (!icon || !modal) return;
            const rect = icon.getBoundingClientRect();
            modal.style.top = (window.scrollY + rect.bottom + 5) + 'px';
            modal.style.left = (window.scrollX + rect.left + 50) + 'px';
        }

        showModal() {
            const modal = document.getElementById(this.modalId);
            if (!modal) return;
            this.hovering = true;
            this.positionModal();
            modal.style.display = 'block';
            modal.classList.remove('fade-out');
            modal.classList.add('fade-in');
        }

        handleMouseLeave(e) {
            const modal = document.getElementById(this.modalId);
            const icon = document.getElementById(this.linkId);
            if (!icon || !modal) return;
            const relatedTarget = e.relatedTarget;
            if (relatedTarget !== modal && relatedTarget !== icon) {
                this.hovering = false;
                this.hideModal();
            }
        }

        hideModal() {
            if (!this.hovering) {
                const modal = document.getElementById(this.modalId);
                if (!modal) return;
                modal.classList.remove('fade-in');
                modal.classList.add('fade-out');
                setTimeout(() => {
                    if (!this.hovering) {
                        modal.style.display = 'none';
                    }
                }, 200);
            }
        }

        isReportReady(table) {
            return Array.from(table.querySelectorAll('tr')).some(row =>
                row.querySelector('img[src*="training_camp.png"]') ||
                row.querySelector('img[src*="gained_skill.png"]')
            );
        }

        markReportAsChecked() {
            const today = this.getBrDate();
            GM_setValue(CONFIG.STORAGE_KEY, today);
            const link = document.getElementById(this.linkId);
            if (link) {
                 link.innerHTML = CONFIG.READY_ICON_HTML;
                 const iconSpan = link.querySelector('.report-icon');
                 if (iconSpan) {
                      iconSpan.addEventListener('animationend', () => {
                          iconSpan.classList.remove('ready-transition');
                      }, { once: true });
                     iconSpan.classList.add('ready-transition');
                 }
             }
            this.fetchEarnedBalls();
         }

        async fetchEarnedBalls() {
            this.balls = 0;
            this.ballPlayers = [];
            try {
                const now = this.getBrTime();
                let day = now.getDay();
                if (this.isExtendedFriday()) day = 5;
                const dayIndex = DAY_MAP[day];
                if (!dayIndex) return;

                const response = await fetch(CONFIG.FETCH_URL_REPORT + dayIndex + '&sort_order=desc&sort_key=modification&player_sort=all');
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const playerDetails = [];
                const rows = doc.querySelectorAll('tr');

                rows.forEach(row => {
                    const ballImg = row.querySelector('img[src*="gained_skill.png"]');
                    if (ballImg) {
                        const nameLink = row.querySelector('.player_link');
                        const skillCell = row.querySelector('.skillColumn .clippable');
                        if (nameLink && skillCell) {
                             const fullName = nameLink.textContent.trim();
                             const nameParts = fullName.split(' ');
                             const shortName = nameParts.length > 1
                                 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}`
                                 : fullName;
                            const skill = skillCell.textContent.trim();
                            playerDetails.push({ name: shortName, skill: skill });
                         }
                     }
                });

                if (playerDetails.length > 0) {
                     this.balls = playerDetails.length;
                     this.ballPlayers = playerDetails;
                     this.updateModalContent(true);
                } else {
                     this.updateModalContent(this.hasReportBeenCheckedToday());
                }
            } catch (_e) {
                this.updateModalContent(this.hasReportBeenCheckedToday());
            }
        }

        hasReportBeenCheckedToday() {
            const today = this.getBrDate();
            return GM_getValue(CONFIG.STORAGE_KEY) === today;
        }
    }

     const checker = new TrainingReportChecker();
     if (document.readyState === 'complete' || document.readyState === 'interactive') {
         checker.init();
     } else {
         document.addEventListener('DOMContentLoaded', () => checker.init());
     }
})();
