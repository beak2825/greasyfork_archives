// ==UserScript==
// @name         Generate Failed Playlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate Failed playlist
// @run-at       context-menu
// @author       River Adams
// @match        https://qa-allureserver.diptest.local/*
// @grant        none
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/447760/Generate%20Failed%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/447760/Generate%20Failed%20Playlist.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    var $ = window.jQuery;
    var project = $("h4").text();
    function DownloadFile(filename, text){
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    async function GetFailedTests(){
        var playlistPreXml = '<Playlist Version="2.0"><Rule Name="Includes" Match="Any"><Rule Match="All"><Property Name="Solution" /><Rule Match="Any">';
        var playlistPostXml = '</Rule></Rule></Rule></Playlist>';
        var response = await fetch("https://qa-allureserver.diptest.local/allure-api/allure-docker-service/projects/"+project+"/reports/latest/data/behaviors.json");
        var json = await response.json();
        var tests = Array.from(FlattenToTests(json.children));
        var failedTestsUids = tests.filter(test => test.status == "failed" || test.status == "broken").map(function(v){
            return v.uid;
        }).filter(onlyUnique);
        for(var uid of failedTestsUids){
                playlistPreXml = playlistPreXml + GetXmlBlobForTest(await GetJsonFromUid(uid));
            }
        var playlistXml = playlistPreXml + playlistPostXml;
        DownloadFile(project+"-failures.playlist", playlistXml);
    }

    async function GetJsonFromUid(uid){
        var response = await fetch("https://qa-allureserver.diptest.local/allure-api/allure-docker-service/projects/"+project+"/reports/latest/data/test-cases/"+uid + ".json");
        var json = await response.json();
        console.log(json.fullName);
        return json;
    }

    function* FlattenToTests(jsonResponse){
        for(var item of jsonResponse){
            if(item.children !== undefined)
            {
                yield* FlattenToTests(item.children);
            }
            else{
                yield item;
            }
        }
    }

    function GetXmlBlobForTest(testJson){
        var xml = '<Rule Match="All"><Property Name="TestWithNormalizedFullyQualifiedName" Value="' + testJson.fullName.split('(')[0] + '" /><Rule Match="Any"><Property Name="DisplayName" Value="' + testJson.name.replace(/"/g,"&quot;") + '" /></Rule></Rule>';
        return xml;
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    await GetFailedTests();
})();
