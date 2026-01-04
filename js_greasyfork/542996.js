// ==UserScript==
// @name         LETTER HANDLER
// @namespace    eroltekramtagapagligtas
// @version      1.0.0
// @description  Handles BTY & VTY letters
// @author       eroltekramtagapagligtas
// @license      All Rights Reserved
// @match        https://f.bsports2.com/*
// @match        https://f.bsports3.com/*
// @match        https://f.bsports4.com/*
// @match        https://f.bsports5.com/*
// @match        https://f.bsports6.com/*
// @match        https://f.bsports7.com/*
// @match        https://f.bsports9.com/*
// @match        https://f.bty0vip1.com/*
// @match        https://f.bty0vip2.com/*
// @match        https://f.bty0vip3.com/*
// @match        https://f.bty0vip4.com/*
// @match        https://f.bty0vip5.com/*
// @match        https://f.bty0vip6.com/*
// @match        https://f.bty-cn.com/*
// @match        https://fg1.btyso17.com/*
// @match        https://fg2.btyso18.com/*
// @match        https://fg3.btyso19.com/*
// @match        https://fg4.btyso20.com/*
// @match        https://fg5.btyso21.com/*
// @match        https://www.vtyproxy.com/*
// @match        https://www.vnmproxy.com/*
// @match        https://www.vnmproxy1.com/*
// @match        https://www.vnmproxy2.com/*
// @match        https://www.vnmproxy3.com/*
// @match        https://www.vnmproxy5.com/*
// @match        https://www.vnmproxy6.com/*
// @match        https://www.vnmproxy8.com/*
// @match        https://www.32j8.cc/*
// @match        https://www.vtyvnmagent11.com/*
// @match        https://www.vtyvnmagent12.com/*
// @match        https://www.vtyvnmagent13.com/*
// @match        https://www.vtyvnmagent15.com/*
// @match        https://www.vty56v.com/*
// @match        https://www.vtycnagent11.com/*
// @match        https://www.vtycnagent12.com/*
// @match        https://www.vtycnagent13.com/*
// @match        https://www.vtycnagent15.com/*
// @downloadURL https://update.greasyfork.org/scripts/542996/LETTER%20HANDLER.user.js
// @updateURL https://update.greasyfork.org/scripts/542996/LETTER%20HANDLER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* eslint-disable */

    const departmentGroups = {
        sncGroups: ['vtyvn001', 'vnzb01', 'bsx002', 'vtyzb001', 'bs9robert1',           'zzzb01'],
        xsGroups:  ['vtyvn002', 'vnzb02', 'bsc001', 'vtyzb002', 'bs9xiaosun',           'zzzb02'],
        fgGroups:  ['VTYVN003', 'vnzb03', 'bsc002', 'vtyzb003', 'bs9ajie1', 'bs9ajie2', 'zzzb03'],
        ahGroups:  ['vtyvn004', 'vnzb04', 'bsc001', 'vtyzb004', 'bs9ahui',              'zzzb04'],
        donGroups: ['vtyvn005', 'vnzb05', 'bsc003', 'vtyzb005', 'bs9don',               'zzzb04'],
        dfGroups:  ['vtyvn006', 'vnzb06', 'bsc003', 'vtyzb006', 'bs9sonic',             'zzzb04'],
    };

    // Case-insensitive comparison
    Object.keys(departmentGroups).forEach(group => {
        departmentGroups[group] = departmentGroups[group].map(item => item.toLowerCase());
    });

    // VALIDATION RULES
    const validationRules = [
        {
            letter: 'T',
            blockedGroups: ['xsGroups'],
            message: 'WRONG LETTER: T'
        },
        {
            letter: 'Y',
            blockedGroups: ['sncGroups'],
            message: 'WRONG LETTER: Y'
        }
    ];

    async function validateClipboardData() {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const clipboardData = JSON.parse(clipboardText);

            if (!clipboardData || !clipboardData.reason || !clipboardData.department) {
                return;
            }

            const reason = clipboardData.reason;
            const department = clipboardData.department.toLowerCase();
            const lastLetter = reason.slice(-1).toUpperCase();

            for (const rule of validationRules) {
                if (lastLetter === rule.letter) {

                    const isBlocked = rule.blockedGroups.some(groupName => {
                        const group = departmentGroups[groupName];
                        return group && group.includes(department);
                    });

                    if (isBlocked) {
                        alert(rule.message);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Error validating clipboard data:', error);
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'v') {
            validateClipboardData();
        }
    });
})();