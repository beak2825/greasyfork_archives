// ==UserScript==
// @name        Create Debate Troll Filter
// @namespace   CreateDebate
// @description Filters out the trolls on www.CreateDebate.com
// @include     https://www.createdebate.com/*
// @version     5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28693/Create%20Debate%20Troll%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/28693/Create%20Debate%20Troll%20Filter.meta.js
// ==/UserScript==

//########################################
//              SETTINGS
//########################################
//This is the list of trolls you want to filter out. If you add more, be sure to make it all lower case
var trolls = ["brontoraptor", "outlaw60", "fromwithin", "nowasaint", "dadman", "grittyworm","dbcooper","atheistchimp","stiflersmom","subcreature","negligentt","cucumbercat","saintnow","mr_bombastic","truthprayer","justtruth","bellasmella","jaywoosh","evil-kin","godisnotdead","chinaman","tzarpepe","factmachine","mcdanksauce"]; 
var hideDebates = true; //Set this to true to hide all debates created by trolls, or false to show them
var hideComments = false; //Set this to true to hide all comments created by trolls, or false to show them
var textColor = "#cccccc"; //Colors the text of troll posts. The color is in hex format. You can use this website to easily select a diffent color. http://htmlcolorcodes.com/color-picker/  
var image = ""; //http://i.imgur.com/BG59e9N.jpg"; //Puts an image next to troll posts. Set to "" if you don't want an image displayed
//########################################


FilterDebates();
FilterComments(); 

function FilterDebates()
{
    try
    {
        for (var t = 0; t < trolls.Length; t++)
        {
             trolls[t] = trolls[t].toLowerCase();
        }

        var n1 = document.getElementsByClassName('debate-item');
        for (var i = 0; i < n1.length; i++)
        {
            var n2 = n1[i].getElementsByTagName('div');
            for (var j = 0; j < n2.length; j++)
            {
                var n3 = n2[j].getElementsByTagName('div');
                for (var k = 0; k < n3.length; k++)
                {
                    var divs4 = n3[k].getElementsByTagName('a');
                    for (var l = 0; l < divs4.length; l++)
                    {
                        if (trolls.indexOf(divs4[l].title.toLowerCase()) > -1)
                        {
                            if (hideDebates)
                            {
                                n1[i].style = 'clear:left;display:none;margin:5px 0 0 0;';
                            }
                            if (textColor !== '' || image !== '')
                            {
                                var n4 = n1[i].getElementsByClassName('debate-item-top');
                                if (n4.length > 0)
                                {
                                    if (image !== '')
                                    {
                                        var n5 = n4[0].getElementsByClassName('debate-icon');
                                        if (n5.length > 0)
                                        {
                                            n5[0].innerHTML = "<img src='" + image + "' alt='general'/>";
                                        }
                                    }
                                    if (textColor !== '')
                                    {
                                        var n6 = n4[0].getElementsByTagName('div');
                                        for (var m = 0; m < n6.length; m++)
                                        {
                                            var n7 = n6[m].getElementsByTagName('a');
                                            if (n7.length > 0)
                                            {
                                                n7[0].style.color = textColor;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    catch (err)
    {
        alert(err.message);
    }
}

function FilterComments()
{
    try {
        var n1 = document.getElementsByClassName('argBox argument');
        for (var i = 0; i < n1.length; i++) {
            var n2 = n1[i].getElementsByClassName('argHead');
            if (n2.length > 0) {
                var n3 = n2[0].getElementsByClassName('updownTD');
                if (n3.length > 0) {
                    var n4 = n3[0].getElementsByTagName('a');
                    for (var j = 0; j < n4.length; j++) {
                        if (trolls.indexOf(n4[j].title.toLowerCase()) > -1) {
                            if (hideComments)
                            {
                                n1[i].style = 'clear:left;display:none;margin:5px 0 0 0;';
                            }
                            if (textColor !== '' || image !== '')
                            {
                                var n5 = n1[i].getElementsByTagName('div');
                                for (var m = 0; m < n5.length; m++) {
                                    var n6 = n5[m].getElementsByClassName('argBody');
                                    if (n6.length > 0) {
                                        if (textColor !== '')
                                            n6[0].style.color = textColor;
                                        if (image !== '')
                                            n6[0].innerHTML = "<img src='" + image + "' align='left' style='img.top {vertical-align: text-top;}' />" + n6[0].innerHTML;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        alert(err.message);
    }
}

 