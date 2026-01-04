// ==UserScript==
// @name        War Base Extended v2
// @namespace   com.torn.gaminganonymous
// @description A modified version of War Base Extended
// @include     *.torn.com/factions.php?step=your
// @version     0.4
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30469/War%20Base%20Extended%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/30469/War%20Base%20Extended%20v2.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

/*
Changelog:

v0.4:
    * FEATURE: Changing the colours of the tags now updates any existing tags on the screen (This is probably fine, as the filter reapplies every time)

v0.3:
    * BUG: Fixed a bug keeping some factions hidden even after adjusting other parts of the filter, revealing some of its members.
    * QOL: Commented a little more code.
    * QOL: Minor optimisations with the hiding of factions
    * QOL: Updated the colour pickers so that their width adjusts depending on screen size. (They could appear be party outside the container when size was too small)
    * QOL: Added a couple of simple animations to make it feel a little friendlier
    * FEATURE: Added an overlay window with colour pickers which allows you to change to colours of the difficulties

v0.2:
    * FEATURE: Added level filter
    * FEATURE: Added option to hide empty factions due to all of its members being hidden
    * QOL: Added a counter to track the number of hidden factions due to the filter
    * QOL: Added tooltips
*/

/*
Known Issues:
    * If you adjust the size of the browser window when the script is active, it might go invisible. It is fixed by refreshing
*/

/*
TODO:
    * Cleanup/ refactoring
    * Filter by enemy tags Easy/Medium/Impossible
    * Fix editing of tag colours
*/

/* Global CSS */
GM_addStyle(
    '#vinkuun-extendedWarBasePanel { line-height: 2em }' +
    '#vinkuun-extendedWarBasePanel label { background-color: rgba(200, 195, 195, 1); padding: 2px; border: 1px solid #fff; border-radius: 5px }' +
    '#vinkuun-extendedWarBasePanel input { margin-right: 5px; vertical-align: text-bottom }' +
    '#vinkuun-extendedWarBasePanel input[type="number"] { vertical-align: baseline; line-height: 1.3em }' +
    '#vinkuun-extendedWarBasePanel { padding: 4px; }'
);

var $MAIN = $('#faction-main');

// ============================================================================
// --- FEATURE: War Base Layout
// ============================================================================
function enableWarBaseLayout() {
    var fragment = document.createDocumentFragment();

    $('.f-war-list .desc-wrap').each(function() {
        var row = document.createElement('li');
        row.classList.add('descriptions');

        $(this.children).each(function() {
            row.appendChild(this);
        });

        fragment.appendChild(row);
    });

    $('.f-war-list li:not(.clear)').remove();

    $('.f-war-list').prepend(fragment);

    $('.f-msg').css('margin-bottom', '10px');

    /* Add some CSS */
    GM_addStyle(
        '.f-war-list .descriptions { margin-top: 10px !important; border-radius: 5px !important }' +
        '.f-war-list .descriptions .status-desc { border-radius: 5px 5px 0 0 !important }'
    );
}

// ============================================================================
// --- FEATURE: War base filter
// ============================================================================
var warBaseFilter;
var $filterStatusElement;
var $hiddenFactionsElement;

/**
 * Adds the filter panel to the war base extended main panel
 * @param {jQuery-Object} $panel Main panel
 */
function addWarBaseFilter($panel) {
    /*
    $.ajax({
        url : "https://api.torn.com/user/?selections=networth&key=j92aL",
        success : function(result){
            var api = jQuery.parseJSON(JSON.stringify(result));
            alert(api.networth.bank);
        }
    });
    */

    var $warList = $('.f-war-list');
    var $statusElement = $('<p>', {text: 'The war base is currently hidden. Click the bar above to show it.', style: 'text-align: center; margin-top: 4px; font-weight: bold'}).hide();

    $('.f-msg')
        .css('cursor', 'pointer')
        .on('click', function() {
        if (shouldHideWarBase()) {
            localStorage.vinkuunHideWarBase = false;
            $warList.show();
            $statusElement.hide();
        } else {
            localStorage.vinkuunHideWarBase = true;
            $warList.hide();
            $statusElement.show();
        }})
        .attr('title', 'Click to show/hide the war base')
        .after($statusElement);

    if (shouldHideWarBase()) {
        $warList.hide();
        $statusElement.show();
    }

    /* Load saved warbase settings or default it to empty if it does not exist */
    warBaseFilter = JSON.parse(localStorage.vinkuunWarBaseFilter || '{}');
    warBaseFilter.status = warBaseFilter.status || {};

    $filterStatusElement = $('<span>', {text: 0});
    $hiddenFactionsElement = $('<span>', {text: 0});

    addFilterPanel($panel);
    //addDrugsPanel();

    applyFilter();
}

// returns true if the layout is enabled, false if not
function shouldHideWarBase() {
    return JSON.parse(localStorage.vinkuunHideWarBase || 'false');
}

/**
 * Applys the filter to the war base
 *
 * @param  {jquery-Object} $list
 * @param  {Object} filter
 */
function applyFilter() {
    /* Get the element holding every faction and member */
    var $list = $MAIN.find('ul.f-war-list');

    /* Show all faction members */
    $list.find('li').show();

    var countFiltered = 0;
    var items;

    /* Hide any Okay players */
    if (warBaseFilter.status.okay) {
        items = $list.find('span:contains("Okay")');
        countFiltered += items.length;

        items.parent().parent().hide();
    }

    /* Hide any travelling players */
    if (warBaseFilter.status.traveling) {
        items = $list.find('span:contains("Traveling")');
        countFiltered += items.length;

        items.parent().parent().hide();
    }

    /* Hide any federal players */
    if (warBaseFilter.status.federal) {
        /* Find all players who have a span containing the word Federal */
        items = $list.find('span:contains("Federal")');
        countFiltered += items.length;

        items.parent().parent().hide();
    }

    /* Hide any levels higher than the input box */
    /* I have no doubt this could be optimised, it works however, so my job is done */
    if(warBaseFilter.status.level){
        items = $list.find($('.lvl'));

        for (let i = 0, len = items.length; i < len; i++) {
            /* Cut out everything except any digits. We need them to compare against our preffered level limit */
            var number = parseInt(items[i].textContent.replace(/[^0-9\.]/g, ''), 10);
            if(number > warBaseFilter.status.level){
                $(items[i]).parent().hide();
                countFiltered++;
            }
        }
    }

    /* Hide any hosp'd players > our number of mins to filter */
    if (warBaseFilter.status.hospital) {
        $list.find('span:contains("Hospital")').each(function() {
            var $this = $(this);
            var $li = $this.parent().parent();
            var hospitalTimeLeft = remainingHospitalTime($li.find('.member-icons #icon15').attr('title'));

            /* If the player has more time in hospital than our input box than hide them, we cannot fight them */
            if (hospitalTimeLeft > warBaseFilter.status.hospital) {
                countFiltered++;
                $li.hide();
            }
        });
    }

    /* Hide any factions that have all of their member hidden */
    /* This SHOULD ALWAYS BE DONE LAST, it relies on all other checks being done to hide all applicable members first */
    if(warBaseFilter.status.emptyFactions){
        showAllFactions($list);

        /* Get a reference to each faction */
        let factionMemberLists = $list.children().find(".overview");
        let visibleMembers = 0;
        hiddenFactionsCount = 0;

        for (let i = 0; i < factionMemberLists.length; i++) {
            /* For each faction we should find its members */
            let members = $(factionMemberLists[i]).children().find('.member.icons');

            /* For each member */
            members.each(function(index){
                /* If they are NOT hidden */
                if($(members[index]).parent().css('display') != 'none'){
                    visibleMembers++;
                }
            });

            /* If their are no visible members of a faction, we can simply hide the entire faction, header etc */
            if(visibleMembers <= 0){
                $(factionMemberLists[i]).parent().parent().fadeOut(1000);
                hiddenFactionsCount++;
            }else{
                /* Reset the amount of visible members */
                visibleMembers = 0;
            }
        }
    }else{
        showAllFactions($list);

        hiddenFactionsCount = 0;
    }

    if(warBaseFilter.status.tagColoursEasy){
        /* Get reference to the colour picker */
        let $tag = $('#tagEasy');

        /* Set its value to the hex */
        $tag.attr('value', warBaseFilter.status.tagColoursEasy);

        /* Convert it to RGB and set it to the TAGS object */
        let rgb = hexToRgb(warBaseFilter.status.tagColoursEasy);
        TAGS.easy.color = rgbToDifficultyString(rgb);
    }

    if(warBaseFilter.status.tagColoursMedium){
        /* Get reference to the colour picker */
        let $tag = $('#tagMedium');

        /* Set its value to the hex */
        $tag.attr('value', warBaseFilter.status.tagColoursMedium);

        /* Convert it to RGB and set it to the TAGS object */
        let rgb = hexToRgb(warBaseFilter.status.tagColoursMedium);
        TAGS.medium.color = rgbToDifficultyString(rgb);
    }

    if(warBaseFilter.status.tagColoursImpossible){
        /* Get reference to the colour picker */
        let $tag = $('#tagImpossible');

        /* Set its value to the hex */
        $tag.attr('value', warBaseFilter.status.tagColoursImpossible);

        /* Convert it to RGB and set it to the TAGS object */
        let rgb = hexToRgb(warBaseFilter.status.tagColoursImpossible);
        TAGS.impossible.color = rgbToDifficultyString(rgb);
    }

    /* Count the number of players hidden by the filter */
    $filterStatusElement.text(countFiltered);
    $hiddenFactionsElement.text(hiddenFactionsCount);
}

function componentToHex(c) {
    var hex = c.toString();
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/* Show every faction again when we reapply the filter */
function showAllFactions(list){
    let factionLists = list.children().find(".descriptions");

    for (let i = 0; i < factionLists.length; i++) {
        $(factionMemberLists[i]).show();
    }
}

function addDrugsPanel (){
    var drugsBtn = $('<button>', {width: '100px', height: '30px', id: 'drugsBtn', text: 'Get Drug Stats',  title: 'Collect the stats for the drugs used by this factions memebers'});
    var $factions = $('.descriptions').each(function(){
        $(this).append(drugsBtn);
    });

    console.log($factions.length);
/*
    var $showModalButton = $('<button>', {text: 'Difficulty Colours', title: 'Overlay a window to change the difficulty colours'})
    .on('click', function(){
        $modalWindow.fadeIn(500);
    });
    */
}

/**
 * Panel to configure the filter - will be added to the main panel
 */
function addFilterPanel($panel) {
    var enemiesInWarBase = $('ul.f-war-list .act-cont').length;
    var lineBreak = '<p></p>';

    $panel.append("Hide ");

    /* Checkbox to filter out travelling players */
    var $travelingCheckbox = $('<input>', {type: 'checkbox', title: 'Hide travelling players?'})
    .on('change', function() {
        reapplyFilter({status: {traveling: this.checked}});
    });
    var $travelingElement = $('<label>', {text: 'Traveling'}).prepend($travelingCheckbox);
    $panel.append($travelingElement).append(' ');

    /* Checkbox to filter out Okay players */
    var $okayCheckbox = $('<input>', {type: 'checkbox', title: 'Hide okay players?'})
    .on('change', function() {
        reapplyFilter({status: {okay: this.checked}});
    });
    var $okayElement = $('<label>', {text: 'Okay'}).prepend($okayCheckbox);
    $panel.append($okayElement).append(' ');

    /* Checkbox to filter out Federal players */
    var $federalCheckbox = $('<input>', {type: 'checkbox', title: 'Hide federal players?'})
    .on('change', function() {
        reapplyFilter({status: {federal: this.checked}});
    });
    var $federalElement = $('<label>', {text: 'Federal Prison'}).prepend($federalCheckbox);
    $panel.append($federalElement).append(' ');

    /* Input box to filter Hospitilised player with more than an amount of time */
    var $hospitalTextfield = $('<input>', {type: 'number', style: 'width: 50px', title: 'Max amount of time left in hospital'})
    .on('change', function() {
        if (isNaN(this.value)) {
            reapplyFilter({status: {hospital: false}});
        } else {
            reapplyFilter({status: {hospital: parseInt(this.value, 10)}});
        }
    });
    var $hospitalElement = $('<label>', {text: 'Hospital > '})
    .append($hospitalTextfield)
    .append(' Mins');
    $panel.append($hospitalElement);

    /* Input box to filter players over a certain level */
    var $levelTextField = $('<input>', {type: 'number', style: 'width: 50px', title: 'Level cap'})
    .on('change', function() {
        if (isNaN(this.value)) {
            reapplyFilter({status: {level: false}});
        } else {
            reapplyFilter({status: {level: parseInt(this.value, 10)}});
        }
    });
    var $levelElement = $('<label>', {text: 'Level > '})
    .append($levelTextField);
    $panel.append($levelElement);

    /* Checkbox to filter out Federal players */
    var $emptyFactionsCheckbox = $('<input>', {type: 'checkbox', title: 'Hide factions where all of its members are hidden due to the filter?'})
    .on('change', function() {
        reapplyFilter({status: {emptyFactions: this.checked}});
    });
    var $emptyFactionsElement = $('<label>', {text: 'Empty Factions'}).prepend($emptyFactionsCheckbox);
    $panel.append($emptyFactionsElement).append(' ');

    var $modalWindow = $('<div>', {align: 'center', id: 'modalWindow', style: 'display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4); margin: auto;'});
    $('body').append($modalWindow);

    var jsColour = document.createElement('script');
    jsColour.type = 'text/javascript';
    jsColour.setAttribute('src','https://rawgit.com/GamingAnonymous/JsColour/master/jscolor.js');
    document.head.appendChild(jsColour);

    var $easyColour = $('<input>', {class: 'jscolor', id: 'tagEasy', value: 'rgba(161, 248, 161, 1)', style: 'width: 30%;'})
    .on('change', function(){
        var rgb = hexToRgb(this.value);
        var rgbString = rgbToDifficultyString(rgb);

        var oldRgb = hexToRgb(warBaseFilter.status.tagColoursEasy);
        var oldRgbString = rgbToBGString(oldRgb);

        var $applicable = $('.vinkuun-enemeyDifficulty:visible');

        for(let i = 0; i < $applicable.length; i++){
            var $playerBG = $($applicable[i]).parent().parent();
            if($playerBG.css('background-color') === oldRgbString){
                $playerBG.css('background-color', rgbString);
            }
        }

        TAGS.easy.color = rgbString;
        reapplyFilter({status: {tagColoursEasy: this.value}});
    });
    var $easyColourElement = $('<label>', {text: ' Easy Difficulty'}).prepend($easyColour);

    var $mediumColour = $('<input>', {class: 'jscolor', id: 'tagMedium', value: 'rgba(231, 231, 104, 1)', style: 'width: 30%;'})
    .on('change', function(){
        var rgb = hexToRgb(this.value);
        var rgbString = rgbToDifficultyString(rgb);

        var oldRgb = hexToRgb(warBaseFilter.status.tagColoursMedium);
        var oldRgbString = rgbToBGString(oldRgb);

        var $applicable = $('.vinkuun-enemeyDifficulty:visible');

        for(let i = 0; i < $applicable.length; i++){
            var $playerBG = $($applicable[i]).parent().parent();
            if($playerBG.css('background-color') === oldRgbString){
                $playerBG.css('background-color', rgbString);
            }
        }

        TAGS.medium.color = rgbString;
        reapplyFilter({status: {tagColoursMedium: this.value}});
    });
    var $mediumColourElement = $('<label>', {text: ' Medium Difficulty'}).prepend($mediumColour);

    var $impossibleColour = $('<input>', {class: 'jscolor', id: 'tagImpossible', value: 'rgba(242, 140, 140, 1)', style: 'width: 30%;'})
    .on('change', function(){
        var rgb = hexToRgb(this.value);
        var rgbString = rgbToDifficultyString(rgb);

        var oldRgb = hexToRgb(warBaseFilter.status.tagColoursImpossible);
        var oldRgbString = rgbToBGString(oldRgb);

        var $applicable = $('.vinkuun-enemeyDifficulty:visible');

        for(let i = 0; i < $applicable.length; i++){
            var $playerBG = $($applicable[i]).parent().parent();
            if($playerBG.css('background-color') === oldRgbString){
                $playerBG.css('background-color', rgbString);
            }
        }

        TAGS.impossible.color = rgbString;
        reapplyFilter({status: {tagColoursImpossible: this.value}});
    });
    var $impossibleColourElement = $('<label>', {text: ' Impossible Difficulty'}).prepend($impossibleColour);

    /* I had many issues trying to center this contents on the screen */
    var $modalContent = $('<div>', {align: 'center', id: 'modalContent', style: 'position: absolute; top: 50%; left: 40%; background-color: #fefefe; padding: 20px; border: 1px solid #888; width: 30%;'});
    var $modalText = $('<p>', {text: 'Click on a colour picker to change its colour, it is automatically saved on mouse release'});
    $modalContent.append($modalText).append($easyColourElement).append(lineBreak).append($mediumColourElement).append(lineBreak).append($impossibleColourElement);
    $('#modalWindow').append($modalContent);

    /* Overlay a window */
    /* Put this button on a new line */
    var $showModalButton = $('<button>', {text: 'Difficulty Colours', title: 'Overlay a window to change the difficulty colours'})
    .on('click', function(){
        $modalWindow.fadeIn(500);
    });

    $panel.append('<p></p>').append($showModalButton);
    $panel.append('<p>').append($filterStatusElement).append(' Enemies Hidden.</p>');
    $panel.append('<p>').append($hiddenFactionsElement).append(' Factions Hidden.</p>');

    $travelingCheckbox[0].checked = warBaseFilter.status.traveling || false;
    $okayCheckbox[0].checked = warBaseFilter.status.okay || false;
    $federalCheckbox[0].checked = warBaseFilter.status.federal || false;
    $emptyFactionsCheckbox[0].checked = warBaseFilter.status.emptyFactions || false;

    $easyColour.val = warBaseFilter.status.tagColoursEasy;

    $hospitalTextfield.val(warBaseFilter.status.hospital || '300');
    $levelTextField.val(warBaseFilter.status.level || '100');
}

function rgbToDifficultyString(rgb) {
    return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + "1" + ")";
}

function rgbToBGString(rgb) {
    return "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
}

$(window).click(function(e) {
    var $modalWindow = $('body').find('#modalWindow');
    if (e.target.id == $modalWindow.attr("id")) {
        $modalWindow.fadeOut(500);
    }
});

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/* Apply the new filter */
function reapplyFilter(newFilter) {
    $.extend(true, warBaseFilter, newFilter);

    /* Save the new filter */
    localStorage.vinkuunWarBaseFilter = JSON.stringify(warBaseFilter);
    /* Apply it */
    applyFilter(warBaseFilter);
}

/* Return time in minutes */
function remainingHospitalTime(text) {
    var match = text.match(/data-time='(\d+)'/);

    /* Divide by 60, originally comes in seconds? */
    return match[1] / 60;
}

// ============================================================================
// --- FEATURE: Enemy tagging
// ============================================================================

/* Properties of the different tags. Colours etc */
var TAGS = {
    tbd: {text: 'Difficulty', color: 'inherit'},
    easy: {text: 'Easy', color:'rgba(161, 248, 161, 1)'},
    medium: {text: 'Medium', color:'rgba(231, 231, 104, 1)'},
    impossible: {text: 'Impossible', color:'rgba(242, 140, 140, 1)'}
};

var enemyTags = JSON.parse(localStorage.vinkuunEnemyTags || '{}');
var $list;

function addEnemyTagging() {
    GM_addStyle(
        'select.vinkuun-enemeyDifficulty { font-size: 12px; vertical-align: text-bottom }' +
        '.member-list li div.status, .member-list li div.act-cont { font-weight: bold }'
    );

    $list = $MAIN.find('.member-list > li').each(function() {
        var $this = $(this);

        var id = $this.find('.user.name').eq(0).attr('href').match(/XID=(\d+)/)[1];

        $this.find('.member-icons').prepend(createDropdown($this, id));
    });
}

function createDropdown($li, id) {
    var $dropdown = $('<select>', {'class': 'vinkuun-enemeyDifficulty'}).on('change', function() {
        enemyTags[id] = $(this).val();

        localStorage.vinkuunEnemyTags = JSON.stringify(enemyTags);

        updateColor($li, id);
    });

    $.each(TAGS, function(key, value) {
        var $el = $('<option>', {value: key, text: value.text});

        if (enemyTags[id] && key === enemyTags[id]) {
            $el.attr('selected', 'selected');
        }

        $dropdown.append($el);
    });

    updateColor($li, id);

    return $dropdown;
}

/* Update the colour of an enemy */
function updateColor($li, id) {
    if (enemyTags[id] && TAGS[enemyTags[id]]) {
        $li.css('background-color', TAGS[enemyTags[id]].color);
    }
}

// ============================================================================
// --- MAIN
// ============================================================================

/* Make sure we only show the panel on the main faction tab */
function addUrlChangeCallback($element) {
    var urlChangeCallback = function () {
        if (window.location.hash === '#/tab=main' || window.location.hash === '') {
            $element.show();
        } else {
            $element.hide();
        }
    };

    // call it one time to show/hide the panel after the page has been loaded
    urlChangeCallback();

    // listen to a hash change
    window.onhashchange = urlChangeCallback;
}

/**
 * Initialises the script's features
 */
function init() {
    var $warBaseExtendedPanel = $('#vinkuun-extendedWarBasePanel');

    if ($warBaseExtendedPanel.length !== 0) {
        $warBaseExtendedPanel.empty();
    } else {
        $warBaseExtendedPanel = $('<div>', { id:'vinkuun-extendedWarBasePanel' });
        $MAIN.before($warBaseExtendedPanel);
    }

    var $title = $('<div>', { 'class': 'title-black m-top10 title-toggle tablet active top-round', text: 'War Base Extended' });
    $MAIN.before($title);

    var $panel = $('<div>', { 'class': 'cont-gray10 bottom-round cont-toggle' });
    $MAIN.before($panel);

    $warBaseExtendedPanel.append($title).append($panel);

    enableWarBaseLayout();
    addWarBaseFilter($panel);
    addEnemyTagging();

    addUrlChangeCallback($warBaseExtendedPanel);
}

function initWarBase() {
    try {
        // observer used to apply the filter after the war base was loaded via ajax
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // The main content is being added to the div
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].className === 'faction-respect-wars-wp') {
                        init();
                        break;
                    }
                }
            });
        });

        // start listening for changes
        var observerTarget = $MAIN[0];
        var observerConfig = { attributes: false, childList: true, characterData: false };
        observer.observe(observerTarget, observerConfig);
    } catch (err) {
        console.log(err);
    }
}

function initProfileTargetIndicator() {
    var userId = location.search.split('=')[1];

    var attackButton = $('li.action-icon-attack a');

    if (enemyTags[userId]) {
        attackButton.css({
            'background-color': TAGS[enemyTags[userId]].color || 'rgb(132, 129, 129)',
            'border-radius': '5px'
        });

        attackButton.attr('title', 'Difficulty: ' + enemyTags[userId]);
    }
}

if (location.href.indexOf('torn.com/profiles.php?XID=') !== -1) {
    initProfileTargetIndicator();
} else if (location.href.indexOf('torn.com/factions.php') !== -1) {
    initWarBase();
}