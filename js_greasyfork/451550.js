// ==UserScript==
// @name             PSA.pm TVmaze API
// @namespace  tuktuk3103@gmail.com
// @description   TVmaze API (https://www.tvmaze.com/api), Icons created by Flat Icons - Flaticon (https://www.flaticon.com/)
// @license           CC BY-SA 4.0
// @include          *://psa.*/tv-show/*
// @include          *://psarips.com/tv-show/*
// @version          1.13
// @grant              GM.openInTab
// @grant              GM.xmlHttpRequest
// @icon                https://psa.re/wp-content/uploads/2021/10/cropped-PS-ICO-192x192.png
// @downloadURL https://update.greasyfork.org/scripts/451550/PSApm%20TVmaze%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/451550/PSApm%20TVmaze%20API.meta.js
// ==/UserScript==


//Removing duplicate episodes since it breaks script, sorry if you wanted other variants.

window.addEventListener("DOMContentLoaded", function() {
  var var0 = document.querySelectorAll('.sp-head');
  var regex = /(S\d{2}E\d{2}).*\.720p/;
  for(var x = var0.length; x--; x>-1) {
    var check1 = regex.exec(var0[x].textContent);
    var check2 = regex.exec(var0[x-1].textContent);
    if (check1[1] === check2[1]) var0[x].remove();
  }
});

//Adding style

let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = "#FemaleCast, #MaleCast, #Year {font-family: Verdana, sans-serif; font-size: 1.6em; font-variant: small-caps;}";
      head.appendChild(style);
    }

document.querySelectorAll("img.size-full")[0].setAttribute('width', '');
document.querySelectorAll("img.size-full")[0].setAttribute('height', '');

//XHR

var id = document.querySelector("h1.entry-title").textContent.replace(/\s\(TV show\)/i,'').replace(/\s\(\d+\)/,'').replace('Law & Order SVU','Law & Order: Special Victims Unit').replace('Marvel’s ','').replace(/Season\s\d+/,'');
var tvmazeAPI = "https://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(id) + "&embed[]=cast&embed[]=episodes";
GM.xmlHttpRequest ({
  method:            'GET',
  url:                      tvmazeAPI,
  responseType: "json",
  onload:               function (response) {

    console.log (
      "GM.xmlHttpRequest() response is:\n",
      response.response
    );

    //Adding containers for the response data

    document.querySelector("h1.entry-title").insertAdjacentHTML('afterbegin', '<a id="dayLink" href="" target="_blank"><img id="dayImg" style="max-height:51.2px; margin-right:20px;" src=""></a><a id="showLink" href="" target="_blank"><img id="showImg" style="max-height:40px; margin-right:20px;" src="https://static.tvmaze.com/images/tvm-header-logo.png"></a>');
    document.querySelector("h1.entry-title").insertAdjacentHTML('afterend', '<span id="Year"></span><br><br><span id="FemaleCast"></span><br><br><span id="MaleCast"></span>');

          switch (response.response.schedule.days[0]) { //Get the day and set the icon
            case "Sunday":
              document.getElementById("dayLink").setAttribute("href", "https://www.flaticon.com/free-icons/sunday");
              document.getElementById("dayImg").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/5776/5776782.png");
              break;
            case "Monday":
              document.getElementById("dayLink").setAttribute("href", "https://www.flaticon.com/free-icons/monday");
              document.getElementById("dayImg").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/5776/5776609.png");
              break;
            case "Tuesday":
              document.getElementById("dayLink").setAttribute("href", "https://www.flaticon.com/free-icons/tuesday");
              document.getElementById("dayImg").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/5776/5776837.png");
              break;
            case "Wednesday":
              document.getElementById("dayLink").setAttribute("href", "https://www.flaticon.com/free-icons/wednesday");
              document.getElementById("dayImg").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/5776/5776852.png");
              break;
            case "Thursday":
              document.getElementById("dayLink").setAttribute("href", "https://www.flaticon.com/free-icons/thursday");
              document.getElementById("dayImg").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/5776/5776798.png");
              break;
            case "Friday":
              document.getElementById("dayLink").setAttribute("href", "https://www.flaticon.com/free-icons/friday");
              document.getElementById("dayImg").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/5776/5776451.png");
              break;
            case "Saturday":
              document.getElementById("dayLink").setAttribute("href", "https://www.flaticon.com/free-icons/saturday");
              document.getElementById("dayImg").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/5776/5776750.png");
              break;
            default:
              document.getElementById("dayLink").setAttribute("href", "");
              document.getElementById("dayImg").setAttribute("src", "");
          }

    document.getElementById("showLink").setAttribute("href", response.response.url);

    document.getElementById("Year").innerHTML += "Premiere Year: " + response.response.premiered.slice(0, 4); //Adding premiere year

    if (response.response.status === "Ended") document.getElementById("Year").innerHTML += ", End Year: " + response.response.ended.slice(0, 4); //Adding end year

    document.getElementById("wpd-post-rating").insertAdjacentHTML('afterend', response.response.summary); //Adding show summary

    var varO = document.querySelectorAll('.sp-head');
    var regex2 = /E(\d{2}).*/;
    var order = true;
    var t=0, f=0;
    for(var m = varO.length; m--; m>-1) {
      try{ var check1 = regex2.exec(varO[m].textContent); } catch{}
      try{ var check2 = regex2.exec(varO[m-1].textContent); } catch{}
      try{ if (parseInt(check1[1], 10) < parseInt(check2[1], 10)) t++; else if (parseInt(check1[1], 10) > parseInt(check2[1], 10)) f++; } catch{}
    }
    if (t<f) order = false;

    if (order) {
    var var1 = document.querySelectorAll('.sp-head');
    var j = 0;
    for(var i = var1.length; i--; i>-1) { //Adding episode names and summaries
      if (/E\d{2}.*\.720p(\.10bit|)\.WEBRip\.2CH\.x265\.HEVC-PSA/.test(var1[i].textContent)) { //Ignores TV-PACKS
        var s = /S(\d{2})/.exec(var1[i].textContent); //Gets the season number
        if (parseInt(s[1], 10) === response.response._embedded.episodes[j].season) { //Checks if the season number matches
          if (/E\d{2}E\d{2}/.test(var1[i].textContent)) { //Double episodes
            var1[i].insertAdjacentHTML('beforeend', '<br>' + response.response._embedded.episodes[j].name + ': ' + response.response._embedded.episodes[j].summary + '<br>' + response.response._embedded.episodes[j+1].name + ': ' + response.response._embedded.episodes[j+1].summary);
            j = j+2;
          } else {
            if ( (/E00.*\.720p/.test(var1[i].textContent)) || (/(REPACK|INTERNAL)\.720p/.test(var1[i].textContent)) ) { } //Skips E00 because the API doesn't have any info about it and repacks/internals
              else {
                var1[i].insertAdjacentHTML('beforeend', '<br>' + response.response._embedded.episodes[j].name + ': ' + response.response._embedded.episodes[j].summary);
                j++;
              }
          }
        } else { if ( (/E00.*\.720p/.test(var1[i].textContent)) || (/(REPACK|INTERNAL)\.720p/.test(var1[i].textContent)) ) { } else { j++; i++; } }
      }
    }
    } else {
    var var1 = document.querySelectorAll('.sp-head');
    var j = response.response._embedded.episodes.length-1;
    for(var i = var1.length; i--; i>-1) { //Adding episode names and summaries
      if (/E\d{2}.*\.720p(\.10bit|)\.WEBRip\.2CH\.x265\.HEVC-PSA/.test(var1[i].textContent)) { //Ignores TV-PACKS
        var s = /S(\d{2})/.exec(var1[i].textContent); //Gets the season number
        if (parseInt(s[1], 10) === response.response._embedded.episodes[j].season) { //Checks if the season number matches
          if (/E\d{2}E\d{2}/.test(var1[i].textContent)) { //Double episodes
            var1[i].insertAdjacentHTML('beforeend', '<br>' + response.response._embedded.episodes[j].name + ': ' + response.response._embedded.episodes[j].summary + '<br>' + response.response._embedded.episodes[j-1].name + ': ' + response.response._embedded.episodes[j-1].summary);
            j = j-2;
          } else {
            if ( (/E00.*\.720p/.test(var1[i].textContent)) || (/(REPACK|INTERNAL)\.720p/.test(var1[i].textContent)) ) { } //Skips E00 because the API doesn't have any info about it and repacks/internals
              else {
                var1[i].insertAdjacentHTML('beforeend', '<br>' + response.response._embedded.episodes[j].name + ': ' + response.response._embedded.episodes[j].summary);
                j--;
              }
          }
        } else { if ( (/E00.*\.720p/.test(var1[i].textContent)) || (/(REPACK|INTERNAL)\.720p/.test(var1[i].textContent)) ) { } else { j--; i++; } }
      }
    }
  }

    //Segregate by gender

    let date =  new Date().getFullYear();

    const Female = response.response._embedded.cast.filter(actress => actress.person.gender === "Female"); //Ladies first! (*^_^*)

    try {
      if (Female[0].person.birthday) var bDay = Female[0].person.birthday.slice(0, 4); else var bDay = date;
      var age = parseInt(date, 10) - parseInt(bDay, 10);
      try {var country1 = "<img title='" + Female[0].person.country.name + "' style='margin-bottom:-8px;' src='https://flagsapi.com/" + Female[0].person.country.code + "/flat/32.png'>&nbsp;";} catch {var country1 = ""; Female[0].person.name = "\u2620&nbsp;" + Female[0].person.name;}
      document.getElementById("FemaleCast").innerHTML += "Female Cast: " + "<a href='" + Female[0].person.url + "' target='_blank'>" + country1 + Female[0].person.name + " (" + age + "yo)" + "</a>" + ".";}
    catch {document.getElementById("FemaleCast").innerHTML += "Female Cast: Not Found.";}

    try {if (Female[1]) document.getElementById("FemaleCast").innerHTML = document.getElementById("FemaleCast").innerHTML.slice(0, document.getElementById("FemaleCast").innerHTML.length-1);
      if (Female[1].person.birthday) var bDay = Female[1].person.birthday.slice(0, 4); else var bDay = date;
      var age = parseInt(date, 10) - parseInt(bDay, 10);
      try {var country2 = "<img title='" + Female[1].person.country.name + "' style='margin-bottom:-8px;' src='https://flagsapi.com/" + Female[1].person.country.code + "/flat/32.png'>&nbsp;";} catch {var country2 = ""; Female[1].person.name = "\u2620&nbsp;" + Female[1].person.name;}
      document.getElementById("FemaleCast").innerHTML += ", " + "<a href='" + Female[1].person.url + "' target='_blank'>" + country2 + Female[1].person.name + " (" + age + "yo)" + "</a>" + ".";}
    catch {}

    try {if (Female[2]) document.getElementById("FemaleCast").innerHTML = document.getElementById("FemaleCast").innerHTML.slice(0, document.getElementById("FemaleCast").innerHTML.length-1);
      if (Female[2].person.birthday) var bDay = Female[2].person.birthday.slice(0, 4); else var bDay = date;
      var age = parseInt(date, 10) - parseInt(bDay, 10);
      try {var country3 = "<img title='" + Female[2].person.country.name + "' style='margin-bottom:-8px;' src='https://flagsapi.com/" + Female[2].person.country.code + "/flat/32.png'>&nbsp;";} catch {var country3 = ""; Female[2].person.name = "\u2620&nbsp;" + Female[2].person.name;}
      document.getElementById("FemaleCast").innerHTML += ", " + "<a href='" + Female[2].person.url + "' target='_blank'>" + country3 + Female[2].person.name + " (" + age + "yo)" + "</a>" + ".";}
    catch {}

    try {if (Female[0].person.image.medium) document.getElementById("FemaleCast").getElementsByTagName('a')[0].addEventListener('mouseover', function() { document.querySelectorAll("img.size-full")[0].setAttribute('src', Female[0].person.image.medium); }, false);} catch {}
    try {if (Female[1].person.image.medium) document.getElementById("FemaleCast").getElementsByTagName('a')[1].addEventListener('mouseover', function() { document.querySelectorAll("img.size-full")[0].setAttribute('src', Female[1].person.image.medium); }, false);} catch {}
    try {if (Female[2].person.image.medium) document.getElementById("FemaleCast").getElementsByTagName('a')[2].addEventListener('mouseover', function() { document.querySelectorAll("img.size-full")[0].setAttribute('src', Female[2].person.image.medium); }, false);} catch {}

    const Male = response.response._embedded.cast.filter(actor => actor.person.gender === "Male");

    try {
      if (Male[0].person.birthday) var bDay = Male[0].person.birthday.slice(0, 4); else var bDay = date;
      var age = parseInt(date, 10) - parseInt(bDay, 10);
      try {var country4 = "<img title='" + Male[0].person.country.name + "' style='margin-bottom:-8px;' src='https://flagsapi.com/" + Male[0].person.country.code + "/flat/32.png'>&nbsp;";} catch {var country4 = ""; Male[0].person.name = "\u2620&nbsp;" + Male[0].person.name;}
      document.getElementById("MaleCast").innerHTML += "Male Cast: " + "<a href='" + Male[0].person.url + "' target='_blank'>" + country4 + Male[0].person.name + " (" + age + "yo)" + "</a>" + ".";}
    catch {document.getElementById("MaleCast").innerHTML += "Male Cast: Not Found.";}

    try {if (Male[1]) document.getElementById("MaleCast").innerHTML = document.getElementById("MaleCast").innerHTML.slice(0, document.getElementById("MaleCast").innerHTML.length-1);
      if (Male[1].person.birthday) var bDay = Male[1].person.birthday.slice(0, 4); else var bDay = date;
      var age = parseInt(date, 10) - parseInt(bDay, 10);
      try {var country5 = "<img title='" + Male[1].person.country.name + "' style='margin-bottom:-8px;' src='https://flagsapi.com/" + Male[1].person.country.code + "/flat/32.png'>&nbsp;";} catch {var country5 = ""; Male[1].person.name = "\u2620&nbsp;" + Male[1].person.name;}
      document.getElementById("MaleCast").innerHTML += ", " + "<a href='" + Male[1].person.url + "' target='_blank'>" + country5 + Male[1].person.name + " (" + age + "yo)" + "</a>" + ".";}
    catch {}

    try {if (Male[2]) document.getElementById("MaleCast").innerHTML = document.getElementById("MaleCast").innerHTML.slice(0, document.getElementById("MaleCast").innerHTML.length-1);
      if (Male[2].person.birthday) var bDay = Male[2].person.birthday.slice(0, 4); else var bDay = date;
      var age = parseInt(date, 10) - parseInt(bDay, 10);
      try {var country6 = "<img title='" + Male[2].person.country.name + "' style='margin-bottom:-8px;' src='https://flagsapi.com/" + Male[2].person.country.code + "/flat/32.png'>&nbsp;";} catch {var country6 = ""; Male[2].person.name = "\u2620&nbsp;" + Male[2].person.name;}
      document.getElementById("MaleCast").innerHTML += ", " + "<a href='" + Male[2].person.url + "' target='_blank'>" + country6 + Male[2].person.name + " (" + age + "yo)" + "</a>" + ".";}
    catch {}

    try {if (Male[0].person.image.medium) document.getElementById("MaleCast").getElementsByTagName('a')[0].addEventListener('mouseover', function() { document.querySelectorAll("img.size-full")[0].setAttribute('src', Male[0].person.image.medium); }, false);} catch {}
    try {if (Male[1].person.image.medium) document.getElementById("MaleCast").getElementsByTagName('a')[1].addEventListener('mouseover', function() { document.querySelectorAll("img.size-full")[0].setAttribute('src', Male[1].person.image.medium); }, false);} catch {}
    try {if (Male[2].person.image.medium) document.getElementById("MaleCast").getElementsByTagName('a')[2].addEventListener('mouseover', function() { document.querySelectorAll("img.size-full")[0].setAttribute('src', Male[2].person.image.medium); }, false);} catch {}

  }
});

// TVmaze API Button

var node1 = document.createElement("div");
node1.setAttribute("style","position: fixed;" +
                                      "bottom: 0;" +
                                      "left: 28px;" +
                                      "cursor: pointer;" +
                                      "border: 1px solid #313131;" +
                                      "border-top-left-radius: 5px;" +
                                      "background: #101000;" +
                                      "padding: 7px 15px;" +
                                      "z-index: 999999;");
node1.setAttribute("title", "Click here to open API");
node1.innerHTML = "<img src='https://static.tvmaze.com/images/api/tvm_api.png' style='max-height:4vh;'><img src='https://licensebuttons.net/l/by-sa/4.0/80x15.png' style='display: block;margin-left: auto;margin-right: auto;'>";
node1.id = "api";
document.body.appendChild(node1);

document.getElementById("api").addEventListener('click', function() { GM.openInTab("https://www.tvmaze.com/api#licensing", false); }, false);
