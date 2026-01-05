// ==UserScript==
// @name DomainKiller
// @version 0.95
// @description Automatycznie zakopuje wybrane domeny. Działa na wykopy sponsorowane.
// @author llinney małpa outlook.com
// @grant none
// @match http://www.wykop.pl/wykopalisko/*
// @match https://www.wykop.pl/wykopalisko/*
// @match https://www.wykop.pl/ustawienia/czarne-listy/
// @namespace http://www.wykop.pl/
// @downloadURL https://update.greasyfork.org/scripts/29441/DomainKiller.user.js
// @updateURL https://update.greasyfork.org/scripts/29441/DomainKiller.meta.js
// ==/UserScript==

// you can fill hardcoded domains table for preserving settings even after browser storage has been cleared.
// example:
// var hardCodedDomains = ['youtube.pl', 'liveleak.com'];
var hardCodedDomains = [];

const icoLock = '<i class="fa fa-lock"></i>';
const icoEye = '<i class="fa fa-eye-slash"></i>';
const icoX = '<i class="fa fa-times"></i>';
const blockedIconLi = '<li><a id="domainKillerPanel" title="Zakopywane domeny" class="dropdown-show ajax">' + icoLock + '</a></li>';
const blockedPanel = '<div id="domainKillerPanelDiv" class="dropdown right notificationsContainer bodyClosable"><div><ul id="domainKillerPanelList" class="menu-list"></ul><div></div>';
const settingsSectionNoGreens = '<div class="rbl-block"><div class="mark-bg"><div><form method="post" class="make-center-block tspace bspace default blackListForm width-two-third"><legend>Zielonki</legend><div class="space"><div class="row"><input class="checkbox" name="down_green" id="down_green" type="checkbox"><label class="inline" for="down_green">Zakopuj znaleziska</label></div><div class="row"><input class="checkbox" name="hide_green" id="hide_green" type="checkbox"><label class="inline" for="hide_green">Ukrywaj znaleziska</label></div></div></form></div></div><div class="space"><span></span></div></div>';
const settingsSectionTitleOrContent = '<div class="rbl-block"><div class="mark-bg"><p>Filtry wykopaliska</p><div><form method="post" class="make-center-block tspace bspace default blackListForm width-two-third"><legend>Tytuł bądź opis zawiera słowo:</legend><input class="medium vtop marginright5" id="wordFilter" value="" type="text"><fieldset class="row buttons"><p><input value="Dodaj" class="cfff large fnormal" id="group-search-button" type="submit"><input id="__token" style="display: none" name="__token" value="a90233fb06c855669455e1aa2db0769b-1502454963" type="hidden"></p></fieldset></form></div></div><div class="space">space</div></div>';
const settingsSectionDomainCheckboxes = '<div class="space"><div class="row"><input class="checkbox" name="down_domain" id="down_domain" type="checkbox"><label class="inline" for="down_domain">Zakopuj znaleziska</label></div><div class="row"><input class="checkbox" name="hide_domain" id="hide_domain" type="checkbox"><label class="inline" for="hide_domain">Ukrywaj znaleziska</label></div></div>';
const settingsBlackListsUrl = '/ustawienia/czarne-listy/';
const articlesUrl = '/wykopalisko/';

var greensDown = false;
var greensHide = false;
var greensMinus = false;

var domainsDown = true;
var domainsHide = true;

function init() {
    //getBlockedDomains();
    getGreenSettings();
    getDomainSettings();
}

function getBlockedDomains() {
    if (localStorage.getItem("unwantedDomains") === null) {
        setBlockedDomains(hardCodedDomains);
    }
    return JSON.parse(localStorage.getItem("unwantedDomains"));
}

function setBlockedDomains(domains) {
    localStorage.setItem("unwantedDomains", JSON.stringify(domains));
}

function getGreenSettings() {
    greensDown = JSON.parse(localStorage.getItem("greensDown"));
    greensHide = JSON.parse(localStorage.getItem("greensHide"));
    greensMinus = JSON.parse(localStorage.getItem("greensMinus"));
}

function getDomainSettings() {
    if ((localStorage.getItem("domainsDown") === null)
	|| (localStorage.getItem("domainsHide") === null)) {
	updateDomainSettings();
    }
    domainsDown = JSON.parse(localStorage.getItem("domainsDown"));
    domainsHide = JSON.parse(localStorage.getItem("domainsHide"));
}

function updateGreenSettings() {
    localStorage.setItem("greensDown", JSON.stringify(greensDown));
    localStorage.setItem("greensHide", JSON.stringify(greensHide));
    localStorage.setItem("greensMinus", JSON.stringify(greensMinus));
}

function updateDomainSettings() {
    localStorage.setItem("domainsDown", JSON.stringify(domainsDown));
    localStorage.setItem("domainsHide", JSON.stringify(domainsHide));
}

function removeDomainFromArray(ind) {
    var array = getBlockedDomains();
    var removedIt = array.splice(ind,1);
    setBlockedDomains(array);
    $('#domainKillerPanelListItem' + ind).parent().parent().hide();
}

function createPanel() {
    $('#domainKillerPanel').after(blockedPanel);
	$('#domainKillerPanelList').append('<li><p><a href="https://www.wykop.pl/ustawienia/czarne-listy/">Ta lista niedługo zniknie. Ustawienia blokowania domen aktualnie znajdują się tutaj >KLIK<</a></p></li>');
        var array = getBlockedDomains();
        var iter = 0;
        array.forEach(function(domain) {
            var currIt = iter;
            $('#domainKillerPanelList').append('<li><p><a  href="' + 'https://www.wykop.pl/szukaj/url:' + domain + '">' + domain + '</a><a id="domainKillerPanelListItem' + iter + '"title="Usuń z listy" class="close">' + icoX + '</a></p></li>');
            var name = '#domainKillerPanelListItem' + iter;
            $(name).on( "click", function() {
                removeDomainFromArray(currIt);
            });
            iter++;
        });
}

function togglePanel() {
    $('#domainKillerPanelDiv').toggle();
}

function addSettingsIcon() {
    $('#openNaturalSearch').parent().parent().prepend(blockedIconLi);

    $( "#domainKillerPanel" ).on( "click", function() {
        togglePanel();
    });
}

function addDownIcon(tagLine) {
    var source = $(tagLine)[0].getElementsByClassName('affect')[1].innerHTML.toString();
    $(tagLine).children('.tag.create').eq(2).before("<a href='' class='tag affect create' onclick='var array = JSON.parse(localStorage.getItem(\"unwantedDomains\"));Array.prototype.push.apply(array, [\"" + source + "\"]);localStorage.setItem(\"unwantedDomains\", JSON.stringify(array));'>zakopuj domenę</a>");
}

function addSettingsTitleOrContentSection() {
    $('.grid-main.m-reset-margin').append(settingsSectionTitleOrContent);
}

function addSettingsGreenOnesSection() {
    $('.grid-main.m-reset-margin').append(settingsSectionNoGreens);

    if (greensDown) {
        $('#down_green').attr("checked", "true");
    }

    if (greensHide) {
        $('#hide_green').attr("checked", "true");
    }

    $('#down_green').change(function() {
        if($(this).is(":checked")) {
     	    greensDown = true;
        } else {
	    greensDown = false;
	}
     	updateGreenSettings();
    });

    $('#hide_green').change(function() {
        if($(this).is(":checked")) {
     	    greensHide = true;
        } else {
	    greensHide = false;
	}
     	updateGreenSettings();
    });
}

function addSettingsDomainSection() {
    $('.rbl-block').eq(3).find('.row.buttons').parent().append(settingsSectionDomainCheckboxes);

    if (domainsDown) {
        $('#down_domain').attr("checked", "true");
    }

    if (domainsHide) {
        $('#hide_domain').attr("checked", "true");
    }

    $('#down_domain').change(function() {
        if($(this).is(":checked")) {
     	    domainsDown = true;
        } else {
	    domainsDown = false;
	}
     	updateDomainSettings();
    });

    $('#hide_domain').change(function() {
        if($(this).is(":checked")) {
     	    domainsHide = true;
        } else {
	    domainsHide = false;
	}
     	updateDomainSettings();
    });
}

function hideArticle(article) {
    //console.log('Proba ukrycia: ' + $(article).find('h2').children().eq(0).attr('href'));
    var hide = article.getElementsByClassName('fix-tagline')[0].getElementsByClassName('ajax affect create')[0];
        if (typeof hide === "undefined") {
	    return;
	} else {
	     hide.click();
	}
}

function downAll() {
    var array = getBlockedDomains();
    var iter = 0;

    $('.article.clearfix.preview.dC').each(function() {
        var downvote;
        var tagLine = $(this).find('.fix-tagline');
        addDownIcon(tagLine, iter);
	iter++;
        var source = $(tagLine)[0].getElementsByClassName('affect')[1].innerHTML.toString();
	var senderType = $(tagLine).children().eq(0).attr('class');

	if (shouldHide(source, array, senderType)) {
            hideArticle(this);
	}
	
        if (shouldDown(source, array, senderType)) {
		try {
	  	    //console.log('Proba zakopania: ' + $(this).find('h2').children().eq(0).attr('href'));
		    
		    var that = this;
		    downvote = this.getElementsByClassName('dropdown fix-dropdown bodyClosable');

		    if (downvote.length > 0) {
		        downvote = downvote[0].getElementsByClassName('ajax');
		     	downvote[4].click();
		    } else {
		        var upVote = this.getElementsByClassName('button button submit');
			if (typeof upVote[0] != "undefined") {
		            upVote[0].click();
			} else { return; }
		        var undo = this.getElementsByClassName('ajax');

		        setTimeout(function() {
		            undo[0].click();

		            setTimeout(function() {
		                downvote = that.getElementsByClassName('dropdown fix-dropdown bodyClosable')[0].getElementsByClassName('ajax');
		                downvote[4].click();
		            }, 2000);
		        }, 2000);
		    }
		    //console.log('Zakopano: ' + $(this).find('h2').children().eq(0).attr('href'));
		} catch (e) {
			//console.log('Blad podczas zakopywania: ' + $(that).find('h2').children().eq(0).attr('href'));
			//console.log(e);
		}
        }
    });
}

$(document).ready(function() {
    work();
});

function shouldDown(source, array, senderType) {

    if(greensDown && senderType == 'color-0 affect') {
        return true;
    }

    if(domainsDown && jQuery.inArray(source, array) > -1) {
        return true;
    }

    return false;
}

function shouldHide(source, array, senderType) {

    if(greensHide && senderType == 'color-0 affect') {
        return true;
    }

    if(domainsHide && jQuery.inArray(source, array) > -1) {
        return true;
    }

    return false;
}

function syncDomains() {
    var domains = getBlockedDomains();
    var alreadyInserted = new Array();
    $('.domaincard').find('a.lcontrast').each(function() {
        var insertedItem = removeWhiteChars($(this).text());
        alreadyInserted.push(insertedItem);
    });

    domains.forEach(function(element) {
        if (jQuery.inArray(element, alreadyInserted) == -1) {
	    sendXhr(element);
        }
    });
}

function removeWhiteChars(string) {
    return string.replace(/\s/g,'');
}

function sendXhr(domain) {
	var http = new XMLHttpRequest();
	var url = "https://www.wykop.pl/ustawienia/czarne-listy/";
	var token = $('#__token').attr('value');
	var params = "blacklist%5Bdomain%5D=" + domain + "&__token=" + token;
	http.open("POST", url, true);

	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {
	    	if(http.readyState == 4 && http.status == 200) {}
	};
	http.send(params);
}

function work() {
    init();
    addSettingsIcon();
    if (window.location.pathname == settingsBlackListsUrl) {
	syncDomains();
        //addSettingsTitleOrContentSection();
	addSettingsDomainSection();
        addSettingsGreenOnesSection();
    }
    createPanel();
    if (window.location.pathname.slice(0, 13) == articlesUrl) {
        downAll();
    }
}
