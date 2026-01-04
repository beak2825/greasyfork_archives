// ==UserScript==
// @name         Blooket Utilities
// @namespace    https://github.com/tungdo0602/Blooket-stuffs
// @version      1.2.9
// @description  Some Useful Blooket Hacks.
// @author       tungdo0602 (https://github.com/tungdo0602)
// @match        *://*.blooket.com/*
// @match        *://blooket.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMzAwIDM0NSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOnVybCgjbGluZWFyLWdyYWRpZW50KTt9LmNscy0ye2ZpbGw6dXJsKCNsaW5lYXItZ3JhZGllbnQtMik7fS5jbHMtM3tmaWxsOiM5MDY4YWQ7fS5jbHMtNHtmaWxsOiMwMGMwZjM7fS5jbHMtNXtmaWxsOiNmZmY7fS5jbHMtNntmaWxsOiNmZmNkMDU7fS5jbHMtMTIsLmNscy03e2ZpbGw6bm9uZTt9LmNscy03e3N0cm9rZTojY2Q4ZTJhO3N0cm9rZS13aWR0aDo4Ljk5cHg7fS5jbHMtMTIsLmNscy0xOCwuY2xzLTd7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fS5jbHMtOHtmaWxsOiNmYWJjMmU7fS5jbHMtOXtmaWxsOiM0MTQwNDI7fS5jbHMtMTB7ZmlsbDojNjY0MDJkO30uY2xzLTExe2ZpbGw6IzJmMmMzODt9LmNscy0xMntzdHJva2U6IzJmMmMzODtzdHJva2Utd2lkdGg6NnB4O30uY2xzLTEze29wYWNpdHk6MC44O30uY2xzLTE0e2ZpbGw6IzdjYTFkNTt9LmNscy0xNXtmaWxsOiM5ZGM2ZWE7fS5jbHMtMTZ7ZmlsbDojNTUzMTkyO30uY2xzLTE3e2ZpbGw6IzYxNDU5Yzt9LmNscy0xOHtmaWxsOiNmZmYwYTQ7c3Ryb2tlOiNmZmY7c3Ryb2tlLXdpZHRoOjJweDt9LmNscy0xOXtmaWxsOiMzODI5NmY7fS5jbHMtMjB7ZmlsbDojMWQ3NThhO30uY2xzLTIxe2ZpbGw6IzZlYjhjYzt9PC9zdHlsZT48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjE0OS45MyIgeTE9IjQxOS4wNyIgeDI9IjE0OS45MyIgeTI9Ii0yMS4yOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMC4xOCIgc3RvcC1jb2xvcj0iIzgwNTRhMiIvPjxzdG9wIG9mZnNldD0iMC4yNCIgc3RvcC1jb2xvcj0iIzZkNDU5YiIvPjxzdG9wIG9mZnNldD0iMC4zMSIgc3RvcC1jb2xvcj0iIzViMzY5NCIvPjxzdG9wIG9mZnNldD0iMC4zNiIgc3RvcC1jb2xvcj0iIzU1MzE5MiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQtMiIgeDE9IjE0OS45MyIgeTE9IjM1MC41NCIgeDI9IjE0OS45MyIgeTI9IjI2MS42MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMC40IiBzdG9wLWNvbG9yPSIjNTUzMTkyIi8+PHN0b3Agb2Zmc2V0PSIwLjg3IiBzdG9wLWNvbG9yPSIjODA1NGEyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgaWQ9ImFtb25nX3VzIiBkYXRhLW5hbWU9ImFtb25nIHVzIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNjMuNTQsMzQ1SDM2LjMxQTM2LjM4LDM2LjM4LDAsMCwxLS4wNywzMDguNjJWMjU5LjE0aDMwMHY0OS40OEEzNi4zOCwzNi4zOCwwLDAsMSwyNjMuNTQsMzQ1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTI2My41NCwzMTEuNjVIMzYuMzFBMzYuMzgsMzYuMzgsMCwwLDEtLjA3LDI3NS4yN1YyNjEuMzhoMzAwdjEzLjg5QTM2LjM4LDM2LjM4LDAsMCwxLDI2My41NCwzMTEuNjVaIi8+PHJlY3QgY2xhc3M9ImNscy0zIiB4PSItMC4wNyIgeT0iNDUiIHdpZHRoPSIzMDAiIGhlaWdodD0iMjUzLjM5IiByeD0iMzYuMzgiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjI1OS4wMSIgeT0iMTk0LjM2IiB3aWR0aD0iNDEuMDYiIGhlaWdodD0iNDAuMTEiLz48cGF0aCBjbGFzcz0iY2xzLTUiIGQ9Ik0yODEuNjUsMjI3LjI1aC04LjFhNy43Nyw3Ljc3LDAsMCwxLTIuNDgtLjI2Ljg1Ljg1LDAsMCwxLS42My0uODF2LTIzLjhxMC0xLjc3LDEwLjY5LTEuNzdjNC4xLDAsNi45Mi4zOSw4LjQ4LDEuMThhNS44LDUuOCwwLDAsMSwzLDMuMTEsOC4wOSw4LjA5LDAsMCwxLC4zNywyLjU5LDcuNzcsNy43NywwLDAsMS0xLDQuMzMsMy4zNCwzLjM0LDAsMCwxLTIuMTMsMS42Myw1LjE0LDUuMTQsMCwwLDEsMi44OSwxLjdjLjc2Ljg5LDEuMTUsMi4zOSwxLjE1LDQuNTFhNi41NSw2LjU1LDAsMCwxLTIuMjYsNS40OCwxMS40OCwxMS40OCwwLDAsMS02LDJDMjg0LjU1LDIyNy4yLDI4My4yMSwyMjcuMjUsMjgxLjY1LDIyNy4yNVptMS0xNS44N2MxLjY5LDAsMi41NC0xLDIuNTQtMi44OWEzLDMsMCwwLDAtLjY4LTIuMTUsMiwyLDAsMCwwLTEuNTEtLjcxaC00djUuNzVabS0zLjY4LDEwLjQxaDMuNjhjMS42OSwwLDIuNTQtMSwyLjU0LTIuOWEzLDMsMCwwLDAtLjY4LTIuMTVBMiwyLDAsMCwwLDI4MywyMTZoLTRaIi8+PHJlY3QgY2xhc3M9ImNscy02IiB4PSIzNS4yOSIgeT0iODMuNjIiIHdpZHRoPSIyMjkuMjYiIGhlaWdodD0iMTc3Ljc3IiByeD0iMjcuOCIvPjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTEyNSwyMjIuNTRzOC40Niw2LjUxLDI0LjksNi41MSwyNC45LTYuNTEsMjQuOS02LjUxIi8+PGNpcmNsZSBjbGFzcz0iY2xzLTgiIGN4PSIyMTkuODkiIGN5PSIxNzYuNCIgcj0iMjcuNTUiLz48Y2lyY2xlIGNsYXNzPSJjbHMtOCIgY3g9Ijc5Ljk2IiBjeT0iMTc2LjQiIHI9IjI3LjU1Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTUiIGN4PSIyMTkuODkiIGN5PSIxODQuMDUiIHI9IjI3LjU1Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTUiIGN4PSI3OS45NiIgY3k9IjE4NC4wNSIgcj0iMjcuNTUiLz48cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Ik0xMDQsMTgwLjA1YTEwLDEwLDAsMCwxLTE0LjUtMTMuNTMsMTcuODUsMTcuODUsMCwwLDAtMi40NC0uMThBMTcuMzcsMTcuMzcsMCwxLDAsMTA0LDE4MC4wNVpNNzkuNzQsMTk1YTQuMTIsNC4xMiwwLDEsMSw0LjEzLTQuMTJBNC4xMiw0LjEyLDAsMCwxLDc5Ljc0LDE5NVoiLz48cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Ik0yMjkuNzUsMTgwYTEwLDEwLDAsMCwxLTE0LjQxLTEzLjQyLDE3LjMzLDE3LjMzLDAsMSwwLDE0LjgyLDE3LjE0QTE2LjksMTYuOSwwLDAsMCwyMjkuNzUsMTgwWm0tMjQuMzQsMTVhNC4xMiw0LjEyLDAsMSwxLDQuMTItNC4xMkE0LjExLDQuMTEsMCwwLDEsMjA1LjQxLDE5NVoiLz48ZWxsaXBzZSBjbGFzcz0iY2xzLTEwIiBjeD0iMjA3Ljg2IiBjeT0iMTQyLjE1IiByeD0iMjMuNiIgcnk9IjEzLjY4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDAuNDkgMTAwLjUxKSByb3RhdGUoLTI0Ljg1KSIvPjxlbGxpcHNlIGNsYXNzPSJjbHMtMTAiIGN4PSI5Mi4xNCIgY3k9IjE0Mi4xNSIgcng9IjEzLjY4IiByeT0iMjMuNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc1LjU3IDE2Ni4wMikgcm90YXRlKC02NS4xNSkiLz48ZWxsaXBzZSBjbGFzcz0iY2xzLTExIiBjeD0iMTc4LjQ4IiBjeT0iMjI3Ljg2IiByeD0iMTcuMjEiIHJ5PSIxMC43NSIvPjxwYXRoIGNsYXNzPSJjbHMtMTIiIGQ9Ik0xNzguMywyMjcuMDVzNzIuNzksMTMsODMuMjEtMzkuMTEiLz48ZyBjbGFzcz0iY2xzLTEzIj48cmVjdCBjbGFzcz0iY2xzLTE0IiB4PSIzNS4yOSIgeT0iODMuNjIiIHdpZHRoPSIyMjkuMjYiIGhlaWdodD0iMTc3Ljc3IiByeD0iMjcuOCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMTUiIHBvaW50cz0iMTE0Ljc3IDI2MS4zOCAxMjYuOTUgMjYxLjM4IDIyOS41OSA4My42MSAyMTcuNCA4My42MSAxMTQuNzcgMjYxLjM4Ii8+PHBhdGggY2xhc3M9ImNscy0xNSIgZD0iTTE0MiwyNjEuMzhoMzAuNzFsOTAuODItMTU3LjNBMjcuODYsMjcuODYsMCwwLDAsMjQ0LjEsODQuNloiLz48L2c+PHBhdGggY2xhc3M9ImNscy0xNiIgZD0iTTIwMiw0NS43NGMwLDE2LjA5LTIzLjg1LDIzLjQ3LTUyLjA4LDIzLjQ3Uzk3Ljg0LDYxLjgzLDk3Ljg0LDQ1Ljc0YzAtLjI1LDAtLjQ5LDAtLjc0bC05LjI2LDBjMCwuMjMsMCwuNDUsMCwuNjgsMCwxOC40OSwyOS4yNywyOS41LDYxLjM1LDI5LjVzNjEuMzQtMTEsNjEuMzQtMjkuNWMwLS4yMywwLS40NSwwLS42OEwyMDIsNDVDMjAyLDQ1LjI1LDIwMiw0NS40OSwyMDIsNDUuNzRaIi8+PHBhdGggY2xhc3M9ImNscy0xNiIgZD0iTTI5MC4xOSw1Ni42MiwyNTMsOTQuNDNsNC4yOCw0LjIxLDM2LjY4LTM3LjI3QTM1Ljc5LDM1Ljc5LDAsMCwwLDI5MC4xOSw1Ni42MloiLz48cGF0aCBjbGFzcz0iY2xzLTE2IiBkPSJNNS45Myw2MS4zNyw0Mi42MSw5OC42NGw0LjI4LTQuMjFMOS42Niw1Ni42MkEzNS43OSwzNS43OSwwLDAsMCw1LjkzLDYxLjM3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMTciIGQ9Ik0xOTUuODcsNDVjLTQsMTIuMjctMjAuODUsMTguMjEtNDUuOTQsMTguMjFTMTA4LDU3LjI3LDEwNCw0NUg5My4zMWM0LDE3LjQzLDI3LjQxLDI0LjIxLDU2LjYyLDI0LjIxUzIwMi41Nyw2Mi40MywyMDYuNTQsNDVaIi8+PHBhdGggY2xhc3M9ImNscy0xNyIgZD0iTTI4Ny4xNSw1My43MSwyNTMsODguNDNsNC4yOCw0LjIxTDI5MS4zOCw1OEEzNi45MSwzNi45MSwwLDAsMCwyODcuMTUsNTMuNzFaIi8+PHBhdGggY2xhc3M9ImNscy0xNyIgZD0iTTguNDcsNTgsNDIuNjEsOTIuNjRsNC4yOC00LjIxTDEyLjcsNTMuNzFBMzYuOTEsMzYuOTEsMCwwLDAsOC40Nyw1OFoiLz48cGF0aCBjbGFzcz0iY2xzLTE2IiBkPSJNMjg4LjM5LDE4OC42MkgyNzUuNjhhOC4wNiw4LjA2LDAsMCwxLTguMDYtOC4wNlYxMjYuNzVzMC0xMy4zNCwxNC40Mi0xMy4zNCwxNC40MiwxMy4zNCwxNC40MiwxMy4zNHY1My44MUE4LjA2LDguMDYsMCwwLDEsMjg4LjM5LDE4OC42MloiLz48cGF0aCBjbGFzcz0iY2xzLTE3IiBkPSJNMjg4LjM5LDE3Ny43NkgyNzUuNjhhOC4wNiw4LjA2LDAsMCwxLTguMDYtOC4wNlYxMTUuODhzMC0xMy4zMywxNC40Mi0xMy4zMywxNC40MiwxMy4zMywxNC40MiwxMy4zM1YxNjkuN0E4LjA2LDguMDYsMCwwLDEsMjg4LjM5LDE3Ny43NloiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMTgiIGN4PSIyODIuMDQiIGN5PSIxMzQuNTYiIHI9IjkuMjgiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMTYiIGN4PSIyODIuMDQiIGN5PSIxNTguMjYiIHI9IjkuMjgiLz48cmVjdCBjbGFzcz0iY2xzLTE5IiB4PSIyNzIuOTkiIHk9IjExMC4zMyIgd2lkdGg9IjE4LjA5IiBoZWlnaHQ9IjkuODEiIHJ4PSIzLjgxIi8+PHBhdGggY2xhc3M9ImNscy0xNiIgZD0iTTI0LjE3LDE4OC42MkgxMS40NmE4LjA2LDguMDYsMCwwLDEtOC4wNy04LjA2VjEyNi43NXMwLTEzLjM0LDE0LjQyLTEzLjM0LDE0LjQyLDEzLjM0LDE0LjQyLDEzLjM0djUzLjgxQTguMDYsOC4wNiwwLDAsMSwyNC4xNywxODguNjJaIi8+PHBhdGggY2xhc3M9ImNscy0xNyIgZD0iTTI0LjE3LDE3Ny43NkgxMS40NmE4LjA2LDguMDYsMCwwLDEtOC4wNy04LjA2VjExNS44OHMwLTEzLjMzLDE0LjQyLTEzLjMzLDE0LjQyLDEzLjMzLDE0LjQyLDEzLjMzVjE2OS43QTguMDYsOC4wNiwwLDAsMSwyNC4xNywxNzcuNzZaIi8+PGNpcmNsZSBjbGFzcz0iY2xzLTE4IiBjeD0iMTcuODEiIGN5PSIxMzQuNTYiIHI9IjkuMjgiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMTYiIGN4PSIxNy44MSIgY3k9IjE1OC4yNiIgcj0iOS4yOCIvPjxyZWN0IGNsYXNzPSJjbHMtMTkiIHg9IjguNzciIHk9IjExMC4zMyIgd2lkdGg9IjE4LjA5IiBoZWlnaHQ9IjkuODEiIHJ4PSIzLjgxIi8+PHBhdGggY2xhc3M9ImNscy0yMCIgZD0iTTIzNi43NSw5OC42YTE5Ljg0LDE5Ljg0LDAsMCwxLDE5LjgyLDE5LjgyVjI0MC41OGExOS44NCwxOS44NCwwLDAsMS0xOS44MiwxOS44Mkg2My4xYTE5Ljg0LDE5Ljg0LDAsMCwxLTE5LjgyLTE5LjgyVjExOC40MkExOS44NCwxOS44NCwwLDAsMSw2My4xLDk4LjZIMjM2Ljc1bTAtOEg2My4xYTI3LjgsMjcuOCwwLDAsMC0yNy44MSwyNy44VjI0MC41OGEyNy44LDI3LjgsMCwwLDAsMjcuODEsMjcuOEgyMzYuNzVhMjcuOCwyNy44LDAsMCwwLDI3LjgxLTI3LjhWMTE4LjQyYTI3LjgsMjcuOCwwLDAsMC0yNy44MS0yNy44WiIvPjxwYXRoIGNsYXNzPSJjbHMtMjEiIGQ9Ik0yMzYuNzUsOTEuNmExOS44NCwxOS44NCwwLDAsMSwxOS44MiwxOS44MlYyMzMuNThhMTkuODQsMTkuODQsMCwwLDEtMTkuODIsMTkuODJINjMuMWExOS44NCwxOS44NCwwLDAsMS0xOS44Mi0xOS44MlYxMTEuNDJBMTkuODQsMTkuODQsMCwwLDEsNjMuMSw5MS42SDIzNi43NW0wLThINjMuMWEyNy44LDI3LjgsMCwwLDAtMjcuODEsMjcuOFYyMzMuNThhMjcuOCwyNy44LDAsMCwwLDI3LjgxLDI3LjhIMjM2Ljc1YTI3LjgsMjcuOCwwLDAsMCwyNy44MS0yNy44VjExMS40MmEyNy44LDI3LjgsMCwwLDAtMjcuODEtMjcuOFoiLz48L2c+PC9zdmc+
// @grant        none
// @run-at       document-end
// @supportURL   https://github.com/tungdo0602/Blooket-stuffs/issues
// @license      MIT
// @source       https://github.com/tungdo0602/Blooket-stuffs/blob/main/userscripts/blooketUtilities.js
// @downloadURL https://update.greasyfork.org/scripts/453539/Blooket%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/453539/Blooket%20Utilities.meta.js
// ==/UserScript==

(function() {
    'use strict';
(function(){
    function getStateNode(){
        for(let i of Object.keys(document.querySelector("#app>div>div"))){
            if(i.toString().includes("__reactEventHandlers")){
                for(let p of Object.values(document.querySelector("#app>div>div")[i].children.filter(n=>n))){
                    if(p._owner&&p._owner.stateNode)return p._owner.stateNode
                }
            }
        }
    }
    function bypass(){
        let _bypass = document.createElement("iframe");
        _bypass.style.display = 'none';
        document.body.appendChild(_bypass);
        return {window: _bypass.contentWindow, document: _bypass.contentDocument}
    }
    function findByProp(prop,first=true){
        const wp = Object.values(window.webpackJsonp.push([
            [], {
                ['']: (_, a, b) => {
                    a.cache = b.c
                },
            },
            [
                ['']
            ],
        ]).cache);
        if(first){
            return wp.find((x)=>x.exports&&x.exports.a&&x.exports.a[prop]).exports.a;
        }else{
            return wp.filter(x=>x.exports?.a&&x.exports?.a[prop]).map(n=>n.exports.a)
        }
    }
    function addReward(){
        return findByProp("post").post("https://play.blooket.com/api/playersessions/solo", {
            gameMode: "Defense"
        }).then(x=>{
            return findByProp("put").put("https://play.blooket.com/api/users/add-rewards", {
                addedTokens: 500,
                addedXp: 500,
                t: x.data.t
            }).then((res)=>{
                return res.status;
            });
        });
    }
    if(location.host==="play.blooket.com"){
        let tmr = new Date();
        tmr.setDate(tmr.getDate()+1);
        let ls = bypass().window.localStorage;
        findByProp("get").get("https://play.blooket.com/api/users/me").then(res=>{
            if(res.data){
                if(ls.getItem("nextReward")){
                    if((new Date().getDate())>=Number(ls.getItem("nextReward"))){
                        ls.setItem("nextReward", tmr.getDate());
                        console.log("[Logger] You're not claim reward yet.");
                        addReward().then(e=>{
                            if(e===200){
                                console.log("[Logger] Successfully added reward | " + e);
                            }else{
                                console.log("[Logger] Failed to add reward | " + e);
                            }
                        });
                    }else{
                        console.log("[Logger] You already claimed today.");
                    }
                }else{
                    ls.setItem("nextReward", tmr.getDate());
                    addReward();
                }
            }else{
                console.log("[Logger] You're not login yet.");
            }
        });
        window.setInterval(()=>{
            try{
                if(location.href.toLowerCase().includes("/lobby")){
                    getStateNode().state.unlocks = Object.keys(findByProp("Astronaut"));
                }else if(location.href.toLowerCase().includes("/register")){
                    Array.from(document.querySelectorAll("input")).map(n=>n.maxLength = 120);
                }else if(location.href.toLowerCase().includes("/host")){
                    getStateNode().props.user.data.plan = 'Plus Flex';
                    getStateNode().state.isBen = getStateNode().state.plus = getStateNode().state.canPlusHost = true;
                }
            }catch{}
            getStateNode().forceUpdate();
        });
    }else if(location.host==="dashboard.blooket.com"){
        window.setInterval(()=>{
            if(location.href.toLowerCase().includes("my-sets")){
                if(!document.querySelector("#folderColorPicker")){
                    try{
                        document.querySelector("div[class*='colorsHolder']").innerHTML = `<input id="folderColorPicker" style="margin: 0 auto;" type="color">`
                        document.querySelector("#folderColorPicker").onchange = function(e){
                            getStateNode().setState({folderColor: e.target.value})
                        }
                    }catch{}
                }
                Array.from(document.querySelectorAll("div")).filter(x=>x.className.includes("FolderButton")).map(x=>x[Object.keys(x).filter(x=>x.includes("EventHandler"))]).map(x=>x.onClick=function(){
                    getStateNode().setState({
                        creatingFolder: true
                    });
                });
            }
        })
    }
    window["blooket"] = {
        bypass: bypass,
        getStateNode: getStateNode,
        findByProp: findByProp,
    }
})();
})();