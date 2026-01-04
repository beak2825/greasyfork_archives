// ==UserScript==
// @name        uv for PyPI
// @namespace   uv-for-pypi
// @match       https://pypi.org/project/*
// @grant       none
// @version     1.0.1
// @author      uncenter
// @description Update the PyPI installation command with `uv add`
// @downloadURL https://update.greasyfork.org/scripts/505178/uv%20for%20PyPI.user.js
// @updateURL https://update.greasyfork.org/scripts/505178/uv%20for%20PyPI.meta.js
// ==/UserScript==

let cmd = document.querySelector('#pip-command');
cmd.textContent = cmd.textContent.replace('pip install', 'uv add');
