// ==UserScript==
// @name         Monocle 3
// @namespace    https://greasyfork.org/en/users/11508-arcbell
// @version      3.1.2
// @description  Alt viewer and more
// @author       Arcbell
// @match        https://epicmafia.com/user/*
// @match        https://epicmafia.com/u/*
// @match        https://epicmafia.com/report*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22274/Monocle%203.user.js
// @updateURL https://update.greasyfork.org/scripts/22274/Monocle%203.meta.js
// ==/UserScript==

//REPLACE meow WITH YOUR MONOCLE AUTH TOKEN
var monocle_auth = "meow";

//CONFIGURE OPTIONS FOR DEFAULT DISPLAY
var vios_hidden_on_profile = true;
var alts_hidden_on_profile = false;
var vios_hidden_on_reports = false;
var alts_hidden_on_reports = false;

/*
Userscript parses JSON sent by Monocle 3 server.
Format: [[{username:userid, username:userid, ...}, time], ...]
time = 0 means it's current
*/

//Setting up variables so the userscript knows what's what
var path = window.location.href;
if (path.indexOf('user') != -1  || path.indexOf('/u/') != -1) {var type = "user";var uid = window.user_id;} else if (path.indexOf('/report/') != -1) {var type = "report";var uid = parseInt($('.report_target a')[0].href.substring(27));} else {var type = "report_main";}
var duplicates = [];

//native functions and variables
String.prototype.between=function(from, to) {
    var i=this.indexOf(from)+from.length;
    return this.substring(i, this.indexOf(to, i));
};

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var vio_box = '<div id="violations"><h3>Violations</h3><div class="pd bgwhite"><table class="full"><tbody></tbody></table></div></div>';

//attempting to handle auth code with localstorage
if (monocle_auth === 'meow') {
    if (localStorage.monocle) {
        monocle_auth = localStorage.monocle;
    } else {
        promptext = "Monocle cannot find your auth code in your browser's cache, or in the tampermonkey script. Enter your auth ";
        promptext += "code here to store it in your browser's cache, or follow the instructions in https://epicmafia.com/topic/78980";
        promptext += " to install it in your userscript for greater permanence (if you don't store data in your browser or frequently reset";
        promptext += " cookies)";
        new_auth = prompt(promptext, "meow");
        if (new_auth !== "meow" && new_auth !== "") {
            localStorage.monocle = new_auth;
            monocle_auth = new_auth;
        }
    }
} else if (!localStorage.monocle) {
    localStorage.monocle = monocle_auth;
}

//Constructor of the HTML to be injected
function JSONtoHTML(d) {
    s = "";
    hs = "";
    for (var e in d) {
        if (d[e][1] === 0) {
            for (var u in d[e][0]) {
                s += "<a href='/user/"+d[e][0][u].toString()+"'>"+u+"</a> ";
            }
        } else {
            //stuff if its historical data
        }
    }
    return s;
}

function addToDate(months) {
    var currentdate = new Date();
    var unbandate = new Date(currentdate.getTime() + 1000 * 60 * 60 * 24 * 30 * months);
    return unbandate.toISOString().split('T')[0];
}

function fetchVios(users, place) {
    if (type == "user" && place === 0) {place += 1;} //Skip the first user (checked account) if this is user profile
    if (place < users.length && place < 101) {
        $.get("/user/"+users[place].toString(), function (data) {
            var new_vios = $(data).find('.violation');
            var user_label = '<a class="vio_user_link" href="/user/'+users[place].toString()+'"> '+$(data).find('#usertitle')[0].innerHTML+'</a>';
            new_vios.each(function (index) {
                var deleteVioButton = $(this).find('.delete-violation')[0];
                deleteVioButton.deletevio = deleteVioButton.href;
                deleteVioButton.removeAttribute('href');
                deleteVioButton.addEventListener("click",deleteVio,false);
                if (index === 0 && place > 0) {
                    $('#violations tbody').append("<br>");
                    $('#violations tbody').append(user_label);
                }
                $('#violations tbody').append(this);
            });
            fetchVios(users, place+1);
        });
    } else if (place > 100) {/*error message*/}
}

function queryMonocle(uid) {
    $.get('https://monocle3.pythonanywhere.com/lookup/'+monocle_auth+'/'+uid.toString(), function (data) {
        monoclebox.innerHTML = JSONtoHTML(data);
        uid_list = [uid];
        //configure differently when history is up and running
        for (var i in data[0][0]) {
            if (data[0][0][i] != uid) {
                uid_list.push(data[0][0][i]);
            }
        }
        //populate vios
        if ((vios_hidden_on_profile && type === "user") || (vios_hidden_on_reports && type === "report")) {
            $('#violations h3').append(' <a id="alt_showbutton"><icon><i class="icon-search"></i></a>');
            var newbutton = $('#alt_showbutton')[0];
            if (newbutton) {
                newbutton.addEventListener("click",function () {fetchVios(uid_list, 0);},false);
            }
        } else {
            fetchVios(uid_list, 0);
        }
    });
}

function createVioModified() {
    var vio = $('[name="siterule_id"]').find('option:selected').text();
    $.post('/violation?'+$('#create_user_violation').serialize());
    var html = '<div id="report_violation"><div class="one_violation"><span>Violation given to </span>'+$('.report_target a')[0].outerHTML+'<span>for </span><span class="violation">'+vio+'</span><span>by&nbsp;'+$('#auth_top a')[0].outerHTML+'</span></div></div>';
    if (!$('#report_violation')[0]) {
        $(html).insertAfter('#report_users');
        if (vio === 'Cheating') {
            $('#report_controls').append('<div><label><input type="checkbox" id="cheating_multi">Multiple Games</label>&nbsp;&nbsp;<label><input type="checkbox" id="cheating_comp">Competitive Games</label></div>');
        } else if (vio === 'Bypassing Suspensions') {
            $('#report_controls').append('<div><label>Handle Bypassing Suspensions manually.</label></div>');
            $('#autohandle_button')[0].className += ' disabled';
        } else if (vio === 'X-rated Material') {
            $('#report_controls').append('<div><label><input type="checkbox" id="xrated_lobby">Lobby or Games</label>&nbsp;&nbsp;<label><input type="checkbox" id="xrated_forum">Forums</label></div>');
        } else if (vio === 'Banned User') {
            $('#report_controls').append('<div><label><input type="checkbox" id="lobbybanonly">Lobby banned only</label>&nbsp;&nbsp;<input type="text" id="bannedusername" placeholder="Name of Banned User"></div>');
        }
    }
}

//////////////////// Handler functions

function report_close(report_id, e) {
    $.get('https://epicmafia.com/report/'+report_id+'/edit/status?status=closed', function (data) {
        if (JSON.stringify(data) === '[1]') {
            if (type === 'report') {
                $('.report_status').replaceWith('<div class="report_status" style="background-color:#bb1111">Closed</div>');
                $('#workingspinner').hide();
            } else {
                $(e.parentElement).find('.button').css('border', "0px");
                $(e).css('border', "2px solid black");
                close_dupes(0, report_id);
            }
        }
    });
}

function report_open(report_id, e) {
    $.get('https://epicmafia.com/report/'+report_id+'/edit/status?status=open', function (data) {
        if (JSON.stringify(data) === '[1]') {
            if (type === 'report') {
                $('.report_status').replaceWith('<div class="report_status" style="background-color:#11bb11">Open</div>');
            } else {
                $(e.parentElement).find('.button').css('border', "0px");
                $(e).css('border', "2px solid black");
            }
        }
    });
}

function report_process(report_id, e) {
    $.get('https://epicmafia.com/report/'+report_id+'/edit/status?status=processing', function (data) {
        if (JSON.stringify(data) === '[1]') {
            if (type === 'report') {
                $('.report_status').replaceWith('<div class="report_status" style="background-color:#bbbb11">In Progress</div>');
            } else {
                $(e.parentElement).find('.button').css('border', "0px");
                $(e).css('border', "2px solid black");
                close_dupes(0, report_id);
            }
        }
    });
}

function designate_dupe(report_id, e) {
    if (duplicates.indexOf(report_id) != -1) {
        duplicates = duplicates.filter(function(e){return e!==report_id;});
        e.innerHTML = 'Duplicate';
    } else {
        e.innerHTML = 'Duplicate &#10004;';
        duplicates.push(report_id);
    }
}

function close_dupes(i ,report_id) {
    if (i < duplicates.length) {
        $.get('https://epicmafia.com/report/'+duplicates[i]+'/edit/statement?statement=Duplicate of https://epicmafia.com/report/'+report_id, function () {
            $.get('https://epicmafia.com/report/'+duplicates[i]+'/edit/status?status=closed', function (data) {
                if (JSON.stringify(data) === '[1]') {
                    $($('#report_'+duplicates[i]+' .close_button')[0].parentElement).find('.button').css('border', "0px");
                    $('#report_'+duplicates[i]+' .close_button').css('border', "2px solid black");
                    $('#report_'+duplicates[i]+' .duplicate_button')[0].innerHTML = 'Duplicate closed ('+report_id+')';
                }
                close_dupes(i+1, report_id);
            });
        });
    } else {duplicates = [];}
}

function deleteVio() {
    var dialogueConfirm = confirm('Are you sure you want to delete this violation?');
    if (dialogueConfirm) {
        var full_vio_element = this.parentElement.parentElement;
        $.get(this.deletevio, function (data) {
            if (data.toString() === '1') {
                if (full_vio_element.getElementsByClassName('report_link')[0].href === window.location.href) {$('#report_violation').remove();}
                full_vio_element.parentNode.removeChild(full_vio_element);
            }
        });
    }
}

//automated mod actions

function writeVerdict(verdict, report_id) {
    $.get('https://epicmafia.com/report/'+report_id+'/edit/statement?statement='+encodeURIComponent(verdict), function () {
        $('#report_statement').remove();
        $('<div class="pd" id="report_statement">'+verdict+'</div>').insertBefore('#report_users');
        report_close(report_id, $('.close_button')[0]);
    });
}

function forum_post(url, data, cb) {
    $.ajax({
        url:'https://epicmafia.com/topic/'+data.topic_id.toString(),
        method: 'GET',
        xhr: function() {
            var xhr = jQuery.ajaxSettings.xhr();
            var setRequestHeader = xhr.setRequestHeader;
            xhr.setRequestHeader = function(name, value) {
                if (name == 'X-Requested-With') return;
                setRequestHeader.call(this, name, value);
            };
            return xhr;
        },
        success: function (new_data) {
            csrf = $(new_data).filter('[name="_csrf"]')[0].content;
            $.ajax({
                url: 'https://epicmafia.com/post',
                beforeSend: function (request)
                {
                    request.setRequestHeader('x-csrf-token', csrf);
                },
                method: 'POST',
                data: data,
                success: cb
            });
        }});
}

//apologies for the enormous shitty function that's probably unreadable
function modallRecurse(verdict, report_id, uid_list, thread_post, n, action) {
    var uidn = uid_list[n];
    if (action === 'cfcban' || action === 'lobbyban') {
        $.get('https://epicmafia.com/moderator/user/'+uidn.toString(), function (data) {
            var banlink, lobbyid;
            $(data).find('#lobbyusers a').each(function () {if (this.parentElement.previousSibling.previousSibling.innerHTML === 'Main') {banlink = this.href;}});
            if (banlink.indexOf('lobbyunban') === -1) {lobbyid = banlink.substring(58);} else {lobbyid = banlink.substring(60);}
            if (action === 'lobbyban') {
                $.get('https://epicmafia.com/moderator/action/lobbyban/lobbyuser/'+lobbyid, function () {
                    if (n+1<uid_list.length) {
                        modallRecurse(verdict, report_id, uid_list, thread_post, n+1, action);
                    } else {
                        forum_post('https://epicmafia.com/post', {'topic_id':74308, 'msg':thread_post}, function () {
                            writeVerdict(verdict, report_id);
                        });
                    }
                });
            } else if (action === 'cfcban') {
                $.get('https://epicmafia.com/moderator/action/ban_forum/user/'+uidn.toString(), function () {
                    $.get('https://epicmafia.com/moderator/action/ban_comments/user/'+uidn.toString(), function () {
                        $.ajax({
                            url: 'https://epicmafia.com/lobbyuser/'+lobbyid+'/banchat',
                            type: 'PUT',
                            success: function(response) {
                                if (response[1]) {
                                    if (n+1<uid_list.length) {
                                        modallRecurse(verdict, report_id, uid_list, thread_post, n+1, action);
                                    } else {
                                        forum_post('https://epicmafia.com/post', {'topic_id':74308, 'msg':thread_post}, function () {
                                            writeVerdict(verdict, report_id);
                                        });
                                    }
                                } else {
                                    $.ajax({
                                        url: 'https://epicmafia.com/lobbyuser/'+lobbyid+'/banchat',
                                        type: 'PUT',
                                        success: function() {
                                            if (n+1<uid_list.length) {
                                                modallRecurse(verdict, report_id, uid_list, thread_post, n+1, action);
                                            } else {
                                                forum_post('https://epicmafia.com/post', {'topic_id':74308, 'msg':thread_post}, function () {
                                                    writeVerdict(verdict, report_id);
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            }
        });
    } else if (action === 'forumsuspend') {
        $.get('https://epicmafia.com/moderator/action/suspend_forum/user/'+uidn.toString(), function () {
            if (n+1<uid_list.length) {
                modallRecurse(verdict, report_id, uid_list, thread_post, n+1, action);
            } else {
                writeVerdict(verdict, report_id);
            }
        });
    }
}

function modall(verdict, report_id, action) {
    var uid_list = [];
    var thread_post = 'https://epicmafia.com/report/'+report_id+' \n'+verdict+'\n\n';
    $('#monocle a').each(function () {
        var i = this.href.substring(27);
        uid_list.push(i);
        thread_post += this.innerHTML + ' ';
    });
    modallRecurse(verdict, report_id, uid_list, thread_post, 0, action);
}



function siteBan(verdict, report_id, uid) {
    $.get('https://epicmafia.com/moderator/action/suspend_account_all/user/'+uid.toString(), function () {
        $.get('https://epicmafia.com/moderator/action/ban/user/'+uid.toString(), function () {
            $.get('https://epicmafia.com/moderator/action/force_logout/user/'+uid.toString(), function () {
                modall(verdict, report_id, 'lobbyban');
            });
        });
    });
}

//vios that are not counted toward 8 vio ban
var noncounting_vios = ['Banned User','Note','Mod Abuse','Eighth Violation Ban','Lobby Ban'];

function eightvioban(report_id, uid) {
    var verdict = '8 Violations: ';
    $('.report_link').each(function () {
        verdict += this.href+' ';
    });
    verdict += '- ';
    modall(verdict+'lobby banned until '+addToDate(3), report_id, 'lobbyban');
}

function autoHandle(report_id) {
    $('#workingspinner').show();
    var uid = parseInt($('.report_target a')[0].href.substring(27));
    var vio, monthsban, verdict;
    if ($('span.violation')[0]) {
        vio = $('span.violation')[0].innerHTML;
        var vio_counter = 1;
        var total_vios = 0;
        if (noncounting_vios.indexOf(this.innerHTML) === -1) {total_vios = 1;}
        $('.siterule_name').each(function () {
            if (this.parentElement.href !== "https://epicmafia.com/report/"+report_id && this.parentElement.href.indexOf('https://epicmafia.com/report/') !== -1) {
                if (this.innerHTML === vio) {vio_counter += 1;}
                if (noncounting_vios.indexOf(this.innerHTML) === -1) {total_vios += 1;}
            }
        });
        verdict = vio + ' #' + vio_counter.toString() + ' - ';
        if (total_vios > 7 && !$('#eightvioban')[0]) {
            $('#report_controls').append('<div><a class="redbutton smallfont" id="eightvioban">8 Vio Ban</a></div>');
            $('#autohandle_button')[0].innerHTML = 'Original Vio';
            $('#eightvioban')[0].addEventListener("click",function () {eightvioban(report_id, uid);},false);
            $('#workingspinner').hide();
        } else if (vio === 'Game Related Suicide' || vio === 'Trolling') {
            if (vio_counter === 1) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/3600', function () {
                    writeVerdict(verdict+'1 hour suspension', report_id);
                });
            } else if (vio_counter === 2) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/43200', function () {
                    writeVerdict(verdict+'12 hour suspension', report_id);
                });
            } else if (vio_counter === 3) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                    writeVerdict(verdict+'1 day suspension', report_id);
                });
            } else if (vio_counter > 3) {
                modall(verdict+'lobby banned until '+addToDate(3), report_id, 'lobbyban');
            }
        } else if (vio === 'Insufficient Participation' || vio === 'Spamming' || vio === 'Copied Mechanics' || vio === 'Encouraging Rule Breakage') {
            if (vio === 'Insufficient Participation' || vio === 'Encouraging Rule Breakage') {monthsban = 3;} else {monthsban = 2;}
            if (vio_counter === 1) {
                writeVerdict(verdict+'warning', report_id);
            } else if (vio_counter === 2) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/3600', function () {
                    writeVerdict(verdict+'1 hour suspension', report_id);
                });
            } else if (vio_counter === 3) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/43200', function () {
                    writeVerdict(verdict+'12 hour suspension', report_id);
                });
            } else if (vio_counter === 4) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                    writeVerdict(verdict+'1 day suspension', report_id);
                });
            } else if (vio_counter > 4) {
                modall(verdict+'lobby banned until '+addToDate(monthsban), report_id, 'lobbyban');
            }
        } else if (vio === 'Game Throwing') {
            if (vio_counter === 1 || vio_counter === 2) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                    writeVerdict(verdict+'24 hour suspension', report_id);
                });
            } else if (vio_counter > 2) {
                modall(verdict+'lobby banned until '+addToDate(3)+', probation until '+addToDate(6), report_id, 'lobbyban');
            }
        } else if (vio === 'Lobby Camping' || vio === 'Lobby Trolling' || vio === 'Repeated Suicides') {
            if (vio === 'Repeated Suicides') {monthsban = 2;} else {monthsban = 6;}
            if (vio_counter === 1) {
                writeVerdict(verdict+'warning', report_id);
            } else if (vio_counter > 1) {
                modall(verdict+'lobby banned until '+addToDate(monthsban), report_id, 'lobbyban');
            }
        } else if (vio === 'Outside of Game Influence') {
            if (vio_counter === 1) {
                writeVerdict(verdict+'warning', report_id);
            } else if (vio_counter === 2) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/43200', function () {
                    writeVerdict(verdict+'12 hour suspension', report_id);
                });
            } else if (vio_counter === 3) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                    writeVerdict(verdict+'1 day suspension', report_id);
                });
            } else if (vio_counter > 3) {
                modall(verdict+'lobby banned until '+addToDate(3), report_id, 'lobbyban');
            }
        } else if  (vio === 'Cheating') {
            if (($('#cheating_multi')[0].checked && $('#cheating_comp')[0].checked) || vio_counter > 1) {
                if (vio_counter > 1) {
                    verdict = 'Cheating #2 - lobby banned until '+addToDate(4)+' and ineligible to trophy until '+addToDate(8);
                } else {
                    verdict = 'Cheating #1, multiple gold heart games - lobby banned until '+addToDate(4)+' and ineligible to trophy until '+addToDate(8);
                }
                modall(verdict, report_id, 'lobbyban');
            } else if ($('#cheating_multi')[0].checked) {
                modall('Cheating #1, multiple red heart games - lobby banned until '+addToDate(0.233), report_id, 'lobbyban');
            } else {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                    writeVerdict('Cheating #1, single cheated game - 1 day suspension', report_id);
                });
            }
        } else if (vio === 'Hateful Comments' || vio === 'Harassment' || vio === 'Exploit Abuse') {
            if (vio_counter === 1) {
                writeVerdict(verdict+'warning', report_id);
            } else if (vio_counter === 2) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/43200', function () {
                    modall(verdict+'12 hour suspension and 1 day forum suspension', report_id, 'forumsuspend');
                });
            } else if (vio_counter === 3) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                    modall(verdict+'1 day suspension and comment, forum, and chat ban until '+addToDate(3), report_id, 'cfcban');
                });
            } else if (vio_counter > 3) {
                siteBan(verdict+'site banned until '+addToDate(3), report_id, uid);
            }
        } else if (vio === 'Inappropriate Content') {
            if (vio_counter === 1) {
                modall(verdict+'1 day forum suspension', report_id, 'forumsuspend');
            } else if (vio_counter === 2) {
                modall(verdict+'1 day forum suspension', report_id, 'forumsuspend');
            } else if (vio_counter === 3) {
                modall(verdict+'comment, forum, and chat ban until '+addToDate(3), report_id, 'cfcban');
            } else if (vio_counter > 3) {
                siteBan(verdict+'site banned until '+addToDate(3), report_id, uid);
            }
        } else if (vio === 'Forum Spam') {
            if (vio_counter === 1) {
                writeVerdict(verdict+'warning', report_id);
            } else if (vio_counter === 2) {
                modall(verdict+'1 day forum suspension', report_id, 'forumsuspend');
            } else if (vio_counter === 3) {
                modall(verdict+'1 day forum suspension', report_id, 'forumsuspend');
            } else if (vio_counter > 3) {
                modall(verdict+'comment, forum, and chat ban until '+addToDate(2), report_id, 'cfcban');
            }
        } else if (vio === 'Site Spam') {
            if (vio_counter === 1) {
                writeVerdict(verdict+'warning', report_id);
            } else if (vio_counter === 2) {
                writeVerdict(verdict+'warning', report_id);
            } else if (vio_counter > 2) {
                siteBan(verdict+'site banned until '+addToDate(2), report_id, uid);
            }
        } else if (vio === 'Impersonation') {
            $.get('https://epicmafia.com/moderator/action/suspend_account/user/'+uid.toString(), function () {
                $.get('https://epicmafia.com/moderator/action/force_logout/user/'+uid.toString(), function () {
                    verdict = 'Impersonation - account locked';
                    var thread_post = 'https://epicmafia.com/report/'+report_id+' \n'+verdict+'\n\n'+$('.report_target a')[0].innerHTML.substring($('.report_target a')[0].innerHTML.indexOf('> ')+2);
                    forum_post('https://epicmafia.com/post', {'topic_id':74308, 'msg':thread_post}, function () {
                        writeVerdict(verdict, report_id);
                    });
                });
            });
        } else if (vio === 'X-rated Material') {
            if (vio_counter === 1) {
                if ($('#xrated_lobby')[0].checked && !$('#xrated_forum')[0].checked) {
                    $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                        writeVerdict(verdict+'1 day suspension', report_id);
                    });
                } else if (!$('#xrated_lobby')[0].checked && $('#xrated_forum')[0].checked) {
                    modall(verdict+'1 day forum suspension', report_id, 'forumsuspend');
                } else if ($('#xrated_lobby')[0].checked && $('#xrated_forum')[0].checked) {
                    $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                        modall(verdict+'1 day lobby & forum suspension', report_id, 'forumsuspend');
                    });
                }
            } else if (vio_counter > 1) {
                siteBan(verdict+'site banned until '+addToDate(3), report_id, uid);
            }
        } else if (vio === 'Outing of Personal Information') {
            if (vio_counter === 1) {
                $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                    writeVerdict(verdict+'1 day suspension', report_id);
                });
            } else if (vio_counter > 1) {
                siteBan(verdict+'site banned until '+addToDate(3), report_id, uid);
            }
        } else if (vio === 'Sharing Account with Banned Users') {
            if (vio_counter === 1) {
                writeVerdict(verdict+'warning', report_id);
            } else if (vio_counter > 1) {
                siteBan(verdict+'site banned until '+addToDate(3), report_id, uid);
            }
        } else if (vio === 'Report Spam') {
            if (vio_counter === 1) {
                writeVerdict(verdict+'warning, relevant reports listed in comments', report_id);
            } else if (vio_counter > 1) {
                siteBan(verdict+'site banned until '+addToDate(2)+', relevant reports listed in comments', report_id, uid);
            }
        } else if (vio === 'Inappropriate Avatar') {
            $.get('https://epicmafia.com/moderator/action/clear_avatar/user/'+uid.toString(), function () {
                if (vio_counter === 1) {
                    $.get('https://epicmafia.com/moderator/action/suspend_all/user/'+uid.toString()+'/duration/86400', function () {
                        writeVerdict(verdict+'1 day suspension', report_id);
                    });
                } else if (vio_counter > 1) {
                    siteBan(verdict+'site banned until '+addToDate(3), report_id, uid);
                }
            });
        } else if (vio === 'Inappropriate Biography') {
            $.get('https://epicmafia.com/moderator/action/clear_bio/user/'+uid.toString(), function () {
                if (vio_counter === 1) {
                    writeVerdict(verdict+'warning', report_id);
                } else if (vio_counter > 1) {
                    siteBan(verdict+'site banned until '+addToDate(3), report_id, uid);
                }
            });
        } else if (vio === 'Inappropriate Name') {
            $.get('https://epicmafia.com/moderator/action/suspend_account/user/'+uid.toString(), function () {
                $.get('https://epicmafia.com/moderator/action/force_logout/user/'+uid.toString(), function () {
                    writeVerdict(verdict+'account locked for inappropriate name, contact a mod once the name is changed', report_id);
                });
            });
        } else if (vio === 'Banned User') {
            var bannedUserName = $('#bannedusername')[0].value;
            if ($('#lobbybanonly')[0].checked) {
                modall(verdict+'lobby banned user '+bannedUserName, report_id, 'lobbyban');
            } else {
                siteBan(verdict+'site banned user '+bannedUserName, report_id, uid);
            }
        } else {$('#workingspinner').hide();alert('Monocle does not handle this violation!');}
    } else {
        writeVerdict('No violation', report_id);
    }

}

////////////////////

//monoclebox variable used in queryMonocle()
var monoclebox = document.createElement("div");
monoclebox.id = "monocle";

//report handler console
var handlebar = document.createElement("div");
handlebar.class = "handlebar";
handlebar.innerHTML = '<a class="button open_button" style="padding:5px;background-color:#11bb11;border-radius:4px;">&nbsp;&nbsp;&nbsp;</a>&nbsp;&nbsp;&nbsp;';
handlebar.innerHTML += '<a class="button progress_button" style="padding:5px;background-color:#bbbb11;;border-radius:4px;">&nbsp;&nbsp;&nbsp;</a>&nbsp;&nbsp;&nbsp;';
handlebar.innerHTML += '<a class="button close_button" style="padding:5px;background-color:#bb1111;border-radius:4px;">&nbsp;&nbsp;&nbsp;</a>&nbsp;&nbsp;&nbsp;';

if (type == "user") {
    if ($('#violations').length === 0) {$('.grid8').prepend(vio_box);}
    var newparent = $('#personalinfo')[0];
    newparent.insertBefore(monoclebox,newparent.firstChild);
} else if (type == "report") {
    insertAfter(handlebar,$('#report_r1 h2')[0]);
    insertAfter(monoclebox,$('#report_msg')[0]);
    $('#report_rt').append(vio_box);
    $('#create_user_violation [type="submit"]').replaceWith('<br><a class="redbutton smallfont" id="new_vio_button">Create violation!</a>');
    $('#report_controls .vv').append('<a class="redbutton smallfont" id="autohandle_button">Auto-handle</a>');
    $('#report_controls .vv').append('<i id="workingspinner" class="icon-spinner icon-spin" style="display: none"></i>');
    var isthereavio = $('#report_violation .violation')[0];
    if (isthereavio) {
        if (isthereavio.innerHTML === 'Cheating') {
            $('#report_controls').append('<div><label><input type="checkbox" id="cheating_multi">Multiple Games</label>&nbsp;&nbsp;<label><input type="checkbox" id="cheating_comp">Competitive Games</label></div>');
        } else if (isthereavio.innerHTML === 'Bypassing Suspensions') {
            $('#report_controls').append('<div><label>Handle Bypassing Suspensions manually.</label></div>');
            $('#autohandle_button')[0].className += ' disabled';
        } else if (isthereavio.innerHTML === 'X-rated Material') {
            $('#report_controls').append('<div><label><input type="checkbox" id="xrated_lobby">Lobby or Games</label>&nbsp;&nbsp;<label><input type="checkbox" id="xrated_forum">Forums</label></div>');
        } else if (isthereavio.innerHTML === 'Banned User') {
            $('#report_controls').append('<div><label><input type="checkbox" id="lobbybanonly">Lobby banned only</label>&nbsp;&nbsp;<input type="text" id="bannedusername" placeholder="Name of Banned User"></div>');
        }
    }
    var newbutton = $('#new_vio_button')[0];
    if (newbutton) {
        newbutton.addEventListener("click",createVioModified,false);
    }
    var newbutton = $('#autohandle_button')[0];
    if (newbutton) {
        newbutton.addEventListener("click",function () {
            autoHandle($('#report_r1 h2')[0].innerHTML.substring(7));},false);
    }
    var newbutton = $('.open_button')[0];
    if (newbutton) {
        newbutton.addEventListener("click",function () {report_open($('#report_r1 h2')[0].innerHTML.substring(7), newbutton);},false);
    }
    var newbutton = $('.progress_button')[0];
    if (newbutton) {
        newbutton.addEventListener("click",function () {report_process($('#report_r1 h2')[0].innerHTML.substring(7), newbutton);},false);
    }
    var newbutton = $('.close_button')[0];
    if (newbutton) {
        newbutton.addEventListener("click",function () {report_close($('#report_r1 h2')[0].innerHTML.substring(7), newbutton);},false);
    }
} else if (type === "report_main") {
    handlebar.style.marginTop = "15px";
    $('.report_top').append("<a class='duplicate_button smallfont pretty'>Duplicate</a>");
    $(".report_status_list").replaceWith(handlebar);
    $('.open_button').each(function () {
        this.addEventListener("click",function () {report_open(this.parentElement.parentElement.parentElement.parentElement.id.substring(7), this);},false);
        if (path.indexOf('?status=processing') === -1 && path.indexOf('?status=closed') === -1) {$(this).css('border', "2px solid black");}
    });
    $('.progress_button').each(function () {
        this.addEventListener("click",function () {report_process(this.parentElement.parentElement.parentElement.parentElement.id.substring(7), this);},false);
        if (path.indexOf('?status=processing') != -1) {$(this).css('border', "2px solid black");}
    });
    $('.close_button').each(function () {
        this.addEventListener("click",function () {report_close(this.parentElement.parentElement.parentElement.parentElement.id.substring(7), this);},false);
        if (path.indexOf('?status=closed') != -1) {$(this).css('border', "2px solid black");}
    });
    $('.duplicate_button').each(function () {
        this.addEventListener("click",function () {designate_dupe(this.parentElement.parentElement.id.substring(7), this);},false);
    });
}

if ((alts_hidden_on_profile && type === "user") || (alts_hidden_on_reports && type === "report")) {
    $('#monocle').append('<a id="alt_showbutton"><icon><i class="icon-search"></i></a>');
    var newbutton = $('#alt_showbutton')[0];
    if (newbutton) {
        newbutton.addEventListener("click",function () {queryMonocle(uid);},false);
    }
} else if (type != "report_main") {
    queryMonocle(uid);
}