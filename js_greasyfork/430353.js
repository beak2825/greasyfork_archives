// ==UserScript==
// @name         Jays Custom buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Jay's Custom WME Buttons
// @author       You
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @match        https://www.waze.com/en-US/editor#wmewide-anglelens1510
// @icon         https://www.google.com/s2/favicons?domain=waze.com
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/13097-proj4js/code/Proj4js.js
// ^^^^^^^^         needed for the NYS FC Viewer PL to convert coordinated to proper projection
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAB9VBMVEUAAAD/gAD/nwD/lQD/nwD/mQD/lQD/kgD/mwD/lwD/nAD/mQD/lwD/mgD/mAD/mwD/mQD/lwD/mAD/mgD/mQD/mAD/mgD/mAD/mgD/mQD/mAD/mQD/mQD/mgD/mQD/////mAD/////mQD/////mQD/////mgD/mQD/////mAD/////mQD/mQD/mQD/////mgD//////Pj/mQD/////mAD/////mQD/mQD/////mgD/////mQD/mAD/////mQD/////mQD/////mgD/////mQD/mAD/////mQD/////mQD/mQD/////mQD/////mQD/////mQD/////mQD/////mQD/mQD/////mQD/////mQD/tkf/ulT/mQD/////mQD/mgD/mQD/////mgD/0Yz/mQD/////mQD///8AAAABAQECAgIDAwMJCQkRERESEhIWFhYZGRkaGhocHBwvLy8xMTFERERISEhXV1doaGhqamqBgYGEhISioqKjo6Ourq64uLi+vr7g4ODn5+fr6+v19fX4+Pj5+fn8/Pz9/f3+/v7/mQD/mwT/ngz/piD/qSj/rjT/s0D/uVD/u1T/w2j/xGz/xnD/x3T/zID/z4j/0Yz/05D/1pj/2aD/26T/3qz/5b//7M//79f/8dv/8t///Pf//fv////VAUOcAAAAaHRSTlMABAgMEBQYHBwgJCgsMDQ4PEBDR0tPU1dbX2Nna29zc3d3e3t/f4OHh4uLj5GTk5eXmZubn5+jp6erq6+zs7e3u7u/v8PHx8vLz9PT19fb29/f4+Pl5+fr6+3t7e/v8PLz8/T29/f7+1UbC/wAAAU+SURBVGje7drtf9NEHADwa7eWZRXWrKxrwAwfKlonghiRbt2YcQM2B4bCHChKFdpmPj/hs+KzLooPoKKITp3k7zRLcsk195iUvvHD71WbNPnud7mn3A0AUjxm24+AXoe9EU/c1VNjv+1Fe6KHSNsO4vEdvSEGi79e/vGH7y5e/MYKom44oet6TdN2l8tjilKQ85LUl+j+6eHKXMOKES3DOKTrrlyWhYh8NRYQjbIAIR+yugs+kqpYVq+RVLVrw1J5iNa9YSkcY6vVeyRdR3/87feXf/tj7a/19X/DNrnuxD9ra2t/Xrt29cqVn57SZvQ5wzgXB1HDej/9+982M94wTfMd2376fu/Pk6QhuaAoqtNONrMRAxpVaQ9TeM30YsX8wrYfjdXOC9CoAfAs5fYbt/7MROMVp5++h1FfI99h9V3O+J28vYohKyYeG/30FMXom+2s0ZmWj9zhjlbw7zZ5yop34tgOohFpN9thaQ3ARD7274Ik9CYxES+miEanMu0bM+Fohd3HNhkIZmQXo31AGtb2EgBN76oPgxut+k/oE9x4GxrHaQaibPEPnOvzS+stUygC5HaqYVnb/GPbwtI6ZpvC8S402gzDahW9g7CPrziJiBvhE5lgGIHycND1TK0mQZgGVGb9b7L7RF6NixzpMHJ1fBpQRDqunN9IvuoikdwSabJRDBHpJKtR0JQm17AsHQDYTNJoJ/KRKLKHb8w6bQN+Pkjod+nxKV5aDCNA8O79PD+Rg1xj0p1m0hGnQ6EZL2OJ5MlG1RtXWIgTr7MSORkaDZbBQ8h12j91r6DBR5x4ntJKRI0AST3UjN776qXr8OMLqPGSf/CAqAHgA5Ocz0c6DcsKFUYiFENL4fMhyf020UYNRCEY/mhVIBvjpEmXBA8cR4xQCScS70PkTvfnxRbfAEf9o7eEhw6ERqCYnUNyMFoJGUAPuno0zoa/jyodo5WYQUZU9ApPIXbyggYRUTuv6VDQ0YpiVLBJ0j585q9Gr3IVzziPJDLaEn3l0jBExa9zlRU0kSbxd7TXOgwhXguVFYg8GMfAkPSiRVNM873wsccx8EyyVOVF83NoHI5lgL2RGSVVefI6MtWPZxAePE2pPtD88gNvFnyWvNIyCsQRqpJy++mvL/xCNoogDsJQwP62/XNcg4ywFDAe26AgDCWBEczqS0BMuS+BQenq6QoxGgWQDImhNPIgKSKscA0WIqiEhlz2Qqat3gyChAqSR5m2UojNVmIqaFklRLjKEvo8kiIcZSmH/ha207G4CFPpNGi9hwDCUCJGNwhViRp0ZN4/McRoS9lTJOO5HBBFWI2RqTRyQBip+SdGQTzlVBaII5rYUntUIRl0BDagXSCOQjSCoh+OnijBlQNeT5p9hmfQn+9m+BzTPGXTGY4BYFXHVtSDhc4RIKrQDLBMbXMwxyoQVE7005a1Yab4qTG4nJoVU05Qd/5gydfxUwNxttc2naEb4NZwYRaLGZjKgICSYexgTtJeGTfeymAq88m2QIPdjNOMKpSCr/LW4pZukDy8DbFiKMhC23ByZCcsEHKe6GZpfe/WTLLSgmvCd1PqXuRd+WhtXC3KUn+iRKiDhkKb7xjGrK5Pa25UykGoilKSZQmpjn27g/Eyxd8FjBcNY17X91X1hRZjPSKIka62ydGXCFbHIU3eGKTC2ZGv3QBjgTtiSDsXujSWJKF/w1CrRnJjflC4xmeGSmWtNmfErQuny+kkrbhfkmRZHlHcuC1sJ7s0rarPGcuoUNveD3oTGWlIlouynM+Cm3Ez/rfxH6STRnmdq/GgAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/430353/Jays%20Custom%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/430353/Jays%20Custom%20buttons.meta.js
// ==/UserScript==

function open_nebraska() {
//  var center_lonlat=new OL.LonLat(W.map.center.lon,W.map.center.lat);
//     center_lonlat.transform(new OL.Projection('EPSG:900913'),new OL.Projection('EPSG:4326'));
//  var NYS_Orthos_PL = 'https://orthos.dhses.ny.gov/?lat='+center_lonlat.lat+'&long='+center_lonlat.lon+'&zoom='+((W.map.zoom)+12);
  var Nebraska_website = 'https://wazeopedia.waze.com/wiki/USA/Nebraska';

  window.open(Nebraska_website,'Nebraksa Wiki');
}

var WazePermalink;
setTimeout(function() {

    WazePermalink = document.getElementsByClassName('WazeMapFooter')[0];

    var map_links = document.createElement('span');
    map_links.innerHTML = '<img src="https://cdn.discordapp.com/emojis/466408454957957120.png?v=1" alt="Nebraska" width="18" height="18" id="Nebraska_link" title="Nebraska Permalink" style="cursor: pointer; float: left; display: inline-block; margin: 2px 5px 0 3px;"> ';
    WazePermalink.appendChild(map_links);
    document.getElementById("Nebraska_link").addEventListener("click", open_nebraska, false);

    var SL_link = document.createElement('a');
    SL_link.classList.add("waze-black-link");
    SL_link.target = '_blank';
    SL_link.rel = 'noopener noreferrer';
    SL_link.href = 'https://wazeopedia.waze.com/wiki/USA/Nebraska#Speed_Limits';
    SL_link.innerHTML = 'Speed Limits';
    WazePermalink.appendChild(SL_link);

    var RT_link = document.createElement('a');
    RT_link.classList.add("waze-black-link");
    RT_link.target = '_blank';
    RT_link.rel = 'noopener noreferrer';
    RT_link.href = 'https://cdn.discordapp.com/attachments/861912716615876618/872059021673246741/image0.png';
    RT_link.innerHTML = 'Road Types';
    WazePermalink.appendChild(RT_link);

    var FC_link = document.createElement('a');
    FC_link.classList.add("waze-black-link");
    FC_link.href = 'https://dot.nebraska.gov/travel/map-library/func-by-county';
    FC_link.target = '_blank';
    FC_link.rel = 'noopener noreferrer';
    FC_link.innerHTML = 'FC';
    WazePermalink.appendChild(FC_link);




}, 2500);
// End pl button