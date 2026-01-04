// ==UserScript==
// @name         Polyglotd3fdfb0162bd39cff
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://localization.google.com/polyglot/tasks/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/376833/Polyglotd3fdfb0162bd39cff.user.js
// @updateURL https://update.greasyfork.org/scripts/376833/Polyglotd3fdfb0162bd39cff.meta.js
// ==/UserScript==

var modal;
var users;
var signedIn = false;

(function() {
    'use strict';
    prepandHTML();
    setClickListeners();
    //setClickListeners();
    handleClientLoad();
    // Your code here...
})();

function prepandHTML() {

    users = localStorage.getItem("users") == null ? [] : JSON.parse(localStorage.getItem("users"));

    var insertUsers = "";
    for(let i=0; i<users.length;i++){
        insertUsers += '<p  style="font-size:large" class="mailArray">'+users[i]+'</p><br>';
    }

    $("body").prepend('<div id="parser" style="z-index: 9999;width:400px"><p>Gmail API Quickstart</p>' +
                      '<button id="authorize_button" style="display: none;">Authorize</button>' +
                      '<button id="signout_button" style="display: none;">Sign Out</button>' +
                      '<pre id="content" style="white-space: pre-wrap;"></pre>'+
                      '<div id="myModal" class="modal">'+
                      '<div style="width:650px" class="modal-content">'+
                      '<span class="close">&times;</span>' +
                      '<p style="font-size:large">Polyglot projekt:</p><br><br><br>'+
                      '<div><button id="shareAll" style="font-size:large" class="ui-corner-all">Dodaj vse v share</button><br>'+
                      '<p style="font-size:20px">Mail se zbriše, ko nanj 2x kliknemo</p><br>' +
                      '<button id="uros" style="font-size:large;" class="">Dodaj Uroš</button>'+
                      '<button id="katja" style="font-size:large;margin-left:20px" class="">Dodaj Katja</button>'+
                      '<button id="joze" style="font-size:large;margin-left:20px" class="">Dodaj Jože</button><br>'+
                      '<p id="pname" style="font-size:large"></p><br><div style="height:400px; overflow-y: auto" class="emails">'+insertUsers+'</div>'+
                      '<textarea id="newUser" style="font-size:large"></textarea><br><br>' +
                      '<div><button id="addUser" style="font-size:large" class="ui-corner-all">Dodaj v seznam</button><br><br>' +
                      '<button id="send" style="font-size:large;float:right" class="ui-corner-all">POŠLJI</button><br><br></div>' +
                      ' </div></div></div>');

    var style = $('<style>body {font-family: Arial, Helvetica, sans-serif;} /* The Modal (background) */ .modal { display: none; /* Hidden by default */ position: fixed; /* Stay in place */ z-index: 1; /* Sit on top */ padding-top: 100px; /* Location of the box */ left: 0; top: 0; width: 100%; /* Full width */ height: 100%; /* Full height */ overflow: auto; /* Enable scroll if needed */ background-color: rgb(0,0,0); /* Fallback color */ background-color: rgba(0,0,0,0.4); /* Black w/ opacity */ } /* Modal Content */ .modal-content { background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%; } /* The Close Button */ .close { color: #aaaaaa; float: right; font-size: 28px; font-weight: bold; } .close:hover, .close:focus { color: #000; text-decoration: none; cursor: pointer; }</style>');
    $('html > head').append(style);
}

function setClickListeners() {
    modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    $("p").on("dblclick",function(){

        doubleClickDelete(this);
    });

    $("#shareAll").on("click",async function(){
        if($('span:contains("View only")').length >0) {
            alert("V tem projektu nimate pravic dodajanja.");
        } else {
            for(var i=0; i<users.length; i++) {
                var mail = users[i].split(" ");
                mail = mail[mail.length-1];
                await addUserToShared(mail);
            }
            alert("Vsi napisani email naslovi so bili dodani v share");
        }

    });

    $("#addUser").on("click",function(){
        addUser($("#newUser").val());
    });

    $("#uros").on("click",function(){
        addUser("Uroš 003-sl_0049@003vendor.com");
    });

    $("#katja").on("click",function(){
        addUser("Katja 003-sl_0050@003vendor.com");
    });

    $("#joze").on("click",function(){
        addUser("Jože 003-sl_0049@003vendor.com");
    });

    $("#send").on("click",function(){
        if(signedIn) {
            sendToAll();
        } else {
            alert("Trenutno je podprto pošiljanje le za prijavljen račun 004-sl_0400@004vendor.com");
        }
    });

    modal.style.display = "block";
}

function doubleClickDelete(el) {
    var index = users.indexOf($(el).text());
    if(index > -1) {
        users.splice(index,1);
    }

    localStorage.setItem("users", JSON.stringify(users));
    $(el).next().remove(); //remove <br>
    $(el).remove();
}

function addUser(newUser) {
    var exit = false;

    var newUserMail = newUser.split(" ");
    newUserMail = newUserMail[newUserMail.length-1];

    $('.mailArray').filter(function(){
        var mail = $(this).text().split(" ");
        mail = mail[mail.length-1];
        if (mail == newUserMail) {
            alert("Vneseni email že obstaja na seznamu.");
            exit = true;
        }
    });
    if(exit) {
        return;
    }

    users.push(newUser);

    $(".emails").append('<p style="font-size:large" class="mailArray">'+newUser+'</p><br>');

    $("p").on("dblclick",function(){
        doubleClickDelete(this);
    });

    $("#newUser").val("");
    localStorage.setItem("users", JSON.stringify(users));
}

async function sendToAll(){
    for(var i=0; i<users.length; i++) {
        var mail = users[i].split(" ");
        mail = mail[mail.length-1];

         await sendMessage({
            'To': mail,
            'Subject': "Polyglot projekt "+getProjectID()
        },
                    await getMailContent()
                   );
    }

    alert("Uspešno poslano");
}

var CLIENT_ID = '13688801541-knljoqqthrg0fftgs2pnd3gkddsiti2k.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCcK53svqrDzUn6Rq4KJSBWn-s-GL_ZF10';

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly ' +
    'https://www.googleapis.com/auth/gmail.send';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        signedIn = true;
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        alert("Potrebna je prijava v 004-sl_0400@004vendor.com v drugem zavihku. Če ste to že storili kliknite na gumb Authorize, nahaja se na dnu strani.");
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function sendMessage(headers_obj, message) {
    var email = '';
    for (var header in headers_obj)
        email += header += ": " + headers_obj[header] + "\r\n";
    email += "\r\n" + message;

    var sendRequest = gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': window.btoa(unescape(encodeURIComponent(email))).replace(/\+/g, '-').replace(/\//g, '_')
        }
    });

    /*return sendRequest.execute(function() {
           // resolve(true);
        console.log("It works");
        });*/
    return new Promise(function(resolve,reject) {
        sendRequest.execute(function() {

        console.log("It works");
            resolve(true);
        });
    });
}

async function getMailContent(){
    var projectName = $(".ZY4IA").html();
    var WWC = $(".Lm2xIf").html();
    var deadline = await getDeadline();

    return "Pozdravljeni!\n\nProsimo za pregled in oddajo Polyglot projekta:\n\n"+
        "Ime projekta: "+projectName+"\n"+"WWC: "+WWC+"\nRok za oddajo: "+deadline+"\n\n"+
        "Hvala.\nLep pozdrav,\nJoze";
}

function setDialog() {
    var pname = projects[0].projectName;
    $("#pname").text(pname);
    modal.style.display = "block";
}

function getShareUrl() {
    var firKey = Object.keys(window.WIZ_global_data)[4];
    var firKeyTmp = Object.keys(window.WIZ_global_data[firKey])[32]; //iMRw7d

    var secKey = Object.keys(window.WIZ_global_data)[2];
    var secValue = window.WIZ_global_data[secKey]; //519283509546659427

    var thirdKey = Object.keys(window.WIZ_global_data)[12];
    var thirdValue = window.WIZ_global_data[thirdKey]; // boq_polyglotuiserver_201812

    var dt = new Date();
    var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours())+1E5+200000;

    return "https://localization.google.com/_/PolyglotUi/data/batchexecute?rpcids="+firKeyTmp +"&f.sid="+secValue+"&bl="+thirdValue+"&hl=en&_reqid="+secs +"&rt=c";
}

function getSendAtParameter(){
    var atKey = Object.keys(window.WIZ_global_data)[9];

    return window.WIZ_global_data[atKey];
}

function getSendPostData(recipient) {
    var firKey = Object.keys(window.WIZ_global_data)[4];
    var firKeyTmp = Object.keys(window.WIZ_global_data[firKey])[32]; //iMRw7d

    var url = window.location.href.split("/");
    url = url[url.length-1];
    var rez = 'f.req=[[["'+firKeyTmp+'","[[[[\\"'+url+'\\",[null,3,\\"'+recipient+'\\",\\"'+url+'\\"]]]]]",null,"generic"]]]&at='+getSendAtParameter()+'&';

    return rez;// encodeURIComponent(rez);
}

function addUserToShared(user) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: getShareUrl(),
            type: "POST",
            headers: {
                'x-client-data':'CI62yQEIorbJAQjEtskBCKmdygEIqKPKAQi/p8oBCOynygEI4qjKARj5pcoB',
                'x-same-domain':'1'
            },
            data: getSendPostData(user),
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            success: function(response) {
                resolve(true);
                console.log("success");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                resolve(true); //google returns contentType json,and it throw an error because of the wrong formulation
                console.log("ERROR:" + textStatus, errorThrown);
            }
        });
    });
}

function getProjectID(){
    var pID = $(".ZY4IA").html().split("_");
    var num = -1;
    for(var i=0; i<pID.length;i++) {
        if(!isNaN(pID[i]) && pID[i] > num) {
            num = pID[i];
        }
    }

    return num;
}

function getDeadline(){
    return new Promise(function (resolve,reject) {
        var url = getProjectID();
        $.get("https://localization.google.com/polyglot?project_id="+url,function(data) {
            resolve($(data).find('span[jsname="GiSHmb"]:eq(4)').html());
        });
    });
}
