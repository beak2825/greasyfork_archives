// ==UserScript==
// @name         ExHentai
// @namespace    ExHentaiEasySearch
// @version      1.42
// @description  Easy ExHentai Search
// @author       Aziien
// @match        *://exhentai.org/tag/*
// @match        *://exhentai.org/uploader/*
// @match        *://exhentai.org/?*
// @match        *://exhentai.org/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @resource     https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/382846/ExHentai.user.js
// @updateURL https://update.greasyfork.org/scripts/382846/ExHentai.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tags = ['3d', 'abortion', 'absorption', 'adventitious penis', 'adventitious vagina', 'afro', 'age progression', 'age progression/Chinese', 'age regression', 'age regression/Chinese', 'ahegao', 'albino', 'alien', 'alien girl', 'all the way through', 'already uploaded', 'amputee', 'anaglyph', 'anal', 'anal birth', 'angel', 'animal on animal', 'animal on furry', 'animated', 'anorexic', 'anthology', 'apron', 'armpit licking', 'armpit sex', 'artbook', 'asphyxiation', 'ass expansion', 'assjob', 'aunt', 'autofellatio', 'autopaizuri', 'bald', 'ball sucking', 'balljob', 'balls expansion', 'bandages', 'bandaid', 'bbm', 'bbw', 'bdsm', 'bear', 'bear boy', 'bear girl', 'beauty mark', 'bee girl', 'bestiality', 'big areolae', 'big ass', 'big balls', 'big breasts', 'big clit', 'big lips', 'big nipples', 'big penis', 'big vagina', 'bike shorts', 'bikini', 'birth', 'bisexual', 'blackmail', 'blind', 'blindfold', 'blood', 'bloomers', 'blowjob', 'blowjob face', 'body modification', 'body painting', 'body swap', 'body writing', 'bodystocking', 'bodysuit', 'bondage', 'braces', 'brain fuck', 'breast expansion', 'breast feeding', 'breast reduction', 'bride', 'brother', 'bukkake', 'bull', 'bull/Chinese', 'bunny boy', 'bunny girl', 'burping', 'business suit', 'butler', 'camel', 'cannibalism', 'caption', 'cashier', 'cat', 'catboy', 'catfight', 'catgirl', 'cbt', 'centaur', 'cervix penetration', 'chastity belt', 'cheating', 'cheerleader', 'chikan', 'chinese dress', 'chloroform', 'christmas', 'clamp', 'clit growth', 'closed eyes', 'clothed female nude male', 'clothed male nude female', 'clothed paizuri', 'clown', 'coach', 'cockslapping', 'collar', 'compilation', 'condom', 'conjoined', 'coprophagia', 'corruption', 'corset', 'cosplaying', 'cousin', 'cow', 'cow/Chinese', 'cowgirl', 'cowgirl/Chinese', 'cowman', 'cowman/Chinese', 'crab', 'crossdressing', 'crotch tattoo', 'crown', 'cum bath', 'cum in eye', 'cum swap', 'cunnilingus', 'cuntboy', 'dakimakura', 'dark nipples', 'dark sclera', 'dark skin', 'daughter', 'deepthroat', 'defloration', 'demon', 'demon girl', 'diaper', 'dick growth', 'dickgirl on dickgirl', 'dickgirl on male', 'dickgirls only', 'dicknipples', 'dilf', 'dinosaur', 'dismantling', 'dog', 'dog boy', 'dog girl', 'doll joints', 'dolphin', 'donkey', 'double anal', 'double blowjob', 'double penetration', 'double vaginal', 'dougi', 'draenei', 'dragon', 'drugs', 'drunk', 'ear fuck', 'eel', 'eggs', 'electric shocks', 'elephant', 'elf', 'emotionless sex', 'enema', 'exhibitionism', 'eye penetration', 'eyemask', 'eyepatch', 'facesitting', 'fairy', 'farting', 'father', 'females only', 'femdom', 'feminization', 'ffm threesome', 'fft threesome', 'figure', 'filming', 'fingering', 'first person perspective', 'fish', 'fisting', 'foot insertion', 'foot licking', 'footjob', 'forbidden content', 'forniphilia', 'fox', 'fox boy', 'fox girl', 'freckles', 'frog', 'frog girl', 'frottage', 'full body tattoo', 'full censorship', 'full color', 'fundoshi', 'furry', 'furry/Chinese', 'futanari', 'gag', 'game sprite', 'gaping', 'garter belt', 'gasmask', 'gender bender', 'ghost', 'giant', 'giant/Chinese', 'giantess', 'giantess/Chinese', 'gigantic breasts', 'gijinka', 'giraffe girl', 'glasses', 'glory hole', 'goat', 'goblin', 'gokkun', 'gorilla', 'gothic lolita', 'granddaughter', 'grandfather', 'grandmother', 'group', 'growth', 'guro', 'gyaru', 'gyaru-oh', 'gymshorts', 'haigure', 'hairjob', 'hairy', 'hairy armpits', 'handicapped', 'handjob', 'hardcore', 'harem', 'harness', 'harpy', 'heterochromia', 'hidden sex', 'hijab', 'horns', 'horse', 'horse boy', 'horse cock', 'horse girl', 'hotpants', 'how to', 'huge breasts', 'huge penis', 'human cattle', 'human on furry', 'human pet', 'humiliation', 'impregnation', 'incest', 'incomplete', 'infantilism', 'inflation', 'insect', 'insect boy', 'insect girl', 'inseki', 'inverted nipples', 'invisible', 'josou seme', 'kangaroo', 'kappa', 'kemonomimi', 'kigurumi', 'kimono', 'kindergarten uniform', 'kissing', 'kneepit sex', 'kunoichi', 'lab coat', 'lactation', 'large insertions', 'latex', 'layer cake', 'leg lock', 'legjob', 'leotard', 'lingerie', 'lion', 'lioness', 'living clothes', 'lizard girl', 'lizard guy', 'lolicon', 'long tongue', 'low bestiality', 'low lolicon', 'low shotacon', 'machine', 'maggot', 'magical girl', 'maid', 'male on dickgirl', 'males only', 'masked face', 'masturbation', 'mecha boy', 'mecha girl', 'menstruation', 'mermaid', 'merman', 'metal armor', 'midget', 'miko', 'milf', 'military', 'milking', 'mind break', 'mind control', 'minigirl', 'minigirl/Chinese', 'miniguy', 'miniguy/Chinese', 'minotaur', 'missing cover', 'mmf threesome', 'mmt threesome', 'monkey', 'monoeye', 'monster', 'monster girl', 'moral degeneration', 'mosaic censorship', 'mother', 'mouse', 'mouse boy', 'mouse girl', 'mtf threesome', 'multi-work series', 'multiple arms', 'multiple breasts', 'multiple nipples', 'multiple paizuri', 'multiple penises', 'multiple vaginas', 'muscle', 'muscle growth', 'mute', 'nakadashi', 'navel fuck', 'nazi', 'necrophilia', 'netorare', 'niece', 'ninja', 'nipple birth', 'nipple expansion', 'nipple fuck', 'non-nude', 'nose fuck', 'nose hook', 'novel', 'nudity only', 'nun', 'nurse', 'octopus', 'oil', 'old lady', 'old man', 'onahole', 'oni', 'oppai loli', 'orc', 'orgasm denial', 'ostrich', 'out of order', 'oyakodon', 'paizuri', 'panda girl', 'panther', 'pantyhose', 'pantyjob', 'paperchild', 'parasite', 'pasties', 'pegging', 'penis birth', 'petrification', 'phimosis', 'phone sex', 'piercing', 'pig', 'pig girl', 'pig man', 'pillory', 'pirate', 'piss drinking', 'plant boy', 'plant girl', 'pole dancing', 'policeman', 'policewoman', 'ponygirl', 'ponytail', 'poor grammar', 'possession', 'pregnant', 'prehensile hair', 'prolapse', 'prostate massage', 'prostitution', 'pubic stubble', 'public use', 'rabbit', 'raccoon boy', 'raccoon girl', 'race queen', 'randoseru', 'rape', 'real doll', 'realporn', 'redraw', 'replaced', 'reptile', 'rewrite', 'rhinoceros', 'rimjob', 'robot', 'ryona', 'saliva', 'sample', 'scanmark', 'scar', 'scat', 'school swimsuit', 'schoolboy uniform', 'schoolgirl uniform', 'screenshots', 'scrotal lingerie', 'selfcest', 'sex toys', 'shared senses', 'shark', 'shark boy', 'shark girl', 'shaved head', 'sheep', 'sheep boy', 'sheep girl', 'shemale', 'shibari', 'shimapan', 'shotacon', 'shrinking', 'shrinking/Chinese', 'sister', 'skinsuit', 'slave', 'sleeping', 'slime', 'slime boy', 'slime girl', 'slug', 'small breasts', 'smegma', 'smell', 'smoking', 'snake', 'snake boy', 'snake girl', 'snuff', 'sockjob', 'sole dickgirl', 'sole female', 'sole male', 'solo action', 'spanking', 'speculum', 'speechless', 'spider', 'spider girl', 'squid boy', 'squid girl', 'squirrel girl', 'squirting', 'ssbbm', 'ssbbw', 'stereoscopic', 'steward', 'stewardess', 'stockings', 'stomach deformation', 'story arc', 'strap-on', 'stretching', 'stuck in wall', 'sumata', 'sundress', 'sunglasses', 'sweating', 'swimsuit', 'swinging', 'syringe', 'table masturbation', 'tail plug', 'tailjob', 'tall girl', 'tall man', 'tankoubon', 'tanlines', 'teacher', 'tentacles', 'text cleaned', 'themeless', 'thick eyebrows', 'thigh high boots', 'tiara', 'tickling', 'tiger', 'tights', 'time stop', 'toddlercon', 'tomboy', 'tomgirl', 'tooth brushing', 'torture', 'tracksuit', 'trampling', 'transformation', 'transformation/Chinese', 'translated', 'tribadism', 'triple anal', 'triple penetration', 'triple vaginal', 'ttf threesome', 'ttm threesome', 'tube', 'turtle', 'tutor', 'twins', 'twintails', 'unbirth', 'uncensored', 'uncle', 'underwater', 'unicorn', 'unusual pupils', 'unusual teeth', 'urethra insertion', 'urination', 'vacbed', 'vaginal sticker', 'vampire', 'variant set', 'virginity', 'vomit', 'vore', 'voyeurism', 'waiter', 'waitress', 'watermarked', 'webtoon', 'weight gain', 'wet clothes', 'whale', 'whip', 'widow', 'widower', 'wings', 'witch', 'wolf', 'wolf boy', 'wolf girl', 'wooden horse', 'worm', 'wormhole', 'wrestling', 'x-ray', 'yandere', 'yaoi', 'yukkuri', 'yuri', 'zebra', 'zombie'];
    $(document).on('click', '.addEnglish', function(){
        $('[name=f_search]').val($('[name=f_search]').val() + ' "language:english"$');
        $('[name=f_apply]').trigger('click');
        if($(this).hasClass('doSearch')) {
            $(this).parents('form').submit();
        }
    });
    $(document).on('click', '.noTranslation', function(){
        $('[name=f_search]').val($('[name=f_search]').val() + ' -"language:translated"$');
        $('[name=f_apply]').trigger('click');
        if($(this).hasClass('doSearch')) {
            $(this).parents('form').submit();
        }
    });
    $(document).on('click', '.findDoujin', function(){
        $('#f_cats').attr('value', 1009).removeAttr('disabled');
        $(this).parents('form').submit();
    });
    $(document).on('click', '.findComic', function(){
        $('#f_cats').attr('value', 511).removeAttr('disabled');
        $(this).parents('form').submit();
    });
    $(document).on('click', '.findImages', function(){
        $('#f_cats').attr('value', 990).removeAttr('disabled');
        $(this).parents('form').submit();
    });
    $(document).on('click', '.findGames', function(){
        $('#f_cats').attr('value', 1007).removeAttr('disabled');
        $(this).parents('form').submit();
    });
    $('.itc').next('div').css({'position': 'relative','min-height':'27px','line-height':'27px','margin-top':'25px'});
    $('.itc').next('div').prepend('<div style="position:absolute;left:22px;bottom:35px;">\
<input type="button" name="f_english" class="addEnglish" value="English" style="border-top-right-radius:0px;border-bottom-right-radius:0px;">\
<input type="button" name="f_english" class="addEnglish doSearch" value="&#x1F50E;&#xFE0E;" style="margin-left: -4px;border-top-left-radius:0px;border-bottom-left-radius:0px;">\
<input type="button" name="f_raw" class="noTranslation" value="Original" style="border-top-right-radius:0px;border-bottom-right-radius:0px;">\
<input type="button" name="f_raw" class="noTranslation doSearch" value="&#x1F50E;&#xFE0E;" style="margin-left: -4px;border-top-left-radius:0px;border-bottom-left-radius:0px;">\
</div>');
    $('.itc').next('div').prepend('<div style="position:absolute;right:22px;bottom:35px;">\
<input type="button" name="game" class="findGames" value="Games">\
<input type="button" name="doujin" class="findImages" value="Image sets">\
<input type="button" name="doujin" class="findDoujin" value="Doujin"">\
<input type="button" name="comic" class="findComic" value="Comic">\
</div>');
    $('body').append('<style>li.ui-menu-item:hover { background-color: #4f535b!important; cursor:pointer;}.nopm .ui-widget{display:inline-block!important}#ui-id-1{padding: 5px 0px;width:387px!important;list-style:none!important;text-align:left!important;margin:0!important;background-color:#34353B;z-index: 999;max-height: 150px;overflow: hidden;overflow-y:scroll;}li.ui-menu-item {padding: 3px 0px 3px 5px;}</style>');

    function split( val ) {
        return val.split( /\$\s*/ );
    }
    function extractLast( term ) {
        return split( term ).pop();
    }

    $('[name=f_search]')
        .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
            event.preventDefault();
        }
    }).autocomplete({
        minLength: 0,
        source: function( request, response ) {
            response( $.ui.autocomplete.filter(
                tags, extractLast( request.term ) ) );
        }, focus: function() {
            return false;
        }, select: function( event, ui ) {
            var terms = split( this.value );
            terms.pop();
            terms.push('"' + ui.item.value + '"');
            terms.push('');
            this.value = terms.join( '$ ' );
            return false;
        }
    });
})();