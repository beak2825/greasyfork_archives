// ==UserScript==
// @name         获取 Github 当前仓库唯一标识
// @namespace    https://juzibiji.top/
// @version      1.0.0
// @icon         https://cdn.juzibiji.top/img/20210216152424.png
// @description  定义函数 getGithubId() 获取当前仓库唯一标识，例如：talelin/lin-ui
// @author       桔子
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

/**
* 获取当前仓库唯一标识
*/
function getGithubId() {
    const strArray = location.pathname.split("/");
    return `${strArray[1]}/${strArray[2]}`;
}