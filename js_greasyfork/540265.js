// ==UserScript==
// @name         Bitbucket Copy `branchName`
// @namespace    http://bitbucket.org/copy/BranchName
// @version      1.1
// @description  Copy `branchName` into clipboard with Ctrl + Shift + C
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitbucket.org
// @author       explainpark101
// @match        https://bitbucket.org/*
// @license      mit
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540265/Bitbucket%20Copy%20%60branchName%60.user.js
// @updateURL https://update.greasyfork.org/scripts/540265/Bitbucket%20Copy%20%60branchName%60.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for the toast
    GM_addStyle(`
      #bb-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #323232;
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 9999;
        transform: translateY(20px);
      }
      #bb-toast.show {
        opacity: 1;
        transform: translateY(0);
      }
    `);

    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'bb-toast';
    document.body.appendChild(toast);

    // Show toast function
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // Function to get `at` param value
    function getAtParam() {
        const params = new URLSearchParams(window.location.search);
        return params.get('at');
    }

    // Listen for Ctrl + Shift + C
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
            e.preventDefault();
            if (location.pathname.split('/').at(3) == "src") {
                const atValue = getAtParam();
                if (atValue) {
                    navigator.clipboard.writeText(atValue).then(() => {
                        showToast(`Branch Name Copied: ${atValue}`);
                    }).catch(err => {
                        showToast('Failed to copy.');
                        console.error(err);
                    });
                }
                else if(location.pathname.split('/').at(4)) {
                    const atValue = location.pathname.split('/').at(4);
                    if (atValue)
                        navigator.clipboard.writeText(atValue).then(() => {
                            showToast(`Branch Name Copied: ${atValue}`);
                        }).catch(err => {
                            showToast('Failed to copy.');
                            console.error(err);
                        });
                    else showToast('No branchName found.');
                }
                else {
                    showToast('No `at` parameter found.');
                }
            }
            if (location.pathname.split('/').at(3) == "pull-requests") {
                const atValue = getAtParam();
                if (atValue) {
                    navigator.clipboard.writeText(atValue).then(() => {
                        showToast(`Branch Name Copied: ${atValue}`);
                    }).catch(err => {
                        showToast('Failed to copy.');
                        console.error(err);
                    });
                }
                else {
                    showToast('No `at` parameter found.');
                }
            }
            else if (location.pathname.split('/').at(3) == "branch") {
                const atValue = location.pathname.split('/').slice(4).join('/');
                if (atValue) {
                    navigator.clipboard.writeText(atValue).then(() => {
                        showToast(`Branch Name Copied: ${atValue}`);
                    }).catch(err => {
                        showToast('Failed to copy.');
                        console.error(err);
                    });
                } else {
                    showToast('No `branchName` found.');
                }
            }
            else if (location.pathname.split('/').at(3) == "commits" && location.pathname.split('/').at(4) == "branch") {
                const atValue = location.pathname.split('/').slice(5).join('/');
                if (atValue) {
                    navigator.clipboard.writeText(atValue).then(() => {
                        showToast(`Branch Name Copied: ${atValue}`);
                    }).catch(err => {
                        showToast('Failed to copy.');
                        console.error(err);
                    });
                } else {
                    showToast('No `branchName` found.');
                }
            }
            else {
                if (location.pathname.split("/").at(3) == "overview") return showToast("Please enter into repository first.");
                showToast("No branchName Found");
            }
        }
    });
})();
