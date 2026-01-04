// ==UserScript==
// @name         WME myUR
// @namespace    https://greasyfork.org/en/users/668704-phuz
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @version      1.07
// @description  Highlight URs based on days since last response
// @author       phuz
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_fetch
// @grant        GM_addStyle

/* global OpenLayers */
/* global W */
/* global WazeWrap */
/* global $ */
/* global I18n */
/* global _ */
/* global MutationObserver */

// @downloadURL https://update.greasyfork.org/scripts/453727/WME%20myUR.user.js
// @updateURL https://update.greasyfork.org/scripts/453727/WME%20myUR.meta.js
// ==/UserScript==
let myURmarkers;
let mapBounds;
const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}

(function () {
    'use strict';
    //Bootstrap
    function bootstrap(tries = 1) {
        if (W && W.loginManager && W.map && W.loginManager.user && W.model
            && W.model.states && W.model.states.getObjectArray().length && WazeWrap && WazeWrap.Ready) {
            myURmarkers = new OpenLayers.Layer.Markers('myURmarkers');
            W.map.addLayer(myURmarkers);
            W.map.getOLMap().setLayerIndex(myURmarkers, 2);
            setTimeout(function () {
                if (W.map.getZoom() >= 12) {
                    getBounds();
                    getURs();
                }
                W.map.events.register("moveend", W.map, function () {
                    myURmarkers.clearMarkers();
                    setTimeout(function () {
                        if (W.map.getZoom() >= 12) {
                            getBounds();
                            getURs();
                        }
                    }, 250);
                });
                console.log("WME myUR Loaded!");
            }, 500);
        } else if (tries < 1000) {
            setTimeout(function () { bootstrap(++tries); }, 200);
        }
    }

    function getBounds() {
        mapBounds = W.map.getExtent();
    }

    async function getURs() {
        let URarray = document.getElementsByClassName("map-problem user-generated");

        //Scan the list of URs that were populated in WME
        for (let i = 0; i < URarray.length; i++) {
            let URid = document.getElementsByClassName("map-problem user-generated")[i].getAttribute("data-id");
            //Only highlight URs that are still open
            if (W.model.mapUpdateRequests.getObjectById(URid).editable) {
                //Continue if the UR is in the bounds of the WME window
                if ((W.model.mapUpdateRequests.getObjectById(URid).attributes.geometry.x > mapBounds.left) && (W.model.mapUpdateRequests.getObjectById(URid).attributes.geometry.x < mapBounds.right)) {
                    if ((W.model.mapUpdateRequests.getObjectById(URid).attributes.geometry.y > mapBounds.bottom) && (W.model.mapUpdateRequests.getObjectById(URid).attributes.geometry.y < mapBounds.top)) {
                        //Continue if the UR has comments
                        if (W.model.mapUpdateRequests.getObjectById(URid).attributes.hasComments) {
                            let updatedOn = W.model.mapUpdateRequests.getObjectById(URid).attributes.updatedOn;
                            let updatedDaysAgo = moment(new Date(Date.now()), "DD.MM.YYYY").startOf('day').diff(moment(new Date(updatedOn), "DD.MM.YYYY").startOf('day'), 'days');
                            let updatedBy = W.model.mapUpdateRequests.getObjectById(URid).attributes.updatedBy;
                            //console.log(URid + ":" + updatedDaysAgo);
                            //Continue if the last comment was 4 or more days ago
                            if ((updatedDaysAgo) >= 4 || (updatedBy == -1)) {
                                setTimeout(async function () {
                                    let URdata = await W.controller.descartesClient.getUpdateRequestSessionsByIds(URid);
                                    if (URdata.users.objects.length > 0) {
                                        for (let j = URdata.users.objects.length - 1; j >= 0; j--) {
                                            //Continue if my username matches a UR response
                                            if ((URdata.users.objects[j].userName == W.loginManager.user.userName) || true) {
                                                let commentLength = URdata.updateRequestSessions.objects[0].attributes.comments.length;
                                                let lastCommentTime = URdata.updateRequestSessions.objects[0].attributes.comments[commentLength - 1].createdOn;
                                                lastCommentTime = moment(new Date(lastCommentTime), "DD.MM.YYYY").startOf('day');
                                                let timeNow = moment(new Date(Date.now()), "DD.MM.YYYY").startOf('day');
                                                let daysSinceLastMessage = timeNow.diff(lastCommentTime, 'days');
                                                //console.log(URid + ":" + daysSinceLastMessage);
                                                if (daysSinceLastMessage >= 5) {
                                                    drawMarkers(URdata.updateRequestSessions.objects[0].attributes.id, "red");
                                                } else if (daysSinceLastMessage >= 4) {
                                                    drawMarkers(URdata.updateRequestSessions.objects[0].attributes.id, "orange");
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }, 20);
                            }
                        }
                    }
                }
            }
            await sleep(20);
            Promise.resolve();
        }
    }

    function drawMarkers(URid, severity) {
        var lon = W.model.mapUpdateRequests.getObjectById(URid).attributes.geometry.x;
        var lat = W.model.mapUpdateRequests.getObjectById(URid).attributes.geometry.y;
        let image;

        //alert(new OpenLayers.LonLat([lon, lat]).transform('EPSG:3857', 'EPSG:4326'));
        const orangeCircle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGUUlEQVR4nO2ba4hWRRiAnzl8iIjEEiJLxBJitZqu5oVCIkWsRLM0wh9O9Sez7KamYmYkWipiZUohlIggo1ZioqUWZhcMNMVrLmoi/RBZREQkFpFlpx8zZ/fst+ebOd/unG9d2geW3Z3zznvemTP3eV9BzmhFBNQCI4CHgAFANXA30NuKNQLXgQbgInAWOAZcEpLmPO0TeSjViv7AM8AU4HGgqoOqGoBfgT3AXiG5EcTABEErQCsGA2uACUCvkLqBW8BPwGIhqQ+lNAqlyHINGEP4woPpLuMxXSUYQStASK4CK0LqLGKVkDSEVBi6BQCsBy7koPcS8GlopWVXgFbU2pE9FSG5DSzslFXpLBSSWw67Iq0YXq7SsipAK2YCp4CXXHJCshszYIXioJDs9MjMBI5YGzOTeRbQig+AZfbfq8AgIUsPSFoxBDgBFIC/gAPAUUxTvgb8CzRZ8QLQF+iHWSeMxswkQ6zMSCE57XhXFXAe6G+TlgjJyizlylQBWrEKeLcoeb2QzPHkmwqcE5JzWd6Tkr8WGOz7+lqxFphblLxSSJb43uGtAK14H/gw5dFt4OGQc3JHsJV0ivSp19sSnGOAVsygtdkX0wtYm8XInPmE0uuOFVrxgitzyRagFSOAP2hdr5diipB875HJBa2YCOzziDUCY4XkWNrD1BagFXcB2/AXHswmp6vI8u4+wDZbpnaU6gKrgQcyKP9ISJZnkMsF27+XZhAdiOkq7XUUJ2jFY8Bv+NcIy4XM9PLc0Yr38C/BmzFd4VAysU0F2BXeEWCUR9lGIXmlXEPzRCs2AK95xE4Co4VsWX+0+8rP4y/8n8AbZVuYP3OAwx6Z4cD0ZEJLC7Bf/wRQ51DQCAwTkosdNDJXtGIAZk3Q1yFWDwyNT5qSLWAC7sIDLLtTCw8gJJfwD4qDgYnxP8kKeNWT8R/gsw5ZVlk+x+w3XMyO/4gAtKIfMMmTaZnd6t7RWBtLrV5jJtpzy5YW8DTuRU8DsLXz5lWM7cAVx/MC5tC2pQImexRu6g5fP8bauskjNg0gsqP/OI+wCmBXpdnieT5GKwoRZlTs5xC80NVb3o4gJBfAaXcVUBdhjrFdHAhmVeXx2f5oBAz1CP0SyJiuwGf7oALwBfA1ZrMQ/zQl/s7jiLtS7AeGYQb7CDP6R5gDlGbMWWUPPfTQQw//W4Q9La3GTA/JKTD+fTV5hNSd0Io+mKu2UtwoYG593nYITQN2hTSsgkwCvnU8/zLCOCS5GBvOnooz0vP8bATpNyYJngxkTFcw3vP8cAScBm46hGq1YmA4myqDVtyL+4T7JnAysgPcIYdgBMwIaVyFmI77cud3IbkdC+zxKHtZKwph7Mofe8gz2yO2D1praBc4p7oazKVJd+E5cHbbJuzMFgFY1zPf4cHS7tAKrI1pDh1JDghpDk2TfWSDJ1MtMKsTtlWK1zG2uvgq/iN5NVbArAlc1+I3MNdKlztjYV5oRQ1wBtJ9ASwXMQ5eTZBoATZhlecdVcCWO7ErWJu24C48wGrX7fBW8Hp0jcNfUV3BaoxnuotzwOZkQpsKsBcK8zK8bIFWvFmOdXlibXkng+j84o1du4WCkOwHvsmgbJ1Wzk1URbCFX5dBdLuQ7C1OLLVSegu8XtkRsFarTDWfC/YDrMPvznMF0p06UzNat3eJe3EU5+/KGeEK/sI3AS/aMrXD5fV9EFjkUX4I2OGRyZOdmJAaF/NtWVLJ4iq7BliQ8qgZeKSUA2KlsC7yRyF1avb6M2dxl1+E8booZrOv8FoxTiuqM7yjVP5qrdx7eiE5SfpV+EYyzGjluMsnW8JN4EFX+Ip1WDqL+TKHgR+xoXAYd/lGaAmJizAenbG7/CjgCczFbTNm9Vnyis56e5ynNTptPTAvS8hdWVFjWjEXExW2WEg+9sh+B0x1iMR3j9B6d1eK3ULybCjbkpQdNqcVo4DTLo8R22x/Lle3h6eELB2FYpfCdUJyvBylwQMnrSEnMNEeIanH+CgGPaLPI2psFuELD8aTxecKWzahI0ergL9xu9x0huvA/a5YpXIJ3QJqMA4VeQQ8x84aNSGV5hU8XYPxw5uM2aL26aCqWxjn7B+AHdYVNii5VEASreiNmdfrMOHz9wH30DaivBkTRnfZ/pzBuLYfF5LGPO37DzEioF2ShAOAAAAAAElFTkSuQmCC';
        const redCircle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFHElEQVR4nO2bXWhcRRiGnz2EULwoJYQQpAQJpcRWpcQgQQpKL0pQkSpSpP6QiyASQpBSelFEEBEvioTghZRib4MXIkVKKSihVhBR/CGG0moVobVa0Ri0xhiT14uZbdbNOeeb3T1nzwb2haFLM/PN+86Z+ebvmxI5QxABA8AgsBvoB3qBLmCLz/YX8BvwE/AtMA98BnxXgrW8OWYOQY9gTHBasCBQnem6YEZwSLCtaF0mBLsEZwTLDYhOSku+QXcVrTMR/ss38sWt9Ifc8GldCI7k2ADHitZnQtApuJSD+Ctad5qFChzwnj0tz6M5NMDjRp2RYE+2ajdWMuYd3GhA3nMZiv8goL7nPLexTMTGVPBSBaGf5ebxtPx3CVZ8/jnBlNx0NizYIegVdPvU6/9v2OeZ8mXkbdxj1LXNc8rHVwhei/kq0wHlDsgtguqtd8Dq+j7fVAy/V+utt9r4iwndclktMCf7RkpadzTWE3x3XE0Zm+cy0tEIxzOG/3i6XsODcqsvy0E9krGmWjiOBPC7KRhKshE7nQm2AjOEzbuDdfLPAiF134bbT2wNtip4M3B6eqVu6hmhanZKSydDDe41xn05vZyztmAIjgXwXRXstQxFgk8za80mIrDXfiHoSDNyMMDIJ4LOJmoLgtwe5OMA/oeSDESCrwI86o4mawuGoF9uy5ymYV5xzl+wP6D1jhagqyYIDgfoeCiu4DtGoe9bsetXww+FK4aW96oLdcte9IwWI6l2CJ41tKwIeioLjBoFrm+Gr1+G7wXXDE1jsO4MHjZsnirBP/nSzg6e6ykj22PALe//i9Fahe/6aoVgp6FpQdBRPrhIy3ipaDH1wk95adoGI+B+w877zSCbEyzuwxFwt5FpNiMyRcDifmdJ7siqG3cHV07/Vvy+XIK/c6WZE+S28ztxzj7C7QMi3Iy2BnxdHLs22mijjTaKR0nutLQXNz1UToHlf2+U3O9NB7kT4f6ULL8jmDaWiweaRThrCJ4wtJ2IcAFJaXigGWRzwr3G3+fLN0CpZ2hNoZoD5A5w07Tdh6BDsJiSaVUtfBCaBMF2pd9vLAo6I+/gPkqxFZF0lNzaOEh6JMuHtw55BM8bXeUHpV0otBj8Ic83hqbxygK9Wo/mSEpPFqipJgR4/xXB7dWFzhqFLm6GXuB92kVDy9m4giGRXeMxdbYUBJMBOjaG3fiWs+L7FgTbC9AVBEGfMaPJ+4b4niz7fkCC2VYcCv4Dng/gnxxGJ3ehYI0fCY43UVsQBK8H8Lb9mMLibiSYaJI2E4KJQM4bL0UTDL4dYGxVMJmzthCuEwqLaJmpxWiP3H1gSCMczlGfxXMyUPw1VV6GViB2qViCG8BT2OcAEXC1MRkN4UeMwG2chme8ptogO9jggmwCuUFuyTtrcGxsmAqOp3T/xADEZkGwR8nLeDOeOaSCSPBGjPG3Aso+qAaeuMjtUfYF5DsRw+9kpr2zqicsWsLkApaW/Ne5IBd0PSJ3bd0l2CK37uj0v7v830Z83vO+7LLc9VZaXdVvlaZzGZqCFzypIwF53w2YQVZ8sjz56Sy5NQTBkIxwGcG+gKmp1rTfqLNDxcYt/4/IXA4NMK8W3INsgGA8B/Hl1DLL71jIvd2x4o0aSb/KeKtUK7L2lH3AZfJ58LzmbfflYDtbyB1MTMgds91s4IsvyU2HR5V+xVU3SnkYrYRcmMoQ7unbbuAO3IFk5WvwNeBP3L7iKjAHfAl8XnJP63PDf2XUd7mudGAmAAAAAElFTkSuQmCC';
        var size = new OpenLayers.Size(60, 60);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -(size.h / 1.3));
        switch (severity) {
            case "orange":
                image = orangeCircle;
                break;
            case "red":
                image = redCircle;
                break;
            default:
                image = orangeCircle;
        }
        var icon = new OpenLayers.Icon(image, size, offset);
        var epsg4326 = new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
        var projectTo = W.map.getProjectionObject(); //The map projection (Spherical Mercator)
        var lonLat = new OpenLayers.LonLat(lon, lat).transform('EPSG:3857', 'EPSG:4326');
        lonLat = new OpenLayers.LonLat(lonLat.lon, lonLat.lat).transform(epsg4326, projectTo);
        var newMarker = new OpenLayers.Marker(lonLat, icon);
        newMarker.location = lonLat;
        myURmarkers.setOpacity(.75);
        myURmarkers.addMarker(newMarker);
    }

    bootstrap();

})();