// ==UserScript==
// @name         Professor Rating Schedule Builder
// @namespace    -1982405
// @version      1.0
// @description  Tired of switching between rate my professor and scheduel builder to find a good professor? Now you don't need to!
// @author       Daniel Glynn & Sam O'Brien
// @match        https://schedulebuilder.umn.edu/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle


// @downloadURL https://update.greasyfork.org/scripts/392320/Professor%20Rating%20Schedule%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/392320/Professor%20Rating%20Schedule%20Builder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .custom-button-for-stuff{
    background: #7a0019;
    color: #fff;
    border-radius: 10px;
    border: none;
    box-shadow: none;
    cursor: pointer;
    margin: 0px auto;
    margin-bottom: 10px;
    height: 30px;
    font-size: 18px;
    z-index: 1034;
    outline: none;
    display: block;
    min-width: 250px;
    }
    .custom-button-for-stuff:hover{
    background: #da291c;
    color: #000;
    }
    .custom-div-parent{
    justifyContent: flex-start;
    align-items: center;
    padding: 10px;
    justify-content: center;
    position: fixed;
    width: 20%;
    height: 97%;
    top: 0;
    right: 0%;
    z-index: 1032;
    background: #fff;
    overflow-y: scroll;
    }
    .credits{
    justifyContent: flex-start;
    align-items: center;
    padding: 8px;
    justify-content: center;
    position: fixed;
    width: 20%;
    height: 5%;
    bottom: 0;
    right: 0%;
    z-index: 1035;
    background: #7a0019;
    }
    `
    let navBar = document.getElementsByClassName("app-title")[0]
    navBar.style.width = '80%'
    let navBar2 = document.getElementsByClassName('breadcrumb')[0]
    navBar2.style.width='80%'
    document.head.appendChild(style);
    document.body.style.width = '80%'

    let rightSide = document.createElement('div');
    rightSide.className = 'custom-div-parent';
    document.body.appendChild(rightSide);

    let credits = document.createElement('div');
    credits.className = 'credits';
    document.body.appendChild(credits)

    var dannyURL = "https://www.linkedin.com/in/danielglynn72/";
    var dannyBold = document.createElement('strong');
    var dannyLink = document.createElement('a');
    dannyLink.href = dannyURL;
    dannyLink.target='_blank';
    dannyLink.innerText = 'Daniel Glynn';
    dannyBold.appendChild(dannyLink);

    var samURL = 'https://www.linkedin.com/in/samuel-o-brien-053959196/';
    var samBold = document.createElement('strong');
    var samLink = document.createElement('a');
    samLink.href = samURL;
    samLink.target='_blank';
    samLink.innerText = "Samuel O'Brien";
    samBold.appendChild(samLink);

    var creditText= document.createElement('span');
    creditText.style.margin = '4px';
    creditText.style.color = '#fff'
    creditText.style.fontSize = "x-small";
    creditText.appendChild(document.createTextNode('Developed By '));
    creditText.appendChild(dannyBold);
    creditText.appendChild(document.createTextNode(' and '));
    creditText.appendChild(samBold);
    creditText.appendChild(document.createTextNode('.'));
    credits.appendChild(creditText)

    var resultList = document.createElement('span');

    var currentProfessors = new Set();
    let searchProfessor = document.createElement("Button");
    rightSide.appendChild(searchProfessor);
    searchProfessor.id = "searchProfessorButton";
    searchProfessor.innerHTML = "Search Professors";
    searchProfessor.className = 'custom-button-for-stuff';
    searchProfessor.style.width = '250px';
    searchProfessor.addEventListener("click", function() {
        var newProfessors = searchProfessors();

        for (let i = 0; i < newProfessors.length; i++) {
            if(currentProfessors.has(newProfessors[i])) {
                console.log('Skipping ' + newProfessors[i]);
            } else {
                currentProfessors.add(newProfessors[i]);
                console.log('Adding ' + newProfessors[i]);
                console.log(currentProfessors);
                getProfessorInfo(newProfessors[i], function(data) {

                    // Function runs if professor is found
                    var url = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + data.id;

                    var bold = document.createElement('strong');
                    var a = document.createElement('a');
                    a.href = url;
                    a.target='_blank';
                    a.innerText = data.name;
                    bold.appendChild(a);

                    var professor = document.createElement("p");
                    professor.appendChild(bold);
                    professor.appendChild(document.createTextNode(' ('+data.numberOfRatings+' Reviews)'));
                    if(data.numberOfRatings > 0) {
                        professor.appendChild(document.createElement('br'));
                        professor.appendChild(document.createTextNode('Rating: '+data.totalRating));
                        professor.appendChild(document.createElement('br'));
                        professor.appendChild(document.createTextNode('Difficulty Score: '+data.easyScore));
                        professor.appendChild(document.createElement('br'));
                        professor.appendChild(document.createTextNode('Reviews: '+data.reviews));
                    }
                    resultList.appendChild(professor);
                }, function(name) {
                    // function runs if professor is not found
                    var professor = document.createElement("p");
                    var bold = document.createElement('strong');
                    bold.innerText = name;
                    professor.appendChild(bold);
                    professor.appendChild(document.createTextNode(' (Not Found)'));
                    resultList.appendChild(professor);
                });
            }
        }
    })
    let clearList = document.createElement("Button");
    clearList.id = "clearListButton";
    clearList.innerHTML = "Clear List";
    clearList.className = 'custom-button-for-stuff'
    clearList.style.width = '250px';
    clearList.addEventListener("click", function() {
        // Remove previous results
        while(resultList.firstChild) {
            resultList.removeChild(resultList.firstChild);
            currentProfessors = new Set();
        }
    })
    rightSide.appendChild(clearList);
    rightSide.appendChild(resultList);
})();

var cache = {};

function getProfessorInfo(name, func, errFunc) {
    if(name in cache) {
        func(cache[name]);
    } else {
        const apiUrl='https://solr-aws-elb-production.ratemyprofessors.com//solr/rmp/select/?solrformat=true&rows=20&wt=json&json.wrf=noCB&callback=noCB&q='+name+'&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+teacherfullname_autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=score+desc&defType=edismax&siteName=rmp&rows=20&group=off&group.field=content_type_s&group.limit=20&fq=schoolname_t%3A%22University+of+Minnesota%5C-Twin+Cities%22&fq=schoolid_s%3A1257';
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(e) {
                var jsonResponse = JSON.parse(this.responseText.substring(5, this.responseText.length - 1));
                console.log(jsonResponse);

                // No Professor was Found
                if(jsonResponse.response.docs.length == 0) {
                    errFunc(toTitleCase(name.replace('+', ' ')));
                    return;
                }

                var data = {
                    id: jsonResponse.response.docs[0].id.replace('teacher:', ''),
                    name : toTitleCase(name.replace('+', ' ')),
                    numberOfRatings : jsonResponse.response.docs[0].total_number_of_ratings_i,
                    clarityScore: jsonResponse.response.docs[0].averageclarityscore_rf,
                    easyScore : jsonResponse.response.docs[0].averageeasyscore_rf,
                    helpfulScore : jsonResponse.response.docs[0].averageheulfulscore_rf,
                    hotScore : jsonResponse.response.docs[0].averagehotscore_rf,
                    totalRating : jsonResponse.response.docs[0].averageratingscore_rf,
                    reviews : (jsonResponse.response.docs[0].tag_s_mv != undefined ? Array.from(jsonResponse.response.docs[0].tag_s_mv).map(i => ' ' + i.replace('.','')) : [])
                }
                cache[name] = data;
                func(data);
            }
        });
    }
}

function searchProfessors() {
    var classes = Array.from(document.getElementsByClassName('table-condensed')).map(i => i)
    console.log(classes)
    let professorList = []
    for (let i = 0; i < classes.length; i++) {
        let classObj = classes[i]
        var classObjHTML = classObj.innerHTML;
        if (classObjHTML.includes('http://www.umn.edu/lookup?type=')) {
            var professorName = classObjHTML.split('http://www.umn.edu/lookup?type=')[1].split('target="_blank">')[1].split('</a><br>')[0].toLowerCase().replace(' ','+')
            professorList.push(professorName)
        }
    }
    let professors = [...new Set(professorList)]
    console.log(professors)
    return professors
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase();
        }
    );
}
