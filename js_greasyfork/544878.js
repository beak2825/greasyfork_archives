// ==UserScript==
// @name         Asobiticket Auto Field Replacer GUI
// @namespace    https://asobistore.jp/
// @version      2.4.1
// @description  Hide and replace
// @author       FUJITAKtone
// @license      FUJITAKtone
// @match        https://asobiticket2.asobistore.jp/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544878/Asobiticket%20Auto%20Field%20Replacer%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/544878/Asobiticket%20Auto%20Field%20Replacer%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'asobi_replace_cache_gui';
    const EXPIRE_MS = 3 * 60 * 1000;

    const DEFAULTS = {
        NAME_JA:   "デビ 太郎",
        BIRTH_JA:  "2018年4月24日",
        BIRTH_ISO: "2018-4-24",
        KANRI_NO:  "Y0000"
    };

    function getCache() {
        try {
            const obj = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (obj && Date.now() - obj.ts < EXPIRE_MS) return obj.data;
        } catch {}
        return null;
    }
    function setCache(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ts: Date.now(), data}));
    }

    function showModal(onSubmit) {
        if (document.getElementById('asobi-gui-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'asobi-gui-modal';
        modal.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
          <form id="asobi-gui-form" style="background:white;border-radius:16px;box-shadow:0 4px 16px #0004;max-width:350px;padding:28px 22px 14px 22px;font-size:16px;">
            <div style="margin-bottom:12px;"><b>Input info for replacement:</b></div>
            <div style="margin-bottom:8px;">Name (XX YY):<input type="text" id="asobi_name" style="width: 80%;" value="${DEFAULTS.NAME_JA}" required></div>
            <div style="margin-bottom:8px;">Birthday (XXXX年Y月Z日):<input type="text" id="asobi_birth" style="width: 80%;" value="${DEFAULTS.BIRTH_JA}" required></div>
            <div style="margin-bottom:8px;">Birthday (ISO):<input type="text" id="asobi_iso" style="width: 80%;" value="${DEFAULTS.BIRTH_ISO}" required></div>
            <div style="margin-bottom:18px;">管理番号:<input type="text" id="asobi_kanri" style="width: 80%;" value="${DEFAULTS.KANRI_NO}" required></div>
            <button type="submit" style="width:100%;padding:8px 0;border:none;background:#1f6ee9;color:white;font-size:16px;border-radius:8px;">OK</button>
          </form>
        </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => document.getElementById('asobi_name').focus(), 30);

        document.getElementById('asobi-gui-form').onsubmit = function(e) {
            e.preventDefault();
            const data = {
                NAME_JA:   document.getElementById('asobi_name').value,
                BIRTH_JA:  document.getElementById('asobi_birth').value,
                BIRTH_ISO: document.getElementById('asobi_iso').value,
                KANRI_NO:  document.getElementById('asobi_kanri').value
            };
            setCache(data);
            document.body.removeChild(modal);
            onSubmit(data);
        };
    }

    function removeHideStyle() {
        const styleElem = document.getElementById('hideAsobiFields');
        if (styleElem) styleElem.remove();
    }

    function replaceFields(cfg, doc = document) {
        const valueMainElements = doc.querySelectorAll('.value-main');
        if (valueMainElements.length >= 2) {
            valueMainElements[0].textContent = cfg.NAME_JA;
            valueMainElements[1].textContent = cfg.BIRTH_JA;
        }
        doc.querySelectorAll('.ticket-info').forEach(ticketInfo => {
            const label = ticketInfo.querySelector('.label');
            const valueElem = ticketInfo.querySelector('.value');
            if (label && valueElem && label.textContent.trim() === "管理番号") {
                valueElem.textContent = cfg.KANRI_NO;
            }
        });
        const inputName = doc.querySelector('input[name="user_name"]');
        if (inputName)  inputName.value = cfg.NAME_JA;
        const inputBirth = doc.querySelector('input[name="birth_date"]');
        if (inputBirth) inputBirth.value = cfg.BIRTH_ISO;
    }

    // Hide fields before render
    const hideStyle = document.createElement('style');
    hideStyle.id = 'hideAsobiFields';
    hideStyle.textContent = `
        .value-main > *:nth-child(1),
        .value-main > *:nth-child(2) {
            visibility: hidden !important;
        }
        .ticket-info .value {
            visibility: hidden !important;
        }
        #asobi-gui-modal { z-index: 2147483647 !important; }
    `;
    if (document.head) {
        document.head.appendChild(hideStyle);
    } else if (document.documentElement) {
        document.documentElement.appendChild(hideStyle);
    }

    function main(cfg) {
        let replaced = false, count = 0;
        function tryReplace() {
            count++;
            replaceFields(cfg, document);
            document.querySelectorAll('iframe').forEach(f => {
                try { replaceFields(cfg, f.contentDocument); } catch(e){}
            });
            const valueMain = document.querySelectorAll('.value-main');
            let kanriOk = false;
            document.querySelectorAll('.ticket-info').forEach(ticketInfo => {
                const label = ticketInfo.querySelector('.label');
                const valueElem = ticketInfo.querySelector('.value');
                if (label && valueElem && label.textContent.trim() === "管理番号" && valueElem.textContent === cfg.KANRI_NO) {
                    kanriOk = true;
                }
            });
            if (valueMain.length >= 2 && valueMain[0].textContent === cfg.NAME_JA && valueMain[1].textContent === cfg.BIRTH_JA && kanriOk) {
                replaced = true;
                removeHideStyle();
            } else if (count < 30) {
                setTimeout(tryReplace, 100);
            } else {
                removeHideStyle();
            }
        }
        tryReplace();
    }

    window.addEventListener('DOMContentLoaded', () => {
        const cached = getCache();
        if (cached) {
            main(cached);
        } else {
            showModal(main);
        }
    });

})();
