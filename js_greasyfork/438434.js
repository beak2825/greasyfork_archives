// ==UserScript==
// @name         Geocaching Events | Add to calendar
// @namespace    https://juroot.sk/
// @version      0.2
// @description  Add geocaching event to calendar (link generator)
// @author       JuRoot
// @match        https://www.geocaching.com/geocache/*
// @icon         https://www.google.com/s2/favicons?domain=geocaching.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438434/Geocaching%20Events%20%7C%20Add%20to%20calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/438434/Geocaching%20Events%20%7C%20Add%20to%20calendar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let calendarRun = false;

    window.onload = function() {
       if (isEventPage() && !calendarRun) {
           calendarRun = true;
           createCalendarLinks();
       }
    }

    function isEventPage() {
        let epst = document.getElementById("mcd3");
        let epet = document.getElementById("mcd4");
        let epsd = document.getElementById("ctl00_ContentBody_ShortDescription");
        return (epst!=null && epet!=null && epsd!=null);
    }

    function createCalendarLinks() {
        const ico_google = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTMgMTNoMjJ2MjJIMTN6Ii8+PHBhdGggZmlsbD0iIzFlODhlNSIgZD0iTTI1LjY4IDIwLjkybDEuMDA4IDEuNDQgMS41ODQtMS4xNTJ2OC4zNTJIMzBWMTguNjE2aC0xLjQ0ek0yMi45NDMgMjMuNzQ1Yy42MjUtLjU3NCAxLjAxMy0xLjM3IDEuMDEzLTIuMjQ5IDAtMS43NDctMS41MzMtMy4xNjgtMy40MTctMy4xNjgtMS42MDIgMC0yLjk3MiAxLjAwOS0zLjMzIDIuNDUzbDEuNjU3LjQyMWMuMTY1LS42NjQuODY4LTEuMTQ2IDEuNjczLTEuMTQ2Ljk0MiAwIDEuNzA5LjY0NiAxLjcwOSAxLjQ0IDAgLjc5NC0uNzY3IDEuNDQtMS43MDkgMS40NGgtLjk5N3YxLjcyOGguOTk3YzEuMDgxIDAgMS45OTMuNzUxIDEuOTkzIDEuNjQgMCAuOTA0LS44NjYgMS42NC0xLjkzMSAxLjY0LS45NjIgMC0xLjc4NC0uNjEtMS45MTQtMS40MThMMTcgMjYuODAyYy4yNjIgMS42MzYgMS44MSAyLjg3IDMuNiAyLjg3IDIuMDA3IDAgMy42NC0xLjUxMSAzLjY0LTMuMzY4IDAtMS4wMjMtLjUwNC0xLjk0MS0xLjI5Ny0yLjU1OXoiLz48cGF0aCBmaWxsPSIjZmJjMDJkIiBkPSJNMzQgNDJIMTRsLTEtNCAxLTRoMjBsMSA0eiIvPjxwYXRoIGZpbGw9IiM0Y2FmNTAiIGQ9Ik0zOCAzNWw0LTFWMTRsLTQtMS00IDF2MjB6Ii8+PHBhdGggZmlsbD0iIzFlODhlNSIgZD0iTTM0IDE0bDEtNC0xLTRIOWEzIDMgMCAwMC0zIDN2MjVsNCAxIDQtMVYxNGgyMHoiLz48cGF0aCBmaWxsPSIjZTUzOTM1IiBkPSJNMzQgMzR2OGw4LTh6Ii8+PHBhdGggZmlsbD0iIzE1NjVjMCIgZD0iTTM5IDZoLTV2OGg4VjlhMyAzIDAgMDAtMy0zek05IDQyaDV2LThINnY1YTMgMyAwIDAwMyAzeiIvPjwvc3ZnPg==";
        const ico_outlook = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cGF0aCBmaWxsPSIjMDNBOUY0IiBkPSJNMjEgMzFhMiAyIDAgMDAyIDJoMTdhMiAyIDAgMDAyLTJWMTZhMiAyIDAgMDAtMi0ySDIzYTIgMiAwIDAwLTIgMnYxNXoiLz48cGF0aCBmaWxsPSIjQjNFNUZDIiBkPSJNNDIgMTYuOTc1VjE2YTEuOTggMS45OCAwIDAwLS4zNjctMS4xNDhsLTExLjI2NCA2LjkzMi03LjU0Mi00LjY1NkwyMi4xMjUgMTlsOC40NTkgNUw0MiAxNi45NzV6Ii8+PHBhdGggZmlsbD0iIzAyNzdCRCIgZD0iTTI3IDQxLjQ2bC0yMS00di0yOGwyMS00eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yMS4yMTYgMTguMzExYy0xLjA5OC0xLjI3NS0yLjU0Ni0xLjkxMy00LjMyOC0xLjkxMy0xLjg5MiAwLTMuNDA4LjY2OS00LjU1NCAyLjAwMy0xLjE0NCAxLjMzNy0xLjcxOSAzLjA4OC0xLjcxOSA1LjI0NiAwIDIuMDQ1LjU2NCAzLjcxNCAxLjY5IDQuOTg2IDEuMTI2IDEuMjczIDIuNTkyIDEuOTEgNC4zNzggMS45MSAxLjg0IDAgMy4zMzEtLjY1MiA0LjQ3NC0xLjk3NSAxLjE0My0xLjMxMyAxLjcxMi0zLjA0MyAxLjcxMi01LjE5OSAwLTIuMDg4LS41NTEtMy43NzQtMS42NTMtNS4wNTh6bS0yLjE2NyA4LjQyNGMtLjU2OC43NjktMS4zMzkgMS4xNTItMi4zMTMgMS4xNTItLjkzOSAwLTEuNjk5LS4zOTQtMi4yODUtMS4xODctLjU4MS0uNzg1LS44Ny0xLjg2MS0uODctMy4yMTEgMC0xLjMzNi4yODktMi40MTQuODctMy4yMjUuNTg2LS44MSAxLjM2OC0xLjIxMSAyLjM1NS0xLjIxMS45NjIgMCAxLjcxOC4zOTMgMi4yNjcgMS4xNzguNTU1Ljc5NS44MzMgMS44OTUuODMzIDMuMzEuMDAxIDEuMzY1LS4yODggMi40MjctLjg1NyAzLjE5NHoiLz48L3N2Zz4=";
        const ico_office = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cGF0aCBmaWxsPSIjZTY0YTE5IiBkPSJNNyAxMmwyMi04IDEyIDN2MzRsLTEyIDMtMjItOCAyMiAzVjEwbC0xNCAzdjIwbC04IDN6Ii8+PC9zdmc+";
        const ico_yahoo = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxwYXRoIGZpbGw9IiM4QTQ1ODEiIGQ9Ik00NDMuMyAxMjkuNEM0MTEuNCA5MyAzNjMuNyA3MC41IDMxNyA2MC43Yy00Ny05LjgtOTcuNy04LTE0MiAxMS43LTczIDMyLjUtMTMxLjggMTA4LjItMTMzLjUgMTg5IC4yLjguMyAxLjcgMCAyLjd2NC40Yy0uMiAxLjEtLjQgMi4yLS41IDMuMy4xIDEgLjIgMS45LjMgMi43LjIgNC4yLjIgOC40LjYgMTIuNi42IDcuOCAzIDE1LjUgMi4zIDIzLjJsLjkgNi4zYzAgLjMuMS41LjIuNy43IDQuNCAxLjQgOC43IDIuMiAxMy4xIDEuNiA5LjEgMy42IDE4LjEgNi4xIDI2LjkgNSAxNy40IDExLjYgMzQuMyAyMC42IDUwLjEgMTcgMzAgNDEuNCA1NiA3Mi45IDcwLjkgMjEuNiAxMC4yIDQ0LjggMTQuNSA2OC43IDE1LjEgMjYgLjYgNTIuMi0yLjIgNzcuNC04LjkgNDkuOC0xMy4yIDk2LjEtNDAuMiAxMjkuMy03OS45IDYxLjItNzMuNyA4OS40LTE5Ni45IDIwLjgtMjc1LjJ6TTM0Mi43IDIzNS44Yy00IDUuMS04LjYgOS43LTEzLjIgMTQuMnMtOS40IDguOS0xNC4xIDEzLjNjLTQuNCA0LjItOC41IDkuNS0xMy40IDEzLjItNC43IDMuNi05IDgtMTMuMiAxMi4yLTIuNiAyLjUtNS4yIDUuMS03LjcgNy44LS45IDEtMS45IDItMi43IDMtLjEuMS0uMi4yLS4zLjQtLjMuOS0uOCAxLjYtMS41IDIuMi4xIDEuNy4xIDMuNC4yIDUuMSAxLjkgMTYgMS42IDMyLjMgMS42IDQ4LjUuNSA1LjQuNSAxMC44LjEgMTYuMSAwIDEuNi0uMSAzLjItLjEgNC44IDAgLjUtLjEgMS0uMiAxLjUgNy40LS4yIDE0LjgtLjUgMjIuMi0xIDQuNi0uMyA5LjMtLjYgMTMuOS0xLjMuNy0uMSAxLjQtLjIgMi4xLS40LjEgMCAuNC0uMS43LS4yIDIuOC0zLjUgOS41LTEuOCAxMC42IDMgNC41IDcuNy0uMyAxNC40LTguNyAxNi4yLTMuOC44LTcuNi45LTExLjQuOC01LjctLjEtMTEuMy43LTE3IDEuMi0xNS45IDEuNC0zMS43IDIuNi00Ny43IDIuNi0xNi40IDAtMzIuNy0uNS00OS4xLS41LS41IDAtLjkgMC0xLjQtLjEtLjcuNS0xLjYuOC0yLjYuOS0zIC4yLTYuNi0yLjMtNi41LTUuNiAwLTEuOC4zLTMuNS44LTUuMi0zLjEtNCAuOC0xMC45IDYuMy05LjYuNC0uMS45LS4yIDEuNC0uMmgyOS42di04LjljLS4yLTI4LjUtOC4yLTU3LjUtNC45LTg1LjktNi4xLTEwLjctMTIuNi0yMS4yLTE5LjQtMzEuNS04LjctMTMuMS0xOS42LTI0LjUtMjguNi0zNy4zLTQuMy02LjItOC44LTEzLjEtMTQuNS0xOC4xLTQuNy00LjEtOS41LTgtMTMtMTMuMi0uMS0uMi0uMy0uNC0uNC0uNy0xMC41LS4zLTIxLS41LTMxLjUgMC0zLjEuMS02LjUtMi4yLTYuNS01LjZ2LTVjLS43LTEuOS0uMy0zLjcuNi01LjkuMy0uOC44LTEuNSAxLjQtMiAuOC0xLjQgMi40LTIuNSA0LjYtMi41IDIyLjQtLjEgNDQuOC0yIDY3LjItMi4yIDIwLjItLjIgNDEuMSAyLjUgNjEtMS45IDYuMS0xLjQgMTAgNS45IDcuMSA5LjYuOCA4LjQtNi42IDEyLjUtMTQuOCAxMy4zLTEwLjIgMS0yMC41IDEuNi0zMC43IDIuMyAwIC4xLS4xLjMtLjEuNCA4LjkgMTAuMSAxOC41IDE5LjQgMjYuOSAzMCA2LjEgNy43IDExLjcgMTUuOSAxNy4xIDI0IDIuNyA0LjEgNS4zIDguMSA3LjggMTIuMyAxLjQgMi40IDIuOCA0LjcgNC4xIDcuMi42IDEuMiAxLjQgMy44IDIuMiA0LjcuMi4yLjQuNC41LjcgNi4xLTUuNCAxMi45LTEwLjIgMTkuOC0xNC44IDEuNy0yLjEgMy42LTQuMSA1LjMtNiA2LjctNy4zIDE0LTE0LjIgMjAuNy0yMS42LTEyLjgtLjQtMjUuNi0uOC0zOC41LS4yLTMuMS4xLTYuNS0yLjItNi41LTUuNnYtNWMtLjctMS45LS4zLTMuNy42LTUuOS4zLS44LjgtMS41IDEuNC0yIC44LTEuNCAyLjQtMi41IDQuNi0yLjUgMjIuNC0uMSA0NC44LTIgNjcuMi0yLjIgMjAuMi0uMiA0MS4xIDIuNSA2MS0xLjkgNi4xLTEuNCAxMCA1LjkgNy4xIDkuNi44IDguNC02LjYgMTIuNS0xNC44IDEzLjMtOS43IDEtMTkuNSAxLjUtMjkuMyAyLjItLjQuNC0uOC44LTEuNCAxLjItNS4xIDQuMS04LjIgOS45LTEyIDE0Ljd6bTM5LjkgMTUwLjdjLTYgNy4zLTE1LjYuNy0yMy4yIDIuMi0zIC42LTYuNS0xLjgtNi4yLTUuMi43LTYgLjctMTIgMS4zLTE3LjktMS4xLTIuNi0uMy02LjMgMy4zLTcuMiA4LTIuMSAxNi40LTEuMSAyNC42LS4xIDMgLjQgNC43IDIuNCA0LjggNS4zLjUgNy4yLjIgMTcuMS00LjYgMjIuOXpNNDEyIDI2Ny4zYy0xLjYgNS4yLTMuMiAxMC40LTMuOSAxNS44LTUuNyAyMC45LTEyLjggNDEuNC0xNy4yIDYyLjUtMiAzLjItNC43IDUuNy04LjggNi4yLS43LjEtMS41LjItMi4yLjItNS43LS4yLTExLjQtLjUtMTcuMS0xLjItLjItLjEtLjQtLjMtLjYtLjUtLjMuMS0uNy4yLTEgLjMtMS4zLS4yLTIuNy0uNC00LS42LTEuMy0uOC0yLjItMi4zLTItNC40bC4yLTJjMC0uMiAwLS4zLjEtLjQuMi0xLjcuNC0zLjMuNi01LS45LTMuOC0uOC03LjUtLjItMTEuNHYtMy40bC42LTIzLjhjLjQtMTYuMy0yLjctMzIuNy0uOS00OSAuMy0yLjQgMS44LTMuOCAzLjUtNC40IDggMS44IDE2LjggMSAyNC43LjYuOSAwIDEuNy0uMSAyLjYtLjEgNy41LjYgMTUgMS4zIDIyLjMgMi40IDEuMi43IDIuMyAxLjYgMy4xIDIuNyAxLjEgMS40IDEuOCAyLjkgMi40IDQuNC0uNyAzLjgtMS40IDcuNS0yLjIgMTEuMXoiLz48cGF0aCBkPSJNNDM3LjYgMTA5LjJjLTM0LjgtMzIuNS04Mi4zLTUyLjEtMTI4LjctNjAuMy00Ny4xLTguMy05Ny40LTQuNS0xNDEgMTUuNy03NS40IDM1LTEzNS4yIDExMy42LTEzNi40IDE5Ny44LTEuOCA2LjItLjIgMTMuNi0uMSAxOS45LjEgNC40LjYgOC44IDEuMSAxMy4yLjEuNC4xLjkuMiAxLjN2LjljLjMgNC4zLjcgOC41IDEuMiAxMi44di4yYy0uMiAxLjMgMCAyLjMuNSAzLjJDMzUuNSAzMjIgMzcgMzMwIDM4LjUgMzM4YzIuMiAxMS4zIDUuMSAyMi40IDguNiAzMy4yIDcgMjEuMiAxNyA0MS41IDI5LjggNTkuOCAyNS42IDM2LjQgNjMuOCA2Mi4xIDEwNy45IDY5LjcgMjUgNC4zIDUxLjQgMy41IDc2LjUuMSAyNS41LTMuNCA1MC42LTEwLjMgNzQuMi0yMC41IDQ3LjItMjAuMyA4Ny40LTU0LjIgMTE0LjctOTcuOCAyNi4zLTQyLjIgNDIuNy05MS44IDQyLjktMTQxLjcuMy00OS45LTE4LjktOTcuNC01NS41LTEzMS42em0tMTUuNCAyOTUuNGMtMzMuMiAzOS44LTc5LjUgNjYuNy0xMjkuMyA3OS45LTI1LjIgNi43LTUxLjQgOS41LTc3LjQgOC45LTIzLjgtLjUtNDctNC44LTY4LjctMTUuMS0zMS40LTE0LjktNTUuOC00MC45LTcyLjgtNzAuOS04LjktMTUuNy0xNS42LTMyLjctMjAuNi01MC4xLTIuNi04LjktNC42LTE3LjktNi4xLTI2LjktLjgtNC40LTEuNS04LjctMi4yLTEzLjEtLjEtLjItLjItLjQtLjItLjctLjItMi4xLS41LTQuMi0uOS02LjMuNy03LjctMS42LTE1LjUtMi4zLTIzLjItLjMtNC4yLS40LTguNC0uNi0xMi42IDAtLjgtLjItMS44LS4zLTIuNy4yLTEuMS4zLTIuMi41LTMuM3YtNC40Yy4zLTEgLjMtMS45IDAtMi43IDEuNy04MC44IDYwLjUtMTU2LjUgMTMzLjUtMTg5IDQ0LjMtMTkuNyA5NS0yMS41IDE0Mi0xMS43IDQ2LjcgOS44IDk0LjQgMzIuMyAxMjYuMyA2OC43IDY4LjggNzguMyA0MC42IDIwMS41LTIwLjkgMjc1LjJ6Ii8+PHBhdGggZmlsbD0iI0Q2RTVFNSIgZD0iTTM5My4xIDE5NS40Yy0xOS45IDQuNC00MC44IDEuNy02MSAxLjktMjIuNC4yLTQ0LjggMi4xLTY3LjIgMi4yLTIuMyAwLTMuOCAxLTQuNiAyLjUtLjYuNS0xLjEgMS4xLTEuNCAyLS45IDIuMS0xLjMgMy45LS42IDUuOXY1YzAgMy40IDMuNCA1LjcgNi41IDUuNiAxMi44LS42IDI1LjctLjIgMzguNS4yLTYuOCA3LjMtMTQgMTQuMy0yMC43IDIxLjYtMS43IDEuOC0zLjUgMy44LTUuMyA2LTYuOSA0LjYtMTMuNyA5LjMtMTkuOCAxNC44LS4yLS4yLS4zLS41LS41LS43LS45LS45LTEuNi0zLjUtMi4yLTQuNy0xLjMtMi40LTIuNy00LjgtNC4xLTcuMi0yLjUtNC4yLTUuMS04LjMtNy44LTEyLjMtNS40LTguMi0xMS0xNi40LTE3LjEtMjQtOC4zLTEwLjUtMTgtMTkuOS0yNi45LTMwIDAtLjEuMS0uMy4xLS40IDEwLjItLjcgMjAuNS0xLjIgMzAuNy0yLjMgOC4yLS44IDE1LjYtNSAxNC44LTEzLjMgMi45LTMuNy0xLTExLTcuMS05LjYtMTkuOSA0LjQtNDAuOCAxLjctNjEgMS45LTIyLjQuMi00NC44IDIuMS02Ny4yIDIuMi0yLjMgMC0zLjggMS00LjYgMi41LS42LjUtMS4xIDEuMS0xLjQgMi0uOSAyLjEtMS4zIDMuOS0uNiA1Ljl2NWMwIDMuNCAzLjQgNS43IDYuNSA1LjYgMTAuNS0uNSAyMS0uMyAzMS41IDAgLjEuMi4yLjUuNC43IDMuNSA1LjIgOC4zIDkuMSAxMyAxMy4yIDUuNyA1IDEwLjIgMTEuOSAxNC41IDE4LjEgOC45IDEyLjkgMTkuOSAyNC4zIDI4LjYgMzcuMyA2LjggMTAuMiAxMy4zIDIwLjggMTkuNCAzMS41LTMuMyAyOC40IDQuNyA1Ny40IDQuOSA4NS45djguOWgtMjkuNmMtLjUgMC0xIC4xLTEuNC4yLTUuNS0xLjMtOS40IDUuNi02LjMgOS42LS41IDEuNy0uNyAzLjQtLjggNS4yLS4xIDMuMyAzLjUgNS44IDYuNSA1LjYgMS0uMSAxLjktLjQgMi42LS45LjUuMS45LjEgMS40LjEgMTYuNCAwIDMyLjcuNSA0OS4xLjUgMTYgMCAzMS44LTEuMiA0Ny43LTIuNiA1LjYtLjUgMTEuMy0xLjIgMTctMS4yIDMuOCAwIDcuNyAwIDExLjQtLjggOC41LTEuNyAxMy4zLTguNSA4LjctMTYuMi0xLjEtNC44LTcuOC02LjUtMTAuNi0zLS4zLjEtLjYuMS0uNy4yLS43LjEtMS40LjItMi4xLjQtNC42LjctOS4yIDEtMTMuOSAxLjMtNy40LjUtMTQuOC44LTIyLjIgMSAuMS0uNS4yLS45LjItMS41IDAtMS42LjEtMy4yLjEtNC44LjQtNS4zLjQtMTAuNy0uMS0xNi4xIDAtMTYuMi4zLTMyLjUtMS42LTQ4LjUtLjEtMS43LS4xLTMuNC0uMi01LjEuNy0uNiAxLjItMS40IDEuNS0yLjIuMS0uMS4yLS4yLjMtLjRsMi43LTNjMi41LTIuNyA1LjEtNS4yIDcuNy03LjggNC4zLTQuMiA4LjUtOC41IDEzLjItMTIuMiA0LjgtMy43IDguOS05IDEzLjQtMTMuMiA0LjctNC40IDkuNC04LjggMTQuMS0xMy4zIDQuNi00LjUgOS4yLTkuMSAxMy4yLTE0LjIgMy44LTQuOSA2LjktMTAuNyAxMi4xLTE0LjIuNS0uNCAxLS44IDEuNC0xLjIgOS43LS42IDE5LjYtMS4yIDI5LjMtMi4yIDguMi0uOCAxNS42LTUgMTQuOC0xMy4zIDIuOC00LjItMS0xMS41LTcuMi0xMC4xeiIvPjxwYXRoIGZpbGw9IiNENkU1RTUiIGQ9Ik00MTEuOCAyNTJjLS45LTEuMS0xLjktMi0zLjEtMi43LTcuNC0xLjEtMTQuOS0xLjgtMjIuMy0yLjQtLjkgMC0xLjcgMC0yLjYuMS03LjkuNC0xNi43IDEuMi0yNC43LS42LTEuOC42LTMuMyAyLTMuNSA0LjQtMS44IDE2LjMgMS4yIDMyLjYuOSA0OWwtLjYgMjMuOHYzLjRjLS42IDMuOC0uNyA3LjUuMiAxMS40LS4xIDEuNy0uMyAzLjMtLjYgNSAwIC4xLS4xLjMtLjEuNGwtLjIgMmMtLjMgMi4xLjYgMy41IDIgNC40IDEuMy4yIDIuNy40IDQgLjYuMy0uMS43LS4yIDEtLjMuMi4yLjQuNC42LjUgNS42LjcgMTEuNCAxIDE3LjEgMS4yLjcgMCAxLjUtLjEgMi4yLS4yIDQuMS0uNSA2LjktMy4xIDguOC02LjIgNC41LTIxLjIgMTEuNi00MS43IDE3LjItNjIuNS43LTUuNCAyLjMtMTAuNiAzLjktMTUuOC44LTMuNiAxLjUtNy4zIDIuMi0xMC45LS42LTEuOC0xLjMtMy4yLTIuNC00LjZ6bS0yNC41IDExMS42Yy0uMi0yLjktMS45LTQuOS00LjgtNS4zLTguMS0xLTE2LjUtMi0yNC42LjEtMy42LjktNC41IDQuNi0zLjMgNy4yLS42IDYtLjYgMTItMS4zIDE3LjktLjQgMy4zIDMuMSA1LjggNi4yIDUuMiA3LjUtMS41IDE3LjEgNS4yIDIzLjItMi4yIDQuNy01LjggNS0xNS43IDQuNi0yMi45eiIvPjwvc3ZnPg==";

        let epsdp = document.getElementById("ctl00_ContentBody_ShortDescription").innerText.split(",");
        if (epsdp.length > 1) {
            let en = document.getElementById("ctl00_ContentBody_CacheName").innerText;
            const regex = /\/(GC[a-zA-Z0-9]+)_?/gm;
            let gc = "";
            var ro = "";
            while ((ro = regex.exec(window.location)) !== null) {
                gc = ro[1];
            }
            let gcl = "https://coord.info/"+gc;
            let t = epsdp[1].split(" - ");
            let eds = new Date(epsdp[0] + " " + t[0]);
            let ede = new Date(epsdp[0] + " " + t[1]);
            let dsm0 = leadingZero(eds.getUTCMonth()+1); // because who doesn't count months from zero!?
            let dsd0 = leadingZero(eds.getUTCDate());
            let dsh0 = leadingZero(eds.getUTCHours());
            let dsi0 = leadingZero(eds.getUTCMinutes());
            let gds = ""+eds.getUTCFullYear()+dsm0+dsd0+"T"+dsh0+dsi0;
            let dem0 = leadingZero(ede.getUTCMonth()+1);
            let ded0 = leadingZero(ede.getUTCDate());
            let deh0 = leadingZero(ede.getUTCHours());
            let dei0 = leadingZero(ede.getUTCMinutes());
            let gde = ""+ede.getUTCFullYear()+dem0+ded0+"T"+deh0+dei0;
            let link_google = "https://calendar.google.com/calendar/render?action=TEMPLATE&dates="+gds+"00Z%2F"+gde+"00Z&text="+encodeURIComponent(en)+"&location="+encodeURIComponent(gcl);
            let out_google = "<a href=\""+link_google+"\" title=\"Google Calendar\" target=\"_blank\"><img width=\"16\" height=\"16\" alt=\"Google Calendar icon\" src=\"data:image/svg+xml;base64,"+ico_google+"\"></a>";
            let ods = ""+eds.getUTCFullYear()+"-"+dsm0+"-"+dsd0+"T"+dsh0+"%3A"+dsi0+"%3A00%2B00%3A00";
            let ode = ""+ede.getUTCFullYear()+"-"+dem0+"-"+ded0+"T"+deh0+"%3A"+dei0+"%3A00%2B00%3A00";
            let link_outlook = "https://outlook.live.com/calendar/0/deeplink/compose?body="+encodeURIComponent(gcl)+"&enddt="+ode+"&location=&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt="+ods+"&subject="+encodeURIComponent(en);
            let out_outlook = "<a href=\""+link_outlook+"\" title=\"Outlook\" target=\"_blank\"><img width=\"16\" height=\"16\" alt=\"Outlook icon\" src=\"data:image/svg+xml;base64,"+ico_outlook+"\"></a>";
            let link_office = "https://outlook.office.com/calendar/0/deeplink/compose?body="+encodeURIComponent(gcl)+"&enddt="+ode+"&location=&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt="+ods+"&subject="+encodeURIComponent(en);
            let out_office = "<a href=\""+link_office+"\" title=\"Office 365\" target=\"_blank\"><img width=\"16\" height=\"16\" alt=\"Office 365 icon\" src=\"data:image/svg+xml;base64,"+ico_office+"\"></a>";
            let link_yahoo = "https://calendar.yahoo.com/?desc="+encodeURIComponent(gcl)+"&et="+gde+"00Z&in_loc=&st="+gds+"00Z&title="+encodeURIComponent(en)+"&v=60";
            let out_yahoo = "<a href=\""+link_yahoo+"\" title=\"Yahoo!\" target=\"_blank\"><img width=\"16\" height=\"16\" alt=\"Yahoo! icon\" src=\"data:image/svg+xml;base64,"+ico_yahoo+"\"></a>";
            let output = "<span style=\"float:right;\">"+out_google+"&nbsp;&nbsp;"+out_outlook+"&nbsp;&nbsp;"+out_office+"&nbsp;&nbsp;"+out_yahoo+"</span>";
            document.getElementById("ctl00_ContentBody_ShortDescription").innerHTML += output;
            console.log(output);
        }
    }

    function leadingZero(input) {
        return (input < 10) ? "0"+input : input;
    }
})();