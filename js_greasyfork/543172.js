// ==UserScript==
// @name        Replace NixOS colorful Logo
// @name:zh-CN  替换 NixOS 多彩图标
// @namespace   http://tampermonkey.net/
// @match       https://search.nixos.org/*
// @grant       none
// @description This script is for people who have trouble focusing on colorful icons, it replaces the icons with the NixOS theme color.
// @description:zh-CN 此脚本适用于难以关注彩色图标的人，它用 NixOS 主题颜色替换图标。
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/543172/Replace%20NixOS%20colorful%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/543172/Replace%20NixOS%20colorful%20Logo.meta.js
// ==/UserScript==
     
    (function() {
        'use strict';
     
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img');
     
            images.forEach(img => {
                if (img.src.includes('/images/nix-logo-pride.png')) {
                    img.src = img.src.replace('/images/nix-logo-pride.png', '/images/nix-logo.png');
                }
            });
        });
    })();

