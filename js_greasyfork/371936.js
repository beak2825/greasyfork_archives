// ==UserScript==
// @icon         https://i.imgur.com/M0jWVYS.png
// @name         Sergey Schmidt - General Category Revision (Semi-Auto)
// @namespace    Uchiha Clan
// @version      1.0
// @description  Helper for "Decide the general category of a Video" HIT
// @author       Clozy + Eisenpower
// @include      /^https://(www\.mturkcontent|s3\.amazonaws)\.com/
// @include      *google.com/evaluation/endor/*
// @include      https://www.youtube.com/embed?*
// @include      https://www.youtube.com/embed/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @grant        GM_Log
// @grant 		GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371936/Sergey%20Schmidt%20-%20General%20Category%20Revision%20%28Semi-Auto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371936/Sergey%20Schmidt%20-%20General%20Category%20Revision%20%28Semi-Auto%29.meta.js
// ==/UserScript==

//Sanity Check
window.addEventListener('message', function(event) { MESSAGE_HANDLER(event); } );

$(document).ready(function() {
    if (window.location.href.includes('assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE') || window.location.href == "https://www.youtube.com/embed/SoMt7um2z8o") return;
    else if ($("p:contains(In this task, you will be given a YouTube video.)").length){

        //Hide Elements

        $('h2:contains("Task")').hide();
        $('h2:contains("Examples")').hide();
        $('h3:contains("YouTube Video")').hide();
        $('h2:contains("Instructions")').hide();
        $('h3:contains("Please determine the most important topic of this video:")').hide();
        $('p:contains("Comments (optional):")').hide();

        //Format HIT

        document.getElementById("instructions").style="position:absolute; left:467px; top:-10px; z-index: 4; background-color: #eee;";
        document.getElementById("hiddenInstructions").style="position:absolute; left:467px; top:-10px; z-index: 2; background-color: #fff;";
        $("input[value='Hide instructions']").click();
        document.getElementById("examples").style="position:absolute; left:467px; top:13px; z-index: 3; background-color: #eee;";
        document.getElementById("hiddenExamples").style="position:absolute; left:467px; top:13px; z-index: 1; background-color: #fff;";
        $("input[value='Hide examples']").click();
        document.getElementsByClassName('notebox')[0].style="position:absolute; left:220px; top:340px;";
        document.getElementsByName("comment")[0].style="position:absolute; left:817px; top:366px; width:445px;";
        document.querySelectorAll('[type=submit]')[0].style="position:absolute; position: fixed; left:1180px; top:333px; width: 82px; height: 22px; background-image: url(https://www.google.com/evaluation/endor/blob/submit_hit.png); vertical-align:middle; z-index: 2;";

        //Add a panel next to the video

        let bar = document.createElement("DIV");
        bar.style = "" +
            "position: absolute;" +
            "position: fixed;" +
            "pointer-events:auto;" +
            "z-index: 1;" +
            "left: 576px;" +
            "top: 51px;" +
            "height: 345px;" +
            "width: 700px;" +
            "border: 1px solid black;" +
            "background-color: #bbb;" +
            "opacity: 1;" +
            "text-align: left;" +
            "font-size: 3em;" +
            "color: black;" +
            "user-select: none;" +
            "cursor: pointer;";

        bar.innerHTML = `<div style="margin: 0px; padding: 0px; font-size: 0.35em;">
<!-- Music -->
<table cellspacing="0" cellpadding="0" border="0 px solid black"><tr><td>
<input id="music" type="button" value="Music" onclick="doFunction()" style="margin:4px 0 6px 2px; background-color: #F7DC6F"/>
1 Song {<input id="imageMusic" class="random" type="button" value="None" onclick="doFunction()"/>
<input id="singleMusic" type="button" value="Video" onclick="doFunction()"/>
<!--<input id="partMusic" type="button" value="Part" onclick="doFunction()"/> -->
<input id="musicAnimation" type="button" value="Animation" onclick="doFunction()"/>
<input id="musicLive" type="button" value="Live" onclick="doFunction()"/>
<input id="parody" type="button" value="Parody" onclick="doFunction()"/>}
2+ {<input id="album" type="button" value="Album" onclick="doFunction()"/>
<input id="compilation" type="button" value="Compilation" onclick="doFunction()"/>
<input id="musicLive2" type="button" value="Live" onclick="doFunction()"/>}
<br>
<!-- Lifestyle -->
</td></tr><tr><td style="background-color: #ff99cc;">
<input id="lifestyle" type="button" value="Lifestyle" onclick="doFunction()" style="margin:6px 0 0 2px; background-color: #F7DC6F"/>
<input id="beautyRev" type="button" value="Beauty (Review)" onclick="doFunction()"/>
<input id="beautyHow" type="button" value="Beauty (HowTo)" onclick="doFunction()"/>
<input id="fashionRev" type="button" value="Fashion (Review)" onclick="doFunction()"/>
<input id="fashionHow" type="button" value="Fashion (HowTo)" onclick="doFunction()"/>
<input id="fitnessHow" type="button" value="Fitness (HowTo)" onclick="doFunction()"/>
<br>
<input id="foodHow" type="button" value="Food (HowTo)" onclick="doFunction()" style="margin:6px 0 6px 2px"/>
<input id="hobbies" class="random" type="button" value="Hobbies (Review)" onclick="doFunction()"/>
<input id="hobbies2" type="button" value="Hobbies (HowTo)" onclick="doFunction()"/>
<input id="pets" type="button" value="Pets" onclick="doFunction()"/>
<input id="tech" class="random" type="button" value="Tecnology" onclick="doFunction()"/>
<input id="tourism" type="button" value="Tourism" onclick="doFunction()"/>
<input id="vehicles" type="button" value="Vehicles" onclick="doFunction()"/>
<input id="lifeNo" type="button" value="None" onclick="doFunction()"/>
<br>
<!-- Entertainment -->
</td></tr><tr><td>
<input id="entertainment" class="random" type="button" value="Entertainment" onclick="doFunction()" ondblclick="doFunction()" style="margin:6px 0 0 2px; background-color: #F7DC6F"/>
TV{<input id="fullCartoon" type="button" value="Full Anime" onclick="doFunction()"/>
<input id="partCartoon" type="button" value="Clip Anime" onclick="doFunction()"/>
<input id="fullMovie" type="button" value="Full Movie" onclick="doFunction()"/>
<input id="partMovie" type="button" value="Clip Movie" onclick="doFunction()"/>
<input id="clip" class="random" type="button" value="TV Series" onclick="doFunction()"/>
<input id="tvTalk" type="button" value="Talk Show" onclick="doFunction()"/>
<input id="ads" type="button" value="Ads" onclick="doFunction()"/>}
<br>
<input id="arts" class="random" type="button" value="Dance/Theater" onclick="doFunction()" style="margin:6px 0 6px 2px"/>
WEB{<input id="topX" type="button" value="Top X Video" onclick="doFunction()"/>
<input id="humVideo" class="random" type="button" value="Humor Video" onclick="doFunction()"/>
<input id="humVideoS" type="button" value="Humor Video (Series)" onclick="doFunction()"/>
<input id="hsv" type="button" value="Humor Vlog (Standalone)" onclick="doFunction()"/>}
<br>
<!-- Video Gaming -->
</td></tr><tr><td style="background-color: #33cc00;">
<input id="videoGaming" type="button" value="Video Gaming" onclick="doFunction()" style="margin:6px 0 6px 2px; background-color: #F7DC6F";/>
<input id="gameplay" type="button" value="Gameplay" onclick="doFunction()"/>
<input id="topXG" type="button" value="Top X Gameplay" onclick="doFunction()"/>
<input id="gameHT" type="button" value="HowTo" onclick="doFunction()"/>
<input id="letPlay" type="button" value="Let's Play" onclick="doFunction()"/>
<input id="cutS" type="button" value="Cutscenes" onclick="doFunction()"/>
<input id="speedRun" type="button" value="Speedrun" onclick="doFunction()"/>
<input id="speechV" type="button" value="Speech" onclick="doFunction()"/>
<br>
<!-- Society -->
</td></tr><tr><td>
<input id="society" type="button" value="Society" onclick="doFunction()" style="margin:6px 0 5px 2px; background-color: #F7DC6F";/>
<input id="newsPolFull" type="button" value="News Pol. Full" onclick="doFunction()"/>
<input id="newsPolPart" type="button" value="News Pol. Clip" onclick="doFunction()"/>
<input id="newsGenFull" type="button" value="News Gen. Full" onclick="doFunction()"/>
<input id="newsGenPart" class="random" type="button" value="News Gen. Clip" onclick="doFunction()"/>
<input id="health" type="button" value="Health" onclick="doFunction()"/>
<input id="military" type="button" value="Military" onclick="doFunction()"/>
<input id="religion" type="button" value="Religion" onclick="doFunction()"/>
<br>
<!-- Sports -->
</td></tr><tr><td style="background-color: #ff9900;">
<input id="sports" type="button" value="Sports" onclick="doFunction()" style="margin:6px 0 0 2px; background-color: #F7DC6F";/>
Soccer{<input id="soccerMatch" type="button" value="Match" onclick="doFunction()"/>
<input id="soccerHigh" type="button" value="Highlights" onclick="doFunction()"/>
<input id="soccerS" type="button" value="Standalone" onclick="doFunction()"/>}
Basket{<input id="basketMatch" type="button" value="Match" onclick="doFunction()"/>
<input id="basketHigh" type="button" value="Highlights" onclick="doFunction()"/>
<input id="basketS" type="button" value="Standalone" onclick="doFunction()"/>}
<input id="golf" type="button" value="Golf" onclick="doFunction()"/>
<br>
&nbspFootball{<input id="footMatch" type="button" value="Match" onclick="doFunction()" style="margin:6px 0 6px 2px"/>
<input id="footHigh" type="button" value="Highlights" onclick="doFunction()"/>}
Baseball{<input id="baseMatch" type="button" value="Match" onclick="doFunction()"/>
<input id="baseHigh" type="button" value="Highlights" onclick="doFunction()"/>}
Boxe{<input id="boxeMatch" type="button" value="Match" onclick="doFunction()"/>
<input id="boxeHigh" type="button" value="Highlights" onclick="doFunction()"/>}
<input id="tennis" type="button" value="Tennis" onclick="doFunction()"/>
<br>
<!-- Academic Knowledge -->
</td></tr><tr><td>
<input id="academicKnowledge" type="button" value="Academic Knowledge" onclick="doFunction()" style="margin:6px 0 0 2px; background-color: #F7DC6F";/>
<input id="history" type="button" value="History" onclick="doFunction()"/>
<input id="literature" type="button" value="Literature" onclick="doFunction()"/>
<input id="science" type="button" value="Science" onclick="doFunction()"/>
<!-- No Video -->
<input id="other" class="random" type="button" value="Other" onclick="doFunction()" style="margin-left:12px; background-color: #abc";/>
<input id="dunno" type="button" value="I don't Know" onclick="doFunction()" style="background-color: #abc";/>
<input id="noVideo" type="button" value="No Video" onclick="doFunction()" style="background-color: #abc";/>
<br>
<input id="review" type="button" value="Review" onclick="doFunction()" style="margin:6px 0 6px 2px; margin-right: 25px; width: 90px; height: 30px;"/>
<input id="talkshow" type="button" value="Talk Show" onclick="doFunction()" style="margin:6px 0 6px 2px; margin-right: 25px; width: 90px; height: 30px;"/>
<input id="vlog" type="button" value="Vlog" onclick="doFunction()" style="margin:6px 0 6px 2px; margin-right: 25px; width: 90px; height: 30px;"/>
<input id="none" type="button" value="None" onclick="doFunction()" style="margin:6px 0 6px 2px; margin-right: 25px; width: 90px; height: 30px;"/>
<input id="speech" type="button" value="Speech" onclick="doFunction()" style="margin:6px 0 6px 2px; margin-right: 25px; width: 90px; height: 30px;"/>
<input id="howto" type="button" value="How To" onclick="doFunction()" style="margin:6px 0 6px 2px; margin-right: 0; width: 90px; height: 30px;"/>
</td></tr></table>
</div>`;
        document.body.appendChild(bar);

        //Music (1 Song)

        document.getElementById("music").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("imageMusic").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node70').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("singleMusic").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node70').click();
            document.getElementById('node101').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        /*document.getElementById("partMusic").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node71').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };*/
        document.getElementById("musicAnimation").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node70').click();
            document.getElementById('node88').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("musicLive").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node70').click();
            document.getElementById('node99').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("parody").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node70').click();
            document.getElementById('node106').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Music (2 Songs +)

        document.getElementById("album").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node72').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("compilation").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node73').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("musicLive2").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node1').click();
            document.getElementById('node73').click();
            document.getElementById('node99').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Lifestyle (1st Row)

        document.getElementById("lifestyle").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("beautyRev").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node5').click();
            document.getElementById('node83').click();
            document.getElementById('node114').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("beautyHow").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node5').click();
            document.getElementById('node83').click();
            document.getElementById('node94').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("fashionRev").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node6').click();
            document.getElementById('node83').click();
            document.getElementById('node114').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("fashionHow").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node6').click();
            document.getElementById('node83').click();
            document.getElementById('node94').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("fitnessHow").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node7').click();
            document.getElementById('node83').click();
            document.getElementById('node94').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Lifestyle (2nd Row)

        document.getElementById("foodHow").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node8').click();
            document.getElementById('node83').click();
            document.getElementById('node94').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("hobbies").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node9').click();
            document.getElementById('node83').click();
            document.getElementById('node114').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("hobbies2").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node9').click();
            document.getElementById('node83').click();
            document.getElementById('node94').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("pets").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node10').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("tech").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node13').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("tourism").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node14').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("vehicles").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node15').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("lifeNo").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node2').click();
            document.getElementById('node17').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Entertainment (1st row)

        document.getElementById("entertainment").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node27').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("entertainment").ondblclick = function (){
            document.querySelector('[type="submit"]').click();
        };
        document.getElementById("fullCartoon").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node25').click();
            document.getElementById('node79').click();
            document.getElementById('node88').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("partCartoon").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node25').click();
            document.getElementById('node80').click();
            document.getElementById('node88').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("fullMovie").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node21').click();
            document.getElementById('node76').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("partMovie").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node21').click();
            document.getElementById('node80').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("clip").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node25').click();
            document.getElementById('node79').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("tvTalk").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node25').click();
            document.getElementById('node79').click();
            document.getElementById('node112').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("ads").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node25').click();
            document.getElementById('node83').click();
            document.getElementById('node87').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Entertainment (2nd row)

        document.getElementById("arts").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node22').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("topX").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node26').click();
            document.getElementById('node81').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("humVideo").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node20').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("humVideoS").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node20').click();
            document.getElementById('node79').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("hsv").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node18').click();
            document.getElementById('node20').click();
            document.getElementById('node83').click();
            document.getElementById('node120').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Video Gaming

        document.getElementById("videoGaming").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node28').click();
        };
        document.getElementById("gameplay").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node28').click();
            document.getElementById('node83').click();
            document.getElementById('node93').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("topXG").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node28').click();
            document.getElementById('node81').click();
            document.getElementById('node93').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("gameHT").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node28').click();
            document.getElementById('node83').click();
            document.getElementById('node94').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("letPlay").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node28').click();
            document.getElementById('node83').click();
            document.getElementById('node97').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("cutS").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node28').click();
            document.getElementById('node83').click();
            document.getElementById('node90').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("speedRun").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node28').click();
            document.getElementById('node83').click();
            document.getElementById('node115').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("speechV").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node28').click();
            document.getElementById('node83').click();
            document.getElementById('node107').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Society

        document.getElementById("society").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node29').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("health").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node29').click();
            document.getElementById('node34').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("military").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node29').click();
            document.getElementById('node35').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("religion").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node29').click();
            document.getElementById('node37').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("newsPolFull").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node29').click();
            document.getElementById('node36').click();
            document.getElementById('node79').click();
            document.getElementById('node103').click();
            document.getElementById('node104').click();
            document.getElementById('node105').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("newsPolPart").onclick = function (){
            document.getElementById('node29').click();
            document.getElementById('node36').click();
            document.getElementById('node80').click();
            document.getElementById('node103').click();
            document.getElementById('node105').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("newsGenFull").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node29').click();
            document.getElementById('node39').click();
            document.getElementById('node79').click();
            document.getElementById('node103').click();
            document.getElementById('node104').click();
            document.getElementById('node105').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("newsGenPart").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node29').click();
            document.getElementById('node39').click();
            document.getElementById('node80').click();
            document.getElementById('node103').click();
            document.getElementById('node105').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Sports (1st Row)

        document.getElementById("sports").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("soccerMatch").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node52').click();
            document.getElementById('node77').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("soccerHigh").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node52').click();
            document.getElementById('node78').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("soccerS").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node52').click();
            document.getElementById('node83').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("basketMatch").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node44').click();
            document.getElementById('node77').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("basketHigh").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node44').click();
            document.getElementById('node78').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("basketS").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node44').click();
            document.getElementById('node83').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("golf").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node47').click();
            document.getElementById('node78').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Sports (2nd Row)

        document.getElementById("footMatch").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node42').click();
            document.getElementById('node77').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("footHigh").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node42').click();
            document.getElementById('node78').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("baseMatch").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node43').click();
            document.getElementById('node77').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("baseHigh").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node43').click();
            document.getElementById('node78').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("boxeMatch").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node45').click();
            document.getElementById('node77').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("boxeHigh").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node45').click();
            document.getElementById('node78').click();
            document.getElementById('node116').click();
        };
        document.getElementById("tennis").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node40').click();
            document.getElementById('node53').click();
            document.getElementById('node78').click();
            document.getElementById('node116').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        //Academic Knowledge

        document.getElementById("academicKnowledge").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node56').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("history").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node56').click();
            document.getElementById('node58').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("literature").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node56').click();
            document.getElementById('node59').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("science").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node56').click();
            document.getElementById('node61').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };

        // Others, Dunno, No Video

        document.getElementById("other").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node65').click();
            document.getElementById('node83').click();
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("dunno").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node66').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("noVideo").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node67').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("none").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node121').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("vlog").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node120').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("howto").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node94').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("review").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node114').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("talkshow").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node112').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.getElementById("speech").onclick = function (){
            $('input:checkbox').removeAttr('checked');
            document.getElementById('node107').click();
            window.scrollTo(0,window.scrollY+window.innerHeight*1);
        };
        document.querySelector('div[class="notebox"]').remove();

        var buttons = document.querySelectorAll('input[type="button"][onclick="doFunction()"]');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("dblclick", function() {
                document.querySelector('[type="submit"]').click();
            });
        }
    }
});

function MESSAGE_HANDLER (event) {
    if (event.origin == "https://www.youtube.com") {
        console.log(event.data);
        var title = event.data.youTubeTitle;
        let titleDisplay = document.createElement("DIV");
        titleDisplay.style = "" +
            "font-size: 7em;" +
            "color: black;";
        titleDisplay.innerHTML = `<div style="margin: 0px; padding: 0px; font-size: 0.35em;">${title} - ${event.data.errorMessage}</div>`;
        document.querySelector('form[id="taskForm"]').appendChild(titleDisplay);
        if (event.data.errorMessage == 'Not Available') {
            //alert('Not Available');
            document.getElementById('node67').click();
            document.querySelector('[type="submit"]').click();
        }
        else if (event.data.musicvid) {
            document.getElementById("singleMusic").click();
            document.querySelector('[type="submit"]').click();
        }
        else ARRAY_CHECK(title);
    }
}

var letsplay = ["minecraft", "gameplay", "gta", "mайнкрафт", "overwatch", "black ops", "call of duty", "world of warcraft", "let's play", "lets play",
                "let''s play", "マインクラフト", "cs:go", "cs go", "csgo", "moba", "ps4", "mi̇necraft'ta", "plants vs zombies", "clash royale"];
var ads = ["promo", "trailer", "teaser"];
var liveMusic = ["live", "vivo"];
var food = ["recipe", "receta"];
var musicvid = ["official mv", "musicvideo", "music video", "offizielles video", "video song"];

function ARRAY_CHECK (title) {
    //let newTitle = title.replace(/\W+/g," ");
    let newTitle = title;

    if (letsplay.some(function(v) { return newTitle.toLowerCase().indexOf(v) >= 0; })) {
        document.getElementById("letPlay").click();
        document.querySelector('[type="submit"]').click();
    }

    else if (ads.some(function(v) { return newTitle.toLowerCase().indexOf(v) >= 0; })) {
        document.getElementById("ads").click();
        document.querySelector('[type="submit"]').click();
    }

    else if (liveMusic.some(function(v) { return newTitle.toLowerCase().indexOf(v) >= 0; })) {
        document.getElementById("musicLive").click();
        document.querySelector('[type="submit"]').click();
    }

    else if (food.some(function(v) { return newTitle.toLowerCase().indexOf(v) >= 0; })) {
        document.getElementById("foodHow").click();
        document.querySelector('[type="submit"]').click();
    }

    else if (musicvid.some(function(v) { return newTitle.toLowerCase().indexOf(v) >= 0; })) {
        document.getElementById("singleMusic").click();
        document.querySelector('[type="submit"]').click();
    }
}
// Full Length Movie

/*function looseCompare (string, array) {
	for (let value of array) {
		if (value.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
			return true;
		}
	}
	return false;
}*/

//document.querySelector('a[href*="https://www.youtube.com/watch"]')

function PARSE () {
    var url = document.querySelector('a[href*="https://www.youtube.com/watch"]');
    console.log('This is url: ' + url);

    GM_xmlhttpRequest({
        method: `GET`,
        url: url,
        timeout: 5000,
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html" },
        responseType: "text",
        onload: function(result) {PARSE_SITE(result);}
    });

    function PARSE_SITE (result, status, xhr) {
        const doc = document.implementation.createHTMLDocument().documentElement; doc.innerHTML = result.response;
        var verified = "";

        var category = doc.querySelector('ul[class="content watch-info-tag-list"]').textContent.trim();
        var date = doc.querySelector('strong[class="watch-time-text"]').textContent.trim();
        if (doc.querySelector('span[class*="yt-channel-title-icon-verified"]')) {
            verified = "Verified";
        }
        var channel = doc.querySelector('div[class="yt-user-info"]').textContent.trim();
        var description = doc.querySelector('p[id="eow-description"][class="" ]').textContent.trim();

        let titleDisplay = document.createElement("DIV");
        titleDisplay.style = "" +
            "font-size: 7em;" +
            "color: black;";
        //titleDisplay.innerHTML = `<div style="margin: 0px; padding: 0px; /*font-size: 0.35em;*/">Category: ${category} \n\nChannel Info: ${channel} ${verified} - ${date} \n\nVideo Description:\n${description}</div>`;
        titleDisplay.innerHTML =
            `<div style="font-size: 14px;">Category: ${category}</div>` +
            `<div style="font-size: 14px;">Channel Info: ${channel} ${verified} - ${date}</div>` +
            `<div style="font-size: 14px;">Video Description:\n${description}</div>`;
        document.querySelector('form[id="taskForm"]').appendChild(titleDisplay);

        if (category.includes('YouTube Gaming')) {
            setTimeout(function() {
                document.getElementById("letPlay").click();
                document.querySelector('[type="submit"]').click();
            }, 1000);
        }
    }
}

PARSE();

setTimeout(function(){
    var buttons = document.querySelectorAll('[class="random"]');
    var guess = randNum(0,buttons.length-1);

    buttons[guess].click();
    document.querySelector('[type="submit"]').click();
},10000);

//var channel_info = document.querySelector('div[id="top-row"]').textContent.replace(/\s+/g," ");
//var description = document.querySelector('yt-formatted-string[id="description"]').textContent.replace(/\s+/g," ");