// ==UserScript==
// @name         Global_ManagedExtensions
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT
// @description  ユーザーによる動的な設定が必要な複数のユーザースクリプトを管理します。
// @author       You
// ==/UserScript==

'use strict'
if (!('Global_ManagedExtensions' in unsafeWindow)) unsafeWindow.Global_ManagedExtensions = {}