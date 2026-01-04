// ==UserScript==
// @name         Advanced TIO Hello World!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I wanna use my template for C++
// @author       fienestar
// @match        https://tio.run/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tio.run
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460627/Advanced%20TIO%20Hello%20World%21.user.js
// @updateURL https://update.greasyfork.org/scripts/460627/Advanced%20TIO%20Hello%20World%21.meta.js
// ==/UserScript==

addEventListener("load", () => {
    'use strict';

    languages['cpp-clang'].tests.helloWorld.request[0].payload['.code.tio'] = languages['cpp-gcc'].tests.helloWorld.request[0].payload['.code.tio'] =
        `#include <bits/stdc++.h>

using namespace std;

int main()
{
	cin.tie(nullptr)->sync_with_stdio(false);

}`
})