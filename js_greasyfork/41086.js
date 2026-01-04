// ==UserScript==
// @name        WME UR-MP tracking
// @version     3.7
// @description Track UR and MP in the Waze Map Editor
// @namespace   http://userscripts.org/users/548866
// @include     https://www.waze.com/editor/*
// @include     https://www.waze.com/*/editor/*
// @include     https://beta.waze.com/editor/*
// @include     https://beta.waze.com/*/editor/*
// @exclude     https://www.waze.com/user/*
// @exclude     https://www.waze.com/*/user/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94DDwolKCvyQLIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAGcElEQVRYw82Xf1BU1xXHv/e9t7DsLiy6uwYEZBVYNGi7gwnYNpk6kx9TrcZJGe0v/cOONkPTJuMYJk5NGxUcp9ohOqZDU5wxk+CMQrEZneIv0Pwgmk6LElJKRECJbBaVZdld2F/33Xv6h0JqY/ghGSdn5s67950z53zeOWfuvQ+YhvT399/1/EZIVVXVlOzZZA07OjqwYMGCsfWKFSsKvF7vHCmlQVEU3eFw/PvkyZOfjepramqwdu3ar+erjh49OjZft25dmsvl+lOey3Uj1zV/OCd//kiOK38kNy/v8/z8/LqlS5cWjtpu2rTp68sAACxZsqTE5/O9ZdRU05wkBQ8nq7AlKBTUCe1Bwa6FBcJCxpItlt0bN24sLy0t5bW1tVizZs30AOrq6lhFefnPQpHoG3kWzfzTzEQqmqHBqDIm6bYTnYDWgE6H+2KsLaBzi8n40vPP/2r/9u07yOPxfKVvdTIAfX193/KHRt6Ya1Yf2ppvooctCuOxGOO6hFQ0xONxCB7HbHMCW5yq0fWIVK+GYoU93d0ftLe3exoaGnDo0KGpA1y8eBE9PT0JwyMjv4tFo0+9Ot+MLJPCyGxF2s83Q5s5C+ErbUhd8hTsqzZguONfSJAc6YkKuxjQLcFIPOvmzRs1LpfrK2Mo4wEUFhbC7XY7wrH4skdmGJBlUkgSwTAzDcmLv4+MDa9g9i9+i4zSCsx4/IdQLakAgeVYNMy3aIjz+BO7du3KHi+GMlH6A4FAciQay15k1aAxMIAh2nsZA8ffhIxHYXv6x2Cqhv7D+8EH+kGMIUkBnCaVVAatpaXl2WkBhMNhIiKYVQZltGUZA8VjANGdF/RFS9+ZmlUGBQyBQIBNC8DhcJBB06QnIqHfcW6ckwfHsxuhJCZhsLEOJHSk/eQ3SLClASAQAG9MMJ0ITqezf1oAnZ2dfcYEw4kPBzkicQJJID5wA6GPP0Tfn7fDU12B669vhf/9v4MH/IAEbkUlXRkWAGPe6urqvwEAjWVrCgDd3d0oKCiIWkxJZzxRIc/74oAuER0cxNV9W3Hz1F8hYMBg82n07NmMWCAEziV9MsTZtbCAyWTaxRiL3q4amzpATk4Odu/eLU0m07FEVf24tp9jKKaTlAQyGCFVDboQEIoGSkyCLiXCXODULY6IoE8cdvsRAGhtbb3/EgDA2bNnrzLIPwzEZfjIDc5UIaHr9KUhBeGfQ5xdCukwJxn/smjhwlsA4Ha77x/g4MGDAIBPOz49ojK0vTsk0RYURLqAzr8YggsEozod8AokGbTWWQ5HQ+Vrr9FE/icEWL9+PUZrmO10vhoXMlTrE8wflaRzCc4ldC4R45Kq+gWLEIWtKSl7m5qaeiaT3QkBfD4f9uzZAwA4ferUaavVWnk5LNAUEIwLASEEpBA4MyTxnwjBwNjbFy5cqJnsCTshgM1mQ1lZ2dj6xRdfOJCSktJ5IgR0hwmSS3SFJZpGiEkiWVFR8RZjTIzat7S03N99oL6+HiUlJaivr1cqKyuX+gf9z2mqmkKAFo1G3JIpdpuB4YUUicPDDB2cQcbiItVqfVfXdZ3r+vn02el7z507F7xzoiIzM3NyAI1NjXjyiScBAO5vuwu8Xm9TmnPuQ9YZqSACNIMGHgmTt8/D7BowoBPSMzNJMyYxoQsQEXo7L0NyXr169eqyvfv2BkbLabPZxgc4fvw4Vq5ceXsfmJeTPTAwcMj9ne9+b/3LLyPZaiWAGJiC4cAQDpSXw9N7DelZWVi7+SXMmp0BgMAUhdrOn2dVO3YARLWlvy59btvvtw1N6R5YXFScbU2xXlq18hnyDQ5STBcyyjmNDi4ldXZ2UnFxMZ1pbCQuJd2lF0L+46OPaJ5zXtxus5cT0fj91tvbOzYverTIaZtpa3Y/8ij13BqQfYEAfeb3f2l4gkG6dKWLPIHgPfWfB0N04v0PKCMjU8x1zt1W8qMSAwCsembV3SXo6upCbm4uAGDZD5altrS0HDGazU9v2PoKrA4HhJC411ZOBKiqAinlPT+KCFAU0HvvvMPeO3ZsKDEx8Zfefm8dACxfvhwNDQ1390BxUfGC9vb2PyqKstxsscBosYAkYTrCGCClRNDvh9D1GBGVhYZD+0f12v8aP/b4Y4sXLlrYBWDfeEfo/YEwAGCapjnsdnvWzp07r48pm5ubH/gv3JYtW/6/XvTAgj/IWN98+S9tiGRBMpU45gAAAABJRU5ErkJggg==
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @copyright   2017, dummyd2, seb-d59
// @author			dummyd2, seb-d59
// @connect         waze.lesduts.info
// @downloadURL https://update.greasyfork.org/scripts/41086/WME%20UR-MP%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/41086/WME%20UR-MP%20tracking.meta.js
// ==/UserScript==


/*******
 * 
 *  You are free to:
 *   Share, copy, and redistribute the script in any medium or format
 *   under the following terms:
 *   Attribution - You must give appropriate credit. You may do so in any
 *     reasonable manner, but not in any way that suggests the licensor
 *     endorses you or your use.
 * 
 *   NonCommercial - You may not use the script for commercial purposes.
 *
 *   NoModifications - You may NOT MODIFY the script.
 * 
 *  You are invited to contact the author: dummyd2 on waze forum for more details.
 * 
********/

function downloadHelperInjected() {
  window.downloadHelper = {jobs:[], _waitForData:function(id) {
    if (this.jobs.length <= id) {
      this.jobs[id].callback({url:null, data:null, callback:this.jobs[id].callback, status:"error", error:"Request not found"});
    } else {
      if (this.jobs[id].status == "success" || this.jobs[id].status == "error") {
        this.jobs[id].callback(this.jobs[id]);
      } else {
        if (this.jobs[id].status == "downloading" && this.jobs[id].progressCallback) {
          this.jobs[id].progressCallback(this.jobs[id]);
        }
        var _this = this;
        window.setTimeout(function() {
          _this._waitForData(id);
        }, 500);
      }
    }
  }, add:function(url, callback, progressCallback) {
    this.jobs.push({url:url, data:null, callback:callback, progressCallback:progressCallback, status:"added", progression:0, error:""});
    var _this = this;
    window.setTimeout(function() {
      _this._waitForData(_this.jobs.length - 1);
    }, 500);
  }};
}
var downloadHelperInjectedScript = document.createElement("script");
downloadHelperInjectedScript.textContent = "" + downloadHelperInjected.toString() + " \n" + "downloadHelperInjected();";
downloadHelperInjectedScript.setAttribute("type", "application/javascript");
document.body.appendChild(downloadHelperInjectedScript);
if (typeof unsafeWindow === "undefined") {
  unsafeWindow = function() {
    var dummyElem = document.createElement("p");
    dummyElem.setAttribute("onclick", "return window;");
    return dummyElem.onclick();
  }();
}
function lookFordownloadHelperJob() {
  for (var i = 0;i < unsafeWindow.downloadHelper.jobs.length;i++) {
    if (unsafeWindow.downloadHelper.jobs[i].status == "added") {
      unsafeWindow.downloadHelper.jobs[i].status = cloneInto("downloading", unsafeWindow.downloadHelper.jobs[i]);
      var f = function() {
        var job = i;
        GM_xmlhttpRequest({method:"GET", headers:{"User-Agent":"Mozilla/5.0", "Accept":"text/plain"}, synchronous:false, timeout:10000, url:unsafeWindow.downloadHelper.jobs[job].url, onerror:function(r) {
          unsafeWindow.downloadHelper.jobs[job].status = cloneInto("error", unsafeWindow.downloadHelper.jobs[job]);
        }, ontimeout:function(r) {
          console.debug("TOTO Timeout while getting area from server: ", r);
          unsafeWindow.downloadHelper.jobs[job].status = cloneInto("error", unsafeWindow.downloadHelper.jobs[job]);
        }, onload:function(r) {
          unsafeWindow.downloadHelper.jobs[job].status = cloneInto("success", unsafeWindow.downloadHelper.jobs[job]);
          unsafeWindow.downloadHelper.jobs[job].data = cloneInto(r.responseText, unsafeWindow.downloadHelper.jobs[job]);
        }, onprogress:function(r) {
          unsafeWindow.downloadHelper.jobs[job].progression = cloneInto(r.total == 0 ? 0 : r.loaded / r.total, unsafeWindow.downloadHelper.jobs[job]);
        }});
      }();
    }
  }
  window.setTimeout(lookFordownloadHelperJob, 2000);
}
window.setTimeout(lookFordownloadHelperJob);
function GMStorageHelperInjected() {
  window.GMStorageHelper = {jobs:[], _waitForData:function(id) {
    if (this.jobs.length <= id) {
      if (this.jobs[id].callback) {
        this.jobs[id].callback({entry:null, data:null, callback:this.jobs[id].callback, status:"error", error:"Request not found"});
      }
    } else {
      if (this.jobs[id].status == "done") {
        if (this.jobs[id].callback) {
          this.jobs[id].callback(this.jobs[id]);
        }
      } else {
        var _this = this;
        window.setTimeout(function() {
          _this._waitForData(id);
        }, 500);
      }
    }
  }, load:function(entry, callback) {
    this.jobs.push({task:"load", entry:entry, data:null, callback:callback, status:"added", error:""});
    var _this = this;
    var jobId = this.jobs.length - 1;
    window.setTimeout(function() {
      _this._waitForData(jobId);
    }, 500);
  }, save:function(entry, data, callback) {
    this.jobs.push({task:"save", entry:entry, data:data, callback:callback, status:"added", error:""});
    var _this = this;
    var jobId = this.jobs.length - 1;
    window.setTimeout(function() {
      _this._waitForData(jobId);
    }, 500);
  }};
}
var GMStorageHelperInjectedScript = document.createElement("script");
GMStorageHelperInjectedScript.textContent = "" + GMStorageHelperInjected.toString() + " \n" + "GMStorageHelperInjected();";
GMStorageHelperInjectedScript.setAttribute("type", "application/javascript");
document.body.appendChild(GMStorageHelperInjectedScript);
if (typeof unsafeWindow === "undefined") {
  unsafeWindow = function() {
    var dummyElem = document.createElement("p");
    dummyElem.setAttribute("onclick", "return window;");
    return dummyElem.onclick();
  }();
}
function lookForGMStorageHelperJob() {
  for (var i = 0;i < unsafeWindow.GMStorageHelper.jobs.length;i++) {
    if (unsafeWindow.GMStorageHelper.jobs[i].status == "added") {
      if (unsafeWindow.GMStorageHelper.jobs[i].task == "load") {
        unsafeWindow.GMStorageHelper.jobs[i].data = cloneInto(GM_getValue(unsafeWindow.GMStorageHelper.jobs[i].entry, null), unsafeWindow.GMStorageHelper.jobs[i]);
      }
      if (unsafeWindow.GMStorageHelper.jobs[i].task == "save") {
        GM_setValue(unsafeWindow.GMStorageHelper.jobs[i].entry, unsafeWindow.GMStorageHelper.jobs[i].data);
        unsafeWindow.GMStorageHelper.jobs[i].data = cloneInto(null, unsafeWindow.GMStorageHelper.jobs[i]);
      }
      unsafeWindow.GMStorageHelper.jobs[i].status = cloneInto("done", unsafeWindow.GMStorageHelper.jobs[i]);
    }
  }
  window.setTimeout(lookForGMStorageHelperJob, 2000);
}
window.setTimeout(lookForGMStorageHelperJob);
function WMEURMPT_Injected() {
  var WMEURMPT = {};
  WMEURMPT.isDebug = false;
  WMEURMPT.urmpt_version = "3.7";
  WMEURMPT.URList = [];
  WMEURMPT.URMap = {};
  WMEURMPT.MPList = [];
  WMEURMPT.MPMap = {};
  WMEURMPT.MCList = [];
  WMEURMPT.MCMap = {};
  WMEURMPT.dom = {};
  WMEURMPT.managedAreas = [];
  WMEURMPT.sortModeListUR = {ageASC:1, ageDSC:-1, typeASC:2, typeDSC:-2, commentCountASC:3, commentCountDSC:-3, distanceASC:4, distanceDSC:-4, lastCommentASC:5, lastCommentDSC:-5};
  WMEURMPT.sortModeListMP = {priorityASC:1, priorityDSC:-1, typeASC:2, typeDSC:-2, distanceASC:3, distanceDSC:-3};
  WMEURMPT.sortModeListMC = {distanceASC:1, distanceDSC:-1, commentCountASC:2, commentCountDSC:-2, ageASC:3, ageDSC:-3};
  WMEURMPT.URFilterList = {hideClosed:1, hideWithoutCommentFromMe:2, hideWithCommentCount:4, hideOutOfMyManagedArea:8, hideVisited:16, hideBlacklisted:32, hideWhitelisted:64, hideGE:128, hideNotKW:256, hideLimitTo:512, hideType:1024, hideArea:2048, hideLastCommentFromEditor:4096, hideTagged:8192, hideNoNewComment:16384};
  WMEURMPT.MPFilterList = {hideClosed:1, hideOutOfMyManagedArea:2, hideVisited:4, hideBlacklisted:8, hideWhitelisted:16, hideLimitTo:32, hideType:64, hideArea:128};
  WMEURMPT.MCFilterList = {hideOutOfMyManagedArea:1, hideVisited:2, hideBlacklisted:4, hideWhitelisted:8, hideLimitTo:16, hideArea:32, hideNotKW:64};
  WMEURMPT.taggedURList = ["[NOTE]", "[CONSTRUCTION]", "[ROADWORKS]", "[CLOSURE]", "[EVENT]", "[WSLM]"];
  WMEURMPT.URAgeColIsLastComment = false;
  WMEURMPT.currentSortModeUR = WMEURMPT.sortModeListUR.ageDSC;
  WMEURMPT.currentSortModeMP = WMEURMPT.sortModeListMP.priorityDSC;
  WMEURMPT.currentSortModeMP = WMEURMPT.sortModeListMC.distanceASC;
  WMEURMPT.sortHistoryUR = [WMEURMPT.currentSortModeUR];
  WMEURMPT.sortHistoryMP = [WMEURMPT.currentSortModeMP];
  WMEURMPT.sortHistoryMC = [WMEURMPT.currentSortModeMC];
  WMEURMPT.currentURFilter = WMEURMPT.URFilterList.hideClosed + WMEURMPT.URFilterList.hideBlacklisted + WMEURMPT.URFilterList.hideLimitTo;
  WMEURMPT.currentMPFilter = WMEURMPT.MPFilterList.hideClosed + WMEURMPT.MPFilterList.hideBlacklisted + WMEURMPT.MPFilterList.hideLimitTo;
  WMEURMPT.currentMCFilter = WMEURMPT.MCFilterList.hideBlacklisted + WMEURMPT.MCFilterList.hideLimitTo;
  WMEURMPT.currentURID = null;
  WMEURMPT.currentMPID = null;
  WMEURMPT.currentMCID = null;
  WMEURMPT.selectedURID = null;
  WMEURMPT.selectedMPID = null;
  WMEURMPT.selectedMCID = null;
  WMEURMPT.displayLegend = true;
  WMEURMPT.isEnabled = true;
  WMEURMPT.isComputeDistances = true;
  WMEURMPT.isAutoScan = true;
  WMEURMPT.isScanningWME = false;
  WMEURMPT.currentURKeyWord = "";
  WMEURMPT.currentMCKeyWord = "";
  WMEURMPT.currentURLimitTo = 100;
  WMEURMPT.currentMPLimitTo = 100;
  WMEURMPT.currentMCLimitTo = 100;
  WMEURMPT.currentUROnlyType = 6;
  WMEURMPT.currentMPOnlyType = 106;
  WMEURMPT.currentUROnlyArea = "";
  WMEURMPT.currentMPOnlyArea = "";
  WMEURMPT.currentURCommentsCount = 0;
  WMEURMPT.wazeServerWaitingTimeToRetry = 1;
  WMEURMPT.mapCenterLonLat = null;
  WMEURMPT.scanAreaBoundsList = [];
  WMEURMPT.scanAreaBoundsCount = 0;
  WMEURMPT.scanUR = true;
  WMEURMPT.scanMP = true;
  WMEURMPT.scanMC = true;
  WMEURMPT.flashOdd = true;
  WMEURMPT.URDescriptionMaxLength = 18;
  WMEURMPT.MPDescriptionMaxLength = 27;
  WMEURMPT.MCSubjectMaxLength = 9;
  WMEURMPT.MCBodyMaxLength = 20;
  WMEURMPT.visitedURBeforeActionsSaved = [];
  WMEURMPT.visitedMPBeforeActionsSaved = [];
  WMEURMPT.visitedTPBeforeActionsSaved = [];
  WMEURMPT.lastUploadedWKT = null;
  WMEURMPT.securityOn_visitedURBeforeActionsSaved_set = false;
  WMEURMPT.servers = [{name:"dummyd2", url:"http://waze.lesduts.info/"}];
  WMEURMPT.customAreaList = [];
  WMEURMPT.areaList = {custom:[], country:[]};
  WMEURMPT.statsCSV = "";
  WMEURMPT.icon_comments = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94DDg83H1XMMOAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAEQ0lEQVRYw+2XTUhcVxTHf0+dwcxUHawuxImtH0hbBEebGLCFutGFgSaBriImoXRRBLciqYuKza4bN21dVFcJgouE2IKolIJYP0BmFCwKoyJxksyMTGZ0Zvpax3u6eW+YD40abTftH+7mvnfv/3/OPfecc+G/Du0ca2sBJ5Bv7BMDXgDr/6Tgz4CfgAAQAaIGcQzYB8KAH/gZuHVRpAXAbeAlIIDk5uaKzWZTRUVFUlxcLMXFxVJUVCQ2m03y8vLE/A/wAV8Aljc9gk+AB8BHABUVFTQ0NHDt2jWuXLlCbW0tZWVlKKXw+/14vV4WFxdZWFhgaWlJdnZ2zP0XgF7g17NY/qXhUrHb7aq/v195PB45DZRSsrKyIgMDA2K1Wk1vhAxvnAq3AR2QiooKtba2JkqpNILTIJFIyMbGhqqvr1eGiEOg6yTyauBPQOrq6lQikTgTaaYnRET8fr80NzcLoAzDPn6dgBlA6uvrVTgcfmPyTBHb29tSU1NjHscvgP0o8k8BcTgcanp6+tzkmSJmZ2dNAQcGVxZ+A+TmzZvnZz0GHR0dZjwMAdZU8hLgldVqVUNDQxdmfSZmZmZML2wAhZl3fr+goEBWV1ezXHiUmNMIzLw94XBY7Ha7KaIkJ0XAW0COxWKhqqoqPVtpGpqmMTw8zN27d3ny5Ely/uHDh9y5c4epqSmUUiilePz4Mffu3WNychJN0xCRtH2MYMxKhNeBmMPhkN3d3SxLxsfHpbCwUABxOp3i8Xhkfn4+mXbz8/MlEAiI1+tNzmmaJj6fL22fcDgsNTU1ZhyUpnrgBXB4cHAgq6urAEnlAJubm8TjcQACgQCRSIS1tbXkd13XCYVCbG1tJedEhPX19OKo6zper1cD/jISU1pdeJ6TkyN9fX1ZHvD5fNLa2ipOp1M6OzslGAxKNBqVlpYWKS8vl46ODonH4xKNRqW9vV2cTqfcuHEjKxZGRkZM62ePygXDgDQ1NalgMJi1OBQKidvtlkgkkvy2v78vHo9HYrFYcm5vb0+Wl5dF1/WsQKyurjYF3AdyMgWUmOc3ODiYFv2ZEX/czTjqFpj/9fT0pJbpD49LxQ9MEXNzc+oiMqCIyNjYmFgsFmXUg+9eVwvyzXrQ1NR0IeSPHj0Sh8Nhun4JePukingLEJfLda6sFwwGpaurS9nt9lTyd0/TD1w/j4BQKCS9vb1SWloqmqaZ5z4JlGYS5R1BbgM+B7h8+bLouq6Nj48zOjoqT58+1RKJBC6Xi7a2NmlsbNQqKys5PDzk2bNneDweJiYmcLvd5l7K6Kq+B74GEqex/r7ZvXR3d6urV6+qlCZTjA5YThgxwA18C7x/lnfBV8A3Keo1Y0SM8jkLxI2u6YNj3gW/G2+DdeD5WZrQFoMo05ofgXeOSBoWg/ySMfJf134fh9QYuAT8YVjzEvgBGAFeHbP2wBgXivcAF//jX8TfP8rg1M0AqeYAAAAASUVORK5CYII=";
  WMEURMPT.icon_distance = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94DDhYIKkhWRgAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACXUlEQVRYw+3Uv2sTYRgH8Cd3Zzyvh8nlEpPGJRSalpOWBpq2QTEx3KExiwgR7FK7OLiJZBD8sejSgnRxFpf+BUWHHjSTLQULdqh0rimUbHfvvffzvcdB/QO61OU++8MDz/d5HoBEIpFIJBKJxP82MTHR1jRtaBjGs3OWcnNzc98bjcYPACico45vNpuvpqamftXr9RtCJpPJrq6ulk9OTnLb29uXdV0XT09P3SAIUpVKRTRN09E0jSuXy1dM07SWlpbEfD6f2trautTtdkvT09PZ3d3dfK/XI8fHx9zh4aGzsLBwleO4cG9vL9B1XQ7D0CeEMEVRJNM0vfn5eUVV1es7OzuyAAAQRRGIomjNzMy8mJycbAHAF57ns+Pj43c0TftUrVYLlNLHpVLpLsdxG4qicADwhjEWh2EYAcA1SZJej42NZQHgviRJZiaTGRSLxa+qqr4PguCb67o/VVV9IsvyS0EQ3CiK/owRAIDjONjf3783HA6fr62tGaPR6KnneY/6/f7t0Wj0luf5XqfTqRUKhQ+O4xi6rjeLxeIGIUSklAq5XO5du91uptPpxXq9/rHVatUkSeoCwPrKykojnU53z87O+svLy7dkWV4/Ojq6yfP8n0BqtdrDwWCAYRi6lmW5iIiO43iUUh8R0bIs6nmeH8cxUkqJ4zghIjLbtkkQBIwxhpZlEURkrutGlFLCGEPf9wPbtgkioud5gW3bLiKibduEMeZvbm7GhmEspqrV6oPZ2dnPlUrFjuM4dRGLLwgCHBwciISQzr+G8t848IKOLwUADACc5A8lEr8BN7wbxzXrd3cAAAAASUVORK5CYII=";
  WMEURMPT.icon_age = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94DDhYcMwKTOZUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAFF0lEQVRYw+2XTWgUZxjHf+/sZnd2EpPsBhWaoB4MVczBbZo05FAPNuApEdSLRAWbguKxtFAoLRLJxQZyaQk9FkR7kKQHQyUXsSlBUGLoITbihlhDNMmucTeZnf2Y9+nB2bJZ893QU/8wMLzzvs/zf77fgf+xM/D9l8qCwKfAL8AMsOw9SeAP4Afg2E4rNYD3gR8BKTzBYFADGpBAIOD6/X4p+j4LdAE1/9Z1EeAL4CegxbKsfFNTU669vT135cqV3JMnT17btq2uXbu21NbWpsLhsHZd143H49VAO9AGvAT+3I7lB4F7xVbfuHHjRSKRyIqIKyISi8WSIyMjtohk5S1yk5OTTjQafVV0Lg1c36oHDgJDwAfhcDjX3t6+UFVV9aK3t7fWsqyAiKCUUqZp2nNzc9m6urqAJ8+oqanxRSKR16lU6vXhw4fzk5OTlcBHwF7gV4/Uhm6/B0g4HHYmJiZSshJaRCSZTM5XVFQkAX3u3LmXRV5YsbenpydR5I1LgNoo4b4FJBKJ5ArKtda6VPLdu3cXTNN0AWlubk47jrOCqH4LERHp7u5e9AgsAUeKlZWiHvgS4MyZM68OHTpUISKilHqHtWEY/5z3+XzvyFNvgYhw+fLlMuANUA70rUfgc8ACmJqacgqCNpm0q8ZWKUU6ndZevwD4pNArjFWazGeWZeX6+vpeDA4OvrdTjaS2trbcdd2KU6dOLXlLX69GoBPg6NGj+sKFC3tDoVBIRGQLetb0lFJKGYZR2dnZqSzL0sDHQFUpgXaAaDSqq6urfVtxv2EYBAKBd/aWGnDixAmjvLxcPLLH/SX7PwwGg9LU1CSAsVbyrYZ4PK6HhoZSpmk6IoJpmm5jY2MwFArtKsgRETFNM3TgwIGl+fn5UHE1FLBsGIZ78eLFOdu2bdkAw8PDiUIZKqW0aZp50zRd0zTdQCDgnjx5Mp5MJtPFZ27duvWXZVnLgAv0G6VdUWtt3L5923r8+LHeyGrLsrRSSnuuVo7j+BzHMRzHMbLZrDExMRGIx+Mrwjw6OmrZth3wQmAWh8AFXJ/Pp7u6utLNzc27NiLQ2tpqnT9/PjE+Pl65SqT02bNnM/v27TOLF/v6+oL3799fGhsbqwQWS3NgWinVUFtbW+7z+YLr5YD3LdTf3+/PZDKZoooSQPl8PvH7/VWAv0ROMJVKlXljPFZK4Ld8Pt/w4MEDA8grpfzrlZUnuCwYDJat2ZlKjJiamsomEgkTyAOPSsvwZ4Dx8XGePn3qbjS1NlMhhT2FchwYGJBUKoXXFX9f7cwsIB0dHbM3b978S3YItm3nrl69GguHw0nPsO/WIt1VGJ1Kqem1JuFWoLXWCwsLucrKyllPdg7Ys9YwGgDGAFpaWkKFpNruDCjkgOu6rlKqwlv+Bphb71yHd42Snp6ehGfFliwuWcpGo9GUZ8woEN4M+etepkp3d/diMpnMTk9PL+ZyufxqyoqVaq214zjZ58+fv5mZmbGLlM94V7NN4/tCPkQikQVg8eHDh9NFigqv6VIv3blzZxZY8LK9oLxjO/8Dl7xrlADS2tqaGBwcXEqn07aIyMjIyOzp06dTz549i4tIPhaLLff29i41NDQsF90DR7dqeemMPwIMFwRalpXfvXt3vrGxMVVXV5cC9P79+xfr6+szkUjELSsrc4uy/avNxnwzOOYRyQBZL0dcr626nsIMkPDqfM+2bzAboAo47nmmFjCBRSAGPFqrw62GvwHMAdeNGK2SbwAAAABJRU5ErkJggg==";
  WMEURMPT.icon_type = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94DDwolKCvyQLIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAGcElEQVRYw82Xf1BU1xXHv/e9t7DsLiy6uwYEZBVYNGi7gwnYNpk6kx9TrcZJGe0v/cOONkPTJuMYJk5NGxUcp9ohOqZDU5wxk+CMQrEZneIv0Pwgmk6LElJKRECJbBaVZdld2F/33Xv6h0JqY/ghGSdn5s67950z53zeOWfuvQ+YhvT399/1/EZIVVXVlOzZZA07OjqwYMGCsfWKFSsKvF7vHCmlQVEU3eFw/PvkyZOfjepramqwdu3ar+erjh49OjZft25dmsvl+lOey3Uj1zV/OCd//kiOK38kNy/v8/z8/LqlS5cWjtpu2rTp68sAACxZsqTE5/O9ZdRU05wkBQ8nq7AlKBTUCe1Bwa6FBcJCxpItlt0bN24sLy0t5bW1tVizZs30AOrq6lhFefnPQpHoG3kWzfzTzEQqmqHBqDIm6bYTnYDWgE6H+2KsLaBzi8n40vPP/2r/9u07yOPxfKVvdTIAfX193/KHRt6Ya1Yf2ppvooctCuOxGOO6hFQ0xONxCB7HbHMCW5yq0fWIVK+GYoU93d0ftLe3exoaGnDo0KGpA1y8eBE9PT0JwyMjv4tFo0+9Ot+MLJPCyGxF2s83Q5s5C+ErbUhd8hTsqzZguONfSJAc6YkKuxjQLcFIPOvmzRs1LpfrK2Mo4wEUFhbC7XY7wrH4skdmGJBlUkgSwTAzDcmLv4+MDa9g9i9+i4zSCsx4/IdQLakAgeVYNMy3aIjz+BO7du3KHi+GMlH6A4FAciQay15k1aAxMIAh2nsZA8ffhIxHYXv6x2Cqhv7D+8EH+kGMIUkBnCaVVAatpaXl2WkBhMNhIiKYVQZltGUZA8VjANGdF/RFS9+ZmlUGBQyBQIBNC8DhcJBB06QnIqHfcW6ckwfHsxuhJCZhsLEOJHSk/eQ3SLClASAQAG9MMJ0ITqezf1oAnZ2dfcYEw4kPBzkicQJJID5wA6GPP0Tfn7fDU12B669vhf/9v4MH/IAEbkUlXRkWAGPe6urqvwEAjWVrCgDd3d0oKCiIWkxJZzxRIc/74oAuER0cxNV9W3Hz1F8hYMBg82n07NmMWCAEziV9MsTZtbCAyWTaxRiL3q4amzpATk4Odu/eLU0m07FEVf24tp9jKKaTlAQyGCFVDboQEIoGSkyCLiXCXODULY6IoE8cdvsRAGhtbb3/EgDA2bNnrzLIPwzEZfjIDc5UIaHr9KUhBeGfQ5xdCukwJxn/smjhwlsA4Ha77x/g4MGDAIBPOz49ojK0vTsk0RYURLqAzr8YggsEozod8AokGbTWWQ5HQ+Vrr9FE/icEWL9+PUZrmO10vhoXMlTrE8wflaRzCc4ldC4R45Kq+gWLEIWtKSl7m5qaeiaT3QkBfD4f9uzZAwA4ferUaavVWnk5LNAUEIwLASEEpBA4MyTxnwjBwNjbFy5cqJnsCTshgM1mQ1lZ2dj6xRdfOJCSktJ5IgR0hwmSS3SFJZpGiEkiWVFR8RZjTIzat7S03N99oL6+HiUlJaivr1cqKyuX+gf9z2mqmkKAFo1G3JIpdpuB4YUUicPDDB2cQcbiItVqfVfXdZ3r+vn02el7z507F7xzoiIzM3NyAI1NjXjyiScBAO5vuwu8Xm9TmnPuQ9YZqSACNIMGHgmTt8/D7BowoBPSMzNJMyYxoQsQEXo7L0NyXr169eqyvfv2BkbLabPZxgc4fvw4Vq5ceXsfmJeTPTAwcMj9ne9+b/3LLyPZaiWAGJiC4cAQDpSXw9N7DelZWVi7+SXMmp0BgMAUhdrOn2dVO3YARLWlvy59btvvtw1N6R5YXFScbU2xXlq18hnyDQ5STBcyyjmNDi4ldXZ2UnFxMZ1pbCQuJd2lF0L+46OPaJ5zXtxus5cT0fj91tvbOzYverTIaZtpa3Y/8ij13BqQfYEAfeb3f2l4gkG6dKWLPIHgPfWfB0N04v0PKCMjU8x1zt1W8qMSAwCsembV3SXo6upCbm4uAGDZD5altrS0HDGazU9v2PoKrA4HhJC411ZOBKiqAinlPT+KCFAU0HvvvMPeO3ZsKDEx8Zfefm8dACxfvhwNDQ1390BxUfGC9vb2PyqKstxsscBosYAkYTrCGCClRNDvh9D1GBGVhYZD+0f12v8aP/b4Y4sXLlrYBWDfeEfo/YEwAGCapjnsdnvWzp07r48pm5ubH/gv3JYtW/6/XvTAgj/IWN98+S9tiGRBMpU45gAAAABJRU5ErkJggg==";
  WMEURMPT.icon_blacklist = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94DFxYbAagU5scAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADGElEQVRYw+1Wz2tcZRQ959xvfmRmXqaZvDppaFeVwCwaCC4aEbswEA2oq1BdiP+CoFshUNRS3ApdiAih4M7NrIpkkY3ZCC4VAoVUE2USCAnOkDrJXBdv3us4tNTaNCjMhW9xv3t553zn/uABIxvZyP7H9r6k7/P5/FfFYnH8rMHfJPnALHihUPBSqfTt+fNTOivwCQA/SvJ8Pt8rlcY8iqIH1Wr1nbMi8AVJD7lcr1gc83K53KtWq16r1e7VJmsTzxv8dQBukkdR1FtfX/ednR1fWlryOI69Xp+68zzBKwB+I+m5XM5nZmbc3b3X6/nKyorX6/Xe9PQFv3Tx4ttP89GnaZzPQdQlc0koFApZwMxAkpJBsi8vv3h5+rQJLAB4TxQlUhIODw6zYKfTgckgyWV6geDNRqNhp0WgCOAWgIokmBkkotv9EwBAEu12GxQhiUlc7wJ447QIfATgJZOcEkhCMoBEq9XC8fFxokACDJFuZnkzuzk7OzvxrATmAXxCEpRoUio13B27u7tot9uJAiQkgTJKcklXQrCPn4XAOICvAUCSpy/sSw1R2N7eRqfTQafTgUzJfT+e5NuH8/NX3/q3BG4AmJHkopi+MCXicLRaLXS7XfzRbkPUQJyk6JJA2O1rr7z62FI8rlOvAfgUQFkSLRhCCJAMZg9PCAGHBwfY2NjAyclJRsAswCxQJjezSKZ4a2ur+SggPuJuDEATwIIktxAYzBAswILBQkAYIJDdp34IfyMYgsEsHEq6vra2dveflOADAAtEMlbqS5/VOPVlqFQqmIwnM1/ZlAjWzyflksbN7LPFxcXyk0pwDsB3A43HEELS+absVTJDHE9idXUVy8vL2Nvbwy/37w/Ek2kZ8GlmF0IIv25ubv4wCBiGCEwlywUwM2Zz3wdPfZMQQsDc3BwAII5jyB4qkIJLBEmmPslLwwoME/gZwF1Jr4kMNiS9KR01YX9/H41GA1EU4ejoKJuONCddWJJBlJP8neQ3TyIASddJvUwpBxJMj4RBP11Gg1uQQ/EsX3QA95rN5k+jP9mR/efsL/+DvMiiIfU+AAAAAElFTkSuQmCC";
  WMEURMPT.icon_delete = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAIFElEQVRYhY2WXWwc1RXHf/fe2bHXWdY2dry249hmY9cmKnaSEqClReqH8lQnAtpKoRKV+GjFW1UUlUqlrUpT9QNeEEh9qYCH8kSCVJSkzYcigVpKA0F2nMRxkOO4tolDEvDa8e583dOHndmsvxBHGu3M7Nz7/51zzzn3Kqpst+vyZFcXodb33NbS8h0Jwxk3lXrtxrVrPHTuHMIXtxc6Orgvn6dYKn0vVVfX99nc3H8dY479+/Jl9i8sVL5Tyc0jtbX8qLubouP8qWvbtn3zs7PUpNNsaGiYXZyd7QkLheI3P/iA6AuI/zWfZ3s+j9648UN/aWnb0vw89R0dzJw7d9AJgoc/nJriF/PztwC+77o8ls+zpPULLfn8zy6cOIHruhhAiXDX7t1Xbs7M5KPFxeIDp059LsSr+TyDW7bg5HLDF44eHfB8HwF8z6Prvvsozs+/qYLgoZEYQjUBf+vrY8Fxns91dz89dvIkNXV1OCIorTGA+D5f3r37ys3p6QpEuIb4a1u2MJjP4+Zyw2PHjw+EQYA1BhEhFMEvFuncuZNiofCmG4YP/fH8efSg63Izih5o6e5+evTkSdx0GmUtVikUIEphUinO/f3vrZmOjgknk0m/s3Mnzhri2/J5Urnc8IXjxweiKEIZU54rDnWqpoaJU6eoq69/sBiGjw1mMmitNelsdujs229TU1uLQGWAAGItaI2uqeHcW2+1Zjo6JkwMoWPxV2Jxp7V1+OKxY2XxZHw8l43vndpaLr7/Ptp1v2uUQhvg6tTUjHYcRKnV4koRAVYE5bqcrYL4x44dvLh5M9vzeZxcbvji0aMDkbUorSviohRi7TIY4zhcm5qaIYpQ/cbwbEODXhC5bkQatNYowBFBa41WCp3ci4BSiO+zdWjoymeXL+cdY4obNm0avpiEXWustURKgbVYEcIYwsYOWmtJKZU7VCxeVQDPZbNsdpxGT2TSaJ3VcfY7WkMsbuJfJQIi2CBg69DQJQVXLxw9eq8VqeRMBGVxpYhElolH1opRql/B+OM3btzqA89ls3SugFjmeQyh4ghhLQCO6xL4PjoJe+J9WQyUwiYwIAb6gfGfXL+OT1UjAvhdfT2dxjR6Sk0ayAIVzxHBxOIKEBG0UkgMZa1FKYVUCS+LBIiGfgPjT8birARIIDY7TqMPyyCULue8EUGg4rGuqhprLRJ7nyReIu5Av4bxx69fJ6jSWwUA8PsYogSTCrJJR1RQLsmqgdVlpqqEk1yQzxFfFyCB6HCcxlIUTRpjsknoE5DE+8QqAPEyCGBFRCvV76wj/rkAAM9kMvTV1jZ4QTDmOE6usv6xePXuWN1sFBCGYTHluoM3Pe/iTwuFdfePlR11mdXW19PS2fmZaH156syZnDEGRXn9wxURiLi1BIG1tPf1XRVrp2p8n2hkZF0Nvd4ff+jo4P7eXpq6u4enL1y4R5QiuUKRygYTWrvs2SoFWvO/8+e72vr6Jhuy2fTBwcF1hdZcgv3t7ezo7aW+vX34/SNHBogijOPcCn9SCQBal0stnizZxKwIvufx1T17rlybns6XCoXiD0ZGVh1qVgH8tq2Nu3t7yba3D59aTzyuhLVyINlJBSCG+NqDD175ZGoqXywUio+cObNqXMV+09bG3T091Le3D7935MiARBE6Flci5fKL+8F6VQBxKcatV0QIPI/7E4j5+eIPz55dDfBsaytf6e2lsb19+D+HDw9IleeqqgVXC1c8EUHFDahSCVX9wMYQX48hlhYWio+OjkIy189bWtjR00N9W9vwvw4dGgjDEIzBilT6uI2TTJYnXlGsnROlyu+sRZJvlCqPi0FwXU4ePNja3Nk5UZPJpF/ZurUM0A7cs3kz6ebmD98+dGggCENslXgYZ30Y72phEl5rRawdUEp9KYyiQqVCrC2LJlUSvwMwrsuJAwdamzdtmkin02ZXXR36jlQKz9pHR959d1sURYgxZeFYPPFIkucykCil+j346FIYFlJKdYcihVCk/H/ieTI22RFF0KkU7xw+3Kpc99ddjoMjwNzMzOBioYAxprykcRarmFxBOfNFCOPeDoz/anGRENiXTn+aM6bbh8kIsgqI4kNIpUPGOaJjmEtjYwOBtWgRobi4+F4inghWDhexR3H4RYn0K5HxZ2JxgD8Xi8xa+6kj0i3WFkJrK4eQKI5aMieUO2ngeadsEJSP5c9mMsyLHAe+zVpWXgJRUdQfRtH4c3FkVtqPgY5UqtEaM4nW2aQy1rCxNNz5pueVob4B7AICrU9o1/2WqoqGWIstlcRpauq7rbf34gebNjEfRaRWTG4BH9i1sMDC6GhDcPXqpHbd+qRvJHOJ74/pKLrzEvAqoFKpFM+/9BK3A/OnT3PjwIF/hteu7VKuW26xYRjknnpqR2ZwcDS1cWMqZa1WUMPqLiqA52tto8XFaGl0tOXjF188SxjejjFIGKLS6TNNQ0MDme3bKW3cyC/37UN1dnby8ssvM7+wsEM5zl2kUk3X33jjyaWRkTtSTU1e8969p52mpiXxPAcRobyDNq4D8CkQohTKda0tFtUnr79+rz89vaG2p+fj5r17/6KMmZUgGM2k06f3799f3o5FRGNtk/h+F77f3rRnz0jzww9/JCJ14nmNUio1xiIbKHu/nrUAPiKL4nmijJHcE08MK61vShTdFM/LSxDUAB8Tn+ac6elpJiYmbEtLyzFr7TEA8X0tvq9jb90qgdoVz2tZAJQAQQQplQIpv7PxhVKKubk5xsfH+T+H8K+bjXuKEwAAAABJRU5ErkJggg==";
  WMEURMPT.icon_priority = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8AogAA6dv1/QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94EHQghL5pOh38AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADiklEQVRYw+2XT2xUVRTGf+e9N/PaqUw7rdOKItLYmnRIrTqhBklcTMLKhStcdAGGRjYluOgKFoQEF6QxbokmJg4sZOsGdyxM/BtRokgjJDYhVWkIf1pDoR3ePSzev3lvZuhQQTe9yc28+9695/vu951z3xvYaP9zk/Uu1JO4QAULsDgn77GynjjWusA/YpxV5jCcRTkLzOmnjP8nCugMeYRzOJRxUBzARrA5j1CR/Sw9WQVqTGMoY1AMEnRFKSNMP1EF9BglHH7DARwUG4muHQQbsNgu73Kp3ZjOI9E1nMEAHvzl9cmXS6/TkevgrYEfpcdcDfU8A7z82C3Qw0xjKGHQmmdx+KcyH37xBx98fomP/3yb+3YvgS0l/ax9K9oioNMMY5jCYGOQG9rPtVtx1V25epOau5UgH2xgSqsMPxYC+j4OhoN4DGIAAzlWcDN2NKfQ3YV9fxkMoIAyCBzUU2tbvLYCHmMYDgWBQSHv3SKfy0RTBjf3kLm7QEgQD4BDwNi/IqD7cfA4HQTWCMDAyOZOP4BlMdhrIauLMQEN5iqntfpwFaw16M2gjEQ1rxEAO3r/AaC3UGBr5m/qyUVnA4wgzKyLgO5jF4bJOl99aQOQHe7vvv893Ty/ejH2v56Ib8WkVtn1SAT0HVwMRzHk63aUACjcm6fYV6C/+DT5m+fr5Y9V8InnEY5qFbd9BWz2YKikZG3Y5c7SFl56dlNy517TNRWEPW0R0Am6geMYnHTipftoX40tnfeSxDTV/VxwgONapbsdBU4gbPPZJBMvoYJCuec2o4XllgQDNUL7tiGceOjLSCfYCXwTQEjE3X/lNl5nHTQrCLX4WXpufE8RBHhD9vJtAwGdIAdcAIYTBKxU4Iz/eweL75cKZLIwXryNm/Vag4cELAThCvCK7GU5bcERYCgCj5g1T8Bjc6NMfVfkwFdFqotvYjyal2K8VoIjaijAinNAJxgAdgfAkjCoSYYveHkuLG2Kpv2w+AwrT73YkCNNiEhgw249xUC9ArmgtziVkrvr7xCGXnguevzq2HbcTDZJtJUiIZ76eCGBeeByCjL9MRJ1WV7kZMVl9pefmb34K1Ov2VjXZ5uXYnwuaDRWLiPMp5OwBHwCTY7NMCvSCdaVRztzyN1rrSugcfw1Dgdkn//Zli7DLmAA6EuoEBKwmgTPNCnR+nvxWLC5QYYFmeTOxl+yjRa2B+5IidtmKn3pAAAAAElFTkSuQmCC";
  WMEURMPT.icon_checked = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94FGw0UDITYgDwAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAC3UlEQVRYw8WXS0gVURjHf2fu9VXakAsXWmRFWFKbcFFIhQhREzKlBC4K2rUIIYKEoE0PCCIiaZctKrIiKJmCSRdtEoMeWiCIFr0QwQcZU5aPe+eeNufGcF/O9T46cBbnzDfz/f/f+f7fNwf+8xC5/LhumwVAEzDhGNbLRDZajgneAB4BF3TbLM4rAN02rwFH1fKrY1jzeQOg22YrcAIIALNAV95yQLfNGuAFUKG2+hzD2p3MPhcRuKWcS7U+mcpYyzL788AOT3SfO4Y1mOqdYMy6HtgJuOk6L9hdVSXdSJsIaDJ6tL/PvRoEmoHHfgH0AivTph7UKGhYgwhoSCkRQhDqGyc8MHkaiADbgOGlABQA80Ah0A189HtEhfvWbQjWVbQAQSEE0pVueHimh7BsBEJAiZ8IRJMmBNwFniaIUNxYcaauOFhfeUdo4p+tCIj+yPhsO9CvpOg7B6IjmgPhJc9+V1U1cMhDIgTcC7+dcvxELxsquOxxLoAvwE2/L2sZym4LsD9m+5JjWG5eAABnY9hPO4Z1Oy0BxSFaW6qVduzpFMXBSuAX8Bp4AHQ7hvXdw74cOOBxDnAxXQZxESg5tb1QOQcoAxqBTuCNbpuHPaatMfL6o9STGQBRFKcaqeZ6oEu3zStqf6+qGdHxUHW+zADMdbxflK6cT9AxpSpWbbptdgO1Mc97HcNazBiAO/oj8rPpSYtjWAKoVjkg1JSK9UFgk6d4fQaGlpPFKVXgGNY31aCeJfl/iK5HgNGsA1AgwsDxFAwjwJCyyz4ABWIMaFfNSsY8XgDeLbeQ+C5EjmH1AJYnF/A0r5GcA1CjTTn0KsMFxvICwDGsaeB6TPuOOIY1k00Acok2fFUVnKg0O5PYhdK9mgWBCWAVYCttJ4xQoLZ8dVHzxq3uJ2dq4f6H0SQkyoAjwCLQAAz4ATTpKb3ZmnPAZr/d8BhQk0BqmVx+J9X/pe+bUbZvSynJ/AUWE+o2p0KuHwAAAABJRU5ErkJggg==";
  WMEURMPT.icon_unchecked = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94FGw0UMdywzC0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAy0lEQVRYw+3WMWoCQRTG8Z9BhRR6BUuDbargBWy8g0WqHE4PZJFaEISQoLjK2qywCMrorkTw/eHBzMCb+d6bgfkIguDZaZzMh/jAvqb9X/CNaWrCL/KaY4/BuQObpXELG7Qxw7yo4BZydPGJDK8pSU0s8Ydxae2WaKCHFX7wntKBMsc3sKtw/7vUR/KvhIAQEAJCQAgIAQ8pIK/4DR/JUk3IKW18YVTREXUKJ7S9JnFxB0+4xltqByboF4l1ue5F4S+TbPm5tSpcLOYAHptFzbynhPsAAAAASUVORK5CYII=";
  WMEURMPT.icon_ge = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94HFgoXEUEWIh4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAJNElEQVRIx4WWaXDV5RXGn/N//+vdcm/2/Q5JzEIICASERnEBHGilY0dGg9hRqaV2iq2tVWudlnE6Mk7VDqPWGZUySl0KBavV1mVwSQUpBBoJCVkEzEq2m4R7c+/97+/bD06rXdTz8Xw485vnzDnPQysX78VUADhz+AY0rvgjWcKhs0c3cwA4+OY5ZXw2XZKY5TWpObvEdiwxmTClscm52c6u4Y+HTj09AvRmAUAIQUXxn9Lk0KMcAOrqfoC+vt/iq0quXB7Akac2IK92N3Ud2SiISABA5aIXl2/f+dHG5kWx1fPrQ+W1VSE5GIpxiTyyTEcMjxYljn9U+cGhE+P7O/92/wdEZAIQlY0/k4a6H+KrrlkGm+7CQO+jXwpAAADjNwTzJ+LT1r0Fwcr6Lfm52lZZZlWaypAbZSguUFFYoKKyVEFtdQgVJTpUFejuS8wcfOfc3t2/63gM/uO9ABAu2kZzE0+Ihqa70XPq4a8C+DmEeJCISBhFT85rXl76YCxqbMqPGfB9wuiYieFRS8ykbOiah1CAI2g4aF4UoY1fj6M6HsInQ0m89c6Zo7t/337v1PDOtk9HXw9gH4or7sT48M4vBGC7XtrJljaVcuCB/B/eufzhG79Vc+Pm6y7CN9fFsX51sVhzeQHmxUNkuQxT05wyGYFk0qbu3mlxsmsCBfkqNS8qQGGeXp4T0RYe6yk+7mePjwHdANYjnXr+SxVgfz7wtACA79/1ix/fdlPdj1a1VCAv10DAkIWhM8SiMubXGtRYG4RtSjQ46kKWiVRF0PBoEj0fT6KyzMDShQWk61JJ0GCx9qOJ94HRbNWCVTQ72YHiys1IJ0/9fwAAWLfx5ZYtm2sfbqzLDZuWj6mEKSzbIcCH4B4ATqWFGqriGiXTPnrPZUnAR0AjOj82S5lMFgvq86iyLISsaTc6Imf0bP/7R2cnOwD9JrhMh5/p+CKAtYFbb1t/f8283FVvt83gqedHxeHjGYxMcmKShGiYwMDJsjzEcoiqKxUk53zqO5OG8FyoqofB4SkEDQkXLyikgC5heiaVf+RDqQ34eHply3oaOP34F65A2nb3HcVZ01/9zAvn8MyLQzjdb2J0wqe+T1y8d8LH+ycI56cAwX3YtoeSQobvtBbg2qsLIDEJHpfgcaJX/tqLt97tRzikoKw4tOyKNfMXA8BTD1+NHb/ei8HBQQBAZ2cnRkZGPvsDp3tn15BkFg6eB4hFRGWFhryYAl1jMC3CqbMCYxM+FszzUBfn0AM+KooZttxQAkWxceD1NByLYXR8hp59qV3Mzk7T+YkZjE8mFgPagYXLV3uPP7Fb6e7uFm1tbcK2bV5WViYAoL29HXIy49yTTNoaSWEEDQm+58OxfXgOh2fbyLg+psY99PZZaKzmWLEYKC+UUFmq4ZaNFQhpDva/msHAMMfp/nGMnR8FkQ3T8moAWweQvmPbFvfzsh88eJANDg768Xgcspm1qgEGJnHh+y6ZpiMyaQeyLMF1fciyBNvxMZu0cLrfQnuHj3WXa1jaGEBpoYpbNs5DbpjjD6+Y6Oy6QCMj05AVjnBYi3/71l9etmf3A6cOHf57oLgoP1lTUzNDRO6aNWv8rVu34uzZs6DaJY8IDg1MjnCmhCRVDYpgwKBgSIOuK4IxBo9zylqOmE5YNJfMiryYRVeu0LH20hjq5gUAAEf/MYx9Lx/Dh8d6MD2TgqJI7rbbVyeuumK+nUrZvqoqA6qqnggGgwebmpoORyKRLABQ44pHsqYNTZbDkqKFwVhAMKaSLGtQFEVIEsEXnGzHF55jk2WaIp1OkyzNoSZOWNOSh5VL8hCNykimTHScHBBth3vFqdMj0vqrG7C8eR7SGQeMSVBVFeFw+EI0Gt1dVlb2UENDwxQrqbiy1DSdhabpydmsL0zHhRAgiQDX9WE5DmzLJtexwD2TCCYUZpNlZTAyNo2TXSPo7BpFMpVEMMRQXBhCYX6IJhNpMgwJsZiGdDoLx7Fh2zZc19WFECuFEH3PPfdch3xhOvECJ/26vBxVLyzSyHIYpmczmJnOQlVVaIYMRgB8D5zb4J4D37egqjYIPlKpNI6fHEdPbx/ycxmqq/IoFDCgKAx5uUEILiBJBCKC53k8nU5LsiwjEoksEUI8Lw/1H+hpWra58+ZNF629oqUK0zO2eO/QGB1qT2AikULqgg/BAVkBFMYhkQsIB+BZSDARDgg4jof0XBqJaQv95yahqQxrr6pFSXEOXI+DiABAEJFgjEGWZTDGJgG4MjAwW1mqvtrUEFsbLw+itEBFaZGCy1bk4Uj7JI59NI3RiTRMy4WVdeDYJnzfghAWuG/B87LwnTRIuAiHdbgeRyQko6IsAl1jyGR9AcAXQpAkScwwDITD4Xej0eg+IuIMAGyzbLC8vGChYag1miKTIoMX5WvUVB+lry3Nx/zqIEUjAprikSTZUCSTVNmDxlxoiotIkCFeHkFNdQFUWcb8ukI0LSgWAvB9X3AiKIwxSdd1RCKRfWVlZfe0tLT0AIAMAENDL0y+uDf8kK6iYdmSeGU0x5AyGZtz4UuKTLSgLoy6KgMZpwKptIPZmRQuJOdgmzZ87kFmABEXvf2TggTnDQ2FXDdU2TRdWZIIjDFomjYSDoefra2tfeySSy6ZAoD9+/cTa73pV1JX53ticvz4gO2Vj2q6dFk0Rw+Zpo09e9u919/uwVRiDh53QfCFLHEoCoSmCqEbjJMk+FQi5Z/qHudjE3Osob6QxeNR5rqciIgrijJsGMbeWCx2/+bNm/fs2rUrCwB79uyhTZs2CQKAv7zyOn3j2msEADTM33TztRuWPBkIqoG9f+pA/5kpRCI6AgEZAU1C0FChqAoAH1nTwdycBe5xFBSEsay5Ag31+T4XIul74rSqqm8EAoG3WltbO4PB4L/f8WuvvYYNGzZ8LhMCaHvzDbp83XoBgC6++Pp7AuHQdxMz2fyxsVnJdrni+xyAAJMkSBIDQfi+L1xZIq+hvsBZdWlVtqYm/6wssw+zpnvE0ANdt9/+vbHPe8B9992HHTt2/Osq/hMAqAfQ+1lQ0FsaK8pzW8ys1+JzquWQJAH4nAuQ4IoEPpETMQbqakvOrL6qurd5afFIJKKPLG3eeOG/Pb+1tRXbt29HQ0PD/+SBfwLs6UJD9IUzMgAAAABJRU5ErkJggg==";
  WMEURMPT.icon_export = "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wgBFAggT+iJkgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADUklEQVR42u2dTWsTURSGn5lOrEoJVYsff0AqUhHEreBW40IR/FiJKze6cV2NuhFdiFgQXLgQf0ARXIk7t3UhLYp/QBTFEksbmibjYk4kxHSMucn96JwXhtAmTU6fOfecc++cuYmwoxIQ459aQMPkDSILRk4CN4EZDwEuAQ+BZTxVCbgH/ACaHh4/gUdykr3UODAvxqaeHkYQY1STwBXg9iAQEwcG14AFYMXBZ1c2ifttiAB3/icmugC4AFwWI1OLoeRlF7waUDaF6ALgihhXd1CydOo5cNUUoqsYmDr63E6I0wKxZhITi5xEGsB9U4hFz8LLMlQHhqhljCFEBWgIUQEaQlSAhhAVoCHEpMCgJoBdspjQrTUpccgptleBapEBHpPpXd6cvJQzYzkMxEUGWAZO9vG6U3klYJEBDpIDWt1/U5Qk0iJbvq8N+42L4oENsmsfMNi1mRjYAM4UFWC7PKkOOOrGgRdF9sBOT3QaRFUKUAEqQAWoUoAKUAH2rW3ADux0km05gBGwBzgnj5ECHGwadR64AUz5BjEEgBGwl2xR87pvEENJIjFwwEeIIWVhLyGOejVmA7jI8DqxOiECPAG+465ZaeQA273Io/JE5xCTnMA9JsZGjkfIPmB7DsQImAO+uYDYC+AYWe9cBTgC7HQIMQH2AwdzPPGaQL4FfLUNMenhedPAXeAE2fVP14km/sdzU8AF+XnWticmPbyvIvCmAsrQZeCseOBjiYlOzm4sw2UiwHn9buAScBqL13q6AbaAz7i5BcFU68Ai8H4Emb9vgE3gNfBOhsFGIPDqwBuJ3R9dxsBUDJjtysKuEsmYZNhDYkcevCrwwfZJTzYpfpeAT/IPuJ4pzQBPgaO+wcsrpFMxxvUQXpfMWvcRXmiLCd7BswGw1+2ur+T3wcML0QO9gmdjNWaYWgXe+gQvJIBrHXWeN/BCAdiUwn7eN3ghAEzJGiOfAV9sTtG2kgf+kiP10bgQAKY+G6e9MQpQASpABahSgApQASpAlQJUgApQAaoUoAIMSC7WA/M2vPFVk2zSseYCYD8b3vimCeB4rxHrAmC/G94EEe4Sn4zRJPK3RrbhjWPVyJo5W6P2QNMNb3zVIvAAaNi6faHE1iqZ/nyNxm/UEhZ+/DhJcwAAAABJRU5ErkJggg==";
  WMEURMPT.shuffleArray = function(array) {
    for (var i = array.length - 1;i > 0;i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };
  WMEURMPT.getElementsByClassName = function(classname, node) {
    if (!node) {
      node = document.getElementsByTagName("body")[0];
    }
    var a = [];
    var re = new RegExp("\\b" + classname + "\\b");
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length;i < j;i++) {
      if (re.test(els[i].className)) {
        a.push(els[i]);
      }
    }
    return a;
  };
  WMEURMPT.getElementByDataID = function(dID, node) {
    if (!node) {
      node = document.getElementsByTagName("body")[0];
    }
    var a = [];
    var re = new RegExp("\\b" + dID + "\\b");
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length;i < j;i++) {
      if (re.test(els[i].getAttribute("data-id"))) {
        a.push(els[i]);
      }
    }
    return a;
  };
  WMEURMPT.removeChildElements = function(node) {
    if (node.id != "") {
      delete WMEURMPT.dom[node.id];
    }
    while (node.firstChild) {
      WMEURMPT.removeChildElements(node.firstChild);
      node.removeChild(node.firstChild);
    }
  };
  WMEURMPT.createElement = function(type, id) {
    var el = document.createElement(type);
    if (typeof id !== "undefined" && id != null) {
      el.id = id;
      WMEURMPT.dom[id] = el;
    }
    return el;
  };
  WMEURMPT.getId = function(node) {
    if (WMEURMPT.dom.hasOwnProperty(node) == true && WMEURMPT.dom[node] != null) {
      return WMEURMPT.dom[node];
    }
    var el = document.getElementById(node);
    if (el != null) {
      WMEURMPT.dom[node] = el;
    }
    return el;
  };
  WMEURMPT.logBeta = function(msg, obj) {
  };
  WMEURMPT.logDebug = function(msg, obj) {
    if (WMEURMPT.isDebug) {
      WMEURMPT.log("DEBUG - " + msg, obj);
    }
  };
  WMEURMPT.log = function(msg, obj) {
    if (obj == null) {
      console.log("UR-MP Tracking v" + WMEURMPT.urmpt_version + " - " + msg);
    } else {
      console.debug("UR-MP Tracking v" + WMEURMPT.urmpt_version + " - " + msg + " ", obj);
    }
  };
  WMEURMPT.setTimeoutArgs = function(func, args, delay) {
    window.setTimeout(function() {
      var json_args = JSON.stringify(args);
      return function() {
        var args = JSON.parse(json_args);
        func.apply(this, args);
      };
    }(), delay);
  };
  WMEURMPT.getFunctionWithArgs = function(func, args) {
    return function() {
      var json_args = JSON.stringify(args);
      return function() {
        var args = JSON.parse(json_args);
        func.apply(this, args);
      };
    }();
  };
  WMEURMPT.invertObject = function(obj) {
    var new_obj = {};
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        new_obj[obj[prop]] = prop;
      }
    }
    return new_obj;
  };
  WMEURMPT.listToObject = function(arr) {
    var o = {};
    for (var i = 0;i < arr.length;++i) {
      o[arr[i].id] = i;
    }
    return o;
  };
  WMEURMPT.getDuration = function(ts) {
    var aDate = new Date;
    var now = aDate.getTime();
    var duration = now - ts;
    aDate.setHours(0);
    aDate.setMinutes(0);
    aDate.setSeconds(0);
    aDate.setMilliseconds(0);
    var startOfDay = aDate.getTime();
    if (duration < now - startOfDay) {
      return 0;
    }
    return Math.ceil((duration - (now - startOfDay)) / 86400000);
  };
  WMEURMPT.escapeHtml = function(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };
  WMEURMPT.decimalToHex = function(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof padding === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
      hex = "0" + hex;
    }
    return hex;
  };
  WMEURMPT.isDescendant = function(parent, child) {
    var node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };
  WMEURMPT.bootstrapURT = function() {
    window.setTimeout(WMEURMPT.initialize, 500);
  };
  WMEURMPT.initialize = function() {
    WMEURMPT.log("init");
    WMEURMPT.initializeWazeObjects();
    WMEURMPT.log("init done");
  };
  WMEURMPT.initializeElements = function() {
    var userInfo = WMEURMPT.getId("user-info");
    if (userInfo == null) {
      window.setTimeout(WMEURMPT.initializeElements, 500);
      return;
    }
    var navTabs = userInfo.getElementsByTagName("ul");
    if (navTabs.length == 0) {
      window.setTimeout(WMEURMPT.initializeElements, 500);
      return;
    }
    if (typeof navTabs[0] === "undefined") {
      window.setTimeout(WMEURMPT.initializeElements, 500);
      return;
    }
    var tabContents = userInfo.getElementsByTagName("div");
    if (tabContents.length == 0) {
      window.setTimeout(WMEURMPT.initializeElements, 500);
      return;
    }
    if (typeof tabContents[0] === "undefined") {
      window.setTimeout(WMEURMPT.initializeElements, 500);
      return;
    }
    WMEURMPT.load();
  };
  WMEURMPT.waitForObject = function(varName, shortcutName) {
    var obj = null;
    obj = eval("typeof(" + varName + ")");
    if (obj === "undefined") {
      WMEURMPT.log(varName + " KO");
      window.setTimeout(WMEURMPT.waitForObject.caller, 1000);
      return false;
    }
    WMEURMPT.logBeta(varName + " OK");
    if (shortcutName != null) {
      eval("WMEURMPT." + shortcutName + "=" + varName);
    }
    return true;
  };
  WMEURMPT.initializeWazeObjects = function() {
    var objectToCheck = [{o:"Waze.map", s:"wazeMap"}, {o:"Waze.model", s:"wazeModel"}, {o:"Waze.loginManager", s:"loginManager"}, {o:"Waze.controller", s:"wazeController"}, {o:"Waze.Config.api_base", s:"wazeConfigApiBase"}, {o:"OpenLayers", s:"OpenLayers"}, {o:"Waze.loginManager.user", s:"me"}, {o:"Waze.loginManager.user.rank", s:"ul"}, {o:"Waze.loginManager.user.isAreaManager", s:"uam"}];
    for (var i = 0;i < objectToCheck.length;i++) {
      var path = objectToCheck[i].o.split(".");
      var object = window;
      for (var j = 0;j < path.length;j++) {
        object = object[path[j]];
        if (typeof object == "undefined" || object == null) {
          window.setTimeout(WMEURMPT.initializeWazeObjects, 1000);
          return;
        } else {
          WMEURMPT[objectToCheck[i].s] = object;
        }
      }
    }
    WMEURMPT.ul = (WMEURMPT.ul + 1) * 2;
    WMEURMPT.initializeElements();
  };
  WMEURMPT.registerEvents = function() {
    WMEURMPT.wazeMap.events.register("moveend", null, WMEURMPT.mapMoveEnd);
    WMEURMPT.wazeMap.events.register("zoomend", null, WMEURMPT.mapZoomEnd);
    WMEURMPT.wazeModel.events.register("mergeend", null, WMEURMPT.setupListener);
    WMEURMPT.wazeController.events.register("savestart", null, WMEURMPT.saveStarted);
    WMEURMPT.wazeController.events.register("saveend", null, WMEURMPT.saveEnded);
    WMEURMPT.wazeModel.repos.mapUpdateRequests.on("objectschanged", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapUpdateRequests.on("objectsadded", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapUpdateRequests.on("objectsremoved", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.problems.on("objectschanged", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.problems.on("objectsadded", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.problems.on("objectsremoved", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapComments.on("objectschanged", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapComments.on("objectsadded", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapComments.on("objectsremoved", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.actionManager.events.register("afteraction", null, WMEURMPT.newActionAdded);
    WMEURMPT.wazeModel.actionManager.events.register("afterundoaction", null, WMEURMPT.newActionAdded);
    WMEURMPT.wazeModel.actionManager.events.register("afterclearaction", null, WMEURMPT.newActionAdded);
    window.setTimeout(WMEURMPT.setupListener, 500);
  };
  WMEURMPT.unregisterEvents = function() {
    WMEURMPT.wazeMap.events.unregister("moveend", null, WMEURMPT.mapMoveEnd);
    WMEURMPT.wazeMap.events.unregister("zoomend", null, WMEURMPT.mapZoomEnd);
    WMEURMPT.wazeModel.events.unregister("mergeend", null, WMEURMPT.setupListener);
    WMEURMPT.wazeController.events.unregister("savestart", null, WMEURMPT.saveStarted);
    WMEURMPT.wazeController.events.unregister("saveend", null, WMEURMPT.saveEnded);
    WMEURMPT.wazeModel.repos.mapUpdateRequests.off("objectschanged", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapUpdateRequests.off("objectsadded", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapUpdateRequests.off("objectsremoved", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.problems.off("objectschanged", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.problems.off("objectsadded", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.problems.off("objectsremoved", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapComments.off("objectschanged", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapComments.off("objectsadded", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.repos.mapComments.off("objectsremoved", WMEURMPT.newDataAvailableStarts);
    WMEURMPT.wazeModel.actionManager.events.unregister("afteraction", null, WMEURMPT.newActionAdded);
    WMEURMPT.wazeModel.actionManager.events.unregister("afterundoaction", null, WMEURMPT.newActionAdded);
    WMEURMPT.wazeModel.actionManager.events.unregister("afterclearaction", null, WMEURMPT.newActionAdded);
  };
  WMEURMPT.initManagedArea = function() {
    if (!WMEURMPT.loginManager.user.isAreaManager) {
      return;
    }
    for (var a = 0;a < WMEURMPT.loginManager.user.areas.length;a++) {
      if (WMEURMPT.loginManager.user.areas[a].type != "managed") {
        continue;
      }
      for (var c = 0;c < WMEURMPT.loginManager.user.areas[a].geometry.components.length;c++) {
        WMEURMPT.loginManager.user.areas[a].geometry.components[c].calculateBounds();
        WMEURMPT.managedAreas.push(WMEURMPT.loginManager.user.areas[a].geometry.components[c]);
      }
    }
  };
  WMEURMPT.initCountryList = function() {
    var countryList = new WMEURMPT.URT_AREA;
    countryList.category = "country";
    countryList.getCategoryElementsFromServer(WMEURMPT.newCountryListAvailable);
  };
  WMEURMPT.newCountryListAvailable = function(countryList) {
    var countryListSelect = WMEURMPT.getId("urmpt-countryList");
    var optionList = "";
    for (var c = 0;c < countryList.length;c++) {
      optionList += '<option value="' + countryList[c].name.replace(/ /g, "_") + '">' + countryList[c].name + "</option>";
      optionList += WMEURMPT.rescurseSubset(countryList[c], "");
    }
    countryListSelect.innerHTML += optionList;
  };
  WMEURMPT.rescurseSubset = function(subset, parentPath) {
    var optionList = "";
    if (typeof subset.set !== "undefined") {
      for (var i = 0;i < subset.set.length;i++) {
        var fullPath = parentPath + subset.name + "->" + subset.set[i].name;
        optionList += '<option value="' + fullPath.replace(/ /g, "_") + '">' + fullPath + "</option>";
        optionList += WMEURMPT.rescurseSubset(subset.set[i], (parentPath == "" ? "" : parentPath + "->") + subset.name + "->");
      }
    } else {
      for (var i = 0;i < subset.subset.length;i++) {
        optionList += WMEURMPT.rescurseSubset(subset.subset[i], (parentPath == "" ? "" : parentPath + "->") + subset.name + "->");
      }
    }
    return optionList;
  };
  WMEURMPT.errorOnCountryServer = function() {
    var countryListSelect = WMEURMPT.getId("urmpt-countryList");
    var errorMessage = WMEURMPT.createElement("span");
    errorMessage.style.color = "#FF0000";
    errorMessage.innerHTML = "Error while getting list of countries<br/>You can try later by reloading WME<br/>Sorry for the inconvenience.";
    countryListSelect.parentNode.parentNode.replaceChild(errorMessage, countryListSelect.parentNode);
  };
  WMEURMPT.wazeMapAreaToOLPolygons = function(geometry) {
    var polygons = [];
    if (geometry.type == "Polygon") {
      polygons.push(WMEURMPT.lonlatArrayToxyOpenLayersPolygons(geometry.coordinates));
      polygons[polygons.length - 1].calculateBounds();
    }
    if (geometry.type == "MultiPolygon") {
      for (var p = 0;p < geometry.coordinates.length;p++) {
        polygons.push(WMEURMPT.lonlatArrayToxyOpenLayersPolygons(geometry.coordinates[p]));
        polygons[polygons.length - 1].calculateBounds();
      }
    }
    return polygons;
  };
  WMEURMPT.bintreeGeometry = function(poly) {
    var pointList = null;
    if (poly.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
      pointList = poly.components;
    } else {
      pointList = poly.components[0].components;
    }
    if (pointList.length <= 15) {
      return;
    }
    var split = "x";
    var notSplit = "y";
    var splitValue = (poly.bounds.right + poly.bounds.left) / 2.0;
    if (poly.bounds.right - poly.bounds.left < poly.bounds.top - poly.bounds.bottom) {
      split = "y";
      var notSplit = "x";
      var splitValue = (poly.bounds.top + poly.bounds.bottom) / 2.0;
    }
    var intersection = [];
    for (var p = 0;p < pointList.length - 1;p++) {
      var point = pointList[p];
      var next = pointList[p + 1];
      if (point[split] <= splitValue && next[split] > splitValue || point[split] > splitValue && next[split] <= splitValue) {
        intersection.push(p);
      }
    }
    for (var j = 0;j < intersection.length;j++) {
      var olPoint = new OpenLayers.Geometry.Point(0, 0);
      var p1 = pointList[intersection[j]];
      var p2 = pointList[intersection[j] + 1];
      olPoint[split] = splitValue;
      if (p2[split] - p1[split] == 0) {
        olPoint[notSplit] = p1[notSplit];
      } else {
        var ratio = (splitValue - p1[split]) / (p2[split] - p1[split]);
        olPoint[notSplit] = ratio * (p2[notSplit] - p1[notSplit]) + p1[notSplit];
      }
      intersection[j] = {index:intersection[j], point:olPoint};
    }
    intersection.sort(function(a, b) {
      return a.point[notSplit] > b.point[notSplit];
    });
    var bintree = [[], []];
    var currentL = -1;
    var currentR = -1;
    var intersectionIndices = intersection.map(function(e) {
      return e.index;
    });
    for (var p = 0;p < pointList.length - 1;p++) {
      var i = (p + intersection[0].index) % (pointList.length - 1);
      if (pointList[i][split] <= splitValue) {
        if (currentL == -1) {
          bintree[0].push({i:[], c:false});
          currentL = 0;
        }
        bintree[0][currentL].i.push(i);
        var intersectionIndex = intersectionIndices.indexOf(i);
        if (intersectionIndex != -1) {
          bintree[0][currentL].i.push(intersectionIndex * -1 - 1);
          var found = false;
          for (b = 0;b < bintree[1].length;b++) {
            if (intersectionIndex % 2 == 0 && (bintree[1][b].i[bintree[1][b].i.length - 1] + 1) * -1 == intersectionIndex + 1 || intersectionIndex % 2 == 1 && (bintree[1][b].i[bintree[1][b].i.length - 1] + 1) * -1 == intersectionIndex - 1) {
              found = true;
              currentR = b;
              break;
            }
          }
          if (!found) {
            bintree[1].push({i:[], c:false});
            currentR = bintree[1].length - 1;
          }
          bintree[1][currentR].i.push(intersectionIndex * -1 - 1);
        }
      } else {
        if (currentR == -1) {
          bintree[1].push({i:[], c:false});
          currentR = 0;
        }
        bintree[1][currentR].i.push(i);
        var intersectionIndex = intersectionIndices.indexOf(i);
        if (intersectionIndex != -1) {
          bintree[1][currentR].i.push(intersectionIndex * -1 - 1);
          var found = false;
          for (b = 0;b < bintree[0].length;b++) {
            if (intersectionIndex % 2 == 0 && (bintree[0][b].i[bintree[0][b].i.length - 1] + 1) * -1 == intersectionIndex + 1 || intersectionIndex % 2 == 1 && (bintree[0][b].i[bintree[0][b].i.length - 1] + 1) * -1 == intersectionIndex - 1) {
              found = true;
              currentL = b;
              break;
            }
          }
          if (!found) {
            bintree[0].push({i:[], c:false});
            currentL = bintree[0].length - 1;
          }
          bintree[0][currentL].i.push(intersectionIndex * -1 - 1);
        }
      }
    }
    var bintree2 = [[], []];
    poly.bintree = {left:null, right:null};
    for (var t = 0;t < 2;t++) {
      var olPolyList = [];
      for (var i = 0;i < bintree[t].length;i++) {
        bintree2[t].push([]);
        for (var j = 0;j < bintree[t][i].i.length;j++) {
          if (bintree[t][i].i[j] < 0) {
            var intersectionIndex = (bintree[t][i].i[j] + 1) * -1;
            var olPoint = intersection[intersectionIndex].point;
            bintree2[t][i].push(olPoint);
          } else {
            bintree2[t][i].push(pointList[bintree[t][i].i[j]]);
          }
        }
        bintree2[t][i].push(bintree2[t][i][0]);
        olPolyList.push(new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(bintree2[t][i])));
        olPolyList[olPolyList.length - 1].calculateBounds();
        WMEURMPT.bintreeGeometry(olPolyList[olPolyList.length - 1]);
      }
      if (t == 0) {
        poly.bintree.left = new OpenLayers.Geometry.MultiPolygon(olPolyList);
      } else {
        poly.bintree.right = new OpenLayers.Geometry.MultiPolygon(olPolyList);
      }
    }
    poly.bintreeContainsPoint = function(point) {
      if (point.x < this.bounds.left || point.x > this.bounds.right || point.y < this.bounds.bottom || point.y > this.bounds.top) {
        return false;
      }
      if (this.hasOwnProperty("bintree") == true) {
        for (var i = 0;i < this.bintree.left.components.length;i++) {
          if (this.bintree.left.components[i].hasOwnProperty("bintree") == true) {
            if (this.bintree.left.components[i].bintreeContainsPoint(point) == true) {
              return true;
            }
          } else {
            if (this.bintree.left.components[i].containsPoint(point) == true) {
              return true;
            }
          }
        }
        for (var i = 0;i < this.bintree.right.components.length;i++) {
          if (this.bintree.right.components[i].hasOwnProperty("bintree") == true) {
            if (this.bintree.right.components[i].bintreeContainsPoint(point) == true) {
              return true;
            }
          } else {
            if (this.bintree.right.components[i].containsPoint(point) == true) {
              return true;
            }
          }
        }
        return false;
      }
      return this.containsPoint(point);
    };
  };
  WMEURMPT.lonlatArrayToxyOpenLayersPolygons = function(lontalArray) {
    var ol_polygons = [];
    for (var p = 0;p < lontalArray.length;p++) {
      var ol_points = [];
      for (var pt = 0;pt < lontalArray[p].length - 1;pt++) {
        var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(lontalArray[p][pt][0], lontalArray[p][pt][1]);
        ol_points.push(new OpenLayers.Geometry.Point(xy.lon, xy.lat));
      }
      ol_polygons.push(new OpenLayers.Geometry.LinearRing(ol_points));
    }
    if (ol_polygons.length >= 1) {
      var ol_linearRing = ol_polygons[0];
      return new OpenLayers.Geometry.Polygon([ol_linearRing]);
    }
    return null;
  };
  WMEURMPT.isInAreas = function(lonlat) {
    for (var c = 0;c < WMEURMPT.areaList.country.length;c++) {
      if (WMEURMPT.areaList.country[c].isInside(lonlat)) {
        return true;
      }
    }
    for (var c = 0;c < WMEURMPT.areaList.custom.length;c++) {
      if (WMEURMPT.areaList.custom[c].isInside(lonlat)) {
        return true;
      }
    }
    return false;
  };
  WMEURMPT.inScreenUpdatableArea = function(xy) {
    for (var a = 0;a < WMEURMPT.wazeModel.userAreas.additionalInfo.length;a++) {
      for (var c = 0;c < WMEURMPT.wazeModel.userAreas.additionalInfo[a].geometry.components.length;c++) {
        if (WMEURMPT.wazeModel.userAreas.additionalInfo[a].geometry.components[c].containsPoint(xy)) {
          return true;
        }
      }
    }
    return false;
  };
  WMEURMPT.isInsideManagedArea = function(lon, lat) {
    var lonlat = OpenLayers.Layer.SphericalMercator.forwardMercator(lon, lat);
    var xy = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
    var inside = false;
    {
      for (var a = 0;a < WMEURMPT.managedAreas.length;a++) {
        if (xy.x >= WMEURMPT.managedAreas[a].bounds.left && xy.x <= WMEURMPT.managedAreas[a].bounds.right && xy.y >= WMEURMPT.managedAreas[a].bounds.bottom && xy.y <= WMEURMPT.managedAreas[a].bounds.top && WMEURMPT.managedAreas[a].containsPoint(xy)) {
          return true;
        }
      }
    }
    return false;
  };
  WMEURMPT.getSelectedProblem = function() {
    try {
      for (var m in WMEURMPT.wazeMap.problemLayer.markers) {
        if (WMEURMPT.wazeMap.problemLayer.markers.hasOwnProperty(m)) {
          if (WMEURMPT.wazeMap.problemLayer.markers[m].icon.imageDiv.className.indexOf("selected") != -1) {
            return m;
          }
        }
      }
    } catch (e) {
      WMEURMPT.log("error while getting selected problem: ", e);
    }
    return null;
  };
  WMEURMPT.getSelectedUR = function() {
    try {
      for (var m in WMEURMPT.wazeMap.updateRequestLayer.markers) {
        if (WMEURMPT.wazeMap.updateRequestLayer.markers.hasOwnProperty(m)) {
          if (WMEURMPT.wazeMap.updateRequestLayer.markers[m].icon.imageDiv.className.indexOf("selected") != -1) {
            return m;
          }
        }
      }
    } catch (e) {
      WMEURMPT.log("error while getting selected UR: ", e);
    }
    return null;
  };
  WMEURMPT.getSelectedMC = function() {
    if (Waze.selectionManager.getSelectedFeatures().length == 1 && Waze.selectionManager.getSelectedFeatures()[0].model.type == "mapComment") {
      return Waze.selectionManager.getSelectedFeatures()[0].model.attributes.id;
    }
    return null;
  };
  WMEURMPT.updateRequestSessions = function() {
    var ids = [];
    for (var i in WMEURMPT.wazeModel.mapUpdateRequests.objects) {
      if (WMEURMPT.wazeModel.updateRequestSessions.objects[i] == null) {
        ids.push(i);
      }
    }
    if (ids.length != 0) {
      url = "https://" + document.location.host + WMEURMPT.wazeConfigApiBase + "/MapProblems/UpdateRequests?ids=" + ids.join(",");
      if (XMLHttpRequest) {
        xhr3_object = new XMLHttpRequest;
      } else {
        if (ActiveXObject) {
          xhr3_object = new ActiveXObject("Microsoft.XMLHTTP");
        }
      }
      var URcomments = null;
      xhr3_object.open("GET", url, false);
      xhr3_object.ontimeout = function() {
        URcomments = null;
      };
      xhr3_object.onerror = function() {
        URcomments = null;
      };
      xhr3_object.onreadystatechange = function() {
        if (xhr3_object.readyState == 4) {
          var r = xhr3_object.responseText;
          try {
            URcomments = JSON.parse(r);
          } catch (e) {
            WMEURMPT.log("Error: can't read server response: ", e);
            WMEURMPT.log("Response from server: ", r);
            WMEURMPT.log("Query: ", url);
            URcomments = null;
          }
        } else {
          URcomments = null;
        }
      };
      xhr3_object.send(null);
      WMEURMPT.logBeta("UR comments: ", URcomments);
      if (URcomments != null) {
        for (var j = 0;j < URcomments.updateRequestSessions.objects.length;j++) {
          var urId = URcomments.updateRequestSessions.objects[j].id;
          var ur = WMEURMPT.getURFromId(urId);
          if (ur != null) {
            ur.data.session = URcomments.updateRequestSessions.objects[j];
            ur.data.session.users = URcomments.users;
            for (var c = 0;c < ur.data.session.comments.length;c++) {
              var userID = ur.data.session.comments[c].userID;
              var userName = "Unknown";
              if (userID == WMEURMPT.me.id) {
                userName = WMEURMPT.me.userName;
                if (c == ur.data.session.comments.length - 1) {
                  ur.lastVisitCommentsCount = ur.data.session.comments.length;
                }
              }
              if (userID == -1) {
                userName = "Reporter";
              } else {
                for (var u = 0;u < ur.data.session.users.objects.length;u++) {
                  if (ur.data.session.users.objects[u].id == userID) {
                    userName = ur.data.session.users.objects[u].userName;
                    break;
                  }
                }
              }
              ur.data.session.comments[c].userName = userName;
            }
          }
        }
      }
    }
  };
  WMEURMPT.settingsSetURDescriptionWidth = function() {
    WMEURMPT.URDescriptionMaxLength = this.value;
    WMEURMPT.saveOptions();
  };
  WMEURMPT.settingsSetMPDescriptionWidth = function() {
    WMEURMPT.MPDescriptionMaxLength = this.value;
    WMEURMPT.saveOptions();
  };
  WMEURMPT.settingsSetMCSubjectWidth = function() {
    WMEURMPT.MCSubjectMaxLength = this.value;
    WMEURMPT.saveOptions();
  };
  WMEURMPT.settingsSetMCBodyWidth = function() {
    WMEURMPT.MCBodyMaxLength = this.value;
    WMEURMPT.saveOptions();
  };
  WMEURMPT.settingsSetURTagList = function() {
    WMEURMPT.taggedURList = this.value.split(";");
    WMEURMPT.saveOptions();
  };
  WMEURMPT.isURFiltered = function(ur) {
    var invert = function(a) {
      return a;
    };
    if (WMEURMPT.getId("urt-checkbox-filterInvert").checked == true) {
      invert = function(a) {
        return !a;
      };
    }
    return invert(WMEURMPT.isURFiltered2(ur));
  };
  WMEURMPT.isURFiltered2 = function(ur) {
    var userId = WMEURMPT.loginManager.user.id;
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideClosed && ur.data.open == false) {
      return true;
    }
    if (ur.data.open == false && WMEURMPT.ul < WMEURMPT.rl4cp) {
      return true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideLastCommentFromEditor) {
      if (ur.data.session.comments.length == 0 || ur.data.session.comments[ur.data.session.comments.length - 1].userID != -1) {
        return true;
      }
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideNoNewComment) {
      if (ur.data.session.comments.length <= ur.lastVisitCommentsCount) {
        return true;
      }
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideWithCommentCount && ur.data.session.comments.length > WMEURMPT.currentURCommentsCount) {
      return true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideOutOfMyManagedArea && WMEURMPT.uam) {
      if (!WMEURMPT.isInsideManagedArea(ur.lonlat.lon, ur.lonlat.lat)) {
        return true;
      }
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideVisited && ur.alreadyVisited) {
      return true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideBlacklisted && ur.blackListed) {
      return true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideWhitelisted && !ur.blackListed) {
      return true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideGE && ur.data.type == 10) {
      return true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideType && ur.data.type != WMEURMPT.currentUROnlyType) {
      return true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideTagged) {
      if (ur.data.description != null) {
        for (var i = 0;i < WMEURMPT.taggedURList.length;i++) {
          if (ur.data.description.toLowerCase().indexOf(WMEURMPT.taggedURList[i].toLowerCase()) != -1) {
            return true;
          }
        }
      }
      for (var c = 0;c < ur.data.session.comments.length;c++) {
        for (var i = 0;i < WMEURMPT.taggedURList.length;i++) {
          if (ur.data.session.comments[c].text.toLowerCase().indexOf(WMEURMPT.taggedURList[i].toLowerCase()) != -1) {
            return true;
          }
        }
      }
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideWithoutCommentFromMe) {
      var found = false;
      for (var c = 0;c < ur.data.session.comments.length;c++) {
        if (ur.data.session.comments[c].userID == userId) {
          found = true;
          break;
        }
      }
      if (!found) {
        return true;
      }
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideNotKW) {
      var found = false;
      if (ur.data.description != null && ur.data.description.toLowerCase().indexOf(WMEURMPT.currentURKeyWord.toLowerCase()) != -1) {
        found = true;
      }
      if (!found && ur.data.open == false && ur.data.hasOwnProperty("resolvedByName") && ur.data.resolvedByName.toLowerCase() == WMEURMPT.currentURKeyWord.toLowerCase()) {
        found = true;
      }
      if (!found && ur.data.session.comments.length > 0) {
        for (var i = 0;i < ur.data.session.comments.length;i++) {
          if (ur.data.session.comments[i].hasOwnProperty("userName") == false) {
            continue;
          }
          if (typeof ur.data.session.comments[i].userName != "string") {
            continue;
          }
          if (ur.data.session.comments[i].userName.toLowerCase() == WMEURMPT.currentURKeyWord.toLowerCase()) {
            found = true;
            break;
          } else {
            if (ur.data.session.comments[i].text.toLowerCase().indexOf(WMEURMPT.currentURKeyWord.toLowerCase()) != -1) {
              found = true;
              break;
            }
          }
        }
      }
      if (!found) {
        return true;
      }
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideArea) {
      var xy = new OpenLayers.Geometry.Point(ur.lonlat.lon, ur.lonlat.lat);
      for (var i = 0;i < WMEURMPT.areaList.custom.length;i++) {
        if (WMEURMPT.areaList.custom[i].name == WMEURMPT.currentUROnlyArea) {
          var inside = false;
          var filterArea = WMEURMPT.areaList.custom[i].geometryOL.geometry.components;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (inside == false) {
            return true;
          }
        }
      }
      for (var i = 0;i < WMEURMPT.areaList.country.length;i++) {
        if (WMEURMPT.areaList.country[i].name == WMEURMPT.currentUROnlyArea) {
          var inside = false;
          var filterArea = WMEURMPT.areaList.country[i].geometryOL.geometry.components;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (inside == false) {
            return true;
          }
        }
      }
    }
    return false;
  };
  WMEURMPT.isMPFiltered = function(mp) {
    var userId = WMEURMPT.loginManager.user.id;
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideClosed && mp.data.open == false) {
      return true;
    }
    if (mp.data.open == false && WMEURMPT.ul < WMEURMPT.rl4cp) {
      return true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideOutOfMyManagedArea && WMEURMPT.uam) {
      if (!WMEURMPT.isInsideManagedArea(mp.lonlat.lon, mp.lonlat.lat)) {
        return true;
      }
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideVisited && mp.alreadyVisited) {
      return true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideBlacklisted && mp.blackListed) {
      return true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideWhitelisted && !mp.blackListed) {
      return true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideType) {
      if (WMEURMPT.currentMPOnlyType == 0 && mp.type != "turnProblem") {
        return true;
      }
      if (WMEURMPT.currentMPOnlyType != 0 && mp.data.subType != WMEURMPT.currentMPOnlyType) {
        return true;
      }
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideArea) {
      var xy = new OpenLayers.Geometry.Point(mp.lonlat.lon, mp.lonlat.lat);
      for (var i = 0;i < WMEURMPT.areaList.custom.length;i++) {
        if (WMEURMPT.areaList.custom[i].name == WMEURMPT.currentMPOnlyArea) {
          var inside = false;
          var filterArea = WMEURMPT.areaList.custom[i].geometryOL.geometry.components;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (inside == false) {
            return true;
          }
        }
      }
      for (var i = 0;i < WMEURMPT.areaList.country.length;i++) {
        if (WMEURMPT.areaList.country[i].name == WMEURMPT.currentMPOnlyArea) {
          var inside = false;
          var filterArea = WMEURMPT.areaList.country[i].geometryOL.geometry.components;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (inside == false) {
            return true;
          }
        }
      }
    }
    return false;
  };
  WMEURMPT.isMCFiltered = function(mc) {
    var userId = WMEURMPT.loginManager.user.id;
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideOutOfMyManagedArea && WMEURMPT.uam) {
      if (!WMEURMPT.isInsideManagedArea(mc.lonlat.lon, mc.lonlat.lat)) {
        return true;
      }
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideVisited && mc.alreadyVisited) {
      return true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideBlacklisted && mc.blackListed) {
      return true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideWhitelisted && !mc.blackListed) {
      return true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideNotKW && (mc.data.subject != null && mc.data.subject.toLowerCase().indexOf(WMEURMPT.currentMCKeyWord.toLowerCase()) == -1) && (mc.data.body != null && mc.data.body.toLowerCase().indexOf(WMEURMPT.currentMCKeyWord.toLowerCase()) == -1)) {
      return true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideArea) {
      var xy = new OpenLayers.Geometry.Point(mc.lonlat.lon, mc.lonlat.lat);
      for (var i = 0;i < WMEURMPT.areaList.custom.length;i++) {
        if (WMEURMPT.areaList.custom[i].name == WMEURMPT.currentMCOnlyArea) {
          var inside = false;
          var filterArea = WMEURMPT.areaList.custom[i].geometryOL.geometry.components;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (inside == false) {
            return true;
          }
        }
      }
      for (var i = 0;i < WMEURMPT.areaList.country.length;i++) {
        if (WMEURMPT.areaList.country[i].name == WMEURMPT.currentMCOnlyArea) {
          var inside = false;
          var filterArea = WMEURMPT.areaList.country[i].geometryOL.geometry.components;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (inside == false) {
            return true;
          }
        }
      }
    }
    return false;
  };
  WMEURMPT.toggleURFilter = function(chkboxId, filter) {
    var chkbox = WMEURMPT.getId(chkboxId);
    if (chkbox == null) {
      return;
    }
    if (chkbox.checked) {
      WMEURMPT.currentURFilter = WMEURMPT.currentURFilter | filter;
    } else {
      WMEURMPT.currentURFilter = WMEURMPT.currentURFilter & ~filter;
    }
    WMEURMPT.logBeta("current UR filter: " + WMEURMPT.currentURFilter);
    WMEURMPT.saveOptions();
    WMEURMPT.updateIHMFromURList();
  };
  WMEURMPT.toggleURFilterHideClosed = function() {
    WMEURMPT.log('Switch UR filter "hide closed"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideClosed", WMEURMPT.URFilterList.hideClosed);
  };
  WMEURMPT.toggleURFilterHideWithoutCommentFromMe = function() {
    WMEURMPT.log('Switch UR filter "hide without comments from me"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideWithoutCommentFromMe", WMEURMPT.URFilterList.hideWithoutCommentFromMe);
  };
  WMEURMPT.toggleURFilterHideWithCommentCount = function() {
    WMEURMPT.log('Switch UR filter "hide more than ' + WMEURMPT.currentURCommentsCount + ' comments"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideWithCommentCount", WMEURMPT.URFilterList.hideWithCommentCount);
  };
  WMEURMPT.toggleURFilterHideNoNewComment = function() {
    WMEURMPT.log('Switch UR filter "hide no new comment"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideNoNewComment", WMEURMPT.URFilterList.hideNoNewComment);
  };
  WMEURMPT.toggleURFilterHideOutOfMyManagedArea = function() {
    WMEURMPT.log('Switch UR filter "hide out of my managed area"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideOutOfMyManagedArea", WMEURMPT.URFilterList.hideOutOfMyManagedArea);
  };
  WMEURMPT.toggleURFilterHideVisited = function() {
    WMEURMPT.log('Switch UR filter "hide visited"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideVisited", WMEURMPT.URFilterList.hideVisited);
  };
  WMEURMPT.toggleURFilterHideBlacklisted = function() {
    WMEURMPT.log('Switch UR filter "hide blacklisted"');
    if (WMEURMPT.getId("urt-checkbox-filterHideBlacklisted").checked) {
      WMEURMPT.getId("urt-checkbox-filterHideWhitelisted").checked = false;
      WMEURMPT.toggleURFilterHideWhitelisted();
    }
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideBlacklisted", WMEURMPT.URFilterList.hideBlacklisted);
  };
  WMEURMPT.toggleURFilterHideWhitelisted = function() {
    WMEURMPT.log('Switch UR filter "hide white listed"');
    if (WMEURMPT.getId("urt-checkbox-filterHideWhitelisted").checked) {
      WMEURMPT.getId("urt-checkbox-filterHideBlacklisted").checked = false;
      WMEURMPT.toggleURFilterHideBlacklisted();
    }
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideWhitelisted", WMEURMPT.URFilterList.hideWhitelisted);
  };
  WMEURMPT.toggleURFilterHideGE = function() {
    WMEURMPT.log('Switch UR filter "hide General Error"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideGE", WMEURMPT.URFilterList.hideGE);
  };
  WMEURMPT.toggleURFilterHideNotKW = function() {
    WMEURMPT.log('Switch UR filter "hide not matching keyword": ' + WMEURMPT.currentURKeyWord);
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideNotKW", WMEURMPT.URFilterList.hideNotKW);
  };
  WMEURMPT.toggleMCFilterHideNotKW = function() {
    WMEURMPT.log('Switch MC filter "hide not matching keyword": ' + WMEURMPT.currentMCKeyWord);
    WMEURMPT.toggleMCFilter("mct-checkbox-filterHideNotKW", WMEURMPT.MCFilterList.hideNotKW);
  };
  WMEURMPT.toggleURFilterHideLimitTo = function() {
    WMEURMPT.log('Switch UR filter "hide over limit: "' + WMEURMPT.currentURLimitTo);
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideLimitTo", WMEURMPT.URFilterList.hideLimitTo);
  };
  WMEURMPT.toggleURFilterHideOnlyType = function() {
    WMEURMPT.log('Switch UR filter "hide all but type: "' + WMEURMPT.currentUROnlyType);
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideOnlyType", WMEURMPT.URFilterList.hideType);
  };
  WMEURMPT.toggleURFilterHideOnlyArea = function() {
    WMEURMPT.log('Switch UR filter "hide all but area: "' + WMEURMPT.currentUROnlyArea);
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideOnlyArea", WMEURMPT.URFilterList.hideArea);
  };
  WMEURMPT.toggleURFilterHideLastCommentFromEditor = function() {
    WMEURMPT.log('Switch UR filter "hide last comment from editor"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideLastCommentFromEditor", WMEURMPT.URFilterList.hideLastCommentFromEditor);
  };
  WMEURMPT.toggleURFilterHideTagged = function() {
    WMEURMPT.log('Switch UR filter "hide tagged"');
    WMEURMPT.toggleURFilter("urt-checkbox-filterHideTagged", WMEURMPT.URFilterList.hideTagged);
  };
  WMEURMPT.toggleMPFilter = function(chkboxId, filter) {
    var chkbox = WMEURMPT.getId(chkboxId);
    if (chkbox == null) {
      return;
    }
    if (chkbox.checked) {
      WMEURMPT.currentMPFilter = WMEURMPT.currentMPFilter | filter;
    } else {
      WMEURMPT.currentMPFilter = WMEURMPT.currentMPFilter & ~filter;
    }
    WMEURMPT.log("current MP filter: " + WMEURMPT.currentMPFilter);
    WMEURMPT.updateIHMFromMPList();
  };
  WMEURMPT.toggleMPFilterHideClosed = function() {
    WMEURMPT.log('Switch MP filter "hide closed"');
    WMEURMPT.toggleMPFilter("mpt-checkbox-filterHideClosed", WMEURMPT.MPFilterList.hideClosed);
  };
  WMEURMPT.toggleMPFilterHideOutOfMyManagedArea = function() {
    WMEURMPT.log('Switch MP filter "hide out of my managed area"');
    WMEURMPT.toggleMPFilter("mpt-checkbox-filterHideOutOfMyManagedArea", WMEURMPT.MPFilterList.hideOutOfMyManagedArea);
  };
  WMEURMPT.toggleMPFilterHideVisited = function() {
    WMEURMPT.log('Switch MP filter "hide visited"');
    WMEURMPT.toggleMPFilter("mpt-checkbox-filterHideVisited", WMEURMPT.MPFilterList.hideVisited);
  };
  WMEURMPT.toggleMPFilterHideBlacklisted = function() {
    WMEURMPT.log('Switch MP filter "hide blacklisted"');
    if (WMEURMPT.getId("mpt-checkbox-filterHideBlacklisted").checked) {
      WMEURMPT.getId("mpt-checkbox-filterHideWhitelisted").checked = false;
      WMEURMPT.toggleMPFilterHideWhitelisted();
    }
    WMEURMPT.toggleMPFilter("mpt-checkbox-filterHideBlacklisted", WMEURMPT.MPFilterList.hideBlacklisted);
  };
  WMEURMPT.toggleMPFilterHideWhitelisted = function() {
    WMEURMPT.log('Switch MP filter "hide whitelisted"');
    if (WMEURMPT.getId("mpt-checkbox-filterHideWhitelisted").checked) {
      WMEURMPT.getId("mpt-checkbox-filterHideBlacklisted").checked = false;
      WMEURMPT.toggleMPFilterHideBlacklisted();
    }
    WMEURMPT.toggleMPFilter("mpt-checkbox-filterHideWhitelisted", WMEURMPT.MPFilterList.hideWhitelisted);
  };
  WMEURMPT.toggleMPFilterHideLimitTo = function() {
    WMEURMPT.log('Switch MP filter "hide over limit: "' + WMEURMPT.currentMPLimitTo);
    WMEURMPT.toggleMPFilter("mpt-checkbox-filterHideLimitTo", WMEURMPT.MPFilterList.hideLimitTo);
  };
  WMEURMPT.toggleMPFilterHideOnlyType = function() {
    WMEURMPT.log('Switch MP filter "hide all but type: "' + WMEURMPT.currentMPOnlyType);
    WMEURMPT.toggleMPFilter("mpt-checkbox-filterHideOnlyType", WMEURMPT.MPFilterList.hideType);
  };
  WMEURMPT.toggleMPFilterHideOnlyArea = function() {
    WMEURMPT.log('Switch MP filter "hide all but area: "' + WMEURMPT.currentMPOnlyArea);
    WMEURMPT.toggleMPFilter("mpt-checkbox-filterHideOnlyArea", WMEURMPT.MPFilterList.hideArea);
  };
  WMEURMPT.toggleMCFilter = function(chkboxId, filter) {
    var chkbox = WMEURMPT.getId(chkboxId);
    if (chkbox == null) {
      return;
    }
    if (chkbox.checked) {
      WMEURMPT.currentMCFilter = WMEURMPT.currentMCFilter | filter;
    } else {
      WMEURMPT.currentMCFilter = WMEURMPT.currentMCFilter & ~filter;
    }
    WMEURMPT.log("current MC filter: " + WMEURMPT.currentMCFilter);
    WMEURMPT.updateIHMFromMCList();
  };
  WMEURMPT.toggleMCFilterHideOutOfMyManagedArea = function() {
    WMEURMPT.log('Switch MC filter "hide out of my managed area"');
    WMEURMPT.toggleMCFilter("mct-checkbox-filterHideOutOfMyManagedArea", WMEURMPT.MCFilterList.hideOutOfMyManagedArea);
  };
  WMEURMPT.toggleMCFilterHideVisited = function() {
    WMEURMPT.log('Switch MC filter "hide visited"');
    WMEURMPT.toggleMCFilter("mct-checkbox-filterHideVisited", WMEURMPT.MCFilterList.hideVisited);
  };
  WMEURMPT.toggleMCFilterHideBlacklisted = function() {
    WMEURMPT.log('Switch MC filter "hide blacklisted"');
    if (WMEURMPT.getId("mct-checkbox-filterHideBlacklisted").checked) {
      WMEURMPT.getId("mct-checkbox-filterHideWhitelisted").checked = false;
      WMEURMPT.toggleMCFilterHideWhitelisted();
    }
    WMEURMPT.toggleMCFilter("mct-checkbox-filterHideBlacklisted", WMEURMPT.MCFilterList.hideBlacklisted);
  };
  WMEURMPT.toggleMCFilterHideWhitelisted = function() {
    WMEURMPT.log('Switch MC filter "hide whitelisted"');
    if (WMEURMPT.getId("mct-checkbox-filterHideWhitelisted").checked) {
      WMEURMPT.getId("mct-checkbox-filterHideBlacklisted").checked = false;
      WMEURMPT.toggleMCFilterHideBlacklisted();
    }
    WMEURMPT.toggleMCFilter("mct-checkbox-filterHideWhitelisted", WMEURMPT.MCFilterList.hideWhitelisted);
  };
  WMEURMPT.toggleMCFilterHideLimitTo = function() {
    WMEURMPT.log('Switch MC filter "hide over limit: "' + WMEURMPT.currentMCLimitTo);
    WMEURMPT.toggleMCFilter("mct-checkbox-filterHideLimitTo", WMEURMPT.MCFilterList.hideLimitTo);
  };
  WMEURMPT.toggleMCFilterHideOnlyArea = function() {
    WMEURMPT.log('Switch MC filter "hide all but area: "' + WMEURMPT.currentMCOnlyArea);
    WMEURMPT.toggleMCFilter("mct-checkbox-filterHideOnlyArea", WMEURMPT.MCFilterList.hideArea);
  };
  WMEURMPT.URCommentsCountChanged = function() {
    WMEURMPT.currentURCommentsCount = this.value;
    if (WMEURMPT.getId("urt-checkbox-filterHideWithCommentCount").checked) {
      WMEURMPT.log("Hide UR comments greater than: " + WMEURMPT.currentURCommentsCount);
      WMEURMPT.updateIHMFromURList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.URKeywordChanged = function() {
    WMEURMPT.currentURKeyWord = this.value;
    if (WMEURMPT.getId("urt-checkbox-filterHideNotKW").checked) {
      WMEURMPT.updateIHMFromURList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.MCKeywordChanged = function() {
    WMEURMPT.currentMCKeyWord = this.value;
    if (WMEURMPT.getId("mct-checkbox-filterHideNotKW").checked) {
      WMEURMPT.updateIHMFromMCList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.URLimitToChanged = function() {
    WMEURMPT.currentURLimitTo = parseInt(this.value);
    if (isNaN(WMEURMPT.currentURLimitTo)) {
      WMEURMPT.currentURLimitTo = 100;
    }
    if (WMEURMPT.getId("urt-checkbox-filterHideLimitTo").checked) {
      WMEURMPT.log("Limit UR list to: " + WMEURMPT.currentURLimitTo);
      WMEURMPT.updateIHMFromURList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.MPLimitToChanged = function() {
    WMEURMPT.currentMPLimitTo = parseInt(this.value);
    if (isNaN(WMEURMPT.currentMPLimitTo)) {
      WMEURMPT.currentMPLimitTo = 100;
    }
    if (WMEURMPT.getId("mpt-checkbox-filterHideLimitTo").checked) {
      WMEURMPT.log("Limit MP list to: " + WMEURMPT.currentMPLimitTo);
      WMEURMPT.updateIHMFromMPList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.MCLimitToChanged = function() {
    WMEURMPT.currentMCLimitTo = parseInt(this.value);
    if (isNaN(WMEURMPT.currentMCLimitTo)) {
      WMEURMPT.currentMCLimitTo = 100;
    }
    if (WMEURMPT.getId("mct-checkbox-filterHideLimitTo").checked) {
      WMEURMPT.log("Limit MC list to: " + WMEURMPT.currentMCLimitTo);
      WMEURMPT.updateIHMFromMCList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.UROnlyTypeChanged = function() {
    WMEURMPT.currentUROnlyType = parseInt(this.value);
    if (WMEURMPT.getId("urt-checkbox-filterHideOnlyType").checked) {
      WMEURMPT.log("Hide all UR but type: " + WMEURMPT.currentUROnlyType);
      WMEURMPT.updateIHMFromURList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.MPOnlyTypeChanged = function() {
    WMEURMPT.currentMPOnlyType = parseInt(this.value);
    if (WMEURMPT.getId("mpt-checkbox-filterHideOnlyType").checked) {
      WMEURMPT.log("Hide all MP but type: " + WMEURMPT.currentMPOnlyType);
      WMEURMPT.updateIHMFromMPList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.UROnlyAreaChanged = function() {
    WMEURMPT.currentUROnlyArea = this.value;
    if (WMEURMPT.getId("urt-checkbox-filterHideOnlyArea").checked) {
      WMEURMPT.log("Hide all UR but area: " + WMEURMPT.currentUROnlyArea);
      WMEURMPT.updateIHMFromURList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.MPOnlyAreaChanged = function() {
    WMEURMPT.currentMPOnlyArea = this.value;
    if (WMEURMPT.getId("mpt-checkbox-filterHideOnlyArea").checked) {
      WMEURMPT.log("Hide all MP but area: " + WMEURMPT.currentMPOnlyArea);
      WMEURMPT.updateIHMFromMPList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.MCOnlyAreaChanged = function() {
    WMEURMPT.currentMCOnlyArea = this.value;
    if (WMEURMPT.getId("mct-checkbox-filterHideOnlyArea").checked) {
      WMEURMPT.log("Hide all MC but area: " + WMEURMPT.currentMCOnlyArea);
      WMEURMPT.updateIHMFromMCList();
    }
    WMEURMPT.saveOptions();
  };
  WMEURMPT.refreshAreasCombolist = function(selectEl, defaultSelected) {
    if (selectEl == null) {
      WMEURMPT.log("Error no filter area");
      return;
    }
    var content = "";
    for (var i = 0;i < WMEURMPT.areaList.country.length;i++) {
      content += '<option value="' + WMEURMPT.areaList.country[i].name + '"' + (defaultSelected == WMEURMPT.areaList.country[i].name ? " selected" : "") + ">" + WMEURMPT.areaList.country[i].name + "</option>";
    }
    for (var i = 0;i < WMEURMPT.areaList.custom.length;i++) {
      content += '<option value="' + WMEURMPT.areaList.custom[i].name + '"' + (defaultSelected == WMEURMPT.areaList.custom[i].name ? " selected" : "") + ">" + WMEURMPT.areaList.custom[i].name + "</option>";
    }
    if (content == "") {
      selectEl.parentNode.style.display = "none";
    } else {
      selectEl.parentNode.style.display = "block";
      WMEURMPT.removeChildElements(selectEl);
      selectEl.innerHTML = content;
    }
  };
  WMEURMPT.addCountryToAreaList = function() {
    var country = WMEURMPT.getId("urmpt-countryList").value;
    WMEURMPT.log("Add country to filter list: " + country);
    var area = new WMEURMPT.URT_AREA;
    area.category = "country";
    var areaPath = country.split("->");
    if (areaPath.length > 1) {
      area.subset = true;
      area.name = areaPath[areaPath.length - 1];
      area.parent = areaPath[0];
      for (var i = 1;i < areaPath.length - 1;i++) {
        if (i % 2 == 1) {
          area.parent += ".";
        } else {
          area.parent += "/";
        }
        area.parent += areaPath[i];
      }
    } else {
      area.name = country;
    }
    area.getGeometryFromServer(WMEURMPT.newCountryGeometryAvailable);
  };
  WMEURMPT.newCountryGeometryAvailable = function(area) {
    if (area == null) {
      alert("Error while getting area from server.\nPlease, retry later.");
      return;
    }
    WMEURMPT.removeCountryFromAreaList(area);
    WMEURMPT.areaList.country.push(area);
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.removeCountryFromAreaList = function(country) {
    WMEURMPT.log("remove country: " + country);
    for (var i = 0;i < WMEURMPT.areaList.country.length;i++) {
      if (WMEURMPT.areaList.country[i].name == country.name && WMEURMPT.areaList.country[i].subset == country.subset && WMEURMPT.areaList.country[i].parent == country.parent) {
        WMEURMPT.areaList.country.splice(i, 1);
        break;
      }
    }
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.removeCountryIDFromAreaList = function(id) {
    WMEURMPT.areaList.country.splice(id, 1);
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.addCustomAreaFromWKTToFilterList = function() {
    var elName = WMEURMPT.getId("urmpt-areas-wktfile-name");
    if (elName.value == "") {
      alert("The name of your custom area is empty.\nPlease, fill it.");
      return;
    }
    if (WMEURMPT.lastUploadedWKT === null) {
      alert("Please, choose a file before.");
      return;
    }
    var ca = new WMEURMPT.URT_AREA;
    ca.category = "custom";
    ca.name = elName.value;
    WMEURMPT.log("Add CA to scan list: " + ca.name);
    ca.geometryWKT = WMEURMPT.lastUploadedWKT;
    WMEURMPT.removeCustomNameFromAreaList(ca.name);
    WMEURMPT.areaList.custom.push(ca);
    elName.value = "";
    WMEURMPT.lastUploadedWKT = null;
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.handleFileSelectAddFromJSON = function(evt) {
    var files = evt.target.files;
    for (var i = 0, f;f = files[i];i++) {
      var reader = new FileReader;
      reader.onload = function(theFile) {
        return function(e) {
          WMEURMPT.lastUploadedJSON = e.target.result;
          WMEURMPT.log("import JSON file read");
        };
      }(f);
      reader.readAsText(f);
    }
  };
  WMEURMPT.addCustomAreaFromJSONToFilterList = function() {
    if (WMEURMPT.lastUploadedJSON === null) {
      alert("Please, choose a file before.");
      return;
    }
    var customAreas = JSON.parse(WMEURMPT.lastUploadedJSON);
    customAreas.forEach(function(a) {
      var ca = new WMEURMPT.URT_AREA;
      ca.category = "custom";
      ca.name = a.name;
      WMEURMPT.log("Add CA to scan list: " + ca.name);
      ca.geometryWKT = a.geometryWKT;
      WMEURMPT.removeCustomNameFromAreaList(ca.name);
      WMEURMPT.areaList.custom.push(ca);
    });
    WMEURMPT.lastUploadedJSON = null;
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.addCustomAreaFromPOIToFilterList = function() {
    var elName = WMEURMPT.getId("urmpt-areas-frompoi-name");
    if (elName.value == "") {
      alert("The name of your custom area is empty.\nPlease, fill it.");
      return;
    }
    var theVenue = null;
    var count = 0;
    for (var v in WMEURMPT.wazeModel.venues.objects) {
      if (WMEURMPT.wazeModel.venues.objects.hasOwnProperty(v) == false) {
        continue;
      }
      var venue = WMEURMPT.wazeModel.venues.objects[v];
      if (venue.isPoint() == true) {
        continue;
      }
      if (venue.attributes.id <= 0) {
        theVenue = venue;
        count++;
      }
    }
    if (count > 1) {
      alert("There must be only one unsaved venue.\n" + count + " detected.\nDraw only one venue to convert it in a custom area.");
      return;
    }
    if (count == 0) {
      alert("You must draw an area venue and not save it. Then you can add it as a custom area.");
      return;
    }
    var ca = new WMEURMPT.URT_AREA;
    ca.category = "custom";
    ca.name = elName.value;
    WMEURMPT.log("Add CA to scan list: " + ca.name);
    if (theVenue.geometry.components.length != 1) {
      alert("Can't parse the geometry");
      return;
    }
    ca.geometryWKT = "POLYGON ((";
    var lonlats = [];
    for (var i = 0;i < theVenue.geometry.components[0].components.length;i++) {
      var lonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(theVenue.geometry.components[0].components[i].x, theVenue.geometry.components[0].components[i].y);
      lonlats.push(lonlat.lon + " " + lonlat.lat);
    }
    ca.geometryWKT += lonlats.join(",");
    ca.geometryWKT += "))";
    WMEURMPT.removeCustomNameFromAreaList(ca.name);
    WMEURMPT.areaList.custom.push(ca);
    elName.value = "";
    if (confirm("Undo all edits?")) {
      while (WMEURMPT.wazeModel.actionManager.undo()) {
      }
    }
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.addCustomAreaToFilterList = function() {
    var elName = WMEURMPT.getId("urmpt-areas-name");
    var elTLlon = WMEURMPT.getId("urmpt-areas-tl-lon");
    var elBRlon = WMEURMPT.getId("urmpt-areas-br-lon");
    var elTLlat = WMEURMPT.getId("urmpt-areas-tl-lat");
    var elBRlat = WMEURMPT.getId("urmpt-areas-br-lat");
    if (elName.value == "") {
      alert("The name of your custom area is empty.\nPlease, fill it.");
      return;
    }
    if (elTLlon.value == "" || elBRlon.value == "" || elTLlat.value == "" || elBRlat.value == "") {
      alert("The lon/lat coords are not filled correctly.");
      return;
    }
    var ca = new WMEURMPT.URT_AREA;
    ca.category = "custom";
    ca.name = elName.value;
    WMEURMPT.log("Add CA to scan list: " + ca.name);
    var lonMin = elTLlon.value;
    var lonMax = elBRlon.value;
    var latMin = elTLlat.value;
    var latMax = elBRlat.value;
    ca.geometryWKT = "POLYGON ((" + lonMin + " " + latMin + "," + lonMax + " " + latMin + "," + lonMax + " " + latMax + "," + lonMin + " " + latMax + "," + lonMin + " " + latMin + "))";
    WMEURMPT.removeCustomNameFromAreaList(ca.name);
    WMEURMPT.areaList.custom.push(ca);
    elName.value = "";
    elTLlon.value = "";
    elBRlon.value = "";
    elTLlat.value = "";
    elBRlat.value = "";
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.removeCustomNameFromAreaList = function(areaName) {
    for (var c = 0;c < WMEURMPT.areaList.custom.length;c++) {
      if (WMEURMPT.areaList.custom[c].name == areaName) {
        WMEURMPT.areaList.custom.splice(c, 1);
        WMEURMPT.log("removed CA: " + areaName);
        break;
      }
    }
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.editCustomArea = function(areaName) {
    for (var c = 0;c < WMEURMPT.areaList.custom.length;c++) {
      WMEURMPT.getId("urmpt-area-custom-edit-" + WMEURMPT.areaList.custom[c].name).style.display = "none";
      if (WMEURMPT.areaList.custom[c].name == areaName) {
        WMEURMPT.getId("urmpt-area-custom-save-" + WMEURMPT.areaList.custom[c].name).style.display = "inline";
        var area = WMEURMPT.areaList.custom[c];
        var featureLandmark = require("Waze/Feature/Vector/Landmark");
        var landmark = new featureLandmark;
        var center = area.geometryOL.geometry.getCentroid();
        var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(center.x, center.y);
        WMEURMPT.wazeMap.setCenter(xy);
        var geo = [];
        area.geometryOL.geometry.components[0].components.forEach(function(c) {
          var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(c.x, c.y);
          geo.push(new OpenLayers.Geometry.Point(xy.lon, xy.lat));
        });
        landmark.geometry = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(geo)]);
        landmark.attributes.categories = ["OTHER"];
        var AddLandmark = require("Waze/Action/AddLandmark");
        Waze.model.actionManager.add(new AddLandmark(landmark), _.defer(function() {
          Waze.selectionManager.setSelectedModels([landmark]);
        }));
      }
    }
  };
  WMEURMPT.saveEditedCustomArea = function(areaName) {
    var theVenue = null;
    var count = 0;
    for (var v in WMEURMPT.wazeModel.venues.objects) {
      if (WMEURMPT.wazeModel.venues.objects.hasOwnProperty(v) == false) {
        continue;
      }
      var venue = WMEURMPT.wazeModel.venues.objects[v];
      if (venue.isPoint() == true) {
        continue;
      }
      if (venue.attributes.id <= 0) {
        theVenue = venue;
        count++;
      }
    }
    if (count > 1) {
      alert("There must be only one unsaved venue.\n" + count + " detected.\nDraw only one venue to convert it in a custom area.");
      WMEURMPT.updateScanGroup();
      return;
    }
    if (count == 0) {
      alert("You must draw an area venue and not save it. Then you can add it as a custom area.");
      WMEURMPT.updateScanGroup();
      return;
    }
    if (theVenue.geometry.components.length != 1) {
      alert("Can't parse the geometry");
      WMEURMPT.updateScanGroup();
      return;
    }
    WMEURMPT.removeCustomNameFromAreaList(areaName);
    var ca = new WMEURMPT.URT_AREA;
    ca.category = "custom";
    ca.name = areaName;
    ca.geometryWKT = "POLYGON ((";
    var lonlats = [];
    for (var i = 0;i < theVenue.geometry.components[0].components.length;i++) {
      var lonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(theVenue.geometry.components[0].components[i].x, theVenue.geometry.components[0].components[i].y);
      lonlats.push(lonlat.lon + " " + lonlat.lat);
    }
    ca.geometryWKT += lonlats.join(",");
    ca.geometryWKT += "))";
    WMEURMPT.areaList.custom.push(ca);
    if (confirm("Undo all edits?")) {
      while (WMEURMPT.wazeModel.actionManager.undo()) {
      }
    }
    WMEURMPT.updateScanGroup();
  };
  WMEURMPT.exportAllCAToJSON = function() {
    this.setAttribute("download", "URMPT_CustomAreas_" + WMEURMPT.me.userName + ".json");
    this.href = "data:application/octet-stream;charset=utf-8;base64," + btoa(JSON.stringify(WMEURMPT.areaList.custom.map(function(e) {
      return {name:e.name, geometryWKT:e.geometryWKT};
    })));
  };
  WMEURMPT.updateScanGroup = function() {
    var scanGroup = WMEURMPT.getId("urt-a-scanGroup");
    var countryScanList = WMEURMPT.getId("urmpt-countryscanlist");
    var customAreaScanList = WMEURMPT.getId("urmpt-custom-scan-list");
    WMEURMPT.removeChildElements(scanGroup);
    scanGroup.innerHTML = "SCAN: ";
    if (countryScanList != null) {
      WMEURMPT.removeChildElements(countryScanList);
      countryScanList.innerHTML = "";
    }
    WMEURMPT.removeChildElements(customAreaScanList);
    customAreaScanList.innerHTML = "";
    var elt = WMEURMPT.createElement("a", "urt-a-scanEditableArea");
    elt.innerHTML = "Editable area";
    elt.href = "#";
    elt.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.updateListsFromManualScan, [{type:"editableArea"}]);
    scanGroup.appendChild(elt);
    if (WMEURMPT.areaList.country.length == 0 && (WMEURMPT.ul >= 8 || WMEURMPT.me.isCountryManager())) {
      scanGroup.insertAdjacentHTML("beforeend", '<br/><font color="#C00000">You are a rank 4+ editor. In the areas tab, you can select a country or a subset for state managers in the list and add it to your scan list!');
    }
    for (var c = 0;c < WMEURMPT.areaList.country.length;c++) {
      if (WMEURMPT.areaList.country[c].geometryOL == null) {
        WMEURMPT.areaList.country[c].geometryOL = (new OpenLayers.Format.WKT).read(WMEURMPT.areaList.country[c].geometryWKT);
        if (WMEURMPT.areaList.country[c].geometryOL == null || WMEURMPT.areaList.country[c].geometryOL.hasOwnProperty("geometry") == false) {
          WMEURMPT.log("Error on area " + WMEURMPT.areaList.country[c].name + ". Removing it... :(");
          WMEURMPT.areaList.country.splice(c, 1);
          c--;
          continue;
        }
        for (var j = 0;j < WMEURMPT.areaList.country[c].geometryOL.geometry.components.length;j++) {
          WMEURMPT.areaList.country[c].geometryOL.geometry.components[j].calculateBounds();
          WMEURMPT.bintreeGeometry(WMEURMPT.areaList.country[c].geometryOL.geometry.components[j]);
        }
      }
      elt = WMEURMPT.createElement("span");
      elt.innerHTML = " | ";
      scanGroup.appendChild(elt);
      elt = WMEURMPT.createElement("a", "urt-a-scan" + WMEURMPT.areaList.country[c].name);
      elt.innerHTML = WMEURMPT.areaList.country[c].name.replace(/_/g, " ");
      elt.href = "#";
      elt.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.updateListsFromManualScan, [{type:"country", name:WMEURMPT.areaList.country[c].name}]);
      scanGroup.appendChild(elt);
      if (countryScanList != null) {
        var elt = WMEURMPT.createElement("div");
        elt.innerHTML = WMEURMPT.areaList.country[c].name.replace(/_/g, " ") + " ";
        var GELink = WMEURMPT.createElement("a");
        GELink.href = "#";
        GELink.innerHTML = '<img style="height: 15px;" src="data:image/png;base64,' + WMEURMPT.icon_ge + '" />';
        GELink.title = "Show in google earth";
        GELink.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.showAreaInGoogleEarth, [{type:"country", name:WMEURMPT.areaList.country[c].name}]);
        elt.appendChild(GELink);
        var WKTLink = WMEURMPT.createElement("a");
        WKTLink.href = "#";
        WKTLink.innerHTML = "WKT";
        WKTLink.title = "Export to WKT";
        WKTLink.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.showAreaInWKT, [{type:"country", name:WMEURMPT.areaList.country[c].name}]);
        elt.appendChild(WKTLink);
        elt.insertAdjacentHTML("beforeend", " (");
        var removeLink = WMEURMPT.createElement("a");
        removeLink.innerHTML = "remove";
        removeLink.href = "#";
        removeLink.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.removeCountryIDFromAreaList, [c]);
        elt.appendChild(removeLink);
        elt.insertAdjacentHTML("beforeend", ")");
        countryScanList.appendChild(elt);
      }
    }
    for (var c = 0;c < WMEURMPT.areaList.custom.length;c++) {
      if (WMEURMPT.areaList.custom[c].geometryOL == null) {
        WMEURMPT.areaList.custom[c].geometryOL = (new OpenLayers.Format.WKT).read(WMEURMPT.areaList.custom[c].geometryWKT);
        if (WMEURMPT.areaList.custom[c].geometryOL == null || WMEURMPT.areaList.custom[c].geometryOL.hasOwnProperty("geometry") == false) {
          WMEURMPT.log("Error on area " + WMEURMPT.areaList.custom[c].name + ". Removing it... :(");
          WMEURMPT.areaList.custom.splice(c, 1);
          c--;
          continue;
        }
        for (var j = 0;j < WMEURMPT.areaList.custom[c].geometryOL.geometry.components.length;j++) {
          WMEURMPT.areaList.custom[c].geometryOL.geometry.components[j].calculateBounds();
          WMEURMPT.bintreeGeometry(WMEURMPT.areaList.custom[c].geometryOL.geometry.components[j]);
        }
      }
      elt = WMEURMPT.createElement("span");
      elt.innerHTML = " | ";
      scanGroup.appendChild(elt);
      elt = WMEURMPT.createElement("a", "urt-a-scan" + WMEURMPT.areaList.custom[c].name);
      elt.innerHTML = WMEURMPT.areaList.custom[c].name.replace(/_/g, " ");
      elt.href = "#";
      elt.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.updateListsFromManualScan, [{type:"custom", name:WMEURMPT.areaList.custom[c].name}]);
      scanGroup.appendChild(elt);
      if (customAreaScanList != null) {
        var elt = WMEURMPT.createElement("div");
        elt.innerHTML = WMEURMPT.areaList.custom[c].name.replace(/_/g, " ") + " ";
        var GELink = WMEURMPT.createElement("a");
        GELink.href = "#";
        GELink.innerHTML = '<img style="height: 15px;" src="data:image/png;base64,' + WMEURMPT.icon_ge + '" />';
        GELink.title = "Show in google earth";
        GELink.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.showAreaInGoogleEarth, [{type:"custom", name:WMEURMPT.areaList.custom[c].name}]);
        elt.appendChild(GELink);
        var WKTLink = WMEURMPT.createElement("a");
        WKTLink.href = "#";
        WKTLink.innerHTML = "WKT";
        WKTLink.title = "Export to WKT";
        WKTLink.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.showAreaInWKT, [{type:"custom", name:WMEURMPT.areaList.custom[c].name}]);
        elt.appendChild(WKTLink);
        elt.insertAdjacentHTML("beforeend", " ");
        var editLink = WMEURMPT.createElement("a");
        editLink.href = "#";
        editLink.id = "urmpt-area-custom-edit-" + WMEURMPT.areaList.custom[c].name;
        editLink.innerHTML = "Edit";
        editLink.title = "Edit as unsaved landmark";
        editLink.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.editCustomArea, [WMEURMPT.areaList.custom[c].name]);
        elt.appendChild(editLink);
        elt.insertAdjacentHTML("beforeend", " ");
        var saveLink = WMEURMPT.createElement("a");
        saveLink.href = "#";
        saveLink.id = "urmpt-area-custom-save-" + WMEURMPT.areaList.custom[c].name;
        saveLink.style.display = "none";
        saveLink.innerHTML = "Save";
        saveLink.title = "Save landmark";
        saveLink.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.saveEditedCustomArea, [WMEURMPT.areaList.custom[c].name]);
        elt.appendChild(saveLink);
        elt.insertAdjacentHTML("beforeend", " (");
        var removeLink = WMEURMPT.createElement("a");
        removeLink.innerHTML = "remove";
        removeLink.href = "#";
        removeLink.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.removeCustomNameFromAreaList, [WMEURMPT.areaList.custom[c].name]);
        elt.appendChild(removeLink);
        elt.insertAdjacentHTML("beforeend", ")");
        customAreaScanList.appendChild(elt);
      }
    }
    var ael = WMEURMPT.createElement("a");
    ael.href = "#";
    ael.innerHTML = "Export to JSON";
    ael.onclick = WMEURMPT.exportAllCAToJSON;
    customAreaScanList.appendChild(ael);
    WMEURMPT.refreshAreasCombolist(WMEURMPT.getId("urt-filterOnlyArea"), WMEURMPT.currentUROnlyArea);
    WMEURMPT.refreshAreasCombolist(WMEURMPT.getId("mpt-filterOnlyArea"), WMEURMPT.currentMPOnlyArea);
    WMEURMPT.refreshAreasCombolist(WMEURMPT.getId("mct-filterOnlyArea"), WMEURMPT.currentMCOnlyArea);
    WMEURMPT.currentUROnlyArea = WMEURMPT.getId("urt-filterOnlyArea").value;
    WMEURMPT.currentMPOnlyArea = WMEURMPT.getId("mpt-filterOnlyArea").value;
    WMEURMPT.currentMCOnlyArea = WMEURMPT.getId("mct-filterOnlyArea").value;
    WMEURMPT.saveAreas();
  };
  WMEURMPT.showAreaInGoogleEarth = function(area) {
    var template = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom"><Document> <name>#AREANAME#</name> <Style id="hl"> <IconStyle> <scale>1.2</scale> </IconStyle> <LineStyle> <color>ff000000</color> <width>2</width> </LineStyle> <PolyStyle> <color>7f0000ff</color> </PolyStyle> </Style> <Style id="default"> <LineStyle> <color>ff000000</color> <width>2</width> </LineStyle> <PolyStyle> <color>7f0000ff</color> </PolyStyle> </Style> <StyleMap id="default0"> <Pair> <key>normal</key> <styleUrl>#default</styleUrl> </Pair> <Pair> <key>highlight</key> <styleUrl>#hl</styleUrl> </Pair> </StyleMap> <Placemark> <name>#AREANAME#</name> <styleUrl>#default0</styleUrl>#GEOMETRY#</Placemark></Document></kml>';
    var kmlGeometry = "";
    var geometry = null;
    function geomToKML(geom) {
      var output = "";
      for (var i = 0;i < geom.length;i++) {
        output += "<Polygon><outerBoundaryIs><LinearRing><coordinates>";
        for (var p = 0;p < geom[i].components.length;p++) {
          output += geom[i].components[p].x + "," + geom[i].components[p].y + " ";
        }
        output += "</coordinates></LinearRing></outerBoundaryIs></Polygon>";
      }
      return output;
    }
    for (var i = 0;i < WMEURMPT.areaList[area.type].length;i++) {
      if (WMEURMPT.areaList[area.type][i].name == area.name) {
        geometry = WMEURMPT.areaList[area.type][i].geometryOL.geometry;
        break;
      }
    }
    if (geometry) {
      if (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon") {
        kmlGeometry += "<MultiGeometry>";
        for (var p = 0;p < geometry.components.length;p++) {
          kmlGeometry += geomToKML(geometry.components[p].components);
        }
        kmlGeometry += "</MultiGeometry>";
      } else {
        kmlGeometry += geomToKML(geometry.components);
      }
      template = template.replace(/#AREANAME#/g, area.name);
      template = template.replace("#GEOMETRY#", kmlGeometry);
      this.setAttribute("download", area.name + ".kml");
      this.href = "data:application/octet-stream;charset=utf-8;base64," + btoa(template);
    }
    return false;
  };
  WMEURMPT.computeStats = function(fromURList, fromMPList, fromDate, toDate) {
    var out = "";
    out += "URs: " + fromURList.length + "<br/>";
    out += "MPs: " + fromMPList.length + "<br/>";
    var closedUR = fromURList.filter(function(value) {
      return value.data.open === false;
    }).length;
    var closedMP = fromMPList.filter(function(value) {
      return value.data.open === false;
    }).length;
    var niUR = fromURList.filter(function(value) {
      return value.data.open === false && value.data.resolution == 1;
    }).length;
    var soUR = closedUR - niUR;
    var niMP = fromMPList.filter(function(value) {
      return value.data.open === false && value.data.resolution == 1;
    }).length;
    var soMP = closedMP - niMP;
    out += "URs closed: " + closedUR + " (" + Math.round(closedUR * 100 / fromURList.length) + "%) " + (fromURList.length - closedUR) + " remaining<br/>";
    out += "&nbsp;&nbsp;Not identified: " + niUR + " (" + Math.round(niUR * 100 / closedUR) + "%)<br/>";
    out += "&nbsp;&nbsp;Solved: " + soUR + " (" + Math.round(soUR * 100 / closedUR) + "%)<br/>";
    out += "MPs closed: " + closedMP + " (" + Math.round(closedMP * 100 / fromMPList.length) + "%) " + (fromMPList.length - closedMP) + " remaining<br/>";
    out += "&nbsp;&nbsp;Not identified: " + niMP + " (" + Math.round(niMP * 100 / closedMP) + "%)<br/>";
    out += "&nbsp;&nbsp;Solved: " + soMP + " (" + Math.round(soMP * 100 / closedMP) + "%)<br/>";
    var urWithComment = fromURList.filter(function(value) {
      return value.data.hasComments === true;
    }).length;
    var urWithCommentFromReporter = fromURList.filter(function(value) {
      return value.data.hasComments === true && value.data.session.comments.filter(function(c) {
        return c.userName == "Reporter";
      }).length != 0;
    }).length;
    out += "URs with reporter comment: " + urWithCommentFromReporter + " (" + Math.round(urWithCommentFromReporter * 100 / urWithComment) + "% of commented URs)<br/>";
    WMEURMPT.statsCSV += "UR;Count;Percent\n";
    WMEURMPT.statsCSV += "Count;" + fromURList.length + "\n";
    WMEURMPT.statsCSV += "Closed;" + closedUR + ";" + closedUR * 100 / fromURList.length + "\n";
    WMEURMPT.statsCSV += "Not identified;" + niUR + ";" + niUR * 100 / closedUR + "\n";
    WMEURMPT.statsCSV += "Solved;" + soUR + ";" + soUR * 100 / closedUR + "\n";
    WMEURMPT.statsCSV += "With comment;" + urWithComment + ";" + urWithComment * 100 / fromURList.length + "\n";
    WMEURMPT.statsCSV += "With reporter comment;" + urWithCommentFromReporter + ";" + urWithCommentFromReporter * 100 / urWithComment + "\n";
    WMEURMPT.statsCSV += "MP;Count;Percent\n";
    WMEURMPT.statsCSV += "Count;" + fromMPList.length + "\n";
    WMEURMPT.statsCSV += "Closed;" + closedMP + ";" + closedMP * 100 / fromMPList.length + "\n";
    WMEURMPT.statsCSV += "Not identified;" + niMP + ";" + niMP * 100 / closedMP + "\n";
    WMEURMPT.statsCSV += "Solved;" + soMP + ";" + soMP * 100 / closedMP + "\n";
    var bestPipeletteList = [];
    var bestURCloserList = [];
    var bestMPCloserList = [];
    for (var i = 0;i < fromURList.length;i++) {
      var ur = fromURList[i];
      if (ur.data.hasComments == true) {
        for (var c = 0;c < ur.data.session.comments.length;c++) {
          var userName = ur.data.session.comments[c].userName;
          if (userName == "Reporter" || userName == "Unknown") {
            continue;
          }
          if (bestPipeletteList.hasOwnProperty(userName)) {
            bestPipeletteList[userName]++;
          } else {
            bestPipeletteList[userName] = 1;
          }
        }
      }
      if (!ur.data.open) {
        if (bestURCloserList.hasOwnProperty(ur.data.resolvedByName)) {
          bestURCloserList[ur.data.resolvedByName].total++;
        } else {
          bestURCloserList[ur.data.resolvedByName] = {total:1, solved:0};
        }
        if (ur.data.resolution != 1) {
          bestURCloserList[ur.data.resolvedByName].solved++;
        }
      }
    }
    for (var i = 0;i < fromMPList.length;i++) {
      var mp = fromMPList[i];
      if (!mp.data.open) {
        if (bestMPCloserList.hasOwnProperty(mp.data.resolvedByName)) {
          bestMPCloserList[mp.data.resolvedByName].total++;
        } else {
          bestMPCloserList[mp.data.resolvedByName] = {total:1, solved:0};
        }
        if (mp.data.resolution != 1) {
          bestMPCloserList[mp.data.resolvedByName].solved++;
        }
      }
    }
    var sortablePipelettes = [];
    for (var p in bestPipeletteList) {
      if (bestPipeletteList.hasOwnProperty(p)) {
        sortablePipelettes.push([p, bestPipeletteList[p]]);
      }
    }
    var sortableURClosers = [];
    for (var c in bestURCloserList) {
      if (bestURCloserList.hasOwnProperty(c)) {
        sortableURClosers.push([c, bestURCloserList[c]]);
      }
    }
    var sortableMPClosers = [];
    for (var c in bestMPCloserList) {
      if (bestMPCloserList.hasOwnProperty(c)) {
        sortableMPClosers.push([c, bestMPCloserList[c]]);
      }
    }
    sortablePipelettes.sort(function(a, b) {
      return b[1] - a[1];
    });
    sortableURClosers.sort(function(a, b) {
      return b[1].total - a[1].total;
    });
    sortableMPClosers.sort(function(a, b) {
      return b[1].total - a[1].total;
    });
    WMEURMPT.statsCSV += "Bests\n";
    out += "Best UR closer:<ol>";
    WMEURMPT.statsCSV += "UR Closer;count;solved;not identified\n";
    for (var i = 0;i < 3 && i < sortableURClosers.length;i++) {
      out += "<li>" + sortableURClosers[i][0] + " (" + sortableURClosers[i][1].total + " URs closed, " + sortableURClosers[i][1].solved + " solved and " + (sortableURClosers[i][1].total - sortableURClosers[i][1].solved) + " not identified)</li>";
      WMEURMPT.statsCSV += sortableURClosers[i][0] + ";" + sortableURClosers[i][1].total + ";" + sortableURClosers[i][1].solved + ";" + (sortableURClosers[i][1].total - sortableURClosers[i][1].solved) + "\n";
    }
    out += "</ol>";
    out += "Best MP closer:<ol>";
    WMEURMPT.statsCSV += "MP Closer;count;solved;not identified\n";
    for (var i = 0;i < 3 && i < sortableMPClosers.length;i++) {
      out += "<li>" + sortableMPClosers[i][0] + " (" + sortableMPClosers[i][1].total + " MPs closed, " + sortableMPClosers[i][1].solved + " solved and " + (sortableMPClosers[i][1].total - sortableMPClosers[i][1].solved) + " not identified)</li>";
      WMEURMPT.statsCSV += sortableMPClosers[i][0] + ";" + sortableMPClosers[i][1].total + ";" + sortableMPClosers[i][1].solved + ";" + (sortableMPClosers[i][1].total - sortableMPClosers[i][1].solved) + "\n";
    }
    out += "</ol>";
    out += "Best pipelette:<ol>";
    WMEURMPT.statsCSV += "Pipelette;Message count\n";
    for (var i = 0;i < 3 && i < sortablePipelettes.length;i++) {
      out += "<li>" + sortablePipelettes[i][0] + " (" + sortablePipelettes[i][1] + " comments)</li>";
      WMEURMPT.statsCSV += sortablePipelettes[i][0] + ";" + sortablePipelettes[i][1] + "\n";
    }
    out += "</ol>";
    return out;
  };
  WMEURMPT.refreshStats = function(fromDate, toDate) {
    WMEURMPT.log("from: ", fromDate);
    WMEURMPT.log("to: ", toDate);
    var pb = new WMEURMPT.ProgressBar(WMEURMPT.getId("urt-progressBar"));
    if (pb.isShown() == false) {
      pb.update(-1);
      pb.show();
      WMEURMPT.showPBInfo(true);
      WMEURMPT.info("Refreshing stats, please wait...");
      window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.refreshStats, [fromDate, toDate]));
      return;
    }
    WMEURMPT.statsCSV = "";
    var div = WMEURMPT.getId("urmpt-stats");
    WMEURMPT.removeChildElements(div);
    div.innerHTML = '<font style="font-size: larger; font-weight: bold;">Statistics</font><hr/>';
    div.innerHTML += '<div style="display: flex;"><span style="margin: 5px; display: table;" >From: </span><input value="' + fromDate + '" type="text" id="urmpt-stat-from" size="10"/><span style="margin: 5px; display: table;" > to </span><input value="' + toDate + '" type="text" id="urmpt-stat-to" size="10"/><button id="urmpt-stat-refresh" style="display: table; width: 40px; padding: 0px;">OK</button></div><hr/>';
    div.innerHTML += '<a id="urmpt-stat-export_csv" href="#">Export to CSV</a><hr/>';
    var dateFilteredURList = WMEURMPT.URList;
    var dateFilteredMPList = WMEURMPT.MPList;
    if (fromDate != "" && toDate != "") {
      var df = (new Date(fromDate)).getTime();
      var dt = (new Date(toDate)).getTime();
      dateFilteredURList = WMEURMPT.URList.filter(function(value) {
        return value.data.resolvedOn != null && value.data.resolvedOn >= df && value.data.resolvedOn <= dt || value.data.updatedOn != null && value.data.updatedOn >= df && value.data.updatedOn <= dt || value.data.driveDate != null && value.data.driveDate >= df && value.data.driveDate <= dt;
      });
      dateFilteredMPList = WMEURMPT.MPList.filter(function(value) {
        return value.data.resolvedOn != null && value.data.resolvedOn >= df && value.data.resolvedOn <= dt;
      });
    }
    div.innerHTML += "General:<br/><br/>";
    WMEURMPT.statsCSV += "General\n";
    div.innerHTML += WMEURMPT.computeStats(dateFilteredURList, dateFilteredMPList, fromDate, toDate);
    div.innerHTML += "<hr/>";
    div.innerHTML += "You:<br/><br/>";
    var closedURbyMe = dateFilteredURList.filter(function(value) {
      return value.data.resolvedBy === WMEURMPT.me.id;
    }).length;
    var closedMPbyMe = dateFilteredMPList.filter(function(value) {
      return value.data.resolvedBy === WMEURMPT.me.id;
    }).length;
    var niURbyMe = dateFilteredURList.filter(function(value) {
      return value.data.resolvedBy === WMEURMPT.me.id && value.data.open === false && value.data.resolution == 1;
    }).length;
    var soURbyMe = closedURbyMe - niURbyMe;
    var niMPbyMe = dateFilteredMPList.filter(function(value) {
      return value.data.resolvedBy === WMEURMPT.me.id && value.data.open === false && value.data.resolution == 1;
    }).length;
    var soMPbyMe = closedMPbyMe - niMPbyMe;
    div.innerHTML += "URs closed: " + closedURbyMe + " (" + Math.round(closedURbyMe * 100 / dateFilteredURList.length) + "%)<br/>";
    div.innerHTML += "&nbsp;&nbsp;Not identified: " + niURbyMe + " (" + Math.round(niURbyMe * 100 / closedURbyMe) + "%)<br/>";
    div.innerHTML += "&nbsp;&nbsp;Solved: " + soURbyMe + " (" + Math.round(soURbyMe * 100 / closedURbyMe) + "%)<br/>";
    div.innerHTML += "MPs closed: " + closedMPbyMe + " (" + Math.round(closedMPbyMe * 100 / dateFilteredMPList.length) + "%)<br/>";
    div.innerHTML += "&nbsp;&nbsp;Not identified: " + niMPbyMe + " (" + Math.round(niMPbyMe * 100 / closedMPbyMe) + "%)<br/>";
    div.innerHTML += "&nbsp;&nbsp;Solved: " + soMPbyMe + " (" + Math.round(soMPbyMe * 100 / closedMPbyMe) + "%)<br/>";
    div.innerHTML += "<hr/>";
    div.innerHTML += "Per area:<br/><br/>";
    div.innerHTML += "<ul>";
    WMEURMPT.statsCSV += "You\n";
    WMEURMPT.statsCSV += "UR;Count;Percent\n";
    WMEURMPT.statsCSV += "Closed;" + closedURbyMe + ";" + closedURbyMe * 100 / dateFilteredURList.length + "\n";
    WMEURMPT.statsCSV += "Not identified;" + niURbyMe + ";" + niURbyMe * 100 / closedURbyMe + "\n";
    WMEURMPT.statsCSV += "Solved;" + soURbyMe + ";" + soURbyMe * 100 / closedURbyMe + "\n";
    WMEURMPT.statsCSV += "MP;Count;Percent\n";
    WMEURMPT.statsCSV += "Closed;" + closedMPbyMe + ";" + closedMPbyMe * 100 / dateFilteredMPList.length + "\n";
    WMEURMPT.statsCSV += "Not identified;" + niMPbyMe + ";" + niMPbyMe * 100 / closedMPbyMe + "\n";
    WMEURMPT.statsCSV += "Solved;" + soMPbyMe + ";" + soMPbyMe * 100 / closedMPbyMe + "\n";
    if (WMEURMPT.uam) {
      WMEURMPT.statsCSV += "Your managed area\n";
      var fromURList = dateFilteredURList.filter(function(value) {
        return WMEURMPT.isInsideManagedArea(value.lonlat.lon, value.lonlat.lat);
      });
      var fromMPList = dateFilteredMPList.filter(function(value) {
        return WMEURMPT.isInsideManagedArea(value.lonlat.lon, value.lonlat.lat);
      });
      div.innerHTML += "<li>Your managed area<br/>" + WMEURMPT.computeStats(fromURList, fromMPList, fromDate, toDate) + "</li>";
    }
    for (var a = 0;a < WMEURMPT.areaList.country.length;a++) {
      WMEURMPT.statsCSV += WMEURMPT.areaList.country[a].name + "\n";
      var fromURList = dateFilteredURList.filter(function(value) {
        return WMEURMPT.areaList.country[a].isInside(value.lonlat);
      });
      var fromMPList = dateFilteredMPList.filter(function(value) {
        return WMEURMPT.areaList.country[a].isInside(value.lonlat);
      });
      div.innerHTML += "<li>" + WMEURMPT.areaList.country[a].name + "<br/>" + WMEURMPT.computeStats(fromURList, fromMPList, fromDate, toDate) + "</li>";
    }
    for (var a = 0;a < WMEURMPT.areaList.custom.length;a++) {
      WMEURMPT.statsCSV += WMEURMPT.areaList.custom[a].name + "\n";
      var fromURList = dateFilteredURList.filter(function(value) {
        return WMEURMPT.areaList.custom[a].isInside(value.lonlat);
      });
      var fromMPList = dateFilteredMPList.filter(function(value) {
        return WMEURMPT.areaList.custom[a].isInside(value.lonlat);
      });
      div.innerHTML += "<li>" + WMEURMPT.areaList.custom[a].name + "<br/>" + WMEURMPT.computeStats(fromURList, fromMPList, fromDate, toDate) + "</li>";
    }
    div.innerHTML += "</ul>";
    WMEURMPT.showPBInfo(false);
    pb.hide();
    pb.update(0);
    WMEURMPT.info();
    window.setTimeout(WMEURMPT.setupStatHandlers);
  };
  WMEURMPT.setupStatHandlers = function() {
    if (typeof $.fn.datepicker !== "undefined") {
      $("#urmpt-stat-from,#urmpt-stat-to").datepicker();
    } else {
      if (typeof $.fn.daterangepicker !== "undefined") {
        $("#urmpt-stat-from,#urmpt-stat-to").daterangepicker({singleDatePicker:!0, locale:{format:"YYYY-MM-DD"}});
      }
    }
    WMEURMPT.getId("urmpt-stat-refresh").onclick = function() {
      var dateFrom = WMEURMPT.getId("urmpt-stat-from").value;
      var dateTo = WMEURMPT.getId("urmpt-stat-to").value;
      WMEURMPT.refreshStats(dateFrom, dateTo);
    };
    WMEURMPT.getId("urmpt-stat-export_csv").onclick = WMEURMPT.exportStatsToCSV;
  };
  WMEURMPT.exportStatsToCSV = function() {
    this.setAttribute("download", "URMPT_Stats_" + (new Date).toISOString().substr(0, 10) + "_" + WMEURMPT.me.userName + ".csv");
    this.href = "data:application/octet-stream;charset=utf-8;base64," + btoa(WMEURMPT.statsCSV);
  };
  WMEURMPT.connectStatHandler = function() {
    WMEURMPT.getId("urmp-tabstitle-stat").onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.refreshStats, ["", ""]);
  };
  WMEURMPT.exportURMPs = function(t, button) {
    button.setAttribute("download", t + "s.bbcode.txt");
    var data = "";
    var displayedCount = 0;
    var src = WMEURMPT.URList;
    var filterFunc = WMEURMPT.isURFiltered;
    var limit = WMEURMPT.currentURLimitTo;
    var typeFunc = WMEURMPT.getFullURTypeFromType;
    if (t == "MP") {
      src = WMEURMPT.MPList;
      filterFunc = WMEURMPT.isMPFiltered;
      limit = WMEURMPT.currentMPLimitTo;
      typeFunc = WMEURMPT.getFullMPTypeFromType;
    }
    for (var i = 0;i < src.length;i++) {
      if (WMEURMPT.getId(t.toLowerCase() + "t-checkbox-filterHideLimitTo").checked) {
        if (displayedCount >= limit) {
          break;
        }
      }
      if (filterFunc(src[i])) {
        continue;
      }
      displayedCount++;
      var number = t == "UR" ? WMEURMPT.getDuration(src[i].data.driveDate) : src[i].data.weight;
      var type = typeFunc(t == "UR" ? src[i].data.type : src[i].data.subType);
      var url = location.protocol + "//" + location.host + location.pathname + "?lon=" + src[i].lonlat.lon + "&lat=" + src[i].lonlat.lat + "&zoom=5" + (t == "UR" ? "&mapUpdateRequest=" : "&mapProblem=") + src[i].id;
      data += "[url=" + url + "]" + (t == "MP" ? "Severity: " : "") + number + (t == "UR" ? " days" : "") + " " + " | " + type + (t == "UR" ? src[i].data.hasOwnProperty("description") && src[i].data.description ? " | " + src[i].data.description : " | N/A" : "") + "[/url]\n";
    }
    button.href = "data:text/plain;base64," + btoa(data);
  };
  WMEURMPT.exportKML_URMPs = function(t, button, start) {
    var kml = "";
    var src = WMEURMPT.URList;
    var filterFunc = WMEURMPT.isURFiltered;
    var typeFunc = WMEURMPT.getFullURTypeFromType;
    if (t == "MP") {
      src = WMEURMPT.MPList;
      filterFunc = WMEURMPT.isMPFiltered;
      typeFunc = WMEURMPT.getFullMPTypeFromType;
    }
    var finished = true;
    var displayedCount = 0;
    var data = {};
    for (var i = start;i < src.length;i++) {
      if (displayedCount == 2500) {
        start = i;
        finished = false;
        break;
      }
      if (filterFunc(src[i])) {
        continue;
      }
      displayedCount++;
      var number = t == "UR" ? WMEURMPT.getDuration(src[i].data.driveDate) : src[i].data.weight;
      var type = typeFunc(t == "UR" ? src[i].data.type : src[i].data.subType);
      var color = "green";
      if (src[i].data.open) {
        if (t == "UR") {
          if (number < 15) {
            color = "yellow";
          } else {
            if (number < 30) {
              color = "orange";
            } else {
              color = "red";
            }
          }
        } else {
          if (number < 51) {
            color = "yellow";
          } else {
            if (number < 100) {
              color = "orange";
            } else {
              color = "red";
            }
          }
        }
      }
      if (data.hasOwnProperty(type) == false) {
        data[type] = [];
      }
      data[type].push({lonlat:src[i].lonlat, color:color});
    }
    kml = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom"><Document><name>' + t + 's</name><Style id="sn_red"><IconStyle><color>7f0000ff</color><scale>0.5</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon></IconStyle><LabelStyle><scale>0</scale></LabelStyle><ListStyle></ListStyle></Style><Style id="sh_red"><IconStyle><color>7f0000ff</color><scale>0.6</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon></IconStyle><LabelStyle><scale>0</scale></LabelStyle><ListStyle></ListStyle></Style><StyleMap id="msn_red"><Pair><key>normal</key><styleUrl>#sn_red</styleUrl></Pair><Pair><key>highlight</key><styleUrl>#sh_red</styleUrl></Pair></StyleMap><Style id="sn_orange"><IconStyle><color>7f0080ff</color><scale>0.5</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon></IconStyle><LabelStyle><scale>0</scale></LabelStyle><ListStyle></ListStyle></Style><Style id="sh_orange"><IconStyle><color>7f0080ff</color><scale>0.6</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon></IconStyle><LabelStyle><scale>0</scale></LabelStyle><ListStyle></ListStyle></Style><StyleMap id="msn_orange"><Pair><key>normal</key><styleUrl>#sn_orange</styleUrl></Pair><Pair><key>highlight</key><styleUrl>#sh_orange</styleUrl></Pair></StyleMap><Style id="sn_yellow"><IconStyle><color>7f00ffff</color><scale>0.5</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon></IconStyle><LabelStyle><scale>0</scale></LabelStyle><ListStyle></ListStyle></Style><Style id="sh_yellow"><IconStyle><color>7f00ffff</color><scale>0.6</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon></IconStyle><LabelStyle><scale>0</scale></LabelStyle><ListStyle></ListStyle></Style><StyleMap id="msn_yellow"><Pair><key>normal</key><styleUrl>#sn_yellow</styleUrl></Pair><Pair><key>highlight</key><styleUrl>#sh_yellow</styleUrl></Pair></StyleMap><Style id="sn_green"><IconStyle><color>7f00ff00</color><scale>0.5</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon></IconStyle><LabelStyle><scale>0</scale></LabelStyle><ListStyle></ListStyle></Style><Style id="sh_green"><IconStyle><color>7f00ff00</color><scale>0.6</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon></IconStyle><LabelStyle><scale>0</scale></LabelStyle><ListStyle></ListStyle></Style><StyleMap id="msn_green"><Pair><key>normal</key><styleUrl>#sn_green</styleUrl></Pair><Pair><key>highlight</key><styleUrl>#sh_green</styleUrl></Pair></StyleMap>';
    for (var type in data) {
      kml += "<Folder><name>";
      kml += type;
      kml += "</name><open>0</open>";
      data[type].forEach(function(r) {
        kml += "<Placemark><name></name><description></description><LookAt><longitude>" + r.lonlat.lon + "</longitude><latitude>" + r.lonlat.lat + "</latitude><altitude>0</altitude><heading>0</heading><tilt>0</tilt><range>1000.000000</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode></LookAt><styleUrl>#msn_" + r.color + "</styleUrl><Point><gx:drawOrder>1</gx:drawOrder><coordinates>" + r.lonlat.lon + "," + r.lonlat.lat + ",0</coordinates></Point></Placemark>";
      });
      kml += "</Folder>";
    }
    kml += "</Document></kml>";
    var element = document.createElement("a");
    element.style.display = "none";
    element.setAttribute("href", encodeURI("data:text/plain," + kml));
    element.setAttribute("download", t + "s_" + start + ".kml");
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    if (finished == false) {
      window.setTimeout(function() {
        WMEURMPT.exportKML_URMPs(t, button, start);
      });
    }
  };
  WMEURMPT.initialiseURT = function() {
    WMEURMPT.initManagedArea();
    var addon = WMEURMPT.createElement("section", "urt-addon");
    var divpbi = WMEURMPT.createElement("div", "urt-progressBarInfo");
    divpbi.className = "urt-progressBarInfo";
    var elt = WMEURMPT.createElement("div", "urt-progressBar");
    elt.style.width = "100%";
    elt.style.display = "none";
    elt.innerHTML = '<div class="urt-progressBarBG"></div><span class="urt-progressBarFG">100%</span>';
    divpbi.appendChild(elt);
    elt = WMEURMPT.createElement("div", "urt-info");
    divpbi.appendChild(elt);
    addon.appendChild(divpbi);
    var section = WMEURMPT.createElement("p", "urt-main-title");
    section.style.paddingTop = "0px";
    section.style.marginTop = "-15px";
    section.style.textIndent = "8px";
    var title = '<b><a target="_blank" href="https://greasyfork.org/fr/scripts/1776-wme-ur-mp-tracking"><u>UR-MP Tracking</u></a> <a target="_blank" href="https://www.waze.com/forum/viewtopic.php?f=68&t=91786">Fr</a> <a target="_blank" href="https://www.waze.com/forum/viewtopic.php?f=819&t=125216">En</a> </b> v' + WMEURMPT.urmpt_version + '<span style="padding-left: 20px;"><a href="#" id="urmpt-onoff"><img class="urt-chkbox" src="data:image/png;base64,' + (WMEURMPT.isEnabled ? WMEURMPT.icon_checked : 
    WMEURMPT.icon_unchecked) + '" /></a></span>';
    section.innerHTML = title;
    if (WMEURMPT.displayLegend) {
      section.innerHTML += '<img id="urt-close-legend" style="display: block; position: relative; left: 5px; top: 10px; float: right; z-index: 99; width: 16px; height: 16px;" src="data:image/png;base64,' + WMEURMPT.icon_delete + '" /><div id="urt-legend" ><table class="urt-table"><tr><td class="urt-bg-selected">Last visited</td><td>Visited</td></tr><tr><td class="urt-bg-ifollow">I follow</td><td class="urt-bg-highlighted">Never visited</td></tr></table></div>';
    }
    addon.appendChild(section);
    var quickOptions = WMEURMPT.createElement("span", "urmpt-qoptions");
    var qohtml = "";
    qohtml = '<font style="font-size: smaller; font-weight: 600;">Quick options:</font><hr style="margin: 0px;" />';
    qohtml += '<table style="border: 0px; width: 100%;"><tr>';
    qohtml += '<td style="width: 50%;">';
    qohtml += '<a href="#" id="urmpt-donoff"><img class="urt-chkbox" src="data:image/png;base64,' + (WMEURMPT.isComputeDistances ? WMEURMPT.icon_checked : WMEURMPT.icon_unchecked) + '" /></a>Distances<br/>';
    qohtml += '<a href="#" id="urmpt-asonoff"><img class="urt-chkbox" src="data:image/png;base64,' + (WMEURMPT.isAutoScan ? WMEURMPT.icon_checked : WMEURMPT.icon_unchecked) + '" /></a>Auto scan';
    qohtml += "</td><td>";
    qohtml += '<a href="#" id="urmpt-suronoff"><img class="urt-chkbox" src="data:image/png;base64,' + (WMEURMPT.scanUR ? WMEURMPT.icon_checked : WMEURMPT.icon_unchecked) + '" /></a>Scan UR<br/>';
    qohtml += '<a href="#" id="urmpt-smponoff"><img class="urt-chkbox" src="data:image/png;base64,' + (WMEURMPT.scanMP ? WMEURMPT.icon_checked : WMEURMPT.icon_unchecked) + '" /></a>Scan MP<br/>';
    qohtml += '<a href="#" id="urmpt-smconoff"><img class="urt-chkbox" src="data:image/png;base64,' + (WMEURMPT.scanMC ? WMEURMPT.icon_checked : WMEURMPT.icon_unchecked) + '" /></a>Scan MC';
    qohtml += "</td>";
    qohtml += "</tr></table>";
    quickOptions.innerHTML = qohtml;
    addon.appendChild(quickOptions);
    var generalMenu = WMEURMPT.createElement("center");
    generalMenu.style.marginBottom = "10px";
    addon.appendChild(generalMenu);
    var elt;
    var scanGroup = WMEURMPT.createElement("div", "urt-a-scanGroup");
    generalMenu.appendChild(scanGroup);
    var urmpTabs = WMEURMPT.createElement("ul", "urmp-tabs");
    addon.appendChild(urmpTabs);
    urmpTabs.className = "nav nav-tabs";
    urmpTabs.innerHTML = '<li class="active" style="width: 16.5%; text-align: center; height: 30px;"><a id="urmp-tabstitle-ur" style="height: 30px;" href="#urmp-tabs-ur" data-toggle="tab">UR</a></li>';
    urmpTabs.innerHTML += '<li class="" style="width: 16.5%; text-align: center; height: 30px;"><a id="urmp-tabstitle-mp" style="height: 30px;" href="#urmp-tabs-mp" data-toggle="tab">MP</a></li>';
    urmpTabs.innerHTML += '<li class="" style="width: 16.5%; text-align: center; height: 30px;"><a id="urmp-tabstitle-mc" style="height: 30px;" href="#urmp-tabs-mc" data-toggle="tab">MC</a></li>';
    urmpTabs.innerHTML += '<li class="" style="width: 16.5%; text-align: center; height: 30px;"><a class="fa fa-bar-chart icon-bar-chart" id="urmp-tabstitle-stat" style="height: 30px;" href="#urmp-tabs-os" data-toggle="tab"></a></li>';
    urmpTabs.innerHTML += '<li class="" style="width: 16.5%; text-align: center; height: 30px;"><a class="fa fa-pencil-square-o" style="height: 30px;" href="#urmp-tabs-areas" data-toggle="tab"></a></li>';
    urmpTabs.innerHTML += '<li class="" style="width: 16.5%; text-align: center; height: 30px;"><a class="fa fa-gear" style="height: 30px;" href="#urmp-tabs-settings" data-toggle="tab"></a></li>';
    window.setTimeout(WMEURMPT.connectStatHandler);
    window.setTimeout(WMEURMPT.connectURTabHandler);
    window.setTimeout(WMEURMPT.connectMPTabHandler);
    window.setTimeout(WMEURMPT.connectMCTabHandler);
    var urmp_tab_content = WMEURMPT.createElement("div", "urmpt-tab-content");
    urmp_tab_content.className = "tab-content";
    urmp_tab_content.style.paddingBottom = "10px";
    urmp_tab_content.style.paddingTop = "10px";
    urmp_tab_content.style.paddingLeft = "5px";
    urmp_tab_content.style.paddingRight = "5px";
    addon.appendChild(urmp_tab_content);
    var ur_tab_pane = WMEURMPT.createElement("section", "urmp-tabs-ur");
    ur_tab_pane.className = "tab-pane active";
    urmp_tab_content.appendChild(ur_tab_pane);
    var urMenu = WMEURMPT.createElement("center");
    ur_tab_pane.appendChild(urMenu);
    elt = WMEURMPT.createElement("a", "urt-a-markallvisited");
    elt.innerHTML = "Mark all as visited";
    elt.href = "#";
    elt.onclick = WMEURMPT.markAllURAsVisited;
    urMenu.appendChild(elt);
    elt = WMEURMPT.createElement("span");
    elt.innerHTML = "|";
    urMenu.appendChild(elt);
    elt = WMEURMPT.createElement("a", "urt-a-clearAll");
    elt.innerHTML = "Clear all";
    elt.href = "#";
    elt.onclick = WMEURMPT.clearAllUR;
    urMenu.appendChild(elt);
    elt = WMEURMPT.createElement("span");
    elt.innerHTML = "|";
    urMenu.appendChild(elt);
    elt = WMEURMPT.createElement("a", "urt-a-export");
    elt.href = "#";
    elt.innerHTML = '<img src="data:image/png;base64,' + WMEURMPT.icon_export + '" width="14px" height="14px" />';
    elt.onclick = function() {
      var that = this;
      WMEURMPT.exportURMPs("UR", that);
    };
    urMenu.appendChild(elt);
    elt = WMEURMPT.createElement("span");
    elt.innerHTML = "|";
    urMenu.appendChild(elt);
    elt = WMEURMPT.createElement("a", "urt-a-export-kml");
    elt.href = "#";
    elt.innerHTML = '<img src="data:image/png;base64,' + WMEURMPT.icon_ge + '" height="14px" />';
    elt.onclick = function() {
      var that = this;
      WMEURMPT.exportKML_URMPs("UR", that, 0);
      return false;
    };
    urMenu.appendChild(elt);
    elt = WMEURMPT.createElement("div");
    var content = '<ul class="urt-filter-list">';
    content += '<li><input type="checkbox" id="urt-checkbox-filterInvert"><b>Invert filters</b></li>';
    content += '<li title="Show URs I have already commented"><input type="checkbox" id="urt-checkbox-filterHideWithoutCommentFromMe"> Hide without comment from me</li>';
    content += '<li title="Show URs with last comment from Reporter"><input type="checkbox" id="urt-checkbox-filterHideLastCommentFromEditor"> Hide last comment from an editor</li>';
    content += '<li title="Show only URs from 0 to n comments"><input type="checkbox" id="urt-checkbox-filterHideWithCommentCount"> Hide with more than <input size="2" maxlength="2" type="text" id="urt-filterHideWithCommentCount" value="' + WMEURMPT.currentURCommentsCount + '"></input> comment(s)</li>';
    content += '<li title="Show URs with unread comment(s)"><input type="checkbox" id="urt-checkbox-filterHideNoNewComment"> Hide no new comment</li>';
    if (WMEURMPT.uam) {
      content += '<li title="Show URs in my managed areas"><input type="checkbox" id="urt-checkbox-filterHideOutOfMyManagedArea"> Hide out of my managed area</li>';
    }
    content += '<li title="Show URs I have never seen"><input type="checkbox" id="urt-checkbox-filterHideVisited"> Hide visited</li>';
    if (WMEURMPT.ul >= WMEURMPT.rl4cp) {
      content += '<li title="Show only pendings URs"><input type="checkbox" id="urt-checkbox-filterHideClosed"> Hide closed</li>';
    }
    content += '<li title="Show white listed URs"><input type="checkbox" id="urt-checkbox-filterHideBlacklisted"> Hide black listed</li>';
    content += '<li title="Show black listed URs"><input type="checkbox" id="urt-checkbox-filterHideWhitelisted"> Hide white listed</li>';
    content += '<li title="Show all but General Error"><input type="checkbox" id="urt-checkbox-filterHideGE"> Hide General Error</li>';
    content += '<li title="Show UR if description contains keyword"><input type="checkbox" id="urt-checkbox-filterHideNotKW"> Description keyword: <input type="text" id="urt-filterKW" value="' + WMEURMPT.currentURKeyWord + '"></input></li>';
    content += '<li title="Show only nth first URs"><input type="checkbox" id="urt-checkbox-filterHideLimitTo"> Limit to: <input type="text" id="urt-filterLimitTo" value="' + WMEURMPT.currentURLimitTo + '"></input></li>';
    content += '<li title="Show tagged URs"><input type="checkbox" id="urt-checkbox-filterHideTagged"> Hide tagged</li>';
    content += '<li title="Show only one type"><input type="checkbox" id="urt-checkbox-filterHideOnlyType"> Hide all but: <select style="height: 25px" id="urt-filterOnlyType">';
    var URTypes = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 21, 22, 23];
    for (var i = 0;i < URTypes.length;i++) {
      content += '<option value="' + URTypes[i] + '"' + (WMEURMPT.currentUROnlyType == URTypes[i] ? " selected" : "") + ">" + WMEURMPT.getFullURTypeFromType(URTypes[i]) + "</option>";
    }
    content += "</select></li>";
    content += '<li title="Show only inside area"><input type="checkbox" id="urt-checkbox-filterHideOnlyArea"> Hide all but: <select style="height: 25px" id="urt-filterOnlyArea">';
    content += "</select></li>";
    content += "</ul>";
    ur_tab_pane.appendChild(elt);
    var pannel = new WMEURMPT.PopupPannel("FilterUR", "100%", "100%", "#93c4d3");
    pannel.setTriggerInnerHTML("Filters");
    pannel.setContentsInnerHTML(content);
    pannel.installInside(elt);
    elt = WMEURMPT.createElement("div", "urt-list");
    ur_tab_pane.appendChild(elt);
    var mp_tab_pane = WMEURMPT.createElement("section", "urmp-tabs-mp");
    mp_tab_pane.className = "tab-pane";
    urmp_tab_content.appendChild(mp_tab_pane);
    var mpMenu = WMEURMPT.createElement("center");
    mp_tab_pane.appendChild(mpMenu);
    elt = WMEURMPT.createElement("a", "mpt-a-markallvisited");
    elt.innerHTML = "Mark all as visited";
    elt.href = "#";
    elt.onclick = WMEURMPT.markAllMPAsVisited;
    mpMenu.appendChild(elt);
    elt = WMEURMPT.createElement("span");
    elt.innerHTML = "|";
    mpMenu.appendChild(elt);
    elt = WMEURMPT.createElement("a", "mpt-a-clearAll");
    elt.innerHTML = "Clear all";
    elt.href = "#";
    elt.onclick = WMEURMPT.clearAllMP;
    mpMenu.appendChild(elt);
    elt = WMEURMPT.createElement("span");
    elt.innerHTML = "|";
    mpMenu.appendChild(elt);
    elt = WMEURMPT.createElement("a", "mpt-a-export");
    elt.href = "#";
    elt.innerHTML = '<img src="data:image/png;base64,' + WMEURMPT.icon_export + '" width="14px" height="14px" />';
    elt.onclick = function() {
      var that = this;
      WMEURMPT.exportURMPs("MP", that);
    };
    mpMenu.appendChild(elt);
    elt = WMEURMPT.createElement("span");
    elt.innerHTML = "|";
    mpMenu.appendChild(elt);
    elt = WMEURMPT.createElement("a", "mpt-a-export-kml");
    elt.href = "#";
    elt.innerHTML = '<img src="data:image/png;base64,' + WMEURMPT.icon_ge + '" height="14px" />';
    elt.onclick = function() {
      var that = this;
      WMEURMPT.exportKML_URMPs("MP", that, 0);
      return false;
    };
    mpMenu.appendChild(elt);
    elt = WMEURMPT.createElement("div");
    elt.className = "mpt-filter-list";
    content = '<ul class="urt-filter-list">';
    if (WMEURMPT.uam) {
      content += '<li title="Show MPs in my managed areas"><input type="checkbox" id="mpt-checkbox-filterHideOutOfMyManagedArea"> Hide out of my managed area</li>';
    }
    content += '<li title="Show MPs I have never seen"><input type="checkbox" id="mpt-checkbox-filterHideVisited"> Hide visited</li>';
    if (WMEURMPT.ul >= WMEURMPT.rl4cp) {
      content += '<li title="Show only pendings MPs"><input type="checkbox" id="mpt-checkbox-filterHideClosed"> Hide closed</li>';
    }
    content += '<li title="Show white listed MPs"><input type="checkbox" id="mpt-checkbox-filterHideBlacklisted"> Hide black listed</li>';
    content += '<li title="Show black listed MPs"><input type="checkbox" id="mpt-checkbox-filterHideWhitelisted"> Hide white listed</li>';
    content += '<li title="Show only nth first MPs"><input type="checkbox" id="mpt-checkbox-filterHideLimitTo"> Limit to: <input type="text" id="mpt-filterLimitTo" value="' + WMEURMPT.currentMPLimitTo + '"></input></li>';
    content += '<li title="Show only one type"><input type="checkbox" id="mpt-checkbox-filterHideOnlyType"> Hide all but: <select style="height: 25px" id="mpt-filterOnlyType">';
    var MPTypes = [101, 102, 103, 104, 105, 106, 200];
    if (document.location.host.indexOf("editor-beta") != -1) {
      MPTypes.push(300);
    }
    for (var i = 0;i < MPTypes.length;i++) {
      content += '<option value="' + MPTypes[i] + '"' + (WMEURMPT.currentMPOnlyType == MPTypes[i] ? " selected" : "") + ">" + WMEURMPT.getFullMPTypeFromType(MPTypes[i]) + "</option>";
    }
    content += "</select></li>";
    content += '<li title="Show only one area"><input type="checkbox" id="mpt-checkbox-filterHideOnlyArea"> Hide all but: <select style="height: 25px" id="mpt-filterOnlyArea">';
    content += "</select></li>";
    content += "</ul>";
    mp_tab_pane.appendChild(elt);
    var pannelMP = new WMEURMPT.PopupPannel("FilterMP", "100%", "100%", "#93c4d3");
    pannelMP.setTriggerInnerHTML("Filters");
    pannelMP.setContentsInnerHTML(content);
    pannelMP.installInside(elt);
    elt = WMEURMPT.createElement("div", "mpt-list");
    mp_tab_pane.appendChild(elt);
    var mc_tab_pane = WMEURMPT.createElement("section", "urmp-tabs-mc");
    mc_tab_pane.className = "tab-pane";
    urmp_tab_content.appendChild(mc_tab_pane);
    var mcMenu = WMEURMPT.createElement("center");
    mc_tab_pane.appendChild(mcMenu);
    elt = WMEURMPT.createElement("a", "mct-a-markallvisited");
    elt.innerHTML = "Mark all as visited";
    elt.href = "#";
    elt.onclick = WMEURMPT.markAllURAsVisited;
    mcMenu.appendChild(elt);
    elt = WMEURMPT.createElement("span");
    elt.innerHTML = "|";
    mcMenu.appendChild(elt);
    elt = WMEURMPT.createElement("a", "mct-a-clearAll");
    elt.innerHTML = "Clear all";
    elt.href = "#";
    elt.onclick = WMEURMPT.clearAllMC;
    mcMenu.appendChild(elt);
    elt = WMEURMPT.createElement("span");
    elt.innerHTML = "|";
    mcMenu.appendChild(elt);
    elt = WMEURMPT.createElement("div");
    var content = '<ul class="urt-filter-list">';
    if (WMEURMPT.uam) {
      content += '<li title="Show MCs in my managed areas"><input type="checkbox" id="mct-checkbox-filterHideOutOfMyManagedArea"> Hide out of my managed area</li>';
    }
    content += '<li title="Show MCs I have never seen"><input type="checkbox" id="mct-checkbox-filterHideVisited"> Hide visited</li>';
    content += '<li title="Show white listed MCs"><input type="checkbox" id="mct-checkbox-filterHideBlacklisted"> Hide black listed</li>';
    content += '<li title="Show black listed MCs"><input type="checkbox" id="mct-checkbox-filterHideWhitelisted"> Hide white listed</li>';
    content += '<li title="Show only nth first MCs"><input type="checkbox" id="mct-checkbox-filterHideLimitTo"> Limit to: <input type="text" id="mct-filterLimitTo" value="' + WMEURMPT.currentMCLimitTo + '"></input></li>';
    content += '<li title="Show MC if subject or body contains keyword"><input type="checkbox" id="mct-checkbox-filterHideNotKW"> Subject/Body keyword: <input type="text" id="mct-filterKW" value="' + WMEURMPT.currentMCKeyWord + '"></input></li>';
    content += '<li title="Show only inside area"><input type="checkbox" id="mct-checkbox-filterHideOnlyArea"> Hide all but: <select style="height: 25px" id="mct-filterOnlyArea">';
    content += "</select></li>";
    content += "</ul>";
    mc_tab_pane.appendChild(elt);
    var pannel = new WMEURMPT.PopupPannel("FilterMC", "100%", "100%", "#93c4d3");
    pannel.setTriggerInnerHTML("Filters");
    pannel.setContentsInnerHTML(content);
    pannel.installInside(elt);
    elt = WMEURMPT.createElement("div", "mct-list");
    mc_tab_pane.appendChild(elt);
    var os_tab_pane = WMEURMPT.createElement("section", "urmp-tabs-os");
    os_tab_pane.className = "tab-pane";
    urmp_tab_content.appendChild(os_tab_pane);
    var divStats = WMEURMPT.createElement("div", "urmpt-stats");
    os_tab_pane.appendChild(divStats);
    var areas_tab_pane = WMEURMPT.createElement("section", "urmp-tabs-areas");
    areas_tab_pane.className = "tab-pane";
    urmp_tab_content.appendChild(areas_tab_pane);
    if (WMEURMPT.ul >= 8 || WMEURMPT.me.isCountryManager()) {
      var divCM = WMEURMPT.createElement("div");
      divCM.innerHTML = "Add country(ies) or subset(s) to scan list.<br/>";
      var divInput = WMEURMPT.createElement("div");
      divInput.style.whiteSpace = "nowrap";
      var countryList = WMEURMPT.createElement("select", "urmpt-countryList");
      countryList.style.width = "calc(100% - 40px)";
      divInput.appendChild(countryList);
      window.setTimeout(WMEURMPT.initCountryList);
      var addButton = WMEURMPT.createElement("button");
      addButton.innerHTML = "Add";
      addButton.onclick = WMEURMPT.addCountryToAreaList;
      divInput.appendChild(addButton);
      divCM.appendChild(divInput);
      divCM.insertAdjacentHTML("beforeend", "<br/>Your country scan list:<br/>");
      var divCountryScanList = WMEURMPT.createElement("div", "urmpt-countryscanlist");
      divCM.appendChild(divCountryScanList);
      areas_tab_pane.appendChild(divCM);
      areas_tab_pane.appendChild(WMEURMPT.createElement("hr"));
    }
    var divCA = WMEURMPT.createElement("div");
    var divAddCA = WMEURMPT.createElement("div");
    divAddCA.style.display = "none";
    divAddCA.style.paddingLeft = "10px";
    var elAddCAmenu = WMEURMPT.createElement("a");
    elAddCAmenu.innerHTML = "\u25b6 Add custom area";
    elAddCAmenu.href = "#";
    elAddCAmenu.onclick = function() {
      if (divAddCA.style.display == "none") {
        divAddCA.style.display = "block";
        this.innerHTML = "\u25bc Add custom area";
      } else {
        divAddCA.style.display = "none";
        this.innerHTML = "\u25b6 Add custom area";
      }
    };
    var inputFromPOI = WMEURMPT.createElement("div");
    inputFromPOI.innerHTML = "FROM AN UNSAVED POI AREA";
    var inputFromPOI_name = WMEURMPT.createElement("div");
    inputFromPOI_name.innerHTML = 'Give a name to your area:<input type="text" id="urmpt-areas-frompoi-name" />';
    var inputFromPOI_button = WMEURMPT.createElement("div");
    inputFromPOI_button.innerHTML = 'Then, <a href="#" id="urmpt-areas-frompoi-add"/>add</a>';
    inputFromPOI.appendChild(inputFromPOI_name);
    inputFromPOI.appendChild(inputFromPOI_button);
    divAddCA.appendChild(inputFromPOI);
    divAddCA.appendChild(WMEURMPT.createElement("hr"));
    var inputFromLL = WMEURMPT.createElement("div");
    inputFromLL.innerHTML = "FROM LON/LAT BOUNDING BOX";
    var input1 = WMEURMPT.createElement("div");
    input1.innerHTML = 'Fill lon/lat top left corner<br/>or <a href="#" id="urmpt-areas-fill-tl">get it from your top left screen</a><br/>lon:<input type="text" size="10" maxlentgh="10" id="urmpt-areas-tl-lon" />lat:<input type="text" size="10" maxlentgh="10" id="urmpt-areas-tl-lat" />';
    var input2 = WMEURMPT.createElement("div");
    input2.innerHTML = 'Fill lon/lat bottom right corner<br/>or <a href="#" id="urmpt-areas-fill-br">get it from your bottom right screen</a><br/>lon:<input type="text" size="10" maxlentgh="10" id="urmpt-areas-br-lon" />lat:<input type="text" size="10" maxlentgh="10" id="urmpt-areas-br-lat" />';
    var input3 = WMEURMPT.createElement("div");
    input3.innerHTML = 'Give a name to your area:<input type="text" id="urmpt-areas-name" />';
    var input4 = WMEURMPT.createElement("div");
    input4.innerHTML = 'Then, <a href="#" id="urmpt-areas-name-add"/>add</a>';
    inputFromLL.appendChild(input1);
    inputFromLL.appendChild(input2);
    inputFromLL.appendChild(input3);
    inputFromLL.appendChild(input4);
    divAddCA.appendChild(inputFromLL);
    divAddCA.appendChild(WMEURMPT.createElement("hr"));
    var inputFromWKT = WMEURMPT.createElement("div");
    inputFromWKT.innerHTML = "FROM WKT";
    var inputFromWKTFile = WMEURMPT.createElement("div");
    inputFromWKTFile.innerHTML = '<input type="file" id="urmpt-areas-wktfile" name="files[]" />';
    var inputFromWKTName = WMEURMPT.createElement("div");
    inputFromWKTName.innerHTML = 'Give a name to your area:<input type="text" id="urmpt-areas-wktfile-name" />';
    var inputFromWKTAdd = WMEURMPT.createElement("div");
    inputFromWKTAdd.innerHTML = 'Then, <a href="#" id="urmpt-areas-wktfile-add"/>add</a>';
    inputFromWKT.appendChild(inputFromWKTName);
    inputFromWKT.appendChild(inputFromWKTFile);
    inputFromWKT.appendChild(inputFromWKTAdd);
    divAddCA.appendChild(inputFromWKT);
    divAddCA.appendChild(WMEURMPT.createElement("hr"));
    var inputFromJSON = WMEURMPT.createElement("div");
    inputFromJSON.innerHTML = "FROM JSON";
    var inputFromJSONFile = WMEURMPT.createElement("div");
    inputFromJSONFile.innerHTML = '<input type="file" id="urmpt-areas-jsonfile" name="files[]" />';
    var inputFromJSONAdd = WMEURMPT.createElement("div");
    inputFromJSONAdd.innerHTML = 'Then, <a href="#" id="urmpt-areas-jsonfile-add"/>add</a>';
    inputFromJSON.appendChild(inputFromJSONFile);
    inputFromJSON.appendChild(inputFromJSONAdd);
    divAddCA.appendChild(inputFromJSON);
    divCA.appendChild(elAddCAmenu);
    divCA.appendChild(divAddCA);
    divCA.insertAdjacentHTML("beforeend", "<br/>Your custom area scan list:<br/>");
    var divCustomAreaScanList = WMEURMPT.createElement("div", "urmpt-custom-scan-list");
    divCA.appendChild(divCustomAreaScanList);
    areas_tab_pane.appendChild(divCA);
    var settings_tab_pane = WMEURMPT.createElement("section", "urmp-tabs-settings");
    settings_tab_pane.className = "tab-pane";
    urmp_tab_content.appendChild(settings_tab_pane);
    var ur_description_column_width = WMEURMPT.createElement("span");
    ur_description_column_width.innerHTML = 'UR description column width: <input style="height:20px" type="text" size="3" id="urmpt-setting-urdescriptionwidth" value="' + WMEURMPT.URDescriptionMaxLength + '"/><br>';
    settings_tab_pane.appendChild(ur_description_column_width);
    var mp_description_column_width = WMEURMPT.createElement("span");
    mp_description_column_width.innerHTML = 'MP description column width: <input style="height:20px" type="text" size="3" id="urmpt-setting-mpdescriptionwidth" value="' + WMEURMPT.MPDescriptionMaxLength + '"/><br>';
    settings_tab_pane.appendChild(mp_description_column_width);
    var mc_subject_column_width = WMEURMPT.createElement("span");
    mc_subject_column_width.innerHTML = 'MC subject column width: <input style="height:20px" type="text" size="3" id="urmpt-setting-mcsubjectwidth" value="' + WMEURMPT.MCSubjectMaxLength + '"/><br>';
    settings_tab_pane.appendChild(mc_subject_column_width);
    var mc_body_column_width = WMEURMPT.createElement("span");
    mc_body_column_width.innerHTML = 'MC body column width: <input style="height:20px" type="text" size="3" id="urmpt-setting-mcbodywidth" value="' + WMEURMPT.MCBodyMaxLength + '"/><br>';
    settings_tab_pane.appendChild(mc_body_column_width);
    var ur_tagged_list_span = WMEURMPT.createElement("span");
    ur_tagged_list_span.innerHTML = 'UR Tag keywords: <input style="height:20px;width:100%;" type="text" id="urmpt-setting-urtaglist" value="' + WMEURMPT.taggedURList.join(";") + '"/>';
    settings_tab_pane.appendChild(ur_tagged_list_span);
    var ur_ageColumn_span = WMEURMPT.createElement("span");
    ur_ageColumn_span.innerHTML = '<input type="checkbox" id="urmpt-setting-uragecolislastcomment" ' + (WMEURMPT.URAgeColIsLastComment ? "checked " : "") + "/> UR age column is last comment age";
    settings_tab_pane.appendChild(ur_ageColumn_span);
    window.setTimeout(WMEURMPT.setupCAEvents);
    window.setTimeout(WMEURMPT.updateScanGroup);
    var userTabs = WMEURMPT.getId("user-tabs");
    var userInfo = WMEURMPT.getId("user-info");
    var sidePanelPrefs = WMEURMPT.getId("sidepanel-prefs");
    var navTabs = WMEURMPT.getElementsByClassName("nav-tabs", userTabs)[0];
    var tabContent = sidePanelPrefs.parentNode;
    newtab = WMEURMPT.createElement("li");
    newtab.innerHTML = '<a title="UR-MP Tracking" href="#sidepanel-urt" data-toggle="tab"><span class="fa fa-map-marker icon-map-marker" style="color: red;"></span></a>';
    navTabs.appendChild(newtab);
    addon.id = "sidepanel-urt";
    addon.className = "tab-pane";
    addon.style.marginLeft = "-10px";
    tabContent.appendChild(addon);
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideClosed && WMEURMPT.ul >= WMEURMPT.rl4cp) {
      WMEURMPT.getId("urt-checkbox-filterHideClosed").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideWithoutCommentFromMe) {
      WMEURMPT.getId("urt-checkbox-filterHideWithoutCommentFromMe").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideWithCommentCount) {
      WMEURMPT.getId("urt-checkbox-filterHideWithCommentCount").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideNoNewComment) {
      WMEURMPT.getId("urt-checkbox-filterHideNoNewComment").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideOutOfMyManagedArea && WMEURMPT.uam) {
      WMEURMPT.getId("urt-checkbox-filterHideOutOfMyManagedArea").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideVisited) {
      WMEURMPT.getId("urt-checkbox-filterHideVisited").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideBlacklisted) {
      WMEURMPT.getId("urt-checkbox-filterHideBlacklisted").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideWhitelisted) {
      WMEURMPT.getId("urt-checkbox-filterHideWhitelisted").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideGE) {
      WMEURMPT.getId("urt-checkbox-filterHideGE").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideNotKW) {
      WMEURMPT.getId("urt-checkbox-filterHideNotKW").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideLimitTo) {
      WMEURMPT.getId("urt-checkbox-filterHideLimitTo").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideType) {
      WMEURMPT.getId("urt-checkbox-filterHideOnlyType").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideArea) {
      WMEURMPT.getId("urt-checkbox-filterHideOnlyArea").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideLastCommentFromEditor) {
      WMEURMPT.getId("urt-checkbox-filterHideLastCommentFromEditor").checked = true;
    }
    if (WMEURMPT.currentURFilter & WMEURMPT.URFilterList.hideTagged) {
      WMEURMPT.getId("urt-checkbox-filterHideTagged").checked = true;
    }
    WMEURMPT.getId("urt-checkbox-filterInvert").onclick = WMEURMPT.updateIHMFromURList;
    if (WMEURMPT.ul >= WMEURMPT.rl4cp) {
      WMEURMPT.getId("urt-checkbox-filterHideClosed").onclick = WMEURMPT.toggleURFilterHideClosed;
    }
    WMEURMPT.getId("urt-checkbox-filterHideWithoutCommentFromMe").onclick = WMEURMPT.toggleURFilterHideWithoutCommentFromMe;
    WMEURMPT.getId("urt-checkbox-filterHideWithCommentCount").onclick = WMEURMPT.toggleURFilterHideWithCommentCount;
    WMEURMPT.getId("urt-checkbox-filterHideNoNewComment").onclick = WMEURMPT.toggleURFilterHideNoNewComment;
    if (WMEURMPT.uam) {
      WMEURMPT.getId("urt-checkbox-filterHideOutOfMyManagedArea").onclick = WMEURMPT.toggleURFilterHideOutOfMyManagedArea;
    }
    WMEURMPT.getId("urt-checkbox-filterHideVisited").onclick = WMEURMPT.toggleURFilterHideVisited;
    WMEURMPT.getId("urt-checkbox-filterHideBlacklisted").onclick = WMEURMPT.toggleURFilterHideBlacklisted;
    WMEURMPT.getId("urt-checkbox-filterHideWhitelisted").onclick = WMEURMPT.toggleURFilterHideWhitelisted;
    WMEURMPT.getId("urt-checkbox-filterHideGE").onclick = WMEURMPT.toggleURFilterHideGE;
    WMEURMPT.getId("urt-checkbox-filterHideNotKW").onclick = WMEURMPT.toggleURFilterHideNotKW;
    WMEURMPT.getId("urt-checkbox-filterHideLimitTo").onclick = WMEURMPT.toggleURFilterHideLimitTo;
    WMEURMPT.getId("urt-checkbox-filterHideOnlyType").onclick = WMEURMPT.toggleURFilterHideOnlyType;
    WMEURMPT.getId("urt-checkbox-filterHideOnlyArea").onclick = WMEURMPT.toggleURFilterHideOnlyArea;
    WMEURMPT.getId("urt-filterHideWithCommentCount").onkeypress = WMEURMPT.URCommentsCountChanged;
    WMEURMPT.getId("urt-filterHideWithCommentCount").onpaste = WMEURMPT.URCommentsCountChanged;
    WMEURMPT.getId("urt-filterHideWithCommentCount").oninput = WMEURMPT.URCommentsCountChanged;
    WMEURMPT.getId("urt-filterKW").onkeypress = WMEURMPT.URKeywordChanged;
    WMEURMPT.getId("urt-filterKW").onpaste = WMEURMPT.URKeywordChanged;
    WMEURMPT.getId("urt-filterKW").oninput = WMEURMPT.URKeywordChanged;
    WMEURMPT.getId("urt-filterLimitTo").onkeypress = WMEURMPT.URLimitToChanged;
    WMEURMPT.getId("urt-filterLimitTo").onpaste = WMEURMPT.URLimitToChanged;
    WMEURMPT.getId("urt-filterLimitTo").oninput = WMEURMPT.URLimitToChanged;
    WMEURMPT.getId("urt-filterOnlyType").onchange = WMEURMPT.UROnlyTypeChanged;
    WMEURMPT.getId("urt-filterOnlyArea").onchange = WMEURMPT.UROnlyAreaChanged;
    WMEURMPT.getId("urt-checkbox-filterHideLastCommentFromEditor").onclick = WMEURMPT.toggleURFilterHideLastCommentFromEditor;
    WMEURMPT.getId("urt-checkbox-filterHideTagged").onclick = WMEURMPT.toggleURFilterHideTagged;
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideClosed && WMEURMPT.ul >= WMEURMPT.rl4cp) {
      WMEURMPT.getId("mpt-checkbox-filterHideClosed").checked = true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideOutOfMyManagedArea && WMEURMPT.uam) {
      WMEURMPT.getId("mpt-checkbox-filterHideOutOfMyManagedArea").checked = true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideVisited) {
      WMEURMPT.getId("mpt-checkbox-filterHideVisited").checked = true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideBlacklisted) {
      WMEURMPT.getId("mpt-checkbox-filterHideBlacklisted").checked = true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideWhitelisted) {
      WMEURMPT.getId("mpt-checkbox-filterHideWhitelisted").checked = true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideLimitTo) {
      WMEURMPT.getId("mpt-checkbox-filterHideLimitTo").checked = true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideType) {
      WMEURMPT.getId("mpt-checkbox-filterHideOnlyType").checked = true;
    }
    if (WMEURMPT.currentMPFilter & WMEURMPT.MPFilterList.hideArea) {
      WMEURMPT.getId("mpt-checkbox-filterHideOnlyArea").checked = true;
    }
    if (WMEURMPT.ul >= WMEURMPT.rl4cp) {
      WMEURMPT.getId("mpt-checkbox-filterHideClosed").onclick = WMEURMPT.toggleMPFilterHideClosed;
    }
    if (WMEURMPT.uam) {
      WMEURMPT.getId("mpt-checkbox-filterHideOutOfMyManagedArea").onclick = WMEURMPT.toggleMPFilterHideOutOfMyManagedArea;
    }
    WMEURMPT.getId("mpt-checkbox-filterHideVisited").onclick = WMEURMPT.toggleMPFilterHideVisited;
    WMEURMPT.getId("mpt-checkbox-filterHideBlacklisted").onclick = WMEURMPT.toggleMPFilterHideBlacklisted;
    WMEURMPT.getId("mpt-checkbox-filterHideWhitelisted").onclick = WMEURMPT.toggleMPFilterHideWhitelisted;
    WMEURMPT.getId("mpt-checkbox-filterHideLimitTo").onclick = WMEURMPT.toggleMPFilterHideLimitTo;
    WMEURMPT.getId("mpt-checkbox-filterHideOnlyType").onclick = WMEURMPT.toggleMPFilterHideOnlyType;
    WMEURMPT.getId("mpt-checkbox-filterHideOnlyArea").onclick = WMEURMPT.toggleMPFilterHideOnlyArea;
    WMEURMPT.getId("mpt-filterLimitTo").onkeypress = WMEURMPT.MPLimitToChanged;
    WMEURMPT.getId("mpt-filterLimitTo").onpaste = WMEURMPT.MPLimitToChanged;
    WMEURMPT.getId("mpt-filterLimitTo").oninput = WMEURMPT.MPLimitToChanged;
    WMEURMPT.getId("mpt-filterOnlyType").onchange = WMEURMPT.MPOnlyTypeChanged;
    WMEURMPT.getId("mpt-filterOnlyArea").onchange = WMEURMPT.MPOnlyAreaChanged;
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideOutOfMyManagedArea && WMEURMPT.uam) {
      WMEURMPT.getId("mct-checkbox-filterHideOutOfMyManagedArea").checked = true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideVisited) {
      WMEURMPT.getId("mct-checkbox-filterHideVisited").checked = true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideBlacklisted) {
      WMEURMPT.getId("mct-checkbox-filterHideBlacklisted").checked = true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideWhitelisted) {
      WMEURMPT.getId("mct-checkbox-filterHideWhitelisted").checked = true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideNotKW) {
      WMEURMPT.getId("mct-checkbox-filterHideNotKW").checked = true;
    }
    if (WMEURMPT.currentMCFilter & WMEURMPT.MCFilterList.hideLimitTo) {
      WMEURMPT.getId("mct-checkbox-filterHideLimitTo").checked = true;
    }
    if (WMEURMPT.uam) {
      WMEURMPT.getId("mct-checkbox-filterHideOutOfMyManagedArea").onclick = WMEURMPT.toggleMCFilterHideOutOfMyManagedArea;
    }
    WMEURMPT.getId("mct-checkbox-filterHideVisited").onclick = WMEURMPT.toggleMCFilterHideVisited;
    WMEURMPT.getId("mct-checkbox-filterHideBlacklisted").onclick = WMEURMPT.toggleMCFilterHideBlacklisted;
    WMEURMPT.getId("mct-checkbox-filterHideWhitelisted").onclick = WMEURMPT.toggleMCFilterHideWhitelisted;
    WMEURMPT.getId("mct-checkbox-filterHideLimitTo").onclick = WMEURMPT.toggleMCFilterHideLimitTo;
    WMEURMPT.getId("mct-checkbox-filterHideNotKW").onclick = WMEURMPT.toggleMCFilterHideNotKW;
    WMEURMPT.getId("mct-checkbox-filterHideOnlyArea").onclick = WMEURMPT.toggleMCFilterHideOnlyArea;
    WMEURMPT.getId("mct-filterKW").onkeypress = WMEURMPT.MCKeywordChanged;
    WMEURMPT.getId("mct-filterKW").onpaste = WMEURMPT.MCKeywordChanged;
    WMEURMPT.getId("mct-filterKW").oninput = WMEURMPT.MCKeywordChanged;
    WMEURMPT.getId("mct-filterLimitTo").onkeypress = WMEURMPT.MCLimitToChanged;
    WMEURMPT.getId("mct-filterLimitTo").onpaste = WMEURMPT.MCLimitToChanged;
    WMEURMPT.getId("mct-filterLimitTo").oninput = WMEURMPT.MCLimitToChanged;
    WMEURMPT.getId("mct-filterOnlyArea").onchange = WMEURMPT.MCOnlyAreaChanged;
    if (WMEURMPT.displayLegend) {
      WMEURMPT.getId("urt-close-legend").onclick = WMEURMPT.closeLegend;
    }
    WMEURMPT.getId("urmpt-onoff").onclick = WMEURMPT.enableOrDisable;
    WMEURMPT.getId("urmpt-donoff").onclick = WMEURMPT.enableOrDisableDistance;
    WMEURMPT.getId("urmpt-asonoff").onclick = WMEURMPT.enableOrDisableAutoScan;
    WMEURMPT.getId("urmpt-suronoff").onclick = WMEURMPT.enableOrDisableScanUR;
    WMEURMPT.getId("urmpt-smponoff").onclick = WMEURMPT.enableOrDisableScanMP;
    WMEURMPT.getId("urmpt-smconoff").onclick = WMEURMPT.enableOrDisableScanMC;
    WMEURMPT.getId("urmpt-setting-urdescriptionwidth").onkeypress = WMEURMPT.settingsSetURDescriptionWidth;
    WMEURMPT.getId("urmpt-setting-urdescriptionwidth").onpaste = WMEURMPT.settingsSetURDescriptionWidth;
    WMEURMPT.getId("urmpt-setting-urdescriptionwidth").oninput = WMEURMPT.settingsSetURDescriptionWidth;
    WMEURMPT.getId("urmpt-setting-mpdescriptionwidth").onkeypress = WMEURMPT.settingsSetMPDescriptionWidth;
    WMEURMPT.getId("urmpt-setting-mpdescriptionwidth").onpaste = WMEURMPT.settingsSetMPDescriptionWidth;
    WMEURMPT.getId("urmpt-setting-mpdescriptionwidth").oninput = WMEURMPT.settingsSetMPDescriptionWidth;
    WMEURMPT.getId("urmpt-setting-mcsubjectwidth").onkeypress = WMEURMPT.settingsSetMCSubjectWidth;
    WMEURMPT.getId("urmpt-setting-mcsubjectwidth").onpaste = WMEURMPT.settingsSetMCSubjectWidth;
    WMEURMPT.getId("urmpt-setting-mcsubjectwidth").oninput = WMEURMPT.settingsSetMCSubjectWidth;
    WMEURMPT.getId("urmpt-setting-mcbodywidth").onkeypress = WMEURMPT.settingsSetMCBodyWidth;
    WMEURMPT.getId("urmpt-setting-mcbodywidth").onpaste = WMEURMPT.settingsSetMCBodyWidth;
    WMEURMPT.getId("urmpt-setting-mcbodywidth").oninput = WMEURMPT.settingsSetMCBodyWidth;
    WMEURMPT.getId("urmpt-setting-urtaglist").onkeypress = WMEURMPT.settingsSetURTagList;
    WMEURMPT.getId("urmpt-setting-urtaglist").onpaste = WMEURMPT.settingsSetURTagList;
    WMEURMPT.getId("urmpt-setting-urtaglist").oninput = WMEURMPT.settingsSetURTagList;
    WMEURMPT.getId("urmpt-setting-uragecolislastcomment").addEventListener("change", function(e) {
      WMEURMPT.URAgeColIsLastComment = e.target.checked;
      WMEURMPT.saveOptions();
    });
    WMEURMPT.updateLongTextCrop();
    var cssElt = WMEURMPT.createElement("style");
    cssElt.type = "text/css";
    var css = "";
    css += ".urt-table { border: 2px solid #3d3d3d; width: 100%; }";
    css += ".urt-table tr { border: 1px solid #3d3d3d; }";
    css += ".urt-table tr td { border: 1px solid #3d3d3d; font-size: smaller; }";
    css += ".urt-table thead { border: 2px solid #3d3d3d; font-size: bigger; text-align: center; background-color: #93c4d3;}";
    css += ".urt-table-head-icon { height: 32px; vertical-align: middle; display: table-cell; }";
    css += ".urt-bg-pair { background-color: #93c4d3; }";
    css += ".urt-bg-highlighted { background-color: #c9e1e9; }";
    css += ".urt-bg-selected { background-color: #42FF9c; }";
    css += ".urt-bg-ifollow { background-color: #e0e0e0; }";
    css += ".urt-bg-odd { }";
    css += ".urt-bg-newcomments { background-color: #FFc90E; }";
    css += ".urt-filter-list { list-style-type: none; padding-left: 2px; overflow: hidden;}";
    css += "#urt-filterHideWithCommentCount { display: inline; height: 20px; font-size: smaller; }";
    css += "#urt-filterKW { display: inline; width: 30%; height: 20px; font-size: smaller; }";
    css += "#mct-filterKW { display: inline; width: 30%; height: 20px; font-size: smaller; }";
    css += "#urt-filterLimitTo { display: inline; width: 30%; height: 20px; font-size: smaller; }";
    css += "#mpt-filterLimitTo { display: inline; width: 30%; height: 20px; font-size: smaller; }";
    css += "#mct-filterLimitTo { display: inline; width: 30%; height: 20px; font-size: smaller; }";
    css += "#urt-progressBarInfo { display: none; width: 90%; float: left; position: absolute; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; margin-bottom: -100%; background-color: #c9e1e9; z-index: 999; margin: 5px; margin-right: 20px; }";
    css += ".urt-progressBarBG { margin-top: 2px; margin-bottom: 2px; margin-left: 2px; margin-right: 2px; padding-bottom: 0px; padding-top: 0px; padding-left: 0px; padding-right: 0px; width: 33%; background-color: #93c4d3; border: 3px rgb(147, 196, 211); border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; height: 22px;}";
    css += ".urt-progressBarFG { float: left; position: relative; bottom: 22px; height: 0px; text-align: center; width: 100% }";
    css += "#urt-info { margin: 5px; }";
    css += ".urt-blacklist { background: transparent url(data:image/png;base64," + WMEURMPT.icon_blacklist + ") center top; background-size: 16px 16px; background-repeat: no-repeat; } ";
    css += "#urmpt-qoptions { display: block; width: 100%; border-top-left-radius: 3px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; border: 1px solid #dddddd; }";
    css += ".urt-chkbox { width: 16px; height: 16px; margin-top: -5px; }";
    cssElt.innerHTML = css;
    document.body.appendChild(cssElt);
    WMEURMPT.updateScanGroup();
    window.setInterval(WMEURMPT.save, 120000);
    if (WMEURMPT.isEnabled) {
      WMEURMPT.registerEvents();
      WMEURMPT.updateIHMFromURList();
      WMEURMPT.updateIHMFromMPList();
    }
    if (!WMEURMPT.isEnabled) {
      WMEURMPT.disable();
    }
  };
  WMEURMPT.setupCAEvents = function() {
    var tl = WMEURMPT.getId("urmpt-areas-fill-tl");
    var br = WMEURMPT.getId("urmpt-areas-fill-br");
    var add = WMEURMPT.getId("urmpt-areas-name-add");
    tl.onclick = WMEURMPT.getTLArea;
    br.onclick = WMEURMPT.getBRArea;
    add.onclick = WMEURMPT.addCustomAreaToFilterList;
    var addFromPOI = WMEURMPT.getId("urmpt-areas-frompoi-add");
    addFromPOI.onclick = WMEURMPT.addCustomAreaFromPOIToFilterList;
    var addFromWKT = WMEURMPT.getId("urmpt-areas-wktfile");
    addFromWKT.addEventListener("change", WMEURMPT.handleFileSelectAddFromWKT, false);
    var addFromWKTAdd = WMEURMPT.getId("urmpt-areas-wktfile-add");
    addFromWKTAdd.onclick = WMEURMPT.addCustomAreaFromWKTToFilterList;
    var addFromJSON = WMEURMPT.getId("urmpt-areas-jsonfile");
    addFromJSON.addEventListener("change", WMEURMPT.handleFileSelectAddFromJSON, false);
    var addFromJSONAdd = WMEURMPT.getId("urmpt-areas-jsonfile-add");
    addFromJSONAdd.onclick = WMEURMPT.addCustomAreaFromJSONToFilterList;
  };
  WMEURMPT.getTLArea = function() {
    var xy = WMEURMPT.wazeMap.getLonLatFromPixel({x:0, y:0});
    var lonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(xy.lon, xy.lat);
    WMEURMPT.getId("urmpt-areas-tl-lon").value = lonlat.lon;
    WMEURMPT.getId("urmpt-areas-tl-lat").value = lonlat.lat;
  };
  WMEURMPT.getBRArea = function() {
    var xy = WMEURMPT.wazeMap.getLonLatFromPixel({x:WMEURMPT.wazeMap.size.w, y:WMEURMPT.wazeMap.size.h});
    var lonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(xy.lon, xy.lat);
    WMEURMPT.getId("urmpt-areas-br-lon").value = lonlat.lon;
    WMEURMPT.getId("urmpt-areas-br-lat").value = lonlat.lat;
  };
  WMEURMPT.closeLegend = function() {
    if (confirm("This legend will never be displayed anymore.\nAre you sure you want to do that?")) {
      WMEURMPT.getId("urt-legend").style.display = "none";
      WMEURMPT.getId("urt-close-legend").style.display = "none";
      WMEURMPT.displayLegend = false;
      WMEURMPT.log("Legend closed");
      WMEURMPT.saveOptions();
    }
  };
  WMEURMPT.connectURTabHandler = function() {
    WMEURMPT.getId("urmp-tabstitle-ur").onclick = WMEURMPT.updateIHMFromURList;
  };
  WMEURMPT.connectMPTabHandler = function() {
    WMEURMPT.getId("urmp-tabstitle-mp").onclick = WMEURMPT.updateIHMFromMPList;
  };
  WMEURMPT.connectMCTabHandler = function() {
    WMEURMPT.getId("urmp-tabstitle-mc").onclick = WMEURMPT.updateIHMFromMCList;
  };
  WMEURMPT.enableOrDisable = function() {
    if (WMEURMPT.isEnabled) {
      WMEURMPT.getId("urmpt-onoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_unchecked + '" />';
      WMEURMPT.disable();
    } else {
      WMEURMPT.getId("urmpt-onoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_checked + '" />';
      WMEURMPT.enable();
    }
    WMEURMPT.isEnabled = !WMEURMPT.isEnabled;
  };
  WMEURMPT.enable = function() {
    WMEURMPT.registerEvents();
    WMEURMPT.getId("urt-a-scanGroup").style.display = "inline";
    WMEURMPT.getId("urmp-tabs").style.display = "block";
    WMEURMPT.getId("urmpt-tab-content").style.display = "block";
    WMEURMPT.getId("urmpt-qoptions").style.display = "block";
    WMEURMPT.updateIHMFromURList();
    WMEURMPT.updateIHMFromMPList();
  };
  WMEURMPT.disable = function() {
    WMEURMPT.unregisterEvents();
    WMEURMPT.getId("urt-a-scanGroup").style.display = "none";
    WMEURMPT.getId("urmp-tabs").style.display = "none";
    WMEURMPT.getId("urmpt-tab-content").style.display = "none";
    WMEURMPT.getId("urmpt-qoptions").style.display = "none";
  };
  WMEURMPT.enableOrDisableDistance = function() {
    if (WMEURMPT.isComputeDistances) {
      WMEURMPT.getId("urmpt-donoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_unchecked + '" />';
    } else {
      WMEURMPT.getId("urmpt-donoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_checked + '" />';
    }
    WMEURMPT.isComputeDistances = !WMEURMPT.isComputeDistances;
    WMEURMPT.saveOptions();
    if (WMEURMPT.isComputeDistances) {
      WMEURMPT.mapMoveEnd();
    }
  };
  WMEURMPT.enableOrDisableAutoScan = function() {
    if (WMEURMPT.isAutoScan) {
      WMEURMPT.getId("urmpt-asonoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_unchecked + '" />';
    } else {
      WMEURMPT.getId("urmpt-asonoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_checked + '" />';
    }
    WMEURMPT.isAutoScan = !WMEURMPT.isAutoScan;
    WMEURMPT.saveOptions();
  };
  WMEURMPT.enableOrDisableScanUR = function() {
    if (WMEURMPT.scanUR) {
      WMEURMPT.getId("urmpt-suronoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_unchecked + '" />';
    } else {
      WMEURMPT.getId("urmpt-suronoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_checked + '" />';
    }
    WMEURMPT.scanUR = !WMEURMPT.scanUR;
    WMEURMPT.saveOptions();
  };
  WMEURMPT.enableOrDisableScanMP = function() {
    if (WMEURMPT.scanMP) {
      WMEURMPT.getId("urmpt-smponoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_unchecked + '" />';
    } else {
      WMEURMPT.getId("urmpt-smponoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_checked + '" />';
    }
    WMEURMPT.scanMP = !WMEURMPT.scanMP;
    WMEURMPT.saveOptions();
  };
  WMEURMPT.enableOrDisableScanMC = function() {
    if (WMEURMPT.scanMC) {
      WMEURMPT.getId("urmpt-smconoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_unchecked + '" />';
    } else {
      WMEURMPT.getId("urmpt-smconoff").innerHTML = '<img class="urt-chkbox" src="data:image/png;base64,' + WMEURMPT.icon_checked + '" />';
    }
    WMEURMPT.scanMC = !WMEURMPT.scanMC;
    WMEURMPT.saveOptions();
  };
  WMEURMPT.handleFileSelectAddFromWKT = function(evt) {
    var files = evt.target.files;
    for (var i = 0, f;f = files[i];i++) {
      var reader = new FileReader;
      reader.onload = function(theFile) {
        return function(e) {
          WMEURMPT.lastUploadedWKT = e.target.result;
          WMEURMPT.log("import WKT file read");
        };
      }(f);
      reader.readAsText(f);
    }
  };
  WMEURMPT.showAreaInWKT = function(area) {
    var geometry = null;
    for (var i = 0;i < WMEURMPT.areaList[area.type].length;i++) {
      if (WMEURMPT.areaList[area.type][i].name == area.name) {
        geometry = WMEURMPT.areaList[area.type][i].geometryWKT;
        break;
      }
    }
    if (geometry) {
      this.setAttribute("download", area.name + ".wkt");
      this.href = "data:application/octet-stream;charset=utf-8;base64," + btoa(geometry);
    }
  };
  WMEURMPT.mapMoveEnd = function() {
    if (WMEURMPT.isComputeDistances) {
      WMEURMPT.mapCenterLonLat = OpenLayers.Layer.SphericalMercator.inverseMercator(WMEURMPT.wazeMap.center.lon, WMEURMPT.wazeMap.center.lat);
      for (var i = 0;i < WMEURMPT.URList.length;i++) {
        WMEURMPT.URList[i].updateDistanceToMapCenter();
      }
      for (var i = 0;i < WMEURMPT.MPList.length;i++) {
        WMEURMPT.MPList[i].updateDistanceToMapCenter();
      }
      for (var i = 0;i < WMEURMPT.MCList.length;i++) {
        WMEURMPT.MCList[i].updateDistanceToMapCenter();
      }
      WMEURMPT.updateIHMFromURList();
      WMEURMPT.updateIHMFromMPList();
      WMEURMPT.updateIHMFromMCList();
    }
  };
  WMEURMPT.mapZoomEnd = function() {
    WMEURMPT.mapMoveEnd();
  };
  WMEURMPT.showPBInfo = function(show) {
    if (show) {
      WMEURMPT.getId("urt-progressBarInfo").style.display = "block";
    } else {
      WMEURMPT.getId("urt-progressBarInfo").style.display = "none";
    }
  };
  WMEURMPT.ProgressBar = function(div) {
    this.div = div;
  };
  WMEURMPT.ProgressBar.prototype.isShown = function() {
    return this.div.style.display != "none";
  };
  WMEURMPT.ProgressBar.prototype.show = function() {
    this.div.style.display = "block";
  };
  WMEURMPT.ProgressBar.prototype.hide = function() {
    this.div.style.display = "none";
  };
  WMEURMPT.ProgressBar.prototype.update = function(value) {
    if (value == -1) {
      this.div.children[0].style.display = "none";
      this.div.children[1].style.display = "none";
      return;
    }
    this.div.children[0].style.display = "block";
    this.div.children[1].style.display = "block";
    this.div.children[0].style.width = value + "%";
    this.div.children[1].innerHTML = value + "%";
  };
  WMEURMPT.clearAllUR = function() {
    WMEURMPT.URList = [];
    WMEURMPT.URMap = {};
    WMEURMPT.log("UR list cleared");
    WMEURMPT.saveURList();
    WMEURMPT.updateIHMFromURList();
  };
  WMEURMPT.markAllURAsVisited = function() {
    for (var i = 0;i < WMEURMPT.URList.length;i++) {
      if (!WMEURMPT.isURFiltered(WMEURMPT.URList[i])) {
        WMEURMPT.URList[i].alreadyVisited = true;
      }
    }
    WMEURMPT.log("All UR marked as visited");
    WMEURMPT.updateIHMFromURList();
  };
  WMEURMPT.blacklistUR = function(index) {
    var i = parseInt(index);
    if (i < 0 || i >= WMEURMPT.URList.length) {
      return;
    }
    WMEURMPT.log((WMEURMPT.URList[i].blackListed ? "Whitelist" : "Blacklist") + " UR: " + WMEURMPT.URList[i].id);
    WMEURMPT.URList[i].blackListed = !WMEURMPT.URList[i].blackListed;
    WMEURMPT.updateIHMFromURList();
  };
  WMEURMPT.URBlackListed = function(URId, value) {
    var ur = WMEURMPT.getURFromId(URId);
    if (ur != null) {
      WMEURMPT.log((value ? "Blacklist" : "Whitelist") + " UR: " + URId);
      ur.blackListed = value;
    }
  };
  WMEURMPT.URVisited = function(URId) {
    var ur = WMEURMPT.getURFromId(URId);
    if (ur != null) {
      WMEURMPT.log("Mark UR " + URId + " as visited");
      ur.lastVisitCommentsCount = ur.data.session.comments.length;
      ur.alreadyVisited = true;
      WMEURMPT.updateIHMFromURList();
    }
  };
  WMEURMPT.getURFromId = function(id) {
    if (typeof WMEURMPT.URMap[id] === "undefined") {
      return null;
    }
    return WMEURMPT.URList[WMEURMPT.URMap[id]];
  };
  WMEURMPT.clearAllMP = function() {
    WMEURMPT.MPList = [];
    WMEURMPT.MPMap = {};
    WMEURMPT.log("MP list cleared");
    WMEURMPT.saveMPList();
    WMEURMPT.updateIHMFromMPList();
  };
  WMEURMPT.markAllMPAsVisited = function() {
    for (var i = 0;i < WMEURMPT.MPList.length;i++) {
      if (!WMEURMPT.isMPFiltered(WMEURMPT.MPList[i])) {
        WMEURMPT.MPList[i].alreadyVisited = true;
      }
    }
    WMEURMPT.log("All MP marked as visited");
    WMEURMPT.updateIHMFromMPList();
  };
  WMEURMPT.blacklistMP = function(index) {
    var i = parseInt(index);
    if (i < 0 || i >= WMEURMPT.MPList.length) {
      return;
    }
    WMEURMPT.log((WMEURMPT.MPList[i].blackListed ? "Whitelist" : "Blacklist") + " MP: " + WMEURMPT.MPList[i].id);
    WMEURMPT.MPList[i].blackListed = !WMEURMPT.MPList[i].blackListed;
    WMEURMPT.updateIHMFromMPList();
  };
  WMEURMPT.MPVisited = function(MPId) {
    var mp = WMEURMPT.getMPFromId(MPId);
    if (mp != null) {
      WMEURMPT.log("Mark MP " + MPId + " as visited");
      mp.alreadyVisited = true;
      WMEURMPT.updateIHMFromMPList();
    }
  };
  WMEURMPT.getMPFromId = function(id) {
    if (typeof WMEURMPT.MPMap[id] === "undefined") {
      return null;
    }
    return WMEURMPT.MPList[WMEURMPT.MPMap[id]];
  };
  WMEURMPT.clearAllMC = function() {
    WMEURMPT.MCList = [];
    WMEURMPT.MCMap = {};
    WMEURMPT.log("MC list cleared");
    WMEURMPT.saveMCList();
    WMEURMPT.updateIHMFromMCList();
  };
  WMEURMPT.markAllMCAsVisited = function() {
    for (var i = 0;i < WMEURMPT.MCList.length;i++) {
      if (!WMEURMPT.isMCFiltered(WMEURMPT.MCList[i])) {
        WMEURMPT.MCList[i].alreadyVisited = true;
      }
    }
    WMEURMPT.log("All MC marked as visited");
    WMEURMPT.updateIHMFromMCList();
  };
  WMEURMPT.blacklistMC = function(index) {
    var i = parseInt(index);
    if (i < 0 || i >= WMEURMPT.MCList.length) {
      return;
    }
    WMEURMPT.log((WMEURMPT.MCList[i].blackListed ? "Whitelist" : "Blacklist") + " MC: " + WMEURMPT.MCList[i].id);
    WMEURMPT.MCList[i].blackListed = !WMEURMPT.MCList[i].blackListed;
    WMEURMPT.updateIHMFromMCList();
  };
  WMEURMPT.MCBlackListed = function(MCId, value) {
    var mc = WMEURMPT.getMCFromId(MCId);
    if (mc != null) {
      WMEURMPT.log((value ? "Blacklist" : "Whitelist") + " MC: " + MCId);
      mc.blackListed = value;
    }
  };
  WMEURMPT.MCVisited = function(MCId) {
    var mc = WMEURMPT.getMCFromId(MCId);
    if (mc != null) {
      WMEURMPT.log("Mark MC " + MCId + " as visited");
      mc.lastVisitCommentsCount = mc.data.hasOwnProperty("conversation") ? mc.data.conversation.length : 0;
      mc.alreadyVisited = true;
      WMEURMPT.updateIHMFromMCList();
    }
  };
  WMEURMPT.getMCFromId = function(id) {
    if (typeof WMEURMPT.MCMap[id] === "undefined") {
      return null;
    }
    return WMEURMPT.MCList[WMEURMPT.MCMap[id]];
  };
  WMEURMPT.getHRURResolutionFromType = function(type) {
    if (type == 1) {
      return "Not identified";
    }
    if (type == 0) {
      return "Solved";
    }
  };
  WMEURMPT.getFullURTypeFromType = function(type) {
    return I18n.translations[I18n.locale].update_requests.types[type];
  };
  WMEURMPT.getHRURTypeFromType = function(type) {
    if (type == 6) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">IT</span>';
    }
    if (type == 7) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">IA</span>';
    }
    if (type == 8) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">IR</span>';
    }
    if (type == 9) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">MRa</span>';
    }
    if (type == 10) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">GE</span>';
    }
    if (type == 11) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">TnA</span>';
    }
    if (type == 12) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">IJ</span>';
    }
    if (type == 13) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">MBO</span>';
    }
    if (type == 14) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">WDD</span>';
    }
    if (type == 15) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">ME</span>';
    }
    if (type == 16) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">MR</span>';
    }
    if (type == 18) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">ML</span>';
    }
    if (type == 19) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">BR</span>';
    }
    if (type == 21) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">MSN</span>';
    }
    if (type == 22) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">MSS</span>';
    }
    if (type == 23) {
      return '<span title="' + WMEURMPT.getFullURTypeFromType(type) + '" style="display: block; width: 100%;">MSL</span>';
    }
    return (WMEURMPT.getFullURTypeFromType(type) + " ").replace(/([A-Za-z])[A-Za-z]* /g, "$1").toUpperCase().substring(0, 3);
  };
  WMEURMPT.getFullMPTypeFromType = function(type) {
    return I18n.translations[I18n.locale].problems.types[type].title;
  };
  WMEURMPT.getHRMPTypeFromType = function(type) {
    return '<span title="' + I18n.translations[I18n.locale].problems.types[type].title + '" style="display: block; width: 100%;">P</span>';
  };
  WMEURMPT.getHRMPDescriptionFromType = function(type) {
    if (type == 1) {
      return '<span title="Crooked segment detected" style="display: block; width: 100%;">Crooked segment</span>';
    }
    if (type == 17) {
      return '<span title="Segment without details detected" style="display: block; width: 100%;">Segment without details</span>';
    }
    if (type == 50) {
      return '<span title="Parking Lot input as point" style="display: block; width: 100%;">Parking Lot as point</span>';
    }
    if (type == 101) {
      return '<span title="Driving direction mismatch" style="display: block; width: 100%;">Driving dr m/match</span>';
    }
    if (type == 102) {
      return '<span title="Missing junction" style="display: block; width: 100%;">Missing junction</span>';
    }
    if (type == 103) {
      return '<span title="Missing road" style="display: block; width: 100%;">Missing road</span>';
    }
    if (type == 104) {
      return '<span title="Cross roads junction missing" style="display: block; width: 100%;">Cross rd junc miss</span>';
    }
    if (type == 105) {
      return '<span title="Road type mismatch" style="display: block; width: 100%;">Road type mismatch</span>';
    }
    if (type == 106) {
      return '<span title="Restricted turn might be allowed" style="display: block; width: 100%;">Rst trn m. be alwd</span>';
    }
    if (type == 200) {
      return '<span title="Turn problem" style="display: block; width: 100%;">Turn problem</span>';
    }
    if (type == 300) {
      return '<span title="Road closure" style="display: block; width: 100%;">Road closure</span>';
    }
    return '<span title="' + I18n.translations[I18n.locale].problems.types[type].title + '" style="display: block; width: 100%;">' + I18n.translations[I18n.locale].problems.types[type].title + "</span>";
  };
  WMEURMPT.compareUR = function(a, b, i) {
    if (arguments.length == 2) {
      i = 0;
    }
    if (i >= WMEURMPT.sortHistoryUR.length) {
      return 0;
    }
    switch(WMEURMPT.sortHistoryUR[i]) {
      case WMEURMPT.sortModeListUR.ageDSC:
        if (a.data.driveDate == b.data.driveDate) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return a.data.driveDate - b.data.driveDate;
        break;
      case WMEURMPT.sortModeListUR.ageASC:
        if (a.data.driveDate == b.data.driveDate) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return b.data.driveDate - a.data.driveDate;
        break;
      case WMEURMPT.sortModeListUR.typeDSC:
        if (a.data.type == b.data.type) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return a.data.type - b.data.type;
        break;
      case WMEURMPT.sortModeListUR.typeASC:
        if (a.data.type == b.data.type) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return b.data.type - a.data.type;
        break;
      case WMEURMPT.sortModeListUR.commentCountDSC:
        if (a.data.session.comments.length == b.data.session.comments.length) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return a.data.session.comments.length - b.data.session.comments.length;
        break;
      case WMEURMPT.sortModeListUR.commentCountASC:
        if (a.data.session.comments.length == b.data.session.comments.length) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return b.data.session.comments.length - a.data.session.comments.length;
        break;
      case WMEURMPT.sortModeListUR.distanceDSC:
        if (a.distanceToMapCenter == b.distanceToMapCenter) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return a.distanceToMapCenter - b.distanceToMapCenter;
        break;
      case WMEURMPT.sortModeListUR.distanceASC:
        if (a.distanceToMapCenter == b.distanceToMapCenter) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return b.distanceToMapCenter - a.distanceToMapCenter;
        break;
      case WMEURMPT.sortModeListUR.lastCommentDSC:
        var da = a.data.driveDate;
        var db = b.data.driveDate;
        if (a.data.session.comments.length != 0) {
          da = a.data.session.comments[a.data.session.comments.length - 1].createdOn;
        }
        if (b.data.session.comments.length != 0) {
          db = b.data.session.comments[b.data.session.comments.length - 1].createdOn;
        }
        if (a.data.session.comments.length != 0 && b.data.session.comments.length == 0) {
          return -1;
        }
        if (a.data.session.comments.length == 0 && b.data.session.comments.length != 0) {
          return 1;
        }
        if (da == db) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return da - db;
        break;
      case WMEURMPT.sortModeListUR.lastCommentASC:
        var da = a.data.driveDate;
        var db = b.data.driveDate;
        if (a.data.session.comments.length != 0) {
          da = a.data.session.comments[a.data.session.comments.length - 1].createdOn;
        }
        if (b.data.session.comments.length != 0) {
          db = b.data.session.comments[b.data.session.comments.length - 1].createdOn;
        }
        if (a.data.session.comments.length != 0 && b.data.session.comments.length == 0) {
          return 1;
        }
        if (a.data.session.comments.length == 0 && b.data.session.comments.length != 0) {
          return -1;
        }
        if (da == db) {
          return WMEURMPT.compareUR(a, b, i + 1);
        }
        return db - da;
        break;
    }
    return 0;
  };
  WMEURMPT.compareMP = function(a, b, i) {
    if (arguments.length == 2) {
      i = 0;
    }
    if (i >= WMEURMPT.sortHistoryMP.length) {
      return 0;
    }
    switch(WMEURMPT.sortHistoryMP[i]) {
      case WMEURMPT.sortModeListMP.priorityDSC:
        if (a.data.weight == b.data.weight) {
          return WMEURMPT.compareMP(a, b, i + 1);
        }
        return a.data.weight - b.data.weight;
        break;
      case WMEURMPT.sortModeListMP.priorityASC:
        if (a.data.weight == b.data.weight) {
          return WMEURMPT.compareMP(a, b, i + 1);
        }
        return b.data.weight - a.data.weight;
        break;
      case WMEURMPT.sortModeListMP.typeDSC:
        if (a.data.subType == b.data.subType) {
          return WMEURMPT.compareMP(a, b, i + 1);
        }
        return a.data.subType - b.data.subType;
        break;
      case WMEURMPT.sortModeListMP.typeASC:
        if (a.data.subType == b.data.subType) {
          return WMEURMPT.compareMP(a, b, i + 1);
        }
        return b.data.subType - a.data.subType;
        break;
      case WMEURMPT.sortModeListMP.distanceDSC:
        if (a.distanceToMapCenter == b.distanceToMapCenter) {
          return WMEURMPT.compareMP(a, b, i + 1);
        }
        return a.distanceToMapCenter - b.distanceToMapCenter;
        break;
      case WMEURMPT.sortModeListMP.distanceASC:
        if (a.distanceToMapCenter == b.distanceToMapCenter) {
          return WMEURMPT.compareMP(a, b, i + 1);
        }
        return b.distanceToMapCenter - a.distanceToMapCenter;
        break;
    }
    return 0;
  };
  WMEURMPT.compareMC = function(a, b, i) {
    if (arguments.length == 2) {
      i = 0;
    }
    if (i >= WMEURMPT.sortHistoryMC.length) {
      return 0;
    }
    switch(WMEURMPT.sortHistoryMC[i]) {
      case WMEURMPT.sortModeListMC.ageDSC:
        if (a.data.createdOn == b.data.createdOn) {
          return WMEURMPT.compareMC(a, b, i + 1);
        }
        return a.data.createdOn - b.data.createdOn;
        break;
      case WMEURMPT.sortModeListMC.ageASC:
        if (a.data.createdOn == b.data.createdOn) {
          return WMEURMPT.compareMC(a, b, i + 1);
        }
        return b.data.createdOn - a.data.createdOn;
        break;
      case WMEURMPT.sortModeListMC.distanceDSC:
        if (a.distanceToMapCenter == b.distanceToMapCenter) {
          return WMEURMPT.compareMC(a, b, i + 1);
        }
        return a.distanceToMapCenter - b.distanceToMapCenter;
        break;
      case WMEURMPT.sortModeListMC.distanceASC:
        if (a.distanceToMapCenter == b.distanceToMapCenter) {
          return WMEURMPT.compareMC(a, b, i + 1);
        }
        return b.distanceToMapCenter - a.distanceToMapCenter;
        break;
      case WMEURMPT.sortModeListMC.commentCountDSC:
        var acount = a.data.hasOwnProperty("conversation") ? a.data.conversation.length : 0;
        var bcount = b.data.hasOwnProperty("conversation") ? b.data.conversation.length : 0;
        if (acount == bcount) {
          return WMEURMPT.compareMC(a, b, i + 1);
        }
        return acount - bcount;
        break;
      case WMEURMPT.sortModeListMC.commentCountASC:
        var acount = a.data.hasOwnProperty("conversation") ? a.data.conversation.length : 0;
        var bcount = b.data.hasOwnProperty("conversation") ? b.data.conversation.length : 0;
        if (acount == bcount) {
          return WMEURMPT.compareMC(a, b, i + 1);
        }
        return bcount - acount;
        break;
    }
    return 0;
  };
  WMEURMPT.compareURDriveDate = function(a, b) {
    if (a.data.driveDate == b.data.driveDate) {
      return WMEURMPT.compareURType(a, b);
    }
    return a.data.driveDate - b.data.driveDate;
  };
  WMEURMPT.compareMPPriority = function(a, b) {
    if (a.data.weight == b.data.weight) {
      return WMEURMPT.compareMPType(a, b);
    }
    return a.data.weight - b.data.weight;
  };
  WMEURMPT.compareURType = function(a, b) {
    if (a.data.type == b.data.type) {
      return WMEURMPT.compareURCommentCount(a, b);
    }
    return a.data.type - b.data.type;
  };
  WMEURMPT.compareMPType = function(a, b) {
    if (a.data.subType == b.data.subType) {
      return WMEURMPT.compareURMPDistanceToMapCenter(a, b);
    }
    return a.data.subType - b.data.subType;
  };
  WMEURMPT.compareURCommentCount = function(a, b) {
    if (a.data.session.comments.length == b.data.session.comments.length) {
      return WMEURMPT.compareURMPDistanceToMapCenter(a, b);
    }
    return a.data.session.comments.length - b.data.session.comments.length;
  };
  WMEURMPT.compareURMPDistanceToMapCenter = function(a, b) {
    if (a.distanceToMapCenter == b.distanceToMapCenter) {
      return a.id - b.id;
    }
    return a.distanceToMapCenter - b.distanceToMapCenter;
  };
  WMEURMPT.compareURLastCommentDate = function(a, b) {
    var da = a.data.driveDate;
    var db = b.data.driveDate;
    if (a.data.session.comments.length != 0) {
      da = a.data.session.comments[a.data.session.comments.length - 1].createdOn;
    }
    if (b.data.session.comments.length != 0) {
      db = b.data.session.comments[b.data.session.comments.length - 1].createdOn;
    }
    if (a.data.session.comments.length != 0 && b.data.session.comments.length == 0) {
      return -1;
    }
    if (a.data.session.comments.length == 0 && b.data.session.comments.length != 0) {
      return 1;
    }
    if (da == db) {
      return WMEURMPT.compareURType(a, b);
    }
    return da - db;
  };
  WMEURMPT.changeTableURSortTo = function(sortMode) {
    sortMode = parseInt(sortMode);
    var pos = WMEURMPT.sortHistoryUR.indexOf(sortMode);
    if (pos != -1) {
      WMEURMPT.sortHistoryUR.splice(pos);
    }
    if (WMEURMPT.sortHistoryUR[0] == -sortMode) {
      WMEURMPT.sortHistoryUR[0] = sortMode;
    } else {
      WMEURMPT.sortHistoryUR.splice(0, 0, sortMode);
    }
    WMEURMPT.updateIHMFromURList(sortMode);
  };
  WMEURMPT.changeTableMPSortTo = function(sortMode) {
    sortMode = parseInt(sortMode);
    var pos = WMEURMPT.sortHistoryMP.indexOf(sortMode);
    if (pos != -1) {
      WMEURMPT.sortHistoryMP.splice(pos);
    }
    if (WMEURMPT.sortHistoryMP[0] == -sortMode) {
      WMEURMPT.sortHistoryMP[0] = sortMode;
    } else {
      WMEURMPT.sortHistoryMP.splice(0, 0, sortMode);
    }
    WMEURMPT.updateIHMFromMPList(sortMode);
  };
  WMEURMPT.changeTableMCSortTo = function(sortMode) {
    sortMode = parseInt(sortMode);
    var pos = WMEURMPT.sortHistoryMC.indexOf(sortMode);
    if (pos != -1) {
      WMEURMPT.sortHistoryMC.splice(pos);
    }
    if (WMEURMPT.sortHistoryMC[0] == -sortMode) {
      WMEURMPT.sortHistoryMC[0] = sortMode;
    } else {
      WMEURMPT.sortHistoryMC.splice(0, 0, sortMode);
    }
    WMEURMPT.updateIHMFromMCList(sortMode);
  };
  WMEURMPT.getColorFromAge = function(ageInDays) {
    var r = 255;
    var g = 0;
    var b = 255;
    if (ageInDays < 15) {
      b = 0;
      g = 255 - ageInDays * 17;
    } else {
      if (ageInDays < 30) {
        b = (ageInDays - 15) * 17;
      }
    }
    if (g < 0) {
      g = 0;
    }
    if (b > 255) {
      b = 255;
    }
    return "#" + WMEURMPT.decimalToHex(r, 2) + WMEURMPT.decimalToHex(g, 2) + WMEURMPT.decimalToHex(b, 2);
  };
  WMEURMPT.getColorFromWieght = function(MPWeight) {
    var r = 255;
    var g = 0;
    var b = 255;
    if (MPWeight == 2) {
      r = 255;
      b = 0;
    } else {
      if (MPWeight == 3) {
        g = 255;
        b = 0;
      } else {
        if (MPWeight > 3) {
          r = 0;
          g = 255;
          b = 0;
        }
      }
    }
    return "#" + WMEURMPT.decimalToHex(r, 2) + WMEURMPT.decimalToHex(g, 2) + WMEURMPT.decimalToHex(b, 2);
  };
  WMEURMPT.getColorFromStartTime = function(ts) {
    var aDate = new Date;
    var now = aDate.getTime();
    var deltaH = (ts - now) / 3600000;
    var r = 255;
    var g = 0;
    var b = 255;
    if (deltaH < 0) {
      return "#" + WMEURMPT.decimalToHex(r, 2) + WMEURMPT.decimalToHex(g, 2) + WMEURMPT.decimalToHex(b, 2);
    }
    r = 0;
    g = 255;
    b = 0;
    if (deltaH > 30 * 24) {
      return "#" + WMEURMPT.decimalToHex(r, 2) + WMEURMPT.decimalToHex(g, 2) + WMEURMPT.decimalToHex(b, 2);
    }
    r = 255;
    g = 0;
    b = 255;
    if (deltaH < 7 * 24) {
      b = Math.floor(255 - deltaH / (7 * 24) * 255);
    } else {
      if (deltaH < 17 * 24) {
        deltaH = deltaH - 7 * 24;
        b = 0;
        g = Math.floor(255 - deltaH / (10 * 24) * 255);
      } else {
        deltaH = deltaH - 17 * 24;
        g = 255;
        b = 0;
        r = Math.floor(255 - deltaH / (13 * 24) * 255);
      }
    }
    if (b > 255) {
      b = 255;
    }
    if (r > 255) {
      r = 255;
    }
    if (g > 255) {
      g = 255;
    }
    return "#" + WMEURMPT.decimalToHex(r, 2) + WMEURMPT.decimalToHex(g, 2) + WMEURMPT.decimalToHex(b, 2);
  };
  WMEURMPT.updateIHMFromURList = function(sortMode) {
    var div = WMEURMPT.getId("urt-list");
    if (WMEURMPT.URList.length == 0) {
      WMEURMPT.removeChildElements(div);
      div.innerHTML = "";
      return;
    }
    sortMode = typeof sortMode !== "undefined" && sortMode != null ? sortMode : WMEURMPT.currentSortModeUR;
    if (sortMode != WMEURMPT.currentSortModeUR || (sortMode == WMEURMPT.sortModeListUR.distanceDSC || sortMode == WMEURMPT.sortModeListUR.distanceASC) && WMEURMPT.isComputeDistances == true) {
      WMEURMPT.URList.sort(WMEURMPT.compareUR);
      WMEURMPT.URMap = WMEURMPT.listToObject(WMEURMPT.URList);
    }
    WMEURMPT.currentSortModeUR = sortMode;
    var content = "";
    content += '<table id="urmpt-ur-table" class="urt-table">';
    content += "<thead><tr>";
    content += '<td><div class="urt-table-head-icon"><img style="width: 16px" title="Blacklist UR 1 by 1." src="data:image/png;base64,' + WMEURMPT.icon_blacklist + '" /></div></td>';
    content += '<td><div class="urt-table-head-icon"><a href="#" id="urt-table-sort-age"><img style="width: 16px" title="Age of the UR.\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_age + '" /></a><a href="#" id="urt-table-sort-lastcomment"><img style="width: 16px" title="Last comment on UR.\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_comments + '" /></a></div></td>';
    content += '<td><div class="urt-table-head-icon"><a href="#" id="urt-table-sort-type"><img title="Type of the UR.\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_type + '" /></a></div></td>';
    content += '<td width="100%">Description</td>';
    content += '<td><div class="urt-table-head-icon"><a href="#" id="urt-table-sort-ccount"><img style="width: 16px" title="Comments count\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_comments + '" /></a></div></td>';
    content += '<td><div class="urt-table-head-icon"><a href="#" id="urt-table-sort-distance"><img title="Distance to the center of the map.\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_distance + '" /></a></div></td>';
    content += '<td style="width: 20px; display: inline-block; border: none;"><center><div class="urt-table-head-icon"><i class="fa fa-crosshairs crosshair icon-screenshot"></i></div></center></td>';
    content += "</tr></thead>";
    var displayedURCount = 0;
    var hiddenURCount = 0;
    for (var i = 0;i < WMEURMPT.URList.length;i++) {
      if (WMEURMPT.getId("urt-checkbox-filterHideLimitTo").checked) {
        if (displayedURCount >= WMEURMPT.currentURLimitTo) {
          hiddenURCount += WMEURMPT.URList.length - i;
          break;
        }
      }
      if (WMEURMPT.isURFiltered(WMEURMPT.URList[i])) {
        hiddenURCount++;
        continue;
      }
      displayedURCount++;
      var URDays = WMEURMPT.getDuration(WMEURMPT.URList[i].data.driveDate);
      var distance = WMEURMPT.URList[i].distanceToMapCenter;
      var distanceStr = Math.floor(distance) + "&nbsp;<font size: smaller>m</font>";
      if (distance >= 1000) {
        distanceStr = Math.floor(distance / 1000) + "&nbsp;<font size: smaller>km</font>";
      }
      if (distance >= 1000000) {
        distanceStr = Math.floor(distance / 1000000) + "&nbsp;<font size: smaller>Mm</font>";
      }
      var comments = "";
      var lastCommentDays = null;
      for (var c = 0;c < WMEURMPT.URList[i].data.session.comments.length;c++) {
        comments += WMEURMPT.URList[i].data.session.comments[c].userName + " (" + (new Date(WMEURMPT.URList[i].data.session.comments[c].createdOn)).toLocaleString() + "):\n";
        comments += WMEURMPT.URList[i].data.session.comments[c].text + "\n\n";
        lastCommentDays = WMEURMPT.getDuration(WMEURMPT.URList[i].data.session.comments[c].createdOn);
        if (c == WMEURMPT.URList[i].data.session.comments.length - 1 && WMEURMPT.URList[i].data.session.comments[c].userName == WMEURMPT.me.userName) {
          WMEURMPT.URList[i].lastVisitCommentsCount = WMEURMPT.URList[i].data.session.comments.length;
        }
      }
      content += '<tr id="urt-tr-' + i + '" >';
      content += '<td class="urt-blacklist" id="urt-blacklist-' + i + '" style=" cursor: pointer; " title="' + (WMEURMPT.URList[i].blackListed ? "whitelist" : "blacklist") + ' this UR" >&nbsp;</td>';
      var colorCode = new Object;
      colorCode.fc = "#000000";
      if (WMEURMPT.URList[i].blackListed) {
        colorCode.bg = "#000000";
        colorCode.fc = "#ffffff";
      } else {
        if (WMEURMPT.URList[i].data.open == false) {
          colorCode.bg = "#00a000";
        } else {
          colorCode.bg = WMEURMPT.getColorFromAge(URDays);
        }
      }
      var HRURDays = "" + URDays;
      var HRURLCDays = "-";
      if (lastCommentDays != null) {
        HRURLCDays = "" + lastCommentDays;
      }
      var ttt = HRURDays + " days";
      var closedBy = "";
      if (WMEURMPT.URList[i].data.open == false) {
        closedBy = " - Closed as " + WMEURMPT.getHRURResolutionFromType(WMEURMPT.URList[i].data.resolution) + " by: " + WMEURMPT.URList[i].data.resolvedByName;
      }
      if (WMEURMPT.URAgeColIsLastComment) {
        content += '<td title="' + ttt + closedBy + '" style="text-align: center; background-color: ' + colorCode.bg + "; color: " + colorCode.fc + ';"><span style="width: 100%; display: block;">' + HRURLCDays + "</span></td>";
      } else {
        content += '<td title="' + HRURLCDays + " days" + closedBy + '" style="text-align: center; background-color: ' + colorCode.bg + "; color: " + colorCode.fc + ';"><span style="width: 100%; display: block;">' + HRURDays + "</span></td>";
      }
      content += "<td>" + WMEURMPT.getHRURTypeFromType(WMEURMPT.URList[i].data.type) + "</td>";
      var descriptionHTML = "Not Available";
      var descriptionHTMLNormalized = "N/A" + (new Array(WMEURMPT.URDescriptionMaxLength - 3 + 1)).join("&nbsp");
      if (WMEURMPT.URList[i].data.description != null) {
        descriptionHTML = WMEURMPT.escapeHtml(WMEURMPT.URList[i].data.description);
        descriptionHTMLNormalized = descriptionHTML.substr(0, WMEURMPT.URDescriptionMaxLength);
      }
      if (descriptionHTMLNormalized.length < WMEURMPT.URDescriptionMaxLength) {
        descriptionHTMLNormalized += (new Array(WMEURMPT.URDescriptionMaxLength - descriptionHTMLNormalized.length + 1)).join("&nbsp");
      }
      content += '<td><span id="urt-descriptionur-' + WMEURMPT.URList[i].id + '" title="' + descriptionHTML + '" style="display: block; height: 20px; overflow: hidden; white-space: nowrap; font-family: \'Courier New\', monospace;">' + descriptionHTMLNormalized + "</span></td>";
      content += '<td style="text-align: right"><span  id="urt-commentscount-' + i + '" style="width: 100%; display: block;" title="' + WMEURMPT.escapeHtml(comments) + '">' + WMEURMPT.URList[i].data.session.comments.length + "</span></td>";
      content += '<td style="text-align: right">' + distanceStr + "</td>";
      content += '<td style="width: 20px;" id="urt-targetur-' + i + (WMEURMPT.isDebug ? '" title="' + WMEURMPT.URList[i].id : "") + '"><a href="#"><center><i class="fa fa-crosshairs crosshair icon-screenshot"></i></center></a></td>';
      content += "</tr>";
    }
    content += "</table>";
    WMEURMPT.removeChildElements(div);
    div.innerHTML = displayedURCount + " URs (" + hiddenURCount + " hidden)<br/>" + content;
    var asort = WMEURMPT.getId("urt-table-sort-age");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListUR.ageDSC;
      if (WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.ageDSC || WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.ageASC) {
        newSortMode = WMEURMPT.currentSortModeUR * -1;
      }
      return function() {
        WMEURMPT.changeTableURSortTo(newSortMode + "");
      };
    }();
    asort = WMEURMPT.getId("urt-table-sort-type");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListUR.typeDSC;
      if (WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.typeDSC || WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.typeASC) {
        newSortMode = WMEURMPT.currentSortModeUR * -1;
      }
      return function() {
        WMEURMPT.changeTableURSortTo(newSortMode + "");
      };
    }();
    asort = WMEURMPT.getId("urt-table-sort-ccount");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListUR.commentCountDSC;
      if (WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.commentCountDSC || WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.commentCountASC) {
        newSortMode = WMEURMPT.currentSortModeUR * -1;
      }
      return function() {
        WMEURMPT.changeTableURSortTo(newSortMode + "");
      };
    }();
    asort = WMEURMPT.getId("urt-table-sort-distance");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListUR.distanceDSC;
      if (WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.distanceDSC || WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.distanceASC) {
        newSortMode = WMEURMPT.currentSortModeUR * -1;
      }
      return function() {
        WMEURMPT.changeTableURSortTo(newSortMode + "");
      };
    }();
    asort = WMEURMPT.getId("urt-table-sort-lastcomment");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListUR.lastCommentDSC;
      if (WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.lastCommentDSC || WMEURMPT.currentSortModeUR == WMEURMPT.sortModeListUR.lastCommentASC) {
        newSortMode = WMEURMPT.currentSortModeUR * -1;
      }
      return function() {
        WMEURMPT.changeTableURSortTo(newSortMode + "");
      };
    }();
    window.setTimeout(WMEURMPT.setupURListHandlers);
    WMEURMPT.updateFlashingURs();
  };
  WMEURMPT.setupURListHandlers = function() {
    var table = WMEURMPT.getId("urmpt-ur-table");
    if (table == null) {
      return;
    }
    if (table.childNodes.length != 2) {
      return;
    }
    var rows = table.childNodes[1].childNodes;
    for (var i = 0;i < rows.length;i++) {
      var row = rows[i];
      var cellBlackList = row.childNodes[0];
      var cellTarget = row.childNodes[row.childNodes.length - 1];
      var indexInList = cellTarget.id.split("-")[2];
      cellBlackList.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.blacklistUR, [indexInList]);
      var lonlat = WMEURMPT.URList[parseInt(indexInList)].lonlat;
      var URId = WMEURMPT.URList[parseInt(indexInList)].id;
      cellTarget.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.targetMapToUR, [lonlat.lon + "", lonlat.lat + "", URId + ""]);
    }
  };
  WMEURMPT.updateIHMFromMPList = function(sortMode) {
    var div = WMEURMPT.getId("mpt-list");
    if (WMEURMPT.MPList.length == 0) {
      WMEURMPT.removeChildElements(div);
      div.innerHTML = "";
      return;
    }
    for (var i = 0;i < WMEURMPT.MPList.length;i++) {
      if (WMEURMPT.MPList[i].type == "problem" && WMEURMPT.MPList[i].data.hasOwnProperty("subType") && WMEURMPT.MPList[i].data.subType == 300) {
        var aDate = new Date;
        var now = aDate.getTime();
        var deltaH = (WMEURMPT.MPList[i].data.startTime - now) / 3600000;
        var MPWeight = Math.ceil((720 - deltaH) / 7.2);
        if (deltaH > 0) {
          MPWeight = Math.ceil((720 - deltaH) / 14.4);
        }
        WMEURMPT.MPList[i].data.weight = MPWeight;
      }
    }
    sortMode = typeof sortMode !== "undefined" && sortMode != null ? sortMode : WMEURMPT.currentSortModeMP;
    if (sortMode != WMEURMPT.currentSortModeMP || (sortMode == WMEURMPT.sortModeListMP.distanceDSC || sortMode == WMEURMPT.sortModeListMP.distanceASC) && WMEURMPT.isComputeDistances == true) {
      WMEURMPT.MPList.sort(WMEURMPT.compareMP);
      WMEURMPT.MPMap = WMEURMPT.listToObject(WMEURMPT.MPList);
    }
    WMEURMPT.currentSortModeMP = sortMode;
    var content = "";
    content += '<table id="urmpt-mp-table" class="urt-table">';
    content += "<thead><tr>";
    content += '<td><div class="urt-table-head-icon"><img style="width: 16px" title="Blacklist UR 1 by 1." src="data:image/png;base64,' + WMEURMPT.icon_blacklist + '" /></div></td>';
    content += '<td><div class="urt-table-head-icon"><a href="#" id="mpt-table-sort-priority"><img style="width: 16px" title="Priority.\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_priority + '" /></a></div></td>';
    content += '<td width="100%"><a href="#" id="mpt-table-sort-type" title="Type of the MP.\nClick to sort.">Description</a></td>';
    content += '<td><div class="urt-table-head-icon"><a href="#" id="mpt-table-sort-distance"><img title="Distance to the center of the map.\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_distance + '" /></a></div></td>';
    content += '<td style="width: 20px; display: inline-block; border: none;"><center><div class="urt-table-head-icon"><i class="fa fa-crosshairs crosshair icon-screenshot"></i></div></center></td>';
    content += "</tr></thead>";
    var displayedMPCount = 0;
    var hiddenMPCount = 0;
    for (var i = 0;i < WMEURMPT.MPList.length;i++) {
      if (WMEURMPT.getId("mpt-checkbox-filterHideLimitTo").checked) {
        if (displayedMPCount >= WMEURMPT.currentMPLimitTo) {
          hiddenMPCount += WMEURMPT.MPList.length - i;
          break;
        }
      }
      if (WMEURMPT.isMPFiltered(WMEURMPT.MPList[i])) {
        hiddenMPCount++;
        continue;
      }
      displayedMPCount++;
      var MPWeight = 0;
      var isClosure = false;
      if (WMEURMPT.MPList[i].type == "problem" && WMEURMPT.MPList[i].data.hasOwnProperty("subType") && WMEURMPT.MPList[i].data.subType == 300) {
        isClosure = true;
      }
      if (WMEURMPT.MPList[i].type == "problem") {
        MPWeight = WMEURMPT.MPList[i].data.priority;
      }
      var distance = WMEURMPT.MPList[i].distanceToMapCenter;
      var distanceStr = Math.floor(distance) + "&nbsp;<font size: smaller>m</font>";
      if (distance > 1000) {
        distanceStr = Math.floor(distance / 1000) + "&nbsp;<font size: smaller>km</font>";
      }
      if (distance >= 1000000) {
        distanceStr = Math.floor(distance / 1000000) + "&nbsp;<font size: smaller>Mm</font>";
      }
      content += '<tr id="mpt-tr-' + i + '" >';
      content += '<td class="urt-blacklist" id="mpt-blacklist-' + i + '" style="cursor: pointer;" title="' + (WMEURMPT.MPList[i].blackListed ? "whitelist" : "blacklist") + ' this MP" >&nbsp;</td>';
      var colorCode = new Object;
      colorCode.fc = "#000000";
      if (WMEURMPT.MPList[i].blackListed) {
        colorCode.bg = "#000000";
        colorCode.fc = "#ffffff";
      } else {
        if (WMEURMPT.MPList[i].data.open == false) {
          colorCode.bg = "#00a000";
        } else {
          colorCode.bg = WMEURMPT.getColorFromWieght(MPWeight);
        }
      }
      var HRMPWeight = "" + MPWeight;
      var ttt = "";
      var date = null;
      var closureDate = null;
      var closureTime = null;
      if (isClosure) {
        var tmpDate = (new Date(WMEURMPT.MPList[i].data.startTime)).toLocaleString();
        tmpDate = tmpDate.split(" ");
        closureDate = tmpDate[0];
        closureDate = closureDate.replace(",", "");
        closureDate = closureDate.replace(/20([0-9][0-9])/, "$1");
        closureTime = tmpDate[1];
      }
      content += '<td style="text-align: right; background-color: ' + colorCode.bg + "; color: " + colorCode.fc + ';"><span ' + (WMEURMPT.MPList[i].data.open == true ? ttt != "" ? 'title="' + ttt + '"' : "" : 'title="' + ttt + (ttt != "" ? "\n" : "") + "Closed as " + WMEURMPT.getHRURResolutionFromType(WMEURMPT.MPList[i].data.resolution) + " by: " + WMEURMPT.MPList[i].data.resolvedByName + '" ') + ' style="width: 100%; display: block;">' + (isClosure ? closureDate : HRMPWeight) + "</span></td>";
      var descriptionHTML = WMEURMPT.MPList[i].type == "turnProblem" ? "Turn Problem" : WMEURMPT.getFullMPTypeFromType(WMEURMPT.MPList[i].data.subType);
      var descriptionHTMLNormalized = (new Array(WMEURMPT.MPDescriptionMaxLength - 3 + 1)).join("&nbsp");
      descriptionHTMLNormalized = descriptionHTML.substr(0, WMEURMPT.MPDescriptionMaxLength);
      if (descriptionHTMLNormalized.length < WMEURMPT.MPDescriptionMaxLength) {
        descriptionHTMLNormalized += (new Array(WMEURMPT.MPDescriptionMaxLength - descriptionHTMLNormalized.length + 1)).join("&nbsp");
      }
      content += '<td><span id="mpt-descriptionmp-' + WMEURMPT.MPList[i].id + '" title="' + descriptionHTML + '" style="display: block; height: 20px; overflow: hidden; white-space: nowrap; font-family: \'Courier New\', monospace;">' + descriptionHTMLNormalized + "</span></td>";
      content += '<td style="text-align: right">' + distanceStr + "</td>";
      content += '<td style="width: 20px;" id="mpt-targetmp-' + i + (WMEURMPT.isDebug ? '" title="' + WMEURMPT.MPList[i].id : "") + '"><a href="#"><center><i class="fa fa-crosshairs crosshair icon-screenshot"></i></center></a></td>';
      content += "</tr>";
    }
    content += "</table>";
    WMEURMPT.removeChildElements(div);
    div.innerHTML = displayedMPCount + " MPs (" + hiddenMPCount + " hidden)<br/>" + content;
    var asort = WMEURMPT.getId("mpt-table-sort-priority");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListMP.priorityDSC;
      if (WMEURMPT.currentSortModeMP == WMEURMPT.sortModeListMP.priorityDSC || WMEURMPT.currentSortModeMP == WMEURMPT.sortModeListMP.priorityASC) {
        newSortMode = WMEURMPT.currentSortModeMP * -1;
      }
      return function() {
        WMEURMPT.changeTableMPSortTo(newSortMode + "");
      };
    }();
    asort = WMEURMPT.getId("mpt-table-sort-type");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListMP.typeDSC;
      if (WMEURMPT.currentSortModeMP == WMEURMPT.sortModeListMP.typeDSC || WMEURMPT.currentSortModeMP == WMEURMPT.sortModeListMP.typeASC) {
        newSortMode = WMEURMPT.currentSortModeMP * -1;
      }
      return function() {
        WMEURMPT.changeTableMPSortTo(newSortMode + "");
      };
    }();
    asort = WMEURMPT.getId("mpt-table-sort-distance");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListMP.distanceDSC;
      if (WMEURMPT.currentSortModeMP == WMEURMPT.sortModeListMP.distanceDSC || WMEURMPT.currentSortModeMP == WMEURMPT.sortModeListMP.distanceASC) {
        newSortMode = WMEURMPT.currentSortModeMP * -1;
      }
      return function() {
        WMEURMPT.changeTableMPSortTo(newSortMode + "");
      };
    }();
    window.setTimeout(WMEURMPT.setupMPListHandlers);
    WMEURMPT.updateFlashingMPs();
  };
  WMEURMPT.setupMPListHandlers = function() {
    var table = WMEURMPT.getId("urmpt-mp-table");
    if (table == null) {
      return;
    }
    if (table.childNodes.length != 2) {
      return;
    }
    var rows = table.childNodes[1].childNodes;
    for (var i = 0;i < rows.length;i++) {
      var row = rows[i];
      var cellBlackList = row.childNodes[0];
      var cellTarget = row.childNodes[row.childNodes.length - 1];
      var indexInList = cellTarget.id.split("-")[2];
      cellBlackList.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.blacklistMP, [indexInList]);
      var lonlat = WMEURMPT.MPList[parseInt(indexInList)].lonlat;
      var MPId = WMEURMPT.MPList[parseInt(indexInList)].id;
      cellTarget.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.targetMapToMP, [lonlat.lon, lonlat.lat, MPId]);
    }
  };
  WMEURMPT.updateIHMFromMCList = function(sortMode) {
    var div = WMEURMPT.getId("mct-list");
    if (WMEURMPT.MCList.length == 0) {
      WMEURMPT.removeChildElements(div);
      div.innerHTML = "";
      return;
    }
    sortMode = typeof sortMode !== "undefined" && sortMode != null ? sortMode : WMEURMPT.currentSortModeMC;
    if (sortMode != WMEURMPT.currentSortModeMC || (sortMode == WMEURMPT.sortModeListMC.distanceDSC || sortMode == WMEURMPT.sortModeListMC.distanceASC) && WMEURMPT.isComputeDistances == true) {
      WMEURMPT.MCList.sort(WMEURMPT.compareMC);
      WMEURMPT.MCMap = WMEURMPT.listToObject(WMEURMPT.MCList);
    }
    WMEURMPT.currentSortModeMC = sortMode;
    var content = "";
    content += '<table id="urmpt-mc-table" class="urt-table">';
    content += "<thead><tr>";
    content += '<td><div class="urt-table-head-icon"><img style="width: 16px" title="Blacklist MC 1 by 1." src="data:image/png;base64,' + WMEURMPT.icon_blacklist + '" /></div></td>';
    content += '<td><div class="urt-table-head-icon"><a href="#" id="mct-table-sort-age"><img style="width: 16px" title="Age of the MC.\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_age + '" /></a></div></td>';
    content += '<td width="100%">Subject</td>';
    content += '<td width="100%">Body</td>';
    content += '<td><div class="mct-table-head-icon"><a href="#" id="mct-table-sort-ccount"><img style="width: 16px" title="Comments count\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_comments + '" /></a></div></td>';
    content += '<td><div class="urt-table-head-icon"><a href="#" id="mct-table-sort-distance"><img title="Distance to the center of the map.\nClick to sort." src="data:image/png;base64,' + WMEURMPT.icon_distance + '" /></a></div></td>';
    content += '<td style="width: 20px; display: inline-block; border: none;"><center><div class="urt-table-head-icon"><i class="fa fa-crosshairs crosshair icon-screenshot"></i></div></center></td>';
    content += "</tr></thead>";
    var displayedMCCount = 0;
    var hiddenMCCount = 0;
    for (var i = 0;i < WMEURMPT.MCList.length;i++) {
      if (WMEURMPT.getId("mct-checkbox-filterHideLimitTo").checked) {
        if (displayedMCCount >= WMEURMPT.currentMCLimitTo) {
          hiddenMCCount += WMEURMPT.MCList.length - i;
          break;
        }
      }
      if (WMEURMPT.isMCFiltered(WMEURMPT.MCList[i])) {
        hiddenMCCount++;
        continue;
      }
      displayedMCCount++;
      var MCDays = WMEURMPT.getDuration(WMEURMPT.MCList[i].data.createdOn);
      var conversation = "";
      if (WMEURMPT.MCList[i].data.hasOwnProperty("conversation")) {
        var conversationArray = [];
        WMEURMPT.MCList[i].data.conversation.forEach(function(c, j) {
          var text = c.userName + " (" + (new Date(c.createdOn)).toLocaleString() + "):\n";
          text += c.text;
          conversationArray.push(text);
          if (j == WMEURMPT.MCList[i].data.conversation.length - 1 && c.userName == WMEURMPT.me.userName) {
            WMEURMPT.MCList[i].lastVisitCommentsCount = WMEURMPT.MCList[i].data.conversation.length;
          }
        });
        conversation = conversationArray.join("\n\n");
      }
      var distance = WMEURMPT.MCList[i].distanceToMapCenter;
      var distanceStr = Math.floor(distance) + "&nbsp;<font size: smaller>m</font>";
      if (distance > 1000) {
        distanceStr = Math.floor(distance / 1000) + "&nbsp;<font size: smaller>km</font>";
      }
      if (distance >= 1000000) {
        distanceStr = Math.floor(distance / 1000000) + "&nbsp;<font size: smaller>Mm</font>";
      }
      content += '<tr id="mct-tr-' + i + '" >';
      content += '<td class="urt-blacklist" id="mct-blacklist-' + i + '" style="cursor: pointer; ' + (WMEURMPT.MCList[i].blackListed ? "background-color: #000; color: #FFF;" : "background-color: #FFF; color: #000;") + '" title="' + (WMEURMPT.MCList[i].blackListed ? "whitelist" : "blacklist") + ' this MC" >&nbsp;</td>';
      var ttt = "";
      var date = null;
      content += '<td title="' + MCDays + ' days" style="text-align: center;"><span style="width: 100%; display: block;">' + MCDays + "</span></td>";
      var subjectHTML = WMEURMPT.MCList[i].data.subject;
      var subjectHTMLNormalized = (new Array(WMEURMPT.MCSubjectMaxLength - 3 + 1)).join("&nbsp");
      subjectHTMLNormalized = subjectHTML.substr(0, WMEURMPT.MCSubjectMaxLength);
      if (subjectHTMLNormalized.length < WMEURMPT.MCSubjectMaxLength) {
        subjectHTMLNormalized += (new Array(WMEURMPT.MCSubjectMaxLength - subjectHTMLNormalized.length + 1)).join("&nbsp");
      }
      content += '<td><span id="mct-subjectmc-' + WMEURMPT.MCList[i].id + '" title="' + subjectHTML + '" style="display: block; height: 20px; overflow: hidden; white-space: nowrap; font-family: \'Courier New\', monospace;">' + subjectHTMLNormalized + "</span></td>";
      var bodyHTML = WMEURMPT.MCList[i].data.body;
      var bodyHTMLNormalized = (new Array(WMEURMPT.MCBodyMaxLength - 3 + 1)).join("&nbsp");
      bodyHTMLNormalized = bodyHTML.substr(0, WMEURMPT.MCBodyMaxLength);
      if (bodyHTMLNormalized.length < WMEURMPT.MCBodyMaxLength) {
        bodyHTMLNormalized += (new Array(WMEURMPT.MCBodyMaxLength - bodyHTMLNormalized.length + 1)).join("&nbsp");
      }
      content += '<td><span id="mct-bodymc-' + WMEURMPT.MCList[i].id + '" title="' + bodyHTML + '" style="display: block; height: 20px; overflow: hidden; white-space: nowrap; font-family: \'Courier New\', monospace;">' + bodyHTMLNormalized + "</span></td>";
      content += '<td style="text-align: right"><span  id="mct-commentscount-' + i + '" style="width: 100%; display: block;" title="' + WMEURMPT.escapeHtml(conversation) + '">' + (WMEURMPT.MCList[i].data.hasOwnProperty("conversation") ? WMEURMPT.MCList[i].data.conversation.length : "0") + "</span></td>";
      content += '<td style="text-align: right">' + distanceStr + "</td>";
      content += '<td style="width: 20px;" id="mct-targetmc-' + i + (WMEURMPT.isDebug ? '" title="' + WMEURMPT.MCList[i].id : "") + '"><a href="#"><center><i class="fa fa-crosshairs crosshair icon-screenshot"></i></center></a></td>';
      content += "</tr>";
    }
    content += "</table>";
    WMEURMPT.removeChildElements(div);
    div.innerHTML = displayedMCCount + " MCs (" + hiddenMCCount + " hidden)<br/>" + content;
    var asort = WMEURMPT.getId("mct-table-sort-age");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListMC.ageDSC;
      if (WMEURMPT.currentSortModeMC == WMEURMPT.sortModeListMC.ageDSC || WMEURMPT.currentSortModeMC == WMEURMPT.sortModeListMC.ageASC) {
        newSortMode = WMEURMPT.currentSortModeMC * -1;
      }
      return function() {
        WMEURMPT.changeTableMCSortTo(newSortMode + "");
      };
    }();
    asort = WMEURMPT.getId("mct-table-sort-distance");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListMC.distanceDSC;
      if (WMEURMPT.currentSortModeMC == WMEURMPT.sortModeListMC.distanceDSC || WMEURMPT.currentSortModeMC == WMEURMPT.sortModeListMC.distanceASC) {
        newSortMode = WMEURMPT.currentSortModeMC * -1;
      }
      return function() {
        WMEURMPT.changeTableMCSortTo(newSortMode + "");
      };
    }();
    asort = WMEURMPT.getId("mct-table-sort-ccount");
    asort.onclick = function() {
      var newSortMode = WMEURMPT.sortModeListMC.commentCountDSC;
      if (WMEURMPT.currentSortModeMC == WMEURMPT.sortModeListMC.commentCountDSC || WMEURMPT.currentSortModeMC == WMEURMPT.sortModeListMC.commentCountASC) {
        newSortMode = WMEURMPT.currentSortModeMC * -1;
      }
      return function() {
        WMEURMPT.changeTableMCSortTo(newSortMode + "");
      };
    }();
    window.setTimeout(WMEURMPT.setupMCListHandlers);
    WMEURMPT.updateFlashingMCs();
  };
  WMEURMPT.setupMCListHandlers = function() {
    var table = WMEURMPT.getId("urmpt-mc-table");
    if (table == null) {
      return;
    }
    if (table.childNodes.length != 2) {
      return;
    }
    var rows = table.childNodes[1].childNodes;
    for (var i = 0;i < rows.length;i++) {
      var row = rows[i];
      var cellBlackList = row.childNodes[0];
      var cellTarget = row.childNodes[row.childNodes.length - 1];
      var indexInList = cellTarget.id.split("-")[2];
      cellBlackList.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.blacklistMC, [indexInList]);
      var lonlat = WMEURMPT.MCList[parseInt(indexInList)].lonlat;
      var MCId = WMEURMPT.MCList[parseInt(indexInList)].id;
      cellTarget.onclick = WMEURMPT.getFunctionWithArgs(WMEURMPT.targetMapToMC, [lonlat.lon, lonlat.lat, MCId]);
    }
  };
  WMEURMPT.updateFlashingURs = function() {
    for (var i = 0;i < WMEURMPT.URList.length;i++) {
      if (WMEURMPT.isURFiltered(WMEURMPT.URList[i])) {
        continue;
      }
      var span = WMEURMPT.getId("urt-commentscount-" + i);
      var tr = WMEURMPT.getId("urt-tr-" + i);
      if (span == null) {
        continue;
      }
      if (tr == null) {
        continue;
      }
      if (WMEURMPT.URList[i].alreadyVisited == false && tr.className != "urt-bg-highlighted") {
        tr.className = "urt-bg-highlighted";
      } else {
        if (WMEURMPT.URList[i].alreadyVisited == true) {
          tr.className = "";
        }
      }
      if (WMEURMPT.URList[i].data.session.isFollowing == true) {
        tr.className = "urt-bg-ifollow";
      }
      if (WMEURMPT.URList[i].id == WMEURMPT.selectedURID) {
        tr.className = "urt-bg-selected";
      }
      if (WMEURMPT.URList[i].data.hasOwnProperty("session") == true && WMEURMPT.URList[i].lastVisitCommentsCount < WMEURMPT.URList[i].data.session.comments.length) {
        span.className = "urt-bg-newcomments";
      } else {
        span.className = "";
      }
    }
    WMEURMPT.flashOdd = !WMEURMPT.flashOdd;
  };
  WMEURMPT.updateFlashingMPs = function() {
    for (var i = 0;i < WMEURMPT.MPList.length;i++) {
      var tr = WMEURMPT.getId("mpt-tr-" + i);
      if (tr == null) {
        continue;
      }
      if (WMEURMPT.MPList[i].alreadyVisited == false && tr.className != "urt-bg-highlighted") {
        tr.className = "urt-bg-highlighted";
      } else {
        if (WMEURMPT.MPList[i].alreadyVisited == true) {
          tr.className = "";
        }
      }
      if (WMEURMPT.MPList[i].id == WMEURMPT.selectedMPID) {
        tr.className = "urt-bg-selected";
      }
    }
  };
  WMEURMPT.updateFlashingMCs = function() {
    for (var i = 0;i < WMEURMPT.MCList.length;i++) {
      var tr = WMEURMPT.getId("mct-tr-" + i);
      if (tr == null) {
        continue;
      }
      if (WMEURMPT.MCList[i].alreadyVisited == false && tr.className != "urt-bg-highlighted") {
        tr.className = "urt-bg-highlighted";
      } else {
        if (WMEURMPT.MCList[i].alreadyVisited == true) {
          tr.className = "";
        }
      }
      if (WMEURMPT.MCList[i].id == WMEURMPT.selectedMCID) {
        tr.className = "urt-bg-selected";
      }
      if (WMEURMPT.MCList[i].data.hasOwnProperty("conversation") == true && WMEURMPT.MCList[i].lastVisitCommentsCount < WMEURMPT.MCList[i].data.conversation.length) {
        var span = WMEURMPT.getId("mct-commentscount-" + i);
        if (span != null) {
          span.className = "urt-bg-newcomments";
        }
      }
    }
  };
  WMEURMPT.updateLongTextCrop = function() {
    var ur_table = WMEURMPT.getId("urmpt-ur-table");
    var mp_table = WMEURMPT.getId("urmpt-mp-table");
    var mc_table = WMEURMPT.getId("urmpt-mc-table");
    if (ur_table) {
      if (ur_table.children.length >= 2) {
        var lines = ur_table.children[1].children;
        var spanText = null;
        for (var i = 0;i < lines.length;i++) {
          spanText = lines[i].children[3].firstChild;
          if (spanText == null) {
            continue;
          }
          if (typeof spanText === "undefined") {
            continue;
          }
          var urIndices = lines[i].id.match(/urt-tr-([0-9]+)/);
          if (urIndices.length != 2) {
            continue;
          }
          var urIndex = parseInt(urIndices[1]);
          if (WMEURMPT.URList[urIndex].data.description == null) {
            continue;
          }
          if (WMEURMPT.URList[urIndex].data.description.length <= WMEURMPT.URDescriptionMaxLength) {
            continue;
          }
          if (typeof WMEURMPT.URList[urIndex].data.descriptionOffset === "undefined") {
            WMEURMPT.URList[urIndex].data.descriptionOffset = -10;
          }
          var pos = WMEURMPT.URList[urIndex].data.descriptionOffset;
          if (WMEURMPT.URList[urIndex].data.descriptionOffset < 0) {
            pos = 0;
          }
          var remaining = WMEURMPT.URList[urIndex].data.description.length - pos;
          if (remaining < 10) {
            spanText.innerHTML = WMEURMPT.escapeHtml(WMEURMPT.URList[urIndex].data.description.substr(0, WMEURMPT.URDescriptionMaxLength));
            WMEURMPT.URList[urIndex].data.descriptionOffset = -10;
          } else {
            if (remaining < WMEURMPT.URDescriptionMaxLength) {
              WMEURMPT.URList[urIndex].data.descriptionOffset++;
            } else {
              if (WMEURMPT.URList[urIndex].data.descriptionOffset > 0) {
                spanText.innerHTML = WMEURMPT.escapeHtml(WMEURMPT.URList[urIndex].data.description.substr(WMEURMPT.URList[urIndex].data.descriptionOffset + 1, WMEURMPT.URDescriptionMaxLength));
              }
              WMEURMPT.URList[urIndex].data.descriptionOffset++;
            }
          }
        }
      }
    }
    if (mp_table) {
      if (mp_table.children.length >= 2) {
        var lines = mp_table.children[1].children;
        var spanText = null;
        for (var i = 0;i < lines.length;i++) {
          spanText = lines[i].children[2].firstChild;
          if (spanText == null) {
            continue;
          }
          if (typeof spanText === "undefined") {
            continue;
          }
          var mpIndices = lines[i].id.match(/mpt-tr-([0-9]+)/);
          if (mpIndices.length != 2) {
            continue;
          }
          var mpIndex = parseInt(mpIndices[1]);
          var description = WMEURMPT.MPList[mpIndex].type == "turnProblem" ? "Turn Problem" : WMEURMPT.getFullMPTypeFromType(WMEURMPT.MPList[mpIndex].data.subType);
          if (description == null) {
            continue;
          }
          if (description.length <= WMEURMPT.MPDescriptionMaxLength) {
            continue;
          }
          if (typeof WMEURMPT.MPList[mpIndex].data.descriptionOffset === "undefined") {
            WMEURMPT.MPList[mpIndex].data.descriptionOffset = -10;
          }
          var pos = WMEURMPT.MPList[mpIndex].data.descriptionOffset;
          if (WMEURMPT.MPList[mpIndex].data.descriptionOffset < 0) {
            pos = 0;
          }
          var remaining = description.length - pos;
          if (remaining < 10) {
            spanText.innerHTML = WMEURMPT.escapeHtml(description.substr(0, WMEURMPT.MPDescriptionMaxLength));
            WMEURMPT.MPList[mpIndex].data.descriptionOffset = -10;
          } else {
            if (remaining < WMEURMPT.MPDescriptionMaxLength) {
              WMEURMPT.MPList[mpIndex].data.descriptionOffset++;
            } else {
              if (WMEURMPT.MPList[mpIndex].data.descriptionOffset > 0) {
                spanText.innerHTML = WMEURMPT.escapeHtml(description.substr(WMEURMPT.MPList[mpIndex].data.descriptionOffset + 1, WMEURMPT.MPDescriptionMaxLength));
              }
              WMEURMPT.MPList[mpIndex].data.descriptionOffset++;
            }
          }
        }
      }
    }
    if (mc_table) {
      if (mc_table.children.length >= 2) {
        var lines = mc_table.children[1].children;
        var spanText = null;
        for (var i = 0;i < lines.length;i++) {
          [{index:2, att:"subject", maxl:WMEURMPT.MCSubjectMaxLength}, {index:3, att:"body", maxl:WMEURMPT.MCBodyMaxLength}].forEach(function(child) {
            spanText = lines[i].children[child.index].firstChild;
            if (spanText == null) {
              return;
            }
            if (typeof spanText === "undefined") {
              return;
            }
            var mcIndices = lines[i].id.match(/mct-tr-([0-9]+)/);
            if (mcIndices.length != 2) {
              return;
            }
            var mcIndex = parseInt(mcIndices[1]);
            var theMC = WMEURMPT.MCList[mcIndex];
            if (theMC.data[child.att] == null) {
              return;
            }
            if (theMC.data[child.att].length <= child.maxl) {
              return;
            }
            if (typeof theMC.data[child.att + "Offset"] === "undefined") {
              theMC.data[child.att + "Offset"] = -10;
            }
            var pos = theMC.data[child.att + "Offset"];
            if (theMC.data[child.att + "Offset"] < 0) {
              pos = 0;
            }
            var text = theMC.data[child.att];
            var remaining = theMC.data[child.att].length - pos;
            if (remaining < 10) {
              spanText.innerHTML = WMEURMPT.escapeHtml(text.substr(0, child.maxl));
              theMC.data[child.att + "Offset"] = -10;
            } else {
              if (remaining < child.maxl) {
                theMC.data[child.att + "Offset"]++;
              } else {
                if (theMC.data[child.att + "Offset"] > 0) {
                  spanText.innerHTML = WMEURMPT.escapeHtml(text.substr(theMC.data[child.att + "Offset"] + 1, child.maxl));
                }
                theMC.data[child.att + "Offset"]++;
              }
            }
          });
        }
      }
    }
    window.setTimeout(WMEURMPT.updateLongTextCrop, 150);
  };
  WMEURMPT.targetMapToUR = function(lon, lat, URId) {
    WMEURMPT.log("Target map to UR: " + URId);
    WMEURMPT.selectedURID = URId;
    WMEURMPT.updateFlashingURs();
    var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(parseFloat(lon), parseFloat(lat));
    WMEURMPT.wazeMap.setCenter(xy);
    URId = parseInt(URId);
    WMEURMPT.wazeMap.updateRequestLayer.setVisibility(true);
    window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.selectURById, [{URId:URId, attempts:0}]), 250);
  };
  WMEURMPT.targetMapToMP = function(lon, lat, MPId) {
    WMEURMPT.log("Target map to MP: " + MPId);
    WMEURMPT.selectedMPID = MPId;
    WMEURMPT.updateFlashingMPs();
    var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(lon, lat);
    WMEURMPT.wazeMap.setCenter(xy);
    WMEURMPT.wazeMap.problemLayer.setVisibility(true);
    window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.selectMPById, [{MPId:MPId, attempts:0}]), 250);
  };
  WMEURMPT.targetMapToMC = function(lon, lat, MCId) {
    WMEURMPT.log("Target map to MC: " + MCId);
    WMEURMPT.selectedMCID = MCId;
    WMEURMPT.updateFlashingMCs();
    var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(lon, lat);
    WMEURMPT.wazeMap.setCenter(xy);
    WMEURMPT.wazeMap.getLayerByUniqueName("mapComments").setVisibility(true);
    window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.selectMCById, [{MCId:MCId, attempts:0}]), 250);
  };
  WMEURMPT.selectURById = function(URId) {
    if (URId.attempts > 10) {
      WMEURMPT.log("Can't select UR " + URId.URId);
      return;
    }
    if (URId.attempts == 0) {
      if (WMEURMPT.wazeMap.panelRegion.hasOwnProperty("currentView")) {
        WMEURMPT.wazeMap.panelRegion.currentView.destroy();
      }
    }
    WMEURMPT.wazeModel.updateRequestSessions.get([URId.URId]);
    var session = WMEURMPT.wazeModel.updateRequestSessions.objects[URId.URId];
    var ur = WMEURMPT.wazeModel.mapUpdateRequests.get(URId.URId);
    if (ur != null && session != null) {
      WMEURMPT.logBeta("Select UR by ID: " + URId.URId);
      if (WMEURMPT.wazeMap.updateRequestLayer.markers.hasOwnProperty(URId.URId)) {
        WMEURMPT.wazeMap.updateRequestLayer.markers[URId.URId].icon.$div[0].click();
        WMEURMPT.URVisited(URId.URId);
        WMEURMPT.currentURID = URId.URId;
        WMEURMPT.setupFollowAndSendListner();
        window.setTimeout(WMEURMPT.openConversationPannel, 100);
        WMEURMPT.log("UR selected: " + WMEURMPT.currentURID);
      }
      if (!WMEURMPT.isAutoScan) {
        var theUR = WMEURMPT.getURFromId(URId.URId);
        theUR.refreshFromWMEData(true);
        WMEURMPT.updateIHMFromURList();
      } else {
        WMEURMPT.newDataAvailableStarts();
      }
      return;
    }
    URId.attempts++;
    WMEURMPT.log("Cannot select UR " + URId.URId + ". Trying again " + URId.attempts + "/10...");
    window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.selectURById, [URId]), 100);
  };
  WMEURMPT.selectMPById = function(MPId) {
    if (MPId.attempts > 10) {
      WMEURMPT.log("Can't select MP " + MPId.MPId);
      return;
    }
    if (MPId.attempts == 0) {
      if (WMEURMPT.wazeMap.panelRegion.hasOwnProperty("currentView")) {
        WMEURMPT.wazeMap.panelRegion.currentView.destroy();
      }
    }
    var mp = WMEURMPT.wazeModel.problems.get(MPId.MPId);
    var tp = null;
    WMEURMPT.logBeta("mp :", mp);
    if (mp != null) {
      if (WMEURMPT.wazeMap.problemLayer.markers.hasOwnProperty(MPId.MPId)) {
        WMEURMPT.wazeMap.problemLayer.markers[MPId.MPId].icon.$div[0].click();
      }
    }
    if (mp != null) {
      WMEURMPT.MPVisited(MPId.MPId);
      WMEURMPT.currentMPID = MPId.MPId;
      WMEURMPT.newDataAvailableStarts();
      return;
    }
    MPId.attempts++;
    WMEURMPT.log("Cannot select MP " + MPId.MPId + ". Trying again " + MPId.attempts + "/10...");
    window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.selectMPById, [MPId]), 100);
  };
  WMEURMPT.selectMCById = function(MCId) {
    if (MCId.attempts > 10) {
      WMEURMPT.log("Can't select MC " + MCId.MCId);
      return;
    }
    if (MCId.attempts == 0) {
      if (WMEURMPT.wazeMap.panelRegion.hasOwnProperty("currentView")) {
        WMEURMPT.wazeMap.panelRegion.currentView.destroy();
      }
    }
    var mc = WMEURMPT.wazeModel.mapComments.get(MCId.MCId);
    WMEURMPT.logBeta("mc :", mc);
    if (mc != null) {
    }
    if (mc != null) {
      WMEURMPT.MCVisited(MCId.MCId);
      WMEURMPT.currentMCID = MCId.MCId;
      WMEURMPT.newDataAvailableStarts();
      return;
    }
    MCId.attempts++;
    WMEURMPT.log("Cannot select MC " + MCId.MCId + ". Trying again " + MCId.attempts + "/10...");
    window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.selectMCById, [MCId]), 100);
  };
  WMEURMPT.newDataAvailableStarts = function() {
    if (WMEURMPT.isScanningWME) {
      return;
    }
    if (!WMEURMPT.isAutoScan) {
      var urID = WMEURMPT.getSelectedUR();
      WMEURMPT.log("scan only selected: UR: " + urID);
      if (urID != null) {
        var theUR = WMEURMPT.getURFromId(urID);
        if (theUR != null) {
          theUR.refreshFromWMEData(true);
          WMEURMPT.updateIHMFromURList();
        }
      }
      var mpID = WMEURMPT.getSelectedProblem();
      WMEURMPT.log("scan only selected: MP: " + mpID);
      if (mpID != null) {
        var theMP = WMEURMPT.getURFromId(mpID);
        if (theMP != null) {
          theMP.refreshFromWMEData();
          WMEURMPT.updateIHMFromMPList();
        }
      }
      var mcID = WMEURMPT.getSelectedMC();
      WMEURMPT.log("scan only selected: MC: " + mcID);
      if (mcID != null) {
        var theMC = WMEURMPT.getMCFromId(mcID);
        if (theMC != null) {
          theMC.refreshFromWMEData(true);
          WMEURMPT.updateIHMFromMCList();
        }
      }
      return;
    }
    WMEURMPT.isScanningWME = true;
    WMEURMPT.newDataAvailable(0);
  };
  WMEURMPT.newDataAvailable = function(i) {
    try {
      var URs = WMEURMPT.wazeModel.mapUpdateRequests.getObjectArray();
      var MPs = WMEURMPT.wazeModel.problems.getObjectArray();
      var MCs = WMEURMPT.wazeModel.mapComments.getObjectArray();
      var urcount = URs.length;
      var mpcount = MPs.length;
      var mccount = MCs.length;
      var count = urcount + mpcount + mccount;
      WMEURMPT.log("new data available: i/count:" + i + "/" + count);
      var pb = new WMEURMPT.ProgressBar(WMEURMPT.getId("urt-progressBar"));
      if (i == 0) {
        WMEURMPT.log("Starting WME data scan...");
        pb.update(0);
        pb.show();
        WMEURMPT.showPBInfo(true);
        WMEURMPT.info("Scanning...");
      }
      if (i >= count) {
        WMEURMPT.log("WME data scan ended");
        WMEURMPT.updateRequestSessions();
        WMEURMPT.isScanningWME = false;
        WMEURMPT.showPBInfo(false);
        pb.hide();
        pb.update(0);
        WMEURMPT.info();
        WMEURMPT.updateIHMFromURList();
        WMEURMPT.updateIHMFromMPList();
        WMEURMPT.updateIHMFromMCList();
        WMEURMPT.saveURMPLists();
        return;
      }
      pb.update(Math.round(i / count * 100));
      if (i < urcount) {
        var index = i;
        var URId = URs[index].attributes.id;
        var theUR = WMEURMPT.getURFromId(URId);
        if (WMEURMPT.ul < WMEURMPT.rl4cp && URs[index].attributes.open == false) {
          if (theUR != null) {
            WMEURMPT.URList.splice(WMEURMPT.URMap[URId], 1);
            WMEURMPT.URMap = WMEURMPT.listToObject(WMEURMPT.URList);
          }
        } else {
          WMEURMPT.logDebug("scan WME: the ur: ", theUR);
          WMEURMPT.logDebug("scan WME: the ur index: ", URs[index]);
          var URxy = new OpenLayers.Geometry.Point(URs[index].geometry.x, URs[index].geometry.y);
          var URLonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(URs[index].geometry.x, URs[index].geometry.y);
          if (WMEURMPT.inScreenUpdatableArea(URxy) || WMEURMPT.isInAreas(URLonlat)) {
            WMEURMPT.logDebug("scan WME: in screen");
            if (theUR == null) {
              theUR = new WMEURMPT.URT_UR(URs[index].attributes.id, URLonlat.lon, URLonlat.lat);
              if (theUR.refreshFromWMEData(false)) {
                WMEURMPT.logDebug("scan WME: added");
                WMEURMPT.URList.push(theUR);
                WMEURMPT.URMap = WMEURMPT.listToObject(WMEURMPT.URList);
              } else {
                WMEURMPT.logDebug("scan WME: NOT added");
              }
            } else {
              theUR.refreshFromWMEData(false);
            }
          } else {
            if (theUR != null) {
              WMEURMPT.URList.splice(WMEURMPT.URMap[URId], 1);
              WMEURMPT.MPMap = WMEURMPT.listToObject(WMEURMPT.MPList);
            }
          }
        }
      } else {
        if (i - urcount < mpcount) {
          var index = i - urcount;
          var MPId = MPs[index].attributes.id;
          var theMP = WMEURMPT.getMPFromId(MPId);
          if (WMEURMPT.ul < WMEURMPT.rl4cp && MPs[index].attributes.open == false) {
            if (theMP != null) {
              WMEURMPT.MPList.splice(WMEURMPT.MPMap[MPId], 1);
              WMEURMPT.MPMap = WMEURMPT.listToObject(WMEURMPT.MPList);
            }
          } else {
            var MPxy = new OpenLayers.Geometry.Point(MPs[index].geometry.x, MPs[index].geometry.y);
            var MPLonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(MPs[index].geometry.x, MPs[index].geometry.y);
            if (WMEURMPT.inScreenUpdatableArea(MPxy) || WMEURMPT.isInAreas(MPLonlat)) {
              if (theMP == null) {
                theMP = new WMEURMPT.URT_MP(MPs[index].attributes.id, MPLonlat.lon, MPLonlat.lat);
                if (theMP.refreshFromWMEData()) {
                  WMEURMPT.MPList.push(theMP);
                  WMEURMPT.MPMap = WMEURMPT.listToObject(WMEURMPT.MPList);
                }
              } else {
                theMP.refreshFromWMEData();
              }
            } else {
              if (theMP != null) {
                WMEURMPT.MPList.splice(WMEURMPT.MPMap[MPId], 1);
                WMEURMPT.MPMap = WMEURMPT.listToObject(WMEURMPT.MPList);
              }
            }
          }
        } else {
          var index = i - urcount - mpcount;
          var MCId = MCs[index].attributes.id;
          var theMC = WMEURMPT.getMCFromId(MCId);
          var MCxy = new OpenLayers.Geometry.Point(MCs[index].geometry.getCentroid().x, MCs[index].geometry.getCentroid().y);
          var MCLonlat = OpenLayers.Layer.SphericalMercator.inverseMercator(MCs[index].geometry.getCentroid().x, MCs[index].geometry.getCentroid().y);
          if (WMEURMPT.inScreenUpdatableArea(MCxy) || WMEURMPT.isInAreas(MCLonlat)) {
            WMEURMPT.log("in area");
            if (theMC == null) {
              theMC = new WMEURMPT.URT_MC(MCs[index].attributes.id, MCLonlat.lon, MCLonlat.lat);
              if (theMC.refreshFromWMEData()) {
                WMEURMPT.MCList.push(theMC);
                WMEURMPT.MCMap[theMC.id] = WMEURMPT.MCList.length - 1;
              }
            } else {
              theMC.refreshFromWMEData();
            }
          } else {
            WMEURMPT.log("not in area");
            if (theMC != null) {
              WMEURMPT.MCList.splice(WMEURMPT.MCMap[MCId], 1);
              delete WMEURMPT.MCMap[MCId];
            }
          }
        }
      }
      i++;
      window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.newDataAvailable, [i]), 0);
    } catch (err) {
      WMEURMPT.log("Warning during auto scan probably due to a map move or a map zoom changed before end of scan: ", err);
      WMEURMPT.isScanningWME = false;
      window.setTimeout(WMEURMPT.newDataAvailableStarts, 1000);
    }
  };
  WMEURMPT.setupListener = function() {
    var urs = WMEURMPT.getElementsByClassName("map-problem");
    for (var i = 0;i < urs.length;i++) {
      var ur = urs[i];
      ur.addEventListener("click", WMEURMPT.clickUR, false);
    }
  };
  WMEURMPT.clickUR = function() {
    if (typeof this.tagName !== "undefined" && this.tagName == "DIV") {
      if (this.className.indexOf("user-generated") == -1 && this.className.indexOf("has-comments") == -1) {
        WMEURMPT.currentMPID = parseInt(this.getAttribute("data-id"));
        WMEURMPT.selectedMPID = WMEURMPT.currentMPID;
        WMEURMPT.MPVisited(WMEURMPT.currentMPID);
        WMEURMPT.log("MP clicked: " + WMEURMPT.currentMPID);
        var mp = WMEURMPT.getMPFromId(WMEURMPT.currentMPID);
        if (mp) {
          mp.refreshFromWMEData();
        }
        WMEURMPT.updateIHMFromMPList();
      } else {
        WMEURMPT.currentURID = parseInt(this.getAttribute("data-id"));
        WMEURMPT.URVisited(WMEURMPT.currentURID);
        WMEURMPT.logBeta("current UR ID: " + WMEURMPT.currentURID);
        WMEURMPT.setupFollowAndSendListner();
        WMEURMPT.selectedURID = WMEURMPT.currentURID;
        WMEURMPT.log("UR clicked: " + WMEURMPT.currentURID);
        var ur = WMEURMPT.getURFromId(WMEURMPT.currentURID);
        if (ur) {
          ur.refreshFromWMEData(true);
        }
        WMEURMPT.updateIHMFromURList();
      }
    }
  };
  WMEURMPT.setupFollowAndSendListner = function() {
    var followPatched = false;
    var sendPatched = false;
    var btnFollow = document.getElementById("follow-on");
    if (btnFollow != null) {
      if (typeof btnFollow.urt_listener === "undefined") {
        btnFollow.addEventListener("change", WMEURMPT.clickFollowUR, false);
        btnFollow.urt_listener = true;
        followPatched = true;
      }
      var btnsSend = WMEURMPT.getElementsByClassName("btn", btnFollow.parentNode.parentNode);
      if (btnsSend.length == 1) {
        var btnSend = btnsSend[0];
        if (typeof btnSend.urt_listener === "undefined") {
          btnSend.addEventListener("click", function() {
            window.setTimeout(WMEURMPT.conversationSent, 400);
          }, false);
          btnSend.urt_listener = true;
          sendPatched = true;
        }
      }
    }
    if (!followPatched || !sendPatched) {
      window.setTimeout(WMEURMPT.setupFollowAndSendListner, 200);
    }
  };
  WMEURMPT.conversationSent = function() {
    var ur = WMEURMPT.getURFromId(WMEURMPT.currentURID);
    if (ur != null && WMEURMPT.wazeMap.panelRegion.currentView.conversationView !== undefined) {
      if (WMEURMPT.wazeMap.panelRegion.currentView.conversationView && ur.data.session.comments.length == WMEURMPT.wazeMap.panelRegion.currentView.conversationView.viewModel.attributes.commentCount) {
        WMEURMPT.log("Comment is updated...");
      } else {
        if (WMEURMPT.wazeMap.panelRegion.currentView.conversationView) {
          WMEURMPT.log("update Comment and refresh...");
          ur.refreshFromWMEData(true);
          ur.lastVisitCommentsCount = ur.data.session.comments.length;
          WMEURMPT.updateIHMFromURList();
        }
      }
    }
  };
  WMEURMPT.clickFollowUR = function() {
    WMEURMPT.logBeta("FOLLOW or UNFOLLOW. That is the question");
    if (!this.checked) {
      WMEURMPT.log("Now: unfollow " + WMEURMPT.currentURID);
      var ur = WMEURMPT.getURFromId(WMEURMPT.currentURID);
      if (ur != null) {
        ur.data.session.isFollowing = false;
        WMEURMPT.updateIHMFromURList();
      }
    } else {
      WMEURMPT.log("Now: follow " + WMEURMPT.currentURID);
      var ur = WMEURMPT.getURFromId(WMEURMPT.currentURID);
      if (ur != null) {
        ur.data.session.isFollowing = true;
        WMEURMPT.URBlackListed(WMEURMPT.currentURID, false);
        WMEURMPT.URVisited(WMEURMPT.currentURID);
        WMEURMPT.updateIHMFromURList();
      }
    }
  };
  WMEURMPT.openConversationPannel = function() {
    var btnConversations = WMEURMPT.getElementsByClassName("btn btn-default toggle-comment-view");
    if (btnConversations.length != 1) {
      window.setTimeout(WMEURMPT.openConversationPannel, 100);
      return;
    }
    var btnConversation = btnConversations[0];
    if (btnConversation.className == "btn btn-default toggle-comment-view comment-view-shown") {
      return;
    }
    btnConversation.click();
  };
  WMEURMPT.saveStarted = function() {
    WMEURMPT.visitedURBeforeActionsSaved.length = 0;
    WMEURMPT.visitedMPBeforeActionsSaved.length = 0;
    WMEURMPT.visitedTPBeforeActionsSaved.length = 0;
    for (var i = 0;i < WMEURMPT.wazeModel.actionManager.actions.length;i++) {
      if (WMEURMPT.wazeModel.actionManager.actions[i].CLASS_NAME == "Waze.Action.UpdateRequest") {
        WMEURMPT.visitedURBeforeActionsSaved.push(WMEURMPT.wazeModel.actionManager.actions[i].request.attributes.id);
      }
      if (WMEURMPT.wazeModel.actionManager.actions[i].CLASS_NAME == "Waze.Action.UpdateProblem") {
        if (WMEURMPT.wazeModel.actionManager.actions[i].problem.type == "mapProblem") {
          WMEURMPT.visitedMPBeforeActionsSaved.push(WMEURMPT.wazeModel.actionManager.actions[i].problem.attributes.id);
        }
        if (WMEURMPT.wazeModel.actionManager.actions[i].problem.type != "mapProblem" && WMEURMPT.wazeModel.actionManager.actions[i].problem.type != "turnProblem") {
          WMEURMPT.log("Error while detecting update problem operation on: ", WMEURMPT.wazeModel.actionManager.actions[i]);
        }
      }
    }
  };
  WMEURMPT.saveEnded = function() {
    for (var i = 0;i < WMEURMPT.visitedURBeforeActionsSaved.length;i++) {
      WMEURMPT.log("save UR: " + WMEURMPT.visitedURBeforeActionsSaved[i]);
      var ur = WMEURMPT.getURFromId(WMEURMPT.visitedURBeforeActionsSaved[i]);
      if (ur != null) {
        WMEURMPT.logBeta("save UR Action: id=" + WMEURMPT.visitedURBeforeActionsSaved[i] + " found");
        var refreshStatus = ur.refreshFromWMEData(true);
        if (!refreshStatus) {
          refreshStatus = ur.refreshFromServer();
          if (refreshStatus == true || refreshStatus == null) {
            WMEURMPT.logBeta("save UR Action: id=" + WMEURMPT.visitedURBeforeActionsSaved[i] + " refresh ok: " + refreshStatus);
            ur.blackListed = false;
            ur.alreadyVisited = true;
          } else {
            WMEURMPT.logBeta("save UR Action: id=" + WMEURMPT.visitedURBeforeActionsSaved[i] + " No change found");
          }
        }
      } else {
        WMEURMPT.logBeta("save UR Action: id=" + WMEURMPT.visitedURBeforeActionsSaved[i] + " not found");
      }
    }
    for (var i = 0;i < WMEURMPT.visitedMPBeforeActionsSaved.length;i++) {
      WMEURMPT.log("save MP: " + WMEURMPT.visitedMPBeforeActionsSaved[i]);
      var mp = WMEURMPT.getMPFromId(WMEURMPT.visitedMPBeforeActionsSaved[i]);
      if (mp != null) {
        WMEURMPT.logDebug("save MP Action: id=" + WMEURMPT.visitedMPBeforeActionsSaved[i] + " found");
        var refreshStatus = mp.refreshFromWMEData();
        if (!refreshStatus) {
          refreshStatus = mp.refreshFromServer();
          if (refreshStatus == true || refreshStatus == null) {
            WMEURMPT.logDebug("save MP Action: id=" + WMEURMPT.visitedMPBeforeActionsSaved[i] + " refresh ok: " + refreshStatus);
            mp.blackListed = false;
            mp.alreadyVisited = true;
          } else {
            WMEURMPT.logDebug("save MP Action: id=" + WMEURMPT.visitedMPBeforeActionsSaved[i] + " No change found");
          }
        }
      } else {
        WMEURMPT.logDebug("save MP Action: id=" + WMEURMPT.visitedMPBeforeActionsSaved[i] + " not found");
      }
    }
    for (var i = 0;i < WMEURMPT.visitedTPBeforeActionsSaved.length;i++) {
      WMEURMPT.log("save MP (TP): " + WMEURMPT.visitedTPBeforeActionsSaved[i]);
      var mp = WMEURMPT.getMPFromId(WMEURMPT.visitedTPBeforeActionsSaved[i]);
      if (mp != null) {
        WMEURMPT.logBeta("save TP Action: id=" + WMEURMPT.visitedTPBeforeActionsSaved[i] + " found");
        var refreshStatus = mp.refreshFromWMEData();
        if (!refreshStatus) {
          refreshStatus = mp.refreshFromServer();
          if (refreshStatus == true || refreshStatus == null) {
            WMEURMPT.logBeta("save TP Action: id=" + WMEURMPT.visitedTPBeforeActionsSaved[i] + " refresh ok: " + refreshStatus);
            mp.blackListed = false;
            mp.alreadyVisited = true;
          } else {
            WMEURMPT.logBeta("save TP Action: id=" + WMEURMPT.visitedTPBeforeActionsSaved[i] + " No change found");
          }
        }
      } else {
        WMEURMPT.logBeta("save TP Action: id=" + WMEURMPT.visitedTPBeforeActionsSaved[i] + " not found");
      }
    }
    WMEURMPT.updateIHMFromURList();
    WMEURMPT.updateIHMFromMPList();
  };
  WMEURMPT.newActionAdded = function(lastAction) {
    if (lastAction.object.actions.length <= 0) {
      return;
    }
    lastAction = lastAction.object.actions[lastAction.object.actions.length - 1];
    if (lastAction.hasOwnProperty("object") && lastAction.object.hasOwnProperty("type") && lastAction.object.type == "mapProblem") {
      var mp = WMEURMPT.getMPFromId(lastAction.attributes.id);
      if (mp == null) {
        return;
      }
      mp.refreshFromWMEData();
      if (mp.data.open == true) {
        mp.data.resolvedOn = null;
        mp.data.resolvedBy = null;
        mp.data.resolvedByName = null;
      } else {
        var now = new Date;
        mp.data.resolvedOn = now.getTime();
        mp.data.resolvedBy = WMEURMPT.me.id;
        mp.data.resolvedByName = WMEURMPT.me.userName;
      }
      WMEURMPT.updateIHMFromMPList();
    }
    if (lastAction.hasOwnProperty("object") && lastAction.object.hasOwnProperty("type") && lastAction.object.type == "mapUpdateRequest") {
      var ur = WMEURMPT.getURFromId(lastAction.attributes.id);
      if (ur == null) {
        return;
      }
      ur.refreshFromWMEData(true);
      if (ur.data.open == true) {
        ur.data.resolvedOn = null;
        ur.data.resolvedBy = null;
        ur.data.resolvedByName = null;
      } else {
        var now = new Date;
        ur.data.resolvedOn = now.getTime();
        ur.data.resolvedBy = WMEURMPT.me.id;
        ur.data.resolvedByName = WMEURMPT.me.userName;
      }
      WMEURMPT.updateIHMFromURList();
    }
  };
  WMEURMPT.getMPs = function(bounds, filter) {
    var url = "https://" + document.location.host + WMEURMPT.wazeConfigApiBase + "/Features?language=en" + (WMEURMPT.scanUR ? "&mapUpdateRequestFilter=1" : "") + (WMEURMPT.scanMP ? "&problemFilter=1&turnProblemFilter=1" : "") + "&mapComments=" + (WMEURMPT.scanMC ? "true" : "false") + "&editableAreas=true&bbox=" + bounds.left + "," + bounds.bottom + "," + bounds.right + "," + bounds.top;
    var xhr3_object = null;
    if (XMLHttpRequest) {
      xhr3_object = new XMLHttpRequest;
    } else {
      if (ActiveXObject) {
        xhr3_object = new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
    var MPs = null;
    xhr3_object.open("GET", url, false);
    xhr3_object.send(null);
    if (xhr3_object.status == 200) {
      var r = xhr3_object.responseText;
      try {
        MPs = JSON.parse(r);
      } catch (e) {
        WMEURMPT.log("Error: can't read server response: ", e);
        WMEURMPT.log("Response from server: ", r);
        WMEURMPT.log("Query: ", url);
        MPs = null;
      }
    }
    if (MPs == null) {
      return null;
    }
    if (!MPs.hasOwnProperty("mapUpdateRequests") && !MPs.hasOwnProperty("problems") && !MPs.hasOwnProperty("mapComments")) {
      return null;
    }
    if (MPs.hasOwnProperty("mapUpdateRequests") && MPs.mapUpdateRequests.objects.length == 500 || MPs.hasOwnProperty("problems") && MPs.problems.objects.length == 500 || MPs.hasOwnProperty("mapComments") && MPs.mapComments.objects.length == 500) {
      return {error:1};
    }
    if (filter != null) {
      var filterArea = [];
      if (filter != null && filter.type == "editableArea") {
        for (var a = 0;a < MPs.userAreas.objects.length;a++) {
          filterArea = filterArea.concat(WMEURMPT.wazeMapAreaToOLPolygons(MPs.userAreas.objects[a].geometry));
        }
      }
      if (filter != null && filter.type == "country") {
        for (var c = 0;c < WMEURMPT.areaList.country.length;c++) {
          if (WMEURMPT.areaList.country[c].name == filter.name) {
            filterArea = WMEURMPT.areaList.country[c].geometryOL.geometry.components;
            break;
          }
        }
      }
      if (filter != null && filter.type == "custom") {
        for (var c = 0;c < WMEURMPT.areaList.custom.length;c++) {
          if (WMEURMPT.areaList.custom[c].name == filter.name) {
            filterArea = WMEURMPT.areaList.custom[c].geometryOL.geometry.components;
            break;
          }
        }
      }
      var cmp = 0;
      if (MPs.hasOwnProperty("problems")) {
        while (cmp < MPs.problems.objects.length) {
          var theMP = MPs.problems.objects[cmp];
          if (WMEURMPT.ul < WMEURMPT.rl4cp && theMP.open == false) {
            MPs.problems.objects.splice(cmp, 1);
            continue;
          }
          var lonlat = OpenLayers.Layer.SphericalMercator.forwardMercator(theMP.geometry.coordinates[0], theMP.geometry.coordinates[1]);
          var xy = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
          if (filter.type == "country" || filter.type == "custom") {
            xy = new OpenLayers.Geometry.Point(theMP.geometry.coordinates[0], theMP.geometry.coordinates[1]);
          }
          var inside = false;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (!inside) {
            MPs.problems.objects.splice(cmp, 1);
            continue;
          }
          cmp++;
        }
      }
      cmp = 0;
      if (MPs.hasOwnProperty("mapUpdateRequests")) {
        while (cmp < MPs.mapUpdateRequests.objects.length) {
          var theUR = MPs.mapUpdateRequests.objects[cmp];
          if (WMEURMPT.ul < WMEURMPT.rl4cp && theUR.open == false) {
            MPs.mapUpdateRequests.objects.splice(cmp, 1);
            continue;
          }
          var lonlat = OpenLayers.Layer.SphericalMercator.forwardMercator(theUR.geometry.coordinates[0], theUR.geometry.coordinates[1]);
          var xy = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
          if (filter.type == "country" || filter.type == "custom") {
            xy = new OpenLayers.Geometry.Point(theUR.geometry.coordinates[0], theUR.geometry.coordinates[1]);
          }
          var inside = false;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (!inside) {
            MPs.mapUpdateRequests.objects.splice(cmp, 1);
            continue;
          }
          cmp++;
        }
      }
      cmp = 0;
      if (MPs.hasOwnProperty("mapComments")) {
        while (cmp < MPs.mapComments.objects.length) {
          var theMC = MPs.mapComments.objects[cmp];
          var lonlat = null;
          var centroid = null;
          if (theMC.geometry.type == "Point") {
            lonlat = OpenLayers.Layer.SphericalMercator.forwardMercator(theMC.geometry.coordinates[0], theMC.geometry.coordinates[1]);
          } else {
            var olpolys = [];
            theMC.geometry.coordinates.forEach(function(poly) {
              var olpts = poly.map(function(e) {
                return new OpenLayers.Geometry.Point(e[0], e[1]);
              });
              var ollr = new OpenLayers.Geometry.LinearRing(olpts);
              var olp = new OpenLayers.Geometry.Polygon(ollr);
              olpolys.push(olp);
            });
            var olmultipoly = new OpenLayers.Geometry.MultiPolygon(olpolys);
            centroid = olmultipoly.getCentroid();
            lonlat = OpenLayers.Layer.SphericalMercator.forwardMercator(centroid.x, centroid.y);
          }
          var xy = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
          if (filter.type == "country" || filter.type == "custom") {
            if (theMC.geometry.type == "Point") {
              xy = new OpenLayers.Geometry.Point(theMC.geometry.coordinates[0], theMC.geometry.coordinates[1]);
            } else {
              xy = centroid;
            }
          }
          var inside = false;
          for (var a = 0;a < filterArea.length;a++) {
            if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
              if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
                inside = true;
                break;
              }
            } else {
              if (filterArea[a].bintreeContainsPoint(xy)) {
                inside = true;
                break;
              }
            }
          }
          if (!inside) {
            MPs.mapComments.objects.splice(cmp, 1);
            continue;
          }
          cmp++;
        }
      }
      MPs.area = filterArea;
      MPs.filterType = filter.type;
      MPs.tile = bounds;
    }
    if (MPs.hasOwnProperty("mapUpdateRequests")) {
      var urIds = [];
      for (var i = 0;i < MPs.mapUpdateRequests.objects.length;i++) {
        urIds.push(MPs.mapUpdateRequests.objects[i].id);
      }
      if (urIds.length != 0) {
        url = "https://" + document.location.host + WMEURMPT.wazeConfigApiBase + "/MapProblems/UpdateRequests?ids=" + urIds.join(",");
        if (XMLHttpRequest) {
          xhr3_object = new XMLHttpRequest;
        } else {
          if (ActiveXObject) {
            xhr3_object = new ActiveXObject("Microsoft.XMLHTTP");
          }
        }
        var URcomments = null;
        xhr3_object.open("GET", url, false);
        xhr3_object.ontimeout = function() {
          URcomments = null;
        };
        xhr3_object.onerror = function() {
          URcomments = null;
        };
        xhr3_object.onreadystatechange = function() {
          if (xhr3_object.readyState == 4) {
            var r = xhr3_object.responseText;
            try {
              URcomments = JSON.parse(r);
            } catch (e$0) {
              WMEURMPT.log("Error: can't read server response: ", e$0);
              WMEURMPT.log("Response from server: ", r);
              WMEURMPT.log("Query: ", url);
              URcomments = null;
            }
          } else {
            URcomments = null;
          }
        };
        xhr3_object.send(null);
        WMEURMPT.logBeta("UR comments: ", URcomments);
        if (URcomments == null) {
          return null;
        }
        for (var i = 0;i < MPs.mapUpdateRequests.objects.length;i++) {
          var urId = MPs.mapUpdateRequests.objects[i].id;
          for (var j = 0;j < URcomments.updateRequestSessions.objects.length;j++) {
            if (urId == URcomments.updateRequestSessions.objects[j].id) {
              MPs.mapUpdateRequests.objects[i].session = URcomments.updateRequestSessions.objects[j];
              MPs.mapUpdateRequests.objects[i].session.users = URcomments.users;
              break;
            }
          }
        }
      }
    }
    WMEURMPT.logBeta("URs, MPs, and MCs from server after UR process: ", MPs);
    return MPs;
  };
  WMEURMPT.updateURList = function(URs) {
    if (URs.hasOwnProperty("mapUpdateRequests") == false) {
      return;
    }
    for (var i = 0;i < URs.mapUpdateRequests.objects.length;i++) {
      var found = true;
      var ur = WMEURMPT.getURFromId(URs.mapUpdateRequests.objects[i].id);
      if (ur == null) {
        ur = new WMEURMPT.URT_UR(URs.mapUpdateRequests.objects[i].id, URs.mapUpdateRequests.objects[i].geometry.coordinates[0], URs.mapUpdateRequests.objects[i].geometry.coordinates[1]);
        found = false;
      }
      ur.data = JSON.parse(JSON.stringify(URs.mapUpdateRequests.objects[i]));
      ur.updated = true;
      ur.data.resolvedByName = "Unknown";
      for (var u = 0;u < URs.users.objects.length;u++) {
        if (URs.users.objects[u].id == ur.data.resolvedBy) {
          ur.data.resolvedByName = URs.users.objects[u].userName;
        }
      }
      for (var c = 0;c < ur.data.session.comments.length;c++) {
        var userID = ur.data.session.comments[c].userID;
        var userName = "Unknown";
        if (userID == WMEURMPT.me.id) {
          userName = WMEURMPT.me.userName;
          if (c == ur.data.session.comments.length - 1) {
            ur.lastVisitCommentsCount = ur.data.session.comments.length;
          }
        }
        if (userID == -1) {
          userName = "Reporter";
        } else {
          for (var u = 0;u < ur.data.session.users.objects.length;u++) {
            if (ur.data.session.users.objects[u].id == userID) {
              userName = ur.data.session.users.objects[u].userName;
              break;
            }
          }
        }
        ur.data.session.comments[c].userName = userName;
      }
      ur.clean();
      ur.updateDistanceToMapCenter();
      if (!found) {
        ur.lastVisitCommentsCount = 0;
        ur.alreadyVisited = false;
        WMEURMPT.URList.push(ur);
        WMEURMPT.URMap = WMEURMPT.listToObject(WMEURMPT.URList);
      }
    }
  };
  WMEURMPT.updateMPList = function(MPs) {
    if (MPs.hasOwnProperty("problems") == false) {
      return;
    }
    WMEURMPT.logBeta("updatelist MPs:", MPs);
    for (var i = 0;i < MPs.problems.objects.length;i++) {
      WMEURMPT.logBeta("MP server Object:", MPs.problems.objects[i]);
      var found = true;
      var mp = WMEURMPT.getMPFromId(MPs.problems.objects[i].id);
      if (mp == null) {
        mp = new WMEURMPT.URT_MP(MPs.problems.objects[i].id, MPs.problems.objects[i].geometry.coordinates[0], MPs.problems.objects[i].geometry.coordinates[1]);
        mp.alreadyVisited = false;
        found = false;
      }
      mp.updated = true;
      mp.type = "problem";
      mp.data = JSON.parse(JSON.stringify(MPs.problems.objects[i]));
      mp.data.resolvedByName = "Unknown";
      for (var u = 0;u < MPs.users.objects.length;u++) {
        if (MPs.users.objects[u].id == mp.data.resolvedBy) {
          mp.data.resolvedByName = MPs.users.objects[u].userName;
        }
      }
      mp.clean();
      mp.updateDistanceToMapCenter();
      if (!found) {
        WMEURMPT.MPList.push(mp);
        WMEURMPT.MPMap = WMEURMPT.listToObject(WMEURMPT.MPList);
      }
    }
    WMEURMPT.logBeta("MPList Updated:", WMEURMPT.MPList);
  };
  WMEURMPT.updateMCList = function(MCs) {
    if (MCs.hasOwnProperty("mapComments") == false) {
      return;
    }
    for (var i = 0;i < MCs.mapComments.objects.length;i++) {
      var found = true;
      var mc = WMEURMPT.getMCFromId(MCs.mapComments.objects[i].id);
      if (mc == null) {
        if (MCs.mapComments.objects[i].geometry.type == "Point") {
          mc = new WMEURMPT.URT_MC(MCs.mapComments.objects[i].id, MCs.mapComments.objects[i].geometry.coordinates[0], MCs.mapComments.objects[i].geometry.coordinates[1]);
        } else {
          var olpolys = [];
          MCs.mapComments.objects[i].geometry.coordinates.forEach(function(poly) {
            var olpts = poly.map(function(e) {
              return new OpenLayers.Geometry.Point(e[0], e[1]);
            });
            var ollr = new OpenLayers.Geometry.LinearRing(olpts);
            var olp = new OpenLayers.Geometry.Polygon(ollr);
            olpolys.push(olp);
          });
          var olmultipoly = new OpenLayers.Geometry.MultiPolygon(olpolys);
          var centroid = olmultipoly.getCentroid();
          mc = new WMEURMPT.URT_MC(MCs.mapComments.objects[i].id, centroid.x, centroid.y);
        }
        found = false;
      }
      mc.data = JSON.parse(JSON.stringify(MCs.mapComments.objects[i]));
      mc.updated = true;
      mc.data.createdByName = "Unknown";
      for (var u in MCs.users.objects) {
        if (MCs.users.objects[u].id == mc.data.createdBy) {
          mc.data.createdByName = MCs.users.objects[u].userName;
          break;
        }
      }
      mc.data.updatedByName = "Unknown";
      for (var u in MCs.users.objects) {
        if (MCs.users.objects[u].id == mc.data.updatedBy) {
          mc.data.updatedByName = MCs.users.objects[u].userName;
          break;
        }
      }
      if (mc.data.hasOwnProperty("conversation")) {
        mc.data.conversation.forEach(function(c, i) {
          if (c.userID == WMEURMPT.me.id) {
            c.userName = WMEURMPT.me.userName;
            if (i == mc.data.conversation.length - 1) {
              mc.lastVisitCommentsCount = mc.data.conversation.length;
            }
          }
          for (var u in MCs.users.objects) {
            if (MCs.users.objects[u].id == c.userID) {
              c.userName = MCs.users.objects[u].userName;
              break;
            }
          }
        }, this);
      }
      mc.clean();
      mc.updateDistanceToMapCenter();
      if (!found) {
        mc.lastVisitCommentsCount = 0;
        mc.alreadyVisited = false;
        WMEURMPT.MCList.push(mc);
        WMEURMPT.MCMap = WMEURMPT.listToObject(WMEURMPT.MCList);
      }
    }
  };
  WMEURMPT.updateListsFromManualScan = function(areaFilter) {
    if (!WMEURMPT.scanUR && !WMEURMPT.scanMP && !WMEURMPT.scanMC) {
      alert("You must check at least one scan in quick options");
      return;
    }
    WMEURMPT.log("Setup tiles for manual scan: ", areaFilter);
    var count = 0;
    WMEURMPT.scanAreaBoundsList = [];
    if (areaFilter.type == "editableArea") {
      for (var i = 0;i < WMEURMPT.loginManager.user.areas.length;i++) {
        WMEURMPT.loginManager.user.areas[i].geometry.calculateBounds();
        var bounds = WMEURMPT.loginManager.user.areas[i].geometry.bounds;
        var lonlatFrom = OpenLayers.Layer.SphericalMercator.inverseMercator(bounds.left, bounds.bottom);
        var lonlatTo = OpenLayers.Layer.SphericalMercator.inverseMercator(bounds.right, bounds.top);
        for (var lat = lonlatFrom.lat;lat < lonlatTo.lat;lat += 0.5) {
          for (var lon = lonlatFrom.lon;lon < lonlatTo.lon;lon += 0.5) {
            WMEURMPT.logBeta("Scan editable area from: " + lon + " " + lat + " to: " + (lon + 1) + " " + (lat + 1));
            var tileBounds = new OpenLayers.Bounds;
            tileBounds.extend(new OpenLayers.LonLat(lon.toFixed(6), lat.toFixed(6)));
            tileBounds.extend(new OpenLayers.LonLat((lon + 0.5).toFixed(6), (lat + 0.5).toFixed(6)));
            WMEURMPT.scanAreaBoundsList.push(tileBounds);
          }
        }
      }
    }
    if (areaFilter.type == "country") {
      var geometry = null;
      for (var i = 0;i < WMEURMPT.areaList.country.length;i++) {
        if (WMEURMPT.areaList.country[i].name == areaFilter.name) {
          geometry = WMEURMPT.areaList.country[i].geometryOL.geometry.components;
          break;
        }
      }
      if (geometry === null) {
        return;
      }
      for (var i = 0;i < geometry.length;i++) {
        var bounds = geometry[i].bounds;
        var lonlatFrom = new OpenLayers.LonLat(bounds.left, bounds.bottom);
        var lonlatTo = new OpenLayers.LonLat(bounds.right, bounds.top);
        for (var lat = lonlatFrom.lat;lat < lonlatTo.lat;lat += 0.5) {
          for (var lon = lonlatFrom.lon;lon < lonlatTo.lon;lon += 0.5) {
            if (lon > 180) {
              lon -= 180;
            }
            var lonStep = 0.5;
            if (lon + lonStep > 180) {
              lonStep = 180 - lon;
            }
            WMEURMPT.logBeta("Scan country from: " + lon + " " + lat + " to: " + (lon + lonStep) + " " + (lat + 0.5));
            var tileBounds = new OpenLayers.Bounds;
            tileBounds.extend(new OpenLayers.LonLat(lon.toFixed(6), lat.toFixed(6)));
            tileBounds.extend(new OpenLayers.LonLat((lon + lonStep).toFixed(6), (lat + 0.5).toFixed(6)));
            WMEURMPT.scanAreaBoundsList.push(tileBounds);
            if (lonStep != 0.5) {
              lonStep = 0.5 - lonStep;
              WMEURMPT.logBeta("Scan country from: 0! " + lat + " to: " + lonStep + " " + (lat + 0.5));
              var tileBounds = new OpenLayers.Bounds;
              tileBounds.extend(new OpenLayers.LonLat(0, lat.toFixed(6)));
              tileBounds.extend(new OpenLayers.LonLat(lonStep.toFixed(6), (lat + 0.5).toFixed(6)));
              WMEURMPT.scanAreaBoundsList.push(tileBounds);
            }
          }
        }
      }
    }
    if (areaFilter.type == "custom") {
      var geometry = null;
      for (var i = 0;i < WMEURMPT.areaList.custom.length;i++) {
        if (WMEURMPT.areaList.custom[i].name == areaFilter.name) {
          geometry = WMEURMPT.areaList.custom[i].geometryOL.geometry.components;
          break;
        }
      }
      if (geometry === null) {
        WMEURMPT.log("Bad geometry for area: ", areaFilter);
        return;
      }
      for (var i = 0;i < geometry.length;i++) {
        var bounds = geometry[i].bounds;
        var lonlatFrom = new OpenLayers.LonLat(bounds.left, bounds.bottom);
        var lonlatTo = new OpenLayers.LonLat(bounds.right, bounds.top);
        for (var lat = lonlatFrom.lat;lat < lonlatTo.lat;lat += 0.5) {
          for (var lon = lonlatFrom.lon;lon < lonlatTo.lon;lon += 0.5) {
            WMEURMPT.logBeta("Scan country from: " + lon + " " + lat + " to: " + (lon + 1) + " " + (lat + 1));
            var tileBounds = new OpenLayers.Bounds;
            tileBounds.extend(new OpenLayers.LonLat(lon.toFixed(6), lat.toFixed(6)));
            tileBounds.extend(new OpenLayers.LonLat((lon + 0.5).toFixed(6), (lat + 0.5).toFixed(6)));
            WMEURMPT.scanAreaBoundsList.push(tileBounds);
          }
        }
      }
    }
    WMEURMPT.scanAreaBoundsCount = WMEURMPT.scanAreaBoundsList.length;
    for (var i = 0;i < WMEURMPT.URList.length;i++) {
      WMEURMPT.URList[i].updated = false;
    }
    for (var i = 0;i < WMEURMPT.MPList.length;i++) {
      WMEURMPT.MPList[i].updated = false;
    }
    for (var i = 0;i < WMEURMPT.MCList.length;i++) {
      WMEURMPT.MCList[i].updated = false;
    }
    WMEURMPT.log("Starting scan...");
    WMEURMPT.log("Tile count: " + WMEURMPT.scanAreaBoundsList.length);
    var pb = new WMEURMPT.ProgressBar(WMEURMPT.getId("urt-progressBar"));
    pb.update(0);
    pb.show();
    WMEURMPT.showPBInfo(true);
    window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.updateListsFromManualScanNextStep, [areaFilter]), 0);
  };
  WMEURMPT.updateListsFromManualScanNextStep = function(areaFilter, seconds, retries) {
    var pb = new WMEURMPT.ProgressBar(WMEURMPT.getId("urt-progressBar"));
    if (typeof seconds !== "undefined" && seconds != null && seconds > 0) {
      seconds--;
      WMEURMPT.info("Error: can't download data from waze server.<br>Retry in " + seconds + "s.");
      window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.updateListsFromManualScanNextStep, [areaFilter, seconds, retries]), 1000);
      return;
    }
    if (typeof retries !== "undefined" && retries != null && retries > 0) {
      retries--;
      WMEURMPT.info("Error: can't download data from waze server.<br>Retry in " + seconds + "s.");
      window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.updateListsFromManualScanNextStep, [areaFilter, WMEURMPT.wazeServerWaitingTimeToRetry, retries]), 1000);
      return;
    }
    if (typeof retries !== "undefined" && retries != null && retries == 0 && typeof seconds !== "undefined" && seconds != null && seconds == 0) {
      var tileBounds = WMEURMPT.scanAreaBoundsList[0];
      WMEURMPT.scanAreaBoundsList.shift();
      if (tileBounds.right - tileBounds.left > 0.02 && tileBounds.top - tileBounds.bottom > 0.02) {
        WMEURMPT.log("Error from waze server. Try a split...");
        var newTileBounds = new OpenLayers.Bounds;
        newTileBounds.extend(new OpenLayers.LonLat(tileBounds.left, tileBounds.bottom));
        newTileBounds.extend(new OpenLayers.LonLat((tileBounds.left + tileBounds.right) / 2.0, (tileBounds.bottom + tileBounds.top) / 2.0));
        WMEURMPT.scanAreaBoundsList.unshift(newTileBounds);
        newTileBounds = new OpenLayers.Bounds;
        newTileBounds.extend(new OpenLayers.LonLat((tileBounds.left + tileBounds.right) / 2.0, tileBounds.bottom));
        newTileBounds.extend(new OpenLayers.LonLat(tileBounds.right, (tileBounds.bottom + tileBounds.top) / 2.0));
        WMEURMPT.scanAreaBoundsList.unshift(newTileBounds);
        newTileBounds = new OpenLayers.Bounds;
        newTileBounds.extend(new OpenLayers.LonLat(tileBounds.left, (tileBounds.bottom + tileBounds.top) / 2.0));
        newTileBounds.extend(new OpenLayers.LonLat((tileBounds.left + tileBounds.right) / 2.0, tileBounds.top));
        WMEURMPT.scanAreaBoundsList.unshift(newTileBounds);
        newTileBounds = new OpenLayers.Bounds;
        newTileBounds.extend(new OpenLayers.LonLat((tileBounds.left + tileBounds.right) / 2.0, (tileBounds.bottom + tileBounds.top) / 2.0));
        newTileBounds.extend(new OpenLayers.LonLat(tileBounds.right, tileBounds.top));
        WMEURMPT.scanAreaBoundsList.unshift(newTileBounds);
        WMEURMPT.scanAreaBoundsCount += 4;
      } else {
        WMEURMPT.log("Abort this area: (" + tileBounds.left + " , " + tileBounds.bottom + ") -> (" + tileBounds.right + " , " + tileBounds.top + ")");
      }
    }
    if (WMEURMPT.scanAreaBoundsList.length == 0) {
      WMEURMPT.log("Scan ended");
      WMEURMPT.showPBInfo(false);
      WMEURMPT.info();
      pb.hide();
      WMEURMPT.refreshStats("", "");
      WMEURMPT.updateIHMFromURList();
      WMEURMPT.updateIHMFromMPList();
      WMEURMPT.updateIHMFromMCList();
      WMEURMPT.saveURMPLists();
      return;
    }
    var tileBounds = WMEURMPT.scanAreaBoundsList[0];
    var progression = Math.floor((1 - WMEURMPT.scanAreaBoundsList.length / WMEURMPT.scanAreaBoundsCount) * 100);
    var MPs = WMEURMPT.getMPs(tileBounds, areaFilter);
    if (MPs == null) {
      WMEURMPT.info("Error: can't download data from waze server.<br>Retry in " + WMEURMPT.wazeServerWaitingTimeToRetry + "s.");
      window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.updateListsFromManualScanNextStep, [areaFilter, WMEURMPT.wazeServerWaitingTimeToRetry, 0]), 1000);
      return;
    }
    WMEURMPT.scanAreaBoundsList.shift();
    if (MPs != null) {
      if (MPs.hasOwnProperty("error") && MPs.error == 1) {
        WMEURMPT.log("Found 500 problems. This is a waze server limit. Enqueuing sub tile...");
        var newTileBounds = new OpenLayers.Bounds;
        newTileBounds.extend(new OpenLayers.LonLat(tileBounds.left, tileBounds.bottom));
        newTileBounds.extend(new OpenLayers.LonLat((tileBounds.left + tileBounds.right) / 2.0, (tileBounds.bottom + tileBounds.top) / 2.0));
        WMEURMPT.scanAreaBoundsList.unshift(newTileBounds);
        newTileBounds = new OpenLayers.Bounds;
        newTileBounds.extend(new OpenLayers.LonLat((tileBounds.left + tileBounds.right) / 2.0, tileBounds.bottom));
        newTileBounds.extend(new OpenLayers.LonLat(tileBounds.right, (tileBounds.bottom + tileBounds.top) / 2.0));
        WMEURMPT.scanAreaBoundsList.unshift(newTileBounds);
        newTileBounds = new OpenLayers.Bounds;
        newTileBounds.extend(new OpenLayers.LonLat(tileBounds.left, (tileBounds.bottom + tileBounds.top) / 2.0));
        newTileBounds.extend(new OpenLayers.LonLat((tileBounds.left + tileBounds.right) / 2.0, tileBounds.top));
        WMEURMPT.scanAreaBoundsList.unshift(newTileBounds);
        newTileBounds = new OpenLayers.Bounds;
        newTileBounds.extend(new OpenLayers.LonLat((tileBounds.left + tileBounds.right) / 2.0, (tileBounds.bottom + tileBounds.top) / 2.0));
        newTileBounds.extend(new OpenLayers.LonLat(tileBounds.right, tileBounds.top));
        WMEURMPT.scanAreaBoundsList.unshift(newTileBounds);
        WMEURMPT.scanAreaBoundsCount += 4;
      } else {
        WMEURMPT.log("Found: " + (MPs.hasOwnProperty("mapUpdateRequests") ? MPs.mapUpdateRequests.objects.length + " URs + " : "") + (MPs.hasOwnProperty("problems") ? MPs.problems.objects.length + " MPs + " : "") + (MPs.hasOwnProperty("mapComments") ? MPs.mapComments.objects.length + " MCs" : ""));
        WMEURMPT.updateURList(MPs);
        WMEURMPT.updateMPList(MPs);
        WMEURMPT.updateMCList(MPs);
        WMEURMPT.removeOldURMP(MPs.area, MPs.filterType, MPs.tile);
      }
    }
    pb.update(progression);
    WMEURMPT.info("Please, don't touch anything during this scan.");
    window.setTimeout(WMEURMPT.getFunctionWithArgs(WMEURMPT.updateListsFromManualScanNextStep, [areaFilter]), 0);
  };
  WMEURMPT.removeOldURMP = function(filterArea, type, tileBounds) {
    var i = 0;
    var now = new Date;
    if (WMEURMPT.scanUR) {
      while (i < WMEURMPT.URList.length) {
        if (WMEURMPT.URList[i].data.hasOwnProperty("session") == false) {
          WMEURMPT.log("pas bon ca: ", WMEURMPT.URList[i]);
        }
        var xy = new OpenLayers.Geometry.Point(WMEURMPT.URList[i].lonlat.lon, WMEURMPT.URList[i].lonlat.lat);
        if (type == "editableArea") {
          xy = OpenLayers.Layer.SphericalMercator.inverseMercator(xy.x, xy.y);
        }
        if (xy.x < tileBounds.left || xy.x > tileBounds.right || xy.y < tileBounds.bottom || xy.y > tileBounds.top) {
          i++;
          continue;
        }
        var inside = false;
        for (var a = 0;a < filterArea.length;a++) {
          if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
            if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
              inside = true;
              break;
            }
          } else {
            if (filterArea[a].bintreeContainsPoint(xy)) {
              inside = true;
              break;
            }
          }
        }
        if (!inside) {
          i++;
          continue;
        }
        if (WMEURMPT.URList[i].data.open == true && WMEURMPT.URList[i].updated == false || WMEURMPT.URList[i].data.open == false && Math.floor((now.getTime() - WMEURMPT.URList[i].data.resolvedOn) / 86400000) > 60) {
          WMEURMPT.log("removing old UR " + WMEURMPT.URList[i].id);
          WMEURMPT.URList.splice(i, 1);
          WMEURMPT.URMap = WMEURMPT.listToObject(WMEURMPT.URList);
        } else {
          i++;
        }
      }
    }
    i = 0;
    if (WMEURMPT.scanMP) {
      while (i < WMEURMPT.MPList.length) {
        var xy = new OpenLayers.Geometry.Point(WMEURMPT.MPList[i].lonlat.lon, WMEURMPT.MPList[i].lonlat.lat);
        if (type == "editableArea") {
          xy = OpenLayers.Layer.SphericalMercator.inverseMercator(xy.x, xy.y);
        }
        if (xy.x < tileBounds.left || xy.x > tileBounds.right || xy.y < tileBounds.bottom || xy.y > tileBounds.top) {
          i++;
          continue;
        }
        var inside = false;
        for (var a = 0;a < filterArea.length;a++) {
          if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
            if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
              inside = true;
              break;
            }
          } else {
            if (filterArea[a].bintreeContainsPoint(xy)) {
              inside = true;
              break;
            }
          }
        }
        if (!inside) {
          i++;
          continue;
        }
        if (WMEURMPT.MPList[i].data.open == true && WMEURMPT.MPList[i].updated == false || WMEURMPT.MPList[i].data.open == false && Math.floor((now.getTime() - WMEURMPT.MPList[i].data.resolvedOn) / 86400000) > 60) {
          WMEURMPT.log("removing old MP " + WMEURMPT.MPList[i].id);
          WMEURMPT.MPList.splice(i, 1);
          WMEURMPT.MPMap = WMEURMPT.listToObject(WMEURMPT.MPList);
        } else {
          i++;
        }
      }
    }
    i = 0;
    if (WMEURMPT.scanMC) {
      while (i < WMEURMPT.MCList.length) {
        var xy = new OpenLayers.Geometry.Point(WMEURMPT.MCList[i].lonlat.lon, WMEURMPT.MCList[i].lonlat.lat);
        if (type == "editableArea") {
          xy = OpenLayers.Layer.SphericalMercator.inverseMercator(xy.x, xy.y);
        }
        if (xy.x < tileBounds.left || xy.x > tileBounds.right || xy.y < tileBounds.bottom || xy.y > tileBounds.top) {
          i++;
          continue;
        }
        var inside = false;
        for (var a = 0;a < filterArea.length;a++) {
          if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
            if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top && filterArea[a].containsPoint(xy)) {
              inside = true;
              break;
            }
          } else {
            if (filterArea[a].bintreeContainsPoint(xy)) {
              inside = true;
              break;
            }
          }
        }
        if (!inside) {
          i++;
          continue;
        }
        if (WMEURMPT.MCList[i].updated == false) {
          WMEURMPT.log("removing old MC " + WMEURMPT.MCList[i].id);
          WMEURMPT.MCList.splice(i, 1);
          WMEURMPT.MCMap = WMEURMPT.listToObject(WMEURMPT.MCList);
        } else {
          i++;
        }
      }
    }
  };
  WMEURMPT.URT_UR = function(id, lon, lat) {
    this.id = id;
    this.lonlat = new OpenLayers.LonLat(lon, lat);
    this.blackListed = false;
    this.alreadyVisited = false;
    this.lastVisitCommentsCount = 0;
    this.refreshFromServer = refreshFromServer;
    this.refreshFromWMEData = refreshFromWMEData;
    this.distanceToMapCenter = 0;
    this.clean = clean;
    this.updateDistanceToMapCenter = updateDistanceToMapCenter;
    function clean() {
      if (this.data.hasOwnProperty("bounds") == true) {
        delete this.data.bounds;
      }
      if (this.data.hasOwnProperty("geometry") == true) {
        delete this.data.geometry;
      }
      if (this.data.hasOwnProperty("session") == true) {
        if (this.data.session.hasOwnProperty("driveGeometry") == true) {
          delete this.data.session.driveGeometry;
        }
        if (this.data.session.hasOwnProperty("routeGeometry") == true) {
          delete this.data.session.routeGeometry;
        }
        if (this.data.session.hasOwnProperty("routeInstructions") == true) {
          delete this.data.session.routeInstructions;
        }
        if (this.data.session.hasOwnProperty("users") == true) {
          delete this.data.session.users;
        }
      }
    }
    function updateDistanceToMapCenter() {
      if (!WMEURMPT.isComputeDistances) {
        return;
      }
      if (!WMEURMPT.mapCenterLonLat) {
        WMEURMPT.mapCenterLonLat = OpenLayers.Layer.SphericalMercator.inverseMercator(WMEURMPT.wazeMap.center.lon, WMEURMPT.wazeMap.center.lat);
      }
      var p1 = new OpenLayers.Geometry.Point(WMEURMPT.mapCenterLonLat.lon, WMEURMPT.mapCenterLonLat.lat);
      var p2 = new OpenLayers.Geometry.Point(this.lonlat.lon, this.lonlat.lat);
      var line = new OpenLayers.Geometry.LineString([p1, p2]);
      this.distanceToMapCenter = line.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
    }
    function refreshFromWMEData(forceSession) {
      var theUR = WMEURMPT.wazeModel.mapUpdateRequests.objects[this.id];
      WMEURMPT.logDebug("refreshFromWME UR:", theUR);
      if (theUR == null) {
        return false;
      }
      WMEURMPT.logDebug("refreshFromWME session:", WMEURMPT.wazeModel.updateRequestSessions.objects[this.id]);
      this.data = {};
      this.data.description = theUR.attributes.description;
      this.data.driveDate = theUR.attributes.driveDate;
      this.data.hasComments = theUR.attributes.hasComments;
      this.data.open = theUR.attributes.open;
      this.data.resolution = theUR.attributes.resolution;
      this.data.resolvedBy = theUR.attributes.resolvedBy;
      this.data.resolvedOn = theUR.attributes.resolvedOn;
      this.data.type = theUR.attributes.type;
      this.data.updatedBy = theUR.attributes.updatedBy;
      this.data.updatedOn = theUR.attributes.updatedOn;
      this.data.resolvedByName = "Unknown";
      for (var u in theUR.model.users.objects) {
        if (theUR.model.users.objects[u].id == this.data.resolvedBy) {
          this.data.resolvedByName = theUR.model.users.objects[u].userName;
          break;
        }
      }
      var needToUpdateCommentsUserNames = true;
      if (!forceSession) {
        if (WMEURMPT.wazeModel.updateRequestSessions.objects[this.id] != null) {
          this.data.session = {};
          this.data.session.comments = JSON.parse(JSON.stringify(WMEURMPT.wazeModel.updateRequestSessions.objects[this.id].comments));
          this.data.session.isFollowing = WMEURMPT.wazeModel.updateRequestSessions.objects[this.id].isFollowing;
        } else {
          this.data.session = {};
          this.data.session.comments = [];
          this.data.session.isFollowing = false;
        }
      } else {
        url = "https://" + document.location.host + WMEURMPT.wazeConfigApiBase + "/MapProblems/UpdateRequests?ids=" + this.id;
        if (XMLHttpRequest) {
          xhr3_object = new XMLHttpRequest;
        } else {
          if (ActiveXObject) {
            xhr3_object = new ActiveXObject("Microsoft.XMLHTTP");
          }
        }
        var URcomments = null;
        xhr3_object.open("GET", url, false);
        xhr3_object.ontimeout = function() {
          URcomments = null;
        };
        xhr3_object.onerror = function(e) {
          WMEURMPT.log("Error while getting UR comments from Waze server.", e);
          URcomments = null;
        };
        xhr3_object.onreadystatechange = function() {
          if (xhr3_object.readyState == 4) {
            var r = xhr3_object.responseText;
            try {
              URcomments = JSON.parse(r);
            } catch (e) {
              WMEURMPT.log("Error: can't read server response: ", e);
              WMEURMPT.log("Response from server: ", r);
              WMEURMPT.log("Query: ", url);
              URcomments = null;
            }
          } else {
            WMEURMPT.log("Error while getting UR comments from Waze server.", xhr3_object);
            URcomments = null;
          }
        };
        xhr3_object.send(null);
        WMEURMPT.logBeta("UR comments: ", URcomments);
        if (URcomments != null) {
          var found = false;
          for (var j = 0;j < URcomments.updateRequestSessions.objects.length;j++) {
            var urId = URcomments.updateRequestSessions.objects[j].id;
            if (urId == this.id) {
              this.data.session = URcomments.updateRequestSessions.objects[j];
              this.data.session.users = URcomments.users;
              for (var c = 0;c < this.data.session.comments.length;c++) {
                var userID = this.data.session.comments[c].userID;
                var userName = "Unknown";
                if (userID == WMEURMPT.me.id) {
                  userName = WMEURMPT.me.userName;
                  if (c == this.data.session.comments.length - 1) {
                    this.lastVisitCommentsCount = this.data.session.comments.length;
                  }
                }
                if (userID == -1) {
                  userName = "Reporter";
                } else {
                  for (var u = 0;u < this.data.session.users.objects.length;u++) {
                    if (this.data.session.users.objects[u].id == userID) {
                      userName = this.data.session.users.objects[u].userName;
                      break;
                    }
                  }
                }
                this.data.session.comments[c].userName = userName;
              }
              found = true;
              needToUpdateCommentsUserNames = false;
            }
          }
          if (!found) {
            this.data.session = {};
            this.data.session.comments = [];
            this.data.session.isFollowing = false;
          }
        } else {
          this.data.session = {};
          this.data.session.comments = [];
          this.data.session.isFollowing = false;
        }
      }
      if (needToUpdateCommentsUserNames) {
        for (var c = 0;c < this.data.session.comments.length;c++) {
          var userID = this.data.session.comments[c].userID;
          var userName = "Unknown";
          if (userID == WMEURMPT.me.id) {
            userName = WMEURMPT.me.userName;
            if (c == this.data.session.comments.length - 1) {
              this.lastVisitCommentsCount = this.data.session.comments.length;
            }
          }
          if (userID == -1) {
            userName = "Reporter";
          } else {
            for (var u in WMEURMPT.wazeModel.updateRequestSessions.objects[this.id].model.users.objects) {
              if (WMEURMPT.wazeModel.updateRequestSessions.objects[this.id].model.users.objects[u].id == userID) {
                userName = WMEURMPT.wazeModel.updateRequestSessions.objects[this.id].model.users.objects[u].userName;
                break;
              }
            }
          }
          this.data.session.comments[c].userName = userName;
        }
      }
      this.clean();
      this.updateDistanceToMapCenter();
      WMEURMPT.updateIHMFromURList();
      return true;
    }
    function refreshFromServer() {
      var haveChanged = false;
      WMEURMPT.log("refresh from server " + this.id);
      var URs = WMEURMPT.getUR(this.lonlat.lon, this.lonlat.lat, this.id);
      if (URs != null) {
        WMEURMPT.log("refresh from server " + this.id + ";", URs);
        if (typeof URs.mapUpdateRequests !== "undefined") {
          for (var i = 0;i < URs.mapUpdateRequests.objects.length;i++) {
            if (URs.mapUpdateRequests.objects[i].id == this.id) {
              if (this.data.updatedOn != URs.mapUpdateRequests.objects[i].updatedOn) {
                haveChanged = true;
              }
              WMEURMPT.log("refresh from server " + this.id + ";", URs.mapUpdateRequests.objects[i]);
              this.data = URs.mapUpdateRequests.objects[i];
              this.data.resolvedByName = "Unknown";
              for (var u = 0;u < URs.users.objects.length;u++) {
                if (URs.users.objects[u].id == this.data.resolvedBy) {
                  this.data.resolvedByName = URs.users.objects[u].userName;
                }
              }
              for (var c = 0;c < this.data.session.comments.length;c++) {
                var userID = this.data.session.comments[c].userID;
                var userName = "Unknown";
                if (userID == -1) {
                  userName = "Reporter";
                } else {
                  for (var u = 0;u < URs.users.objects.length;u++) {
                    if (URs.users.objects[u].userID == userID) {
                      userName = URs.users.objects[u].userName;
                      break;
                    }
                  }
                  for (var u = 0;u < URs.mapUpdateRequests.objects[i].session.users.objects.length;u++) {
                    if (URs.mapUpdateRequests.objects[i].session.users.objects[u].id == userID) {
                      userName = URs.mapUpdateRequests.objects[i].session.users.objects[u].userName;
                      break;
                    }
                  }
                  if (userID == WMEURMPT.loginManager.user.id) {
                    userName = WMEURMPT.loginManager.user.userName;
                  }
                }
                this.data.session.comments[c].userName = userName;
              }
            }
          }
          return haveChanged;
        }
      }
      return null;
    }
  };
  WMEURMPT.getUR = function(lon, lat, id) {
    var bounds = new OpenLayers.Bounds(lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01);
    var URs = WMEURMPT.getMPs(bounds);
    if (URs == null) {
      return null;
    }
    if (id != null) {
      while (URs.mapUpdateRequests.objects.length >= 2) {
        for (var i = 0;i < URs.mapUpdateRequests.objects.length;i++) {
          if (URs.mapUpdateRequests.objects[i].id != id) {
            URs.mapUpdateRequests.objects.splice(i, 1);
            break;
          }
        }
      }
      if (URs.mapUpdateRequests.objects.length == 0) {
        return null;
      }
      if (URs.mapUpdateRequests.objects[0].id != id) {
        return null;
      }
    }
    return URs;
  };
  WMEURMPT.URT_MP = function(id, lon, lat) {
    this.id = id;
    this.lonlat = new OpenLayers.LonLat(lon, lat);
    this.blackListed = false;
    this.alreadyVisited = false;
    this.distanceToMapCenter = 0;
    this.type = "problem";
    this.refreshFromServer = refreshFromServer;
    this.refreshFromWMEData = refreshFromWMEData;
    this.clean = clean;
    this.updateDistanceToMapCenter = updateDistanceToMapCenter;
    function clean() {
      delete this.data.bounds;
      delete this.data.geometry;
    }
    function updateDistanceToMapCenter() {
      if (!WMEURMPT.isComputeDistances) {
        return;
      }
      if (!WMEURMPT.mapCenterLonLat) {
        WMEURMPT.mapCenterLonLat = OpenLayers.Layer.SphericalMercator.inverseMercator(WMEURMPT.wazeMap.center.lon, WMEURMPT.wazeMap.center.lat);
      }
      var p1 = new OpenLayers.Geometry.Point(WMEURMPT.mapCenterLonLat.lon, WMEURMPT.mapCenterLonLat.lat);
      var p2 = new OpenLayers.Geometry.Point(this.lonlat.lon, this.lonlat.lat);
      var line = new OpenLayers.Geometry.LineString([p1, p2]);
      this.distanceToMapCenter = line.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
    }
    function refreshFromWMEData() {
      WMEURMPT.logDebug("Refresh MP: ", WMEURMPT.wazeModel.problems.additionalInfo);
      var theMP = null;
      if (WMEURMPT.wazeModel.problems.objects.hasOwnProperty(this.id)) {
        theMP = WMEURMPT.wazeModel.problems.objects[this.id];
      }
      if (theMP == null) {
        return false;
      }
      this.data = {};
      this.data.priority = theMP.attributes.priority;
      this.data.subType = theMP.attributes.subType;
      this.data.open = theMP.attributes.open;
      this.data.resolution = theMP.attributes.resolution;
      this.data.resolvedBy = theMP.attributes.resolvedBy;
      this.data.resolvedOn = theMP.attributes.resolvedOn;
      this.data.weight = theMP.attributes.weight;
      this.data.startTime = theMP.attributes.startTime;
      this.data.resolvedByName = "Unknown";
      for (var u in theMP.model.users.objects) {
        if (theMP.model.users.objects[u].id == this.data.resolvedBy) {
          this.data.resolvedByName = theMP.model.users.objects[u].userName;
          break;
        }
      }
      this.clean();
      this.updateDistanceToMapCenter();
      return true;
    }
    function refreshFromServer() {
      var haveChanged = false;
      var MPs = WMEURMPT.getMP(this.lonlat.lon, this.lonlat.lat, this.id);
      if (MPs != null) {
        if (typeof MPs.problems !== "undefined") {
          for (var i = 0;i < MPs.problems.objects.length;i++) {
            if (MPs.problems.objects[i].id == this.id) {
              if (this.data.updatedOn != MPs.problems.objects[i].updatedOn) {
                haveChanged = true;
              }
              this.data = MPs.problems.objects[i];
              return haveChanged;
            }
          }
        }
      }
      return null;
    }
  };
  WMEURMPT.getMP = function(lon, lat, id) {
    var bounds = new OpenLayers.Bounds(lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01);
    var MPs = WMEURMPT.getMPs(bounds);
    if (MPs == null) {
      return null;
    }
    if (id != null) {
      while (MPs.problems.objects.length >= 2) {
        for (var i = 0;i < MPs.problems.objects.length;i++) {
          if (MPs.problems.objects[i].id != id) {
            MPs.problems.objects.splice(i, 1);
            break;
          }
        }
      }
      if (MPs.problems.objects.length != 0 && MPs.problems.objects[0].id != id) {
        return null;
      }
    }
    if (MPs.problems.objects.length == 0) {
      return null;
    }
    return MPs;
  };
  WMEURMPT.URT_MC = function(id, lon, lat) {
    this.id = id;
    this.lonlat = new OpenLayers.LonLat(lon, lat);
    this.blackListed = false;
    this.alreadyVisited = false;
    this.lastVisitCommentsCount = 0;
    this.refreshFromServer = refreshFromServer;
    this.refreshFromWMEData = refreshFromWMEData;
    this.distanceToMapCenter = 0;
    this.clean = clean;
    this.updateDistanceToMapCenter = updateDistanceToMapCenter;
    function clean() {
      if (this.data.hasOwnProperty("bounds") == true) {
        delete this.data.bounds;
      }
      if (this.data.hasOwnProperty("geometry") == true) {
        delete this.data.geometry;
      }
    }
    function updateDistanceToMapCenter() {
      if (!WMEURMPT.isComputeDistances) {
        return;
      }
      if (!WMEURMPT.mapCenterLonLat) {
        WMEURMPT.mapCenterLonLat = OpenLayers.Layer.SphericalMercator.inverseMercator(WMEURMPT.wazeMap.center.lon, WMEURMPT.wazeMap.center.lat);
      }
      var p1 = new OpenLayers.Geometry.Point(WMEURMPT.mapCenterLonLat.lon, WMEURMPT.mapCenterLonLat.lat);
      var p2 = new OpenLayers.Geometry.Point(this.lonlat.lon, this.lonlat.lat);
      var line = new OpenLayers.Geometry.LineString([p1, p2]);
      this.distanceToMapCenter = line.getGeodesicLength(new OpenLayers.Projection("EPSG:4326"));
    }
    function refreshFromWMEData(forceSession) {
      var theMC = WMEURMPT.wazeModel.mapComments.objects[this.id];
      WMEURMPT.logDebug("refreshFromWME MC:", theMC);
      if (theMC == null) {
        return false;
      }
      this.data = {};
      ["body", "createdBy", "createdOn", "endDate", "isFollowing", "subject", "updatedBy", "updatedOn"].forEach(function(p) {
        this.data[p] = theMC.attributes[p];
      }, this);
      this.data.createdByName = "Unknown";
      for (var u in theMC.model.users.objects) {
        if (theMC.model.users.objects[u].id == this.data.createdBy) {
          this.data.createdByName = theMC.model.users.objects[u].userName;
          break;
        }
      }
      this.data.updatedByName = "Unknown";
      for (var u in theMC.model.users.objects) {
        if (theMC.model.users.objects[u].id == this.data.updatedBy) {
          this.data.updatedByName = theMC.model.users.objects[u].userName;
          break;
        }
      }
      this.data.conversation = [];
      if (theMC.attributes.hasOwnProperty("conversation")) {
        theMC.attributes.conversation.forEach(function(c, i) {
          if (c.userID == WMEURMPT.me.id) {
            c.userName = WMEURMPT.me.userName;
            if (i == theMC.attributes.conversation.length - 1) {
              this.lastVisitCommentsCount = theMC.attributes.conversation.length;
            }
          }
          this.data.conversation.push(JSON.parse(JSON.stringify(c)));
          this.data.conversation[this.data.conversation.length - 1].userName = theMC.model.users.objects[c.userID].userName;
        }, this);
      }
      this.clean();
      this.updateDistanceToMapCenter();
      WMEURMPT.updateIHMFromMCList();
      return true;
    }
    function refreshFromServer() {
      var haveChanged = false;
      WMEURMPT.log("refresh from server " + this.id);
      var MCs = WMEURMPT.getMC(this.lonlat.lon, this.lonlat.lat, this.id);
      if (MCs != null) {
        WMEURMPT.log("refresh from server " + this.id + ";", MCs);
        if (typeof MCs.mapComments !== "undefined") {
          for (var i = 0;i < MCs.mapComments.objects.length;i++) {
            if (MCs.mapComments.objects[i].id == this.id) {
              if (this.data.updatedOn != MCs.mapComments.objects[i].updatedOn) {
                haveChanged = true;
              }
              WMEURMPT.log("refresh from server " + this.id + ";", MCs.mapComments.objects[i]);
              this.data = MCs.mapUpdateRequests.objects[i];
              this.data.createdByName = "Unknown";
              for (var u in MCs.users.objects) {
                if (MCs.users.objects[u].id == this.data.createdBy) {
                  this.data.createdByName = MCs.users.objects[u].userName;
                  break;
                }
              }
              this.data.updatedByName = "Unknown";
              for (var u in MCs.users.objects) {
                if (MCs.users.objects[u].id == this.data.updatedBy) {
                  this.data.updatedByName = MCs.users.objects[u].userName;
                  break;
                }
              }
              if (this.data.hasOwnProperty("conversation")) {
                this.data.conversation.forEach(function(c, j) {
                  if (c.userID == WMEURMPT.me.id) {
                    c.userName = WMEURMPT.me.userName;
                    if (j == this.data.conversation.length - 1) {
                      this.lastVisitCommentsCount = this.data.conversation.length;
                    }
                  }
                  for (var u in MCs.users.objects) {
                    if (MCs.users.objects[u].id == c.userID) {
                      c.userName = MCs.users.objects[u].userName;
                      break;
                    }
                  }
                }, this);
              } else {
                this.data.conversation = [];
              }
            }
          }
          return haveChanged;
        }
      }
      return null;
    }
  };
  WMEURMPT.getMC = function(lon, lat, id) {
    var bounds = new OpenLayers.Bounds(lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01);
    var MCs = WMEURMPT.getMPs(bounds);
    if (MCs == null) {
      return null;
    }
    if (id != null) {
      while (MCs.mapComments.objects.length >= 2) {
        for (var i = 0;i < MCs.mapComments.objects.length;i++) {
          if (MCs.mapComments.objects[i].id != id) {
            MCs.mapComments.objects.splice(i, 1);
            break;
          }
        }
      }
      if (MCs.mapComments.objects.length == 0) {
        return null;
      }
      if (MCs.mapComments.objects[0].id != id) {
        return null;
      }
    }
    return MCs;
  };
  WMEURMPT.URT_AREA = function() {
    this.name = "";
    this.category = "";
    this.subset = false;
    this.parent = "";
    this.geometryWKT = "";
    this.geometryOL = null;
    this.getGeometryFromServer = getGeometryFromServer;
    this.getCategoryElementsFromServer = getCategoryElementsFromServer;
    this.isInside = isInside;
    function getGeometryFromServer(callback, serverIndex) {
      if (typeof serverIndex === "undefined" || serverIndex == null) {
        serverIndex = 0;
      }
      if (serverIndex >= WMEURMPT.servers.length) {
        callback(null);
        return;
      }
      var url = WMEURMPT.servers[serverIndex].url + "getArea.php?category=" + this.category + (this.subset == true ? "&subset=" + this.parent : "") + "&name=" + this.name;
      var context = this;
      WMEURMPT.log("Try to donwload area from server " + WMEURMPT.servers[serverIndex].name);
      downloadHelper.add(url, function(data) {
        if (data.status == "success") {
          try {
            var jsonObj = JSON.parse(data.data);
            context.geometryWKT = jsonObj.geometry;
            callback(context);
          } catch (e) {
            WMEURMPT.log("Error while getting area from server" + WMEURMPT.servers[serverIndex].name + "!", e);
            context.getGeometryFromServer(callback, serverIndex + 1);
          }
        } else {
          context.getGeometryFromServer(callback, serverIndex + 1);
        }
      }, null);
    }
    function getCategoryElementsFromServer(callback, serverIndex) {
      if (typeof serverIndex === "undefined" || serverIndex == null) {
        serverIndex = 0;
      }
      if (serverIndex >= WMEURMPT.servers.length) {
        WMEURMPT.errorOnCountryServer();
        return;
      }
      var url = WMEURMPT.servers[serverIndex].url + "getArea.php?category=" + this.category;
      var context = this;
      WMEURMPT.log("Try to donwload area list from server " + WMEURMPT.servers[serverIndex].name);
      var context = this;
      downloadHelper.add(url, function(data) {
        if (data.status == "success") {
          try {
            callback(JSON.parse(data.data));
          } catch (e) {
            WMEURMPT.log("Error while getting categories from server!", e);
            context.getCategoryElementsFromServer(callback, serverIndex + 1);
          }
        } else {
          context.getCategoryElementsFromServer(callback, serverIndex + 1);
        }
      }, null);
    }
    function isInside(lonlat) {
      var xy = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
      var filterArea = [];
      if (this.category == "editableArea") {
      }
      if (this.category == "country" || this.category == "custom") {
        if (this.geometryOL != null) {
          filterArea = this.geometryOL.geometry.components;
        }
      }
      var inside = false;
      for (var a = 0;a < filterArea.length;a++) {
        if (xy.x >= filterArea[a].bounds.left && xy.x <= filterArea[a].bounds.right && xy.y >= filterArea[a].bounds.bottom && xy.y <= filterArea[a].bounds.top) {
          if (filterArea[a].hasOwnProperty("bintreeContainsPoint") == false) {
            if (filterArea[a].containsPoint(xy)) {
              return true;
            }
          } else {
            if (filterArea[a].bintreeContainsPoint(xy)) {
              return true;
            }
          }
        }
      }
      return false;
    }
  };
  WMEURMPT.info = function(text) {
    text = typeof text !== "undefined" ? text : "";
    var div = WMEURMPT.getId("urt-info");
    div.innerHTML = text;
  };
  WMEURMPT.saveOptions = function() {
    var options = {filterUR:WMEURMPT.currentURFilter, filterMP:WMEURMPT.currentMPFilter, filterMC:WMEURMPT.currentMCFilter, filterURKeyword:WMEURMPT.currentURKeyWord, filterMCKeyword:WMEURMPT.currentMCKeyWord, filterURLimitTo:WMEURMPT.currentURLimitTo, filterMPLimitTo:WMEURMPT.currentMPLimitTo, filterMCLimitTo:WMEURMPT.currentMCLimitTo, displayLegend:WMEURMPT.displayLegend, isEnabled:WMEURMPT.isEnabled, isAutoScan:WMEURMPT.isAutoScan, isComputeDistances:WMEURMPT.isComputeDistances, scanUR:WMEURMPT.scanUR, 
    scanMP:WMEURMPT.scanMP, scanMC:WMEURMPT.scanMC, filterUROnlyType:WMEURMPT.currentUROnlyType, filterMPOnlyType:WMEURMPT.currentMPOnlyType, filterUROnlyArea:WMEURMPT.currentUROnlyArea, filterMPOnlyArea:WMEURMPT.currentMPOnlyArea, filterMCOnlyArea:WMEURMPT.currentMCOnlyArea, filterURCommentsCount:WMEURMPT.currentURCommentsCount, URDescriptionMaxLength:WMEURMPT.URDescriptionMaxLength, MPDescriptionMaxLength:WMEURMPT.MPDescriptionMaxLength, MCSubjectMaxLength:WMEURMPT.MCSubjectMaxLength, MCBodyMaxLength:WMEURMPT.MCBodyMaxLength, 
    taggedURList:WMEURMPT.taggedURList, URAgeColIsLastComment:WMEURMPT.URAgeColIsLastComment};
    WMEURMPT.log("save options: ", options);
    GMStorageHelper.save("WMEURMPTracking_options", JSON.stringify(options));
  };
  WMEURMPT.saveAreas = function() {
    GMStorageHelper.save("WMEURMPTracking_areaList", JSON.stringify(WMEURMPT.areaList, function(key, value) {
      if (key == "geometryOL") {
        return;
      }
      return value;
    }));
  };
  WMEURMPT.saveURList = function() {
    GMStorageHelper.save("WMEURMPTracking_URList", JSON.stringify(WMEURMPT.URList));
  };
  WMEURMPT.saveMPList = function() {
    GMStorageHelper.save("WMEURMPTracking_MPList", JSON.stringify(WMEURMPT.MPList));
  };
  WMEURMPT.saveMCList = function() {
    GMStorageHelper.save("WMEURMPTracking_MCList", JSON.stringify(WMEURMPT.MCList));
  };
  WMEURMPT.saveURMPLists = function() {
    WMEURMPT.saveURList();
    WMEURMPT.saveMPList();
    WMEURMPT.saveMCList();
  };
  WMEURMPT.save = function() {
    delete localStorage.WMEURTracking_options;
    delete localStorage.WMEURTracking_URList;
    delete localStorage.WMEURTracking_MPList;
    delete localStorage.WMEURMPTracking_URList;
    delete localStorage.WMEURMPTracking_MPList;
    delete localStorage.WMEURMPTracking_options;
    delete localStorage.WMEURMPTracking_URList_z;
    delete localStorage.WMEURMPTracking_MPList_z;
    WMEURMPT.saveOptions();
    WMEURMPT.saveAreas();
    WMEURMPT.saveURMPLists();
    WMEURMPT.log("Options and data saved");
  };
  WMEURMPT.optionsLoaded = function(data) {
    if (data.data != null) {
      var options = JSON.parse(data.data);
      WMEURMPT.log("GM options:", options);
      WMEURMPT.currentURFilter = typeof options.filterUR === "undefined" ? WMEURMPT.URFilterList.hideClosed + WMEURMPT.URFilterList.hideBlacklisted : options.filterUR;
      WMEURMPT.currentMPFilter = typeof options.filterMP === "undefined" ? WMEURMPT.MPFilterList.hideClosed + WMEURMPT.MPFilterList.hideBlacklisted : options.filterMP;
      WMEURMPT.currentMCFilter = typeof options.filterMC === "undefined" ? WMEURMPT.MCFilterList.hideBlacklisted : options.filterMC;
      WMEURMPT.currentURKeyWord = typeof options.filterURKeyword === "undefined" ? WMEURMPT.loginManager.user.userName : options.filterURKeyword;
      WMEURMPT.currentMCKeyWord = typeof options.filterMCKeyword === "undefined" ? WMEURMPT.loginManager.user.userName : options.filterMCKeyword;
      WMEURMPT.currentURLimitTo = typeof options.filterURLimitTo === "undefined" ? 100 : options.filterURLimitTo;
      WMEURMPT.currentMPLimitTo = typeof options.filterMPLimitTo === "undefined" ? 100 : options.filterMPLimitTo;
      WMEURMPT.currentMCLimitTo = typeof options.filterMCLimitTo === "undefined" ? 100 : options.filterMCLimitTo;
      WMEURMPT.displayLegend = typeof options.displayLegend === "undefined" ? true : options.displayLegend;
      WMEURMPT.isEnabled = typeof options.isEnabled === "undefined" ? true : options.isEnabled;
      WMEURMPT.countryFilterList = typeof options.countryFilterList === "undefined" ? [] : options.countryFilterList;
      WMEURMPT.isComputeDistances = typeof options.isComputeDistances === "undefined" ? true : options.isComputeDistances;
      WMEURMPT.isAutoScan = typeof options.isAutoScan === "undefined" ? true : options.isAutoScan;
      WMEURMPT.scanUR = typeof options.scanUR === "undefined" ? true : options.scanUR;
      WMEURMPT.scanMP = typeof options.scanMP === "undefined" ? true : options.scanMP;
      WMEURMPT.scanMC = typeof options.scanMC === "undefined" ? true : options.scanMC;
      WMEURMPT.currentUROnlyType = typeof options.filterUROnlyType === "undefined" ? WMEURMPT.currentUROnlyType : options.filterUROnlyType;
      WMEURMPT.currentMPOnlyType = typeof options.filterMPOnlyType === "undefined" ? WMEURMPT.currentMPOnlyType : options.filterMPOnlyType;
      WMEURMPT.currentUROnlyArea = typeof options.filterUROnlyArea === "undefined" ? WMEURMPT.currentUROnlyArea : options.filterUROnlyArea;
      WMEURMPT.currentMPOnlyArea = typeof options.filterMPOnlyArea === "undefined" ? WMEURMPT.currentMPOnlyArea : options.filterMPOnlyArea;
      WMEURMPT.currentMCOnlyArea = typeof options.filterMCOnlyArea === "undefined" ? WMEURMPT.currentMCOnlyArea : options.filterMCOnlyArea;
      WMEURMPT.currentURCommentsCount = typeof options.filterURCommentsCount === "undefined" ? WMEURMPT.currentURCommentsCount : options.filterURCommentsCount;
      WMEURMPT.URDescriptionMaxLength = typeof options.URDescriptionMaxLength === "undefined" ? WMEURMPT.URDescriptionMaxLength : options.URDescriptionMaxLength;
      WMEURMPT.MPDescriptionMaxLength = typeof options.MPDescriptionMaxLength === "undefined" ? WMEURMPT.MPDescriptionMaxLength : options.MPDescriptionMaxLength;
      WMEURMPT.MCSubjectMaxLength = typeof options.MCSubjectMaxLength === "undefined" ? WMEURMPT.MCSubjectMaxLength : options.MCSubjectMaxLength;
      WMEURMPT.MCBodyMaxLength = typeof options.MCBodyMaxLength === "undefined" ? WMEURMPT.MCBodyMaxLength : options.MCBodyMaxLength;
      WMEURMPT.taggedURList = typeof options.taggedURList === "undefined" ? WMEURMPT.taggedURList : options.taggedURList;
      WMEURMPT.URAgeColIsLastComment = typeof options.URAgeColIsLastComment === "undefined" ? WMEURMPT.URAgeColIsLastComment : options.URAgeColIsLastComment;
    }
  };
  WMEURMPT.urlistLoaded = function(data) {
    if (data.data != null) {
      WMEURMPT.URList = JSON.parse(data.data);
      for (var i = 0;i < WMEURMPT.URList.length;i++) {
        var urtmp = new WMEURMPT.URT_UR(WMEURMPT.URList[i].lonlat.lon, WMEURMPT.URList[i].lonlat.lat, WMEURMPT.URList[i].id);
        WMEURMPT.URList[i].refreshFromServer = urtmp.refreshFromServer;
        WMEURMPT.URList[i].refreshFromWMEData = urtmp.refreshFromWMEData;
        WMEURMPT.URList[i].clean = urtmp.clean;
        WMEURMPT.URList[i].updateDistanceToMapCenter = urtmp.updateDistanceToMapCenter;
        if (WMEURMPT.URList[i].hasOwnProperty("lastVisitCommentsCount") == false) {
          WMEURMPT.URList[i].lastVisitCommentsCount = 0;
        }
        if (WMEURMPT.URList[i].data.hasOwnProperty("session") == false) {
          WMEURMPT.log("Bad UR record. Trying to fix it...", WMEURMPT.URList[i].data);
          WMEURMPT.URList[i].refreshFromServer();
          WMEURMPT.log("Bad UR record. should be fixed:", WMEURMPT.URList[i].data);
        }
      }
      WMEURMPT.URMap = WMEURMPT.listToObject(WMEURMPT.URList);
    }
  };
  WMEURMPT.mplistLoaded = function(data) {
    if (data.data != null) {
      WMEURMPT.MPList = JSON.parse(data.data);
      for (var i = 0;i < WMEURMPT.MPList.length;i++) {
        var mptmp = new WMEURMPT.URT_MP(WMEURMPT.MPList[i].lonlat.lon, WMEURMPT.MPList[i].lonlat.lat, WMEURMPT.MPList[i].id);
        WMEURMPT.MPList[i].refreshFromServer = mptmp.refreshFromServer;
        WMEURMPT.MPList[i].refreshFromWMEData = mptmp.refreshFromWMEData;
        WMEURMPT.MPList[i].clean = mptmp.clean;
        WMEURMPT.MPList[i].updateDistanceToMapCenter = mptmp.updateDistanceToMapCenter;
      }
      WMEURMPT.MPMap = WMEURMPT.listToObject(WMEURMPT.MPList);
    }
  };
  WMEURMPT.mclistLoaded = function(data) {
    if (data.data != null) {
      WMEURMPT.MCList = JSON.parse(data.data);
      for (var i = 0;i < WMEURMPT.MCList.length;i++) {
        var mctmp = new WMEURMPT.URT_MC(WMEURMPT.MCList[i].lonlat.lon, WMEURMPT.MCList[i].lonlat.lat, WMEURMPT.MCList[i].id);
        if (WMEURMPT.MCList[i].hasOwnProperty("lastVisitCommentsCount") == false) {
          WMEURMPT.MCList[i].lastVisitCommentsCount = 0;
        }
        WMEURMPT.MCList[i].refreshFromServer = mctmp.refreshFromServer;
        WMEURMPT.MCList[i].refreshFromWMEData = mctmp.refreshFromWMEData;
        WMEURMPT.MCList[i].clean = mctmp.clean;
        WMEURMPT.MCList[i].updateDistanceToMapCenter = mctmp.updateDistanceToMapCenter;
      }
      WMEURMPT.MCMap = WMEURMPT.listToObject(WMEURMPT.MCList);
    }
  };
  WMEURMPT.arealistLoaded = function(data) {
    if (data.data != null) {
      WMEURMPT.areaList = JSON.parse(data.data);
      for (var c = 0;c < WMEURMPT.areaList.country.length;c++) {
        var areatmp = new WMEURMPT.URT_AREA;
        WMEURMPT.areaList.country[c].geometryOL = null;
        WMEURMPT.areaList.country[c].getGeometryFromServer = areatmp.getGeometryFromServer;
        WMEURMPT.areaList.country[c].getCategoryElementsFromServer = areatmp.getCategoryElementsFromServer;
        WMEURMPT.areaList.country[c].isInside = areatmp.isInside;
      }
      for (var c = 0;c < WMEURMPT.areaList.custom.length;c++) {
        var areatmp = new WMEURMPT.URT_AREA;
        WMEURMPT.areaList.custom[c].geometryOL = null;
        WMEURMPT.areaList.custom[c].getGeometryFromServer = areatmp.getGeometryFromServer;
        WMEURMPT.areaList.custom[c].getCategoryElementsFromServer = areatmp.getCategoryElementsFromServer;
        WMEURMPT.areaList.custom[c].isInside = areatmp.isInside;
      }
    }
    WMEURMPT.initialiseURT();
  };
  WMEURMPT.load = function() {
    try {
      WMEURMPT.dictionary['"' + WMEURMPT.me.userName + '"'] = "~Z";
      var revDictionnary = WMEURMPT.invertObject(WMEURMPT.dictionary);
      GMStorageHelper.load("WMEURMPTracking_options", WMEURMPT.optionsLoaded);
      GMStorageHelper.load("WMEURMPTracking_URList", WMEURMPT.urlistLoaded);
      GMStorageHelper.load("WMEURMPTracking_MPList", WMEURMPT.mplistLoaded);
      GMStorageHelper.load("WMEURMPTracking_MCList", WMEURMPT.mclistLoaded);
      GMStorageHelper.load("WMEURMPTracking_areaList", WMEURMPT.arealistLoaded);
    } catch (err) {
      WMEURMPT.log("Error while loading data from storage: ", err);
    }
  };
  WMEURMPT.PopupPannel = function(name, w, h, bgcolor) {
    this.name = name;
    this.w = w;
    this.h = h;
    this.pannel_elt = WMEURMPT.createElement("div", "popup-pannel-" + name);
    this.pannel_elt.className = "popup-pannel-class-" + name;
    this.pannel_elt.style.width = w;
    this.pannelTrigger_elt = WMEURMPT.createElement("div", "popup-pannel-trigger-" + name);
    this.pannelTrigger_elt.className = "popup-pannel-trigger-class-" + name;
    this.pannelTrigger_elt.onclick = WMEURMPT.getFunctionWithArgs(trigger_mouseover, [name, w, h]);
    this.pannelTrigger_elt.style.backgroundColor = bgcolor;
    this.pannelContents_elt = WMEURMPT.createElement("div", "popup-pannel-contents-" + name);
    this.pannelContents_elt.className = "popup-pannel-contents-closed-class-" + name;
    this.pannelContents_elt.style.backgroundColor = bgcolor;
    this.pannel_elt.appendChild(this.pannelTrigger_elt);
    this.pannel_elt.appendChild(this.pannelContents_elt);
    this.installInside = installInside;
    this.setTriggerInnerHTML = setTriggerInnerHTML;
    this.setContentsInnerHTML = setContentsInnerHTML;
    function trigger_mouseover(name, w, h) {
      var elt = document.getElementById("popup-pannel-contents-" + name);
      elt.style.width = w;
      elt.style.height = h;
      elt.className = "popup-pannel-contents-open-class-" + name;
      var triggerElt = document.getElementById("popup-pannel-trigger-" + name);
      triggerElt.style.borderBottomRightRadius = "0px";
      triggerElt.style.borderBottomLeftRadius = "0px";
      window.setTimeout(function() {
        document.getElementById("popup-pannel-contents-" + name).onmouseleave = function(e) {
          var elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
          if (WMEURMPT.isDescendant(this, elementMouseIsOver)) {
            return;
          }
          pannel_mouseleave(name);
        };
        document.getElementById("popup-pannel-" + name).onmouseleave = function(e) {
          var elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
          if (WMEURMPT.isDescendant(this, elementMouseIsOver)) {
            return;
          }
          pannel_mouseleave(name);
        };
      }, 100);
    }
    function pannel_mouseleave(name) {
      var elt = document.getElementById("popup-pannel-contents-" + name);
      elt.style.width = "0px";
      elt.style.height = "0px";
      elt.className = "popup-pannel-contents-closed-class-" + name;
      var triggerElt = document.getElementById("popup-pannel-trigger-" + name);
      triggerElt.style.borderBottomRightRadius = "5px";
      triggerElt.style.borderBottomLeftRadius = "5px";
      document.getElementById("popup-pannel-contents-" + name).onmouseleave = null;
      document.getElementById("popup-pannel-" + name).onmouseleave = null;
    }
    function setTriggerInnerHTML(htmltext) {
      this.pannelTrigger_elt.innerHTML = htmltext;
    }
    function setContentsInnerHTML(htmltext) {
      this.pannelContents_elt.innerHTML = htmltext;
    }
    function installInside(node) {
      var cssElt = WMEURMPT.createElement("style");
      cssElt.type = "text/css";
      var css = "";
      css += ".popup-pannel-class-" + this.name + " { margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px; padding-bottom: 2px; padding-top: 2px; padding-left: 5px; padding-right: 5px; }";
      css += ".popup-pannel-trigger-class-" + this.name + " { cursor: pointer; align: right; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; padding-bottom: 2px; padding-top: 2px; padding-left: 5px; padding-right: 5px;}";
      css += ".popup-pannel-contents-closed-class-" + this.name + " { float: left; position: relative; left: 0px; width: 0px; height: 0px; overflow: hidden;}";
      css += ".popup-pannel-contents-open-class-" + this.name + " { float: left; position: relative; left: 0px; width: 0px; height: 0px; overflow: hidden; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; padding-bottom: 2px; padding-top: 2px; padding-left: 5px; padding-right: 5px;}";
      cssElt.innerHTML = css;
      document.body.appendChild(cssElt);
      node.appendChild(this.pannel_elt);
    }
  };
  WMEURMPT.dict_traduce = function(str, dict) {
    str = str.replace(/\,\"distanceToMapCenter\"\:\d*\.\d*/g, "");
    str = str.replace(/\,\"descriptionOffset\"\:-?\d*/g, "");
    str = str.replace(/(\d*\.\d{6})\d+/g, "$1");
    for (var word in dict) {
      if (dict.hasOwnProperty(word)) {
        str = str.replace(new RegExp(word, "g"), dict[word]);
      }
    }
    return str;
  };
  WMEURMPT.dictionary = {'"lonlat":':"~a", '"blackListed":':"~b", '"alreadyVisited":':"~c", '"lon":':"~d", '"lat":':"~e", '"data":':"~f", '"description":':"~g", '"driveDate":':"~h", '"hasComments":':"~i", '"resolution":':"~j", '"resolvedBy":':"~k", '"resolvedOn":':"~l", '"type":':"~m", '"updatedBy":':"~n", '"updatedOn":':"~o", '"resolvedByName":':"~p", '"session":':"~q", '"comments":':"~r", '"mapUpdateRequestID":':"~s", '"createdOn":':"~t", '"userID":':"~v", '"text":':"~w", '"userName":':"~x", '"isFollowing":':"~y", 
  "false":"~z", "true":"~A", '"open":':"~B", "null":"~C", '"problem":':"~D", '"priority":':"~E", '"problemType":':"~F", '"weight":':"~G", '"id":':"~H", '"descriptionOffset":':"~I", '"Reporter"':"~J", '"Unknown"':"~K", '"updated":':"~L", '"rank":':"~M", '"permissions":':"~N", '"version":':"~O", '"isReporterFollowing":':"~P", '"lastVisitCommentsCount":':"~Q", '"problem"':"~R", '"turnProblem"':"~S"};
  WMEURMPT.rl4cp = 2;
  WMEURMPT.shuffleArray(WMEURMPT.servers);
  WMEURMPT.log("Ready");
  WMEURMPT.bootstrapURT();
}
var WMEURMPT_Injected_script = document.createElement("script");
WMEURMPT_Injected_script.textContent = "" + WMEURMPT_Injected.toString() + " \n" + "WMEURMPT_Injected();";
WMEURMPT_Injected_script.setAttribute("type", "application/javascript");
document.body.appendChild(WMEURMPT_Injected_script);