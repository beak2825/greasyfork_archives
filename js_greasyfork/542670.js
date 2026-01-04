// ==UserScript==
// @name         Devabit Jira+
// @namespace    http://tampermonkey.net/
// @version      4.0.2
// @description  Jira enhancements.
// @match        https://devabit.atlassian.net/browse/*
// @match        https://devabit.atlassian.net/jira/*
// @grant        none
// @license      3-clause BSD
// @downloadURL https://update.greasyfork.org/scripts/542670/Devabit%20Jira%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/542670/Devabit%20Jira%2B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const deadlineMap = new Map();
    // const estimatedHoursMap = new Map();

    const uaMonths = {
        січ: 0,
        лют: 1,
        бер: 2,
        квіт: 3,
        трав: 4,
        черв: 5,
        лип: 6,
        серп: 7,
        вер: 8,
        жовт: 9,
        лист: 10,
        груд: 11,
    };

    const jiraColors = {
        red: "#a10a0a",
        green: "#315e1d",
        yellow: "#ffd414",
        white: "#ffffff",
        black: "#000000",
    };

    // function parseDateString(str) {
    //   // Parses date like "16 лип. 2025 р." or "16 лип. 2025 р., 17:00"
    //   // Ignores time after comma
    //   const regex = /(\d{1,2})\s([а-яіїєґ]{3})\.?\s(\d{4})/i;
    //   const m = regex.exec(str);
    //   if (!m) return null;
    //   return {
    //     day: +m[1],
    //     month: m[2].toLowerCase(),
    //     year: +m[3],
    //   };
    // }

    function feature_hideAIMate() {
        const span = document.querySelector('span[data-testid="atlassian-navigation.ui.conversation-assistant.app-navigation-ai-mate"]');
        if (span) {
            span.style.display = "none";
        }

        const div = document.querySelector('div._1e0c1txw._vchhusvi._gy1pu2gc._1p57u2gc._4cvr1h6o._2lx2vrvc._kqswh2mm')

        if (div) {
        div.style.display = "none";
        }
    }

    function parseDateTimeString(str) {
        if (!str) return null;

        // Example: "Dec 03, 2025, 7:00 PM"
        const regex = /^([A-Za-z]{3}) (\d{2}), (\d{4}), (\d{1,2}):(\d{2}) (AM|PM)$/;
        const m = str.match(regex);
        if (!m) return null;

        const [, monStr, day, year, hh, mm, ampm] = m;

        const month = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
        ].indexOf(monStr);

        let hours = parseInt(hh, 10);
        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        return new Date(
            parseInt(year, 10),
            month,
            parseInt(day, 10),
            hours,
            parseInt(mm, 10),
            0
        );
    }


    function formatTimeLeft(ms) {
        const absMs = Math.abs(ms);
        const totalSeconds = Math.floor(absMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = Math.floor(totalDays / 30);

        let parts = [];

        if (totalMonths >= 1) {
            parts.push(`${totalMonths}mo`);
            const remainingDays = totalDays % 30;
            if (remainingDays) parts.push(`${remainingDays}d`);
        } else if (totalWeeks >= 1) {
            parts.push(`${totalWeeks}w`);
            const remainingDays = totalDays % 7;
            if (remainingDays) parts.push(`${remainingDays}d`);
        } else {
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (totalDays) parts.push(`${totalDays}d`);
            if (hours) parts.push(`${hours}h`);
            if (minutes) parts.push(`${minutes}m`);
            if (seconds || parts.length === 0) {
                parts.push(`${seconds.toString().padStart(2, "0")}s`);
            }
        }

        const label = parts.join(" ");

        // --- Format exact target date ---
        const target = new Date(Date.now() + ms);

        const uaMonths = [
            "січня", "лютого", "березня", "квітня", "травня", "червня",
            "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
        ];

        const dd = target.getDate();
        const mm = uaMonths[target.getMonth()];
        const yyyy = target.getFullYear();
        const HH = target.getHours().toString().padStart(2, "0");
        const MM = target.getMinutes().toString().padStart(2, "0");

        // 12-hour format with AM/PM
        let hours12 = target.getHours() % 12;
        if (hours12 === 0) hours12 = 12;
        const ampm = target.getHours() >= 12 ? "PM" : "AM";
        const HH12 = hours12.toString().padStart(2, "0");

        const formattedDate24 = `${HH}:${MM}`;
        const formattedDate12 = `${HH12}:${MM} ${ampm}`;

        // Combine both formats
        const formattedDateCombined = `${dd} ${mm} ${yyyy} р., ${formattedDate24} (${formattedDate12})`;

        if (ms <= 0) {
            return `${formattedDateCombined}\n(over deadline by ${label})`;
        } else {
            return `${formattedDateCombined}\n(left ${label})`;
        }
    }


    // function datesMatch(date1, date2) {
    //   return (
    //     date1 &&
    //     date2 &&
    //     date1.day === date2.day &&
    //     date1.month === date2.month &&
    //     date1.year === date2.year
    //   );
    // }

    function jiraTimeToHours(input) {
        if (!/\d/.test(input)) return null; // ignore if no digits

        const timeUnits = {
            w: 40,
            d: 8,
            h: 1,
            m: 1 / 60,
        };
        const regex = /(\d+)\s*(w|d|h|m)/gi;
        let totalHours = 0,
            match;

        while ((match = regex.exec(input)) !== null) {
            totalHours += parseInt(match[1], 10) * timeUnits[match[2].toLowerCase()];
        }

        return +totalHours.toFixed(2);
    }

    function isDueDeadlineApply() {
        const el = document.querySelector(
            'button[id="issue.fields.status-view.status-button"] > span.css-178ag6o'
        );
        return !(
            el &&
            (el.innerText === "Delivered" ||
             el.innerText === "Within client" ||
             el.innerText === "Archive" ||
             el.innerText === "Scheduled")
        );
    }

    function feature_highlightIfMonthBilledIsIncorrect() {
        if (!isDueDeadlineApply()) return;

        const tags = document.querySelectorAll(
            'span[data-testid="issue.views.common.tag.tag-item"] > span'
        );
        const now = new Date();
        const currentMonth = now.toLocaleString("en-US", {
            month: "long",
        });
        const currentYear = now.getFullYear();

        tags.forEach((tag) => {
            // Check for Delivered in sibling span.css-178ag6o
            const parent = tag.closest(
                'span[data-testid="issue.views.common.tag.tag-item"]'
            );
            if (!parent) return;

            const deliveredSpan = parent.querySelector("span.css-178ag6o");
            if (deliveredSpan && deliveredSpan.textContent.includes("Delivered")) {
                // Skip highlighting & timer for this task
                parent.style.backgroundColor = "";
                parent.style.color = "";
                parent.style.border = "";
                return;
            }

            const text = tag.textContent.trim();
            const regex = /^([A-Za-z]+)\s+(\d{4})$/;
            const match = text.match(regex);
            if (!match) return;

            const [_, tagMonth, tagYearStr] = match;
            const tagYear = parseInt(tagYearStr, 10);

            parent.style.border = "none"; // remove border

            if (
                tagMonth.toLowerCase() === currentMonth.toLowerCase() &&
                tagYear === currentYear
            ) {
                parent.style.backgroundColor = jiraColors.green; // green
                parent.style.color = "white";
            } else {
                parent.style.backgroundColor = jiraColors.red; // red
                parent.style.color = "white";
            }
        });
    }

    function feature_highlightIfPOisReceived() {
        const spans = document.querySelectorAll(
            'div[data-testid="issue.views.field.checkbox-inline-edit.customfield_10357--container"] > form > div._1pfhu2gc > div._vwz4kb7n > div > div > div > div > div > div >  span > span._11c82smr._1reo15vq._18m915vq._p12fmgvx._1bto1l2s._o5721q9c'
        );
        if (!spans.length) return;

        spans.forEach((span) => {
            const value = span.textContent.trim().toLowerCase();
            const parent = span.parentElement?.closest("span");
            if (!parent) return;

            parent.style.border = "none";
            parent.style.borderRadius = "4px";

            if (value === "yes") {
                parent.style.backgroundColor = jiraColors.green;
                parent.style.color = "#ffffff";
            } else if (value === "no") {
                parent.style.backgroundColor = jiraColors.red;
                parent.style.color = "#ffffff";
            } else {
                parent.style.backgroundColor = "";
                parent.style.color = "";
            }
        });
    }

    function feature_updateJiraTime() {
        const selectors = [
            ".css-v44io0",
            "._19pkidpf._2hwxidpf._otyridpf._18u0idpf._1i4qfg65._11c81o8v._y3gn1h6o",
            "span > span > ._k48p1wq8",
            'span[data-testid="issue.issue-view.common.logged-time.value"]',
            'span[data-testid="issue.component.logged-time.remaining-time"] > span',
        ];

        document.querySelectorAll(selectors.join(",")).forEach((el) => {
            let original = el.getAttribute("data-original");
            if (!original) {
                original = el.textContent.trim();
                el.setAttribute("data-original", original);
            }

            // Skip if no digits in string
            if (!/\d/.test(original)) return;

            // Skip non-time strings in .css-v44io0
            if (el.classList.contains("css-v44io0") && !/[wdhm]/i.test(original)) {
                return;
            }

            const hours = jiraTimeToHours(original);
            if (hours == null) return;

            el.textContent = `${hours}h`;
        });
    }

    function feature_bailando() {
        const aEl = document.querySelector( 'a[aria-label="Go to your Jira homepage"]' );

        if (aEl) { aEl.removeAttribute("style"); aEl.style.textDecoration = "none"; }

        const logoWrapper = document.querySelector( 'span[data-testid="atlassian-navigation--product-home--icon--wrapper"]' );

        if (!logoWrapper) return;
        // Remove existing SVG
        const svg = logoWrapper.querySelector("svg");
        if (svg) svg.remove();

        // Use flex container
        logoWrapper.style.display = "flex";
        logoWrapper.style.alignItems = "center";
        logoWrapper.style.gap = "8px";

        // Add GIF only once
        if (!logoWrapper.querySelector("img.devabit-gif")) {
            const img = document.createElement("img");
            // img.src = "https://media.tenor.com/vX-qFMkapQQAAAAj/cat-dancing.gif";
            img.src = "https://media.tenor.com/gfILJ_kUMhQAAAAj/frog-happy.gif";
            img.className = "devabit-gif";
            img.style.height = "28px",
                img.style.width = "auto";
            img.style.verticalAlign = "middle";
            logoWrapper.appendChild(img);
        }

        // Add/update Жира span
        const target = document.querySelector(
            "span._19pkidpf._2hwxidpf._otyridpf._18u0idpf._1i4qfg65._11c82smr._1reo15vq._18m915vq._1e0ccj1k._sudp1e54._1nmz9jpi._k48p1pd9"
        );
        if (!target) return;

        target.textContent = "тут був Андрій Л :)";
    }

    function feature_setupLiveDeadlineCountdown() {
        const containers = document.querySelectorAll(
            'div[data-testid="issue-field-date-time.ui.issue-field-date-time--container"] > div'
        );
        containers.forEach((el) => {
            if (!deadlineMap.has(el)) {
                //let original = el.getAttribute("data-original");
                //if (!original) {
                const original = el.textContent.trim();
                //el.setAttribute("data-original", original);
                //}

                const deadline = parseDateTimeString(original);
                if (!deadline) return;

                deadlineMap.set(el, {
                    deadline,
                    original,
                });
            }
        });
    }

    function feature_updateLiveDeadlineCountdown() {
        const now = new Date();

        deadlineMap.forEach((info, el) => {
            const msLeft = info.deadline - now;
            const hoursLeft = msLeft / (1000 * 60 * 60);

            let label = formatTimeLeft(msLeft);

            if (isDueDeadlineApply()) {
                el.innerText = `${label}`;
                el.style.whiteSpace = "pre";
                el.style.flexDirection = "column";
                el.style.gap = "0rem";
                el.style.alignItems = "flex-start";
            } else {
                el.textContent = `${info.original}`;
                el.style.whiteSpace = "normal";
                el.style.backgroundColor = "";
                return;
            }

            if (msLeft <= 0) {
                el.style.backgroundColor = jiraColors.red;
                el.style.color = "#ffffff";
            } else if (hoursLeft < 0.5) {
                el.style.backgroundColor = jiraColors.yellow; // yellow
                el.style.color = "#000000";
            } else {
                el.style.backgroundColor = jiraColors.green; // green
                el.style.color = "#ffffff";
            }
        });
    }

    function getProjectCode() {
        const heading = document.querySelector(
            'h1[data-testid="issue.views.issue-base.foundation.summary.heading"]'
        );
        if (!heading) return null;

        const title = heading.textContent.trim();

        const casePatterns = [
            /[A-Z]{2}-[A-Z]{3}\d{7}-\d{3}/g, // AI-DFL2507006-016
            /[A-Z]{2}-[A-Z]{3}\d{7}/g, // AI-DFL2507006
            /\d{4}\/\d{5}(?:\/#\d+)?/g, // 2025/62049/#2 or 2025/62049
            /\b\d{4}\/\d{4}\b/g, // 3411/2025 (including "Quote 3411/2025")
        ];

        for (const pattern of casePatterns) {
            const matches = title.match(pattern);
            if (matches?.length) {
                return matches[matches.length - 1];
            }
        }

        return null;
    }

    function getDeadlineText() {
        const deadlineContainer = document.querySelector(
            'div[data-testid="issue-field-date-time.ui.issue-field-date-time--container"] > div'
        );
        if (!deadlineContainer) return;
        const deadlineText = deadlineContainer.textContent.trim();
        if (!deadlineText) return;
        return deadlineText;
    }

    function getServerPath() {
        const description =
              document.querySelector(
                  '[data-testid="issue.views.field.rich-text.description"]'
              )?.innerText || "";
        const match = description.match(/M:\\[^\s\n\r]*/i);
        if (!match) return null;

        // Remove any trailing word-like junk (like "Instructions" stuck to the path)
        const cleaned = match[0].replace(/([A-Za-z0-9_-]+)(?=[A-Z][a-z])/, "$1"); // optional: fine-tune

        return cleaned;
    }

    function feature_insertInfoCopyButton() {
        const projectCode = getProjectCode();

        let deadlineText = getDeadlineText();
        deadlineText = deadlineText?.replace(/\s*\(.*?\)\s*$/, "") ?? "";

        const serverPath = getServerPath();

        const previousParent = document.querySelector(
            'div[data-testid="issue.views.issue-base.context.status-and-approvals-wrapper.status-and-approval"] > div'
        );
        if (!previousParent) return;

        previousParent.style.paddingLeft = "0"; // ← add this line

        const container = previousParent.parentElement;
        if (!container) return;

        const existing = container.querySelector("#case-id-overlay");
        if (existing) existing.remove();

        const overlay = document.createElement("div");
        overlay.id = "case-id-overlay";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.gap = "6px";
        overlay.style.marginBottom = "12px";

        function createRow(buttonText, valueText) {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.gap = "8px";

            const btn = document.createElement("button");
            btn.textContent = buttonText;
            btn.className =
                "_mizu194a _1ah31bk5 _ra3xnqa1 _128m1bk5 _1cvmnqa1 _4davt94y _19itglyw _vchhusvi _r06hglyw _80omtlke _2rkosqtm _11c82smr _v5649dqc _189eidpf _1rjc12x7 _1e0c116y _1bsbviql _p12f1osq _kqswh2mm _4cvr1q9y _1bah1h6o _gy1p1b66 _1o9zidpf _4t3iviql _k48p1wq8 _y4tize3t _bozgze3t _y3gn1h6o _s7n4nkob _14mj1kw7 _9v7aze3t _1tv3nqa1 _39yqe4h9 _11fnglyw _18postnw _bfhk1w7a _syaz1gjq _8l3mmuej _aetrb3bt _10531gjq _f8pj1gjq _30l31gjq _9h8h1gjq _irr3166n _1di61dty _4bfu18uv _1hmsglyw _ajmmnqa1 _1a3b18uv _4fprglyw _5goinqa1 _9oik18uv _1bnxglyw _jf4cnqa1 _1nrm18uv _c2waglyw _1iohnqa1";
            btn.style.padding = "6px 8px 6px 8px";
            btn.style.width = "fit-content";

            btn.addEventListener("click", () => {
                navigator.clipboard.writeText(valueText);
            });

            const text = document.createElement("span");
            text.textContent = valueText;
            text.title = valueText;
            text.style.userSelect = "text";
            text.style.fontWeight = "normal";
            text.style.flex = "1";
            text.style.whiteSpace = "nowrap";
            text.style.overflow = "hidden";
            text.style.textOverflow = "ellipsis";

            row.appendChild(btn);
            row.appendChild(text);

            return row;
        }

        if (projectCode) overlay.appendChild(createRow("Copy", projectCode));
        if (deadlineText) overlay.appendChild(createRow("Copy", deadlineText));
        if (serverPath) overlay.appendChild(createRow("Copy", serverPath));

        container.appendChild(overlay);
    }

    // function debounce(func, delay) {
    //   let timer;
    //   return function (...args) {
    //     clearTimeout(timer);
    //     timer = setTimeout(() => func.apply(this, args), delay);
    //   };
    // }

    function setJiraBackgroundGIF() {
        // Remove existing background if any
        let bgDiv = document.getElementById("jira-bg-gif");
        if (!bgDiv) {
            bgDiv = document.createElement("div");
            bgDiv.id = "jira-bg-gif";
            document.body.prepend(bgDiv);
        }

        Object.assign(bgDiv.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            opacity: "10%",
            zIndex: "10", // behind everything
            pointerEvents: "none", // allow clicks through
            backgroundImage: 'url("https://www.animationsoftware7.com/img/agifs/snow02.gif")',
            backgroundRepeat: "repeat",          // repeat horizontally & vertically
            backgroundSize: "auto",
            mixBlendMode: "difference"  // apply difference blending

        });

        // --- Small bottom-right GIF ---
        let cornerGif = document.getElementById("jira-corner-gif");
        if (!cornerGif) {
            cornerGif = document.createElement("img");
            cornerGif.id = "jira-corner-gif";
            document.body.appendChild(cornerGif);
        }
        cornerGif.src = "https://media.tenor.com/6gAeTRLLtz8AAAAj/snowman-peepo.gif";
        Object.assign(cornerGif.style, {
            position: "fixed",
            bottom: "0",
            right: "0",
            width: "60px",
            height: "auto",
            zIndex: "1000",
            pointerEvents: "none"
        });
    }

    // setJiraBackgroundGIF();


    function runAllEnhancements() {
        // feature_insertInfoCopyButton();

        feature_hideAIMate();
        feature_highlightIfPOisReceived();
        // feature_bailando();
        feature_setupLiveDeadlineCountdown();
        feature_updateLiveDeadlineCountdown();
        feature_highlightIfMonthBilledIsIncorrect();
        feature_updateJiraTime();
    }

    // const debouncedUpdate = debounce(runAllEnhancements, 150);

    //const observer = new MutationObserver(debouncedUpdate);
    // observer.observe(document.body, {
    //childList: true,
    //  subtree: true,
    //});

    // window.addEventListener("load", runAllEnhancements);
    setInterval(runAllEnhancements, 200)
    // setInterval(feature_updateJiraTime, 150);
})();
