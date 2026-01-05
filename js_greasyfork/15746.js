// ==UserScript==
// @name       sgmod - sir lame cakes
// @namespace  woot
// @version    0.5
// @description  just do it!
// @match      https://www.seriousgmod.com/*
// @copyright  2013+, stackoverflow
// @downloadURL https://update.greasyfork.org/scripts/15746/sgmod%20-%20sir%20lame%20cakes.user.js
// @updateURL https://update.greasyfork.org/scripts/15746/sgmod%20-%20sir%20lame%20cakes.meta.js
// ==/UserScript==

var lemonposts = [
    "https://www.seriousgmod.com/posts/172594/", "https://www.seriousgmod.com/posts/172607/", "https://www.seriousgmod.com/posts/172612/", "https://www.seriousgmod.com/posts/898/", "https://www.seriousgmod.com/posts/1021/",
    "https://www.seriousgmod.com/posts/1949/", "https://www.seriousgmod.com/posts/2113/", "https://www.seriousgmod.com/posts/2161/", "https://www.seriousgmod.com/posts/1941/", "https://www.seriousgmod.com/posts/2612/",
    "https://www.seriousgmod.com/posts/2960/", "https://www.seriousgmod.com/posts/3240/", "https://www.seriousgmod.com/posts/1076/", "https://www.seriousgmod.com/posts/1022/",
    "https://www.seriousgmod.com/posts/3359/", "https://www.seriousgmod.com/posts/3361/", "https://www.seriousgmod.com/posts/3422/", "https://www.seriousgmod.com/posts/3361/",
    "https://www.seriousgmod.com/posts/3422/", "https://www.seriousgmod.com/posts/3358/", "https://www.seriousgmod.com/threads/a-great-helpful-and-freindly-mod.1089/#post-4281",
    "https://www.seriousgmod.com/threads/rule-controversy.1090/#post-4298", "https://www.seriousgmod.com/threads/killamarshall-is-a-great-mod.1166/#post-4833",
    "https://www.seriousgmod.com/threads/new-maps.1173/#post-4955", "https://www.seriousgmod.com/threads/new-maps.1173/#post-4876",
    "https://www.seriousgmod.com/threads/new-maps.1173/#post-4882", "https://www.seriousgmod.com/threads/the-youtube-channel.990/#post-5051",
    "https://www.seriousgmod.com/threads/the-youtube-channel.990/#post-3949",
    "https://www.seriousgmod.com/threads/the-youtube-channel.990/#post-4403",
    "https://www.seriousgmod.com/threads/the-youtube-channel.990/#post-4403",
    "https://www.seriousgmod.com/threads/the-youtube-channel.990/#post-3533",
    "https://www.seriousgmod.com/threads/new-turtle-beach-headset.1228/#post-5284",
    "https://www.seriousgmod.com/threads/betting-system-need-your-input.1227/#post-5221",
    "https://www.seriousgmod.com/threads/betting-system-need-your-input.1227/#post-5287",
    "https://www.seriousgmod.com/threads/dawg-chowder.1241/#post-5400",
    "https://www.seriousgmod.com/threads/post-your-faces-old.1152/#post-5483",
    "https://www.seriousgmod.com/threads/post-your-faces-old.1152/#post-5457",
    "https://www.seriousgmod.com/threads/morgan-freeman.1253/#post-5484",
    "https://www.seriousgmod.com/threads/morgan-freeman.1253/#post-5481",
    "https://www.seriousgmod.com/threads/gta5.1259/#post-5531",
    "https://www.seriousgmod.com/threads/gta5.1259/#post-5636",
    "https://www.seriousgmod.com/threads/gta5.1259/#post-5526",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/#post-5654",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/#post-5458",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/#post-5436",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/#post-5336",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/#post-5288",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/#post-5345",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/#post-5211",
    "https://www.seriousgmod.com/threads/birthday.1278/#post-5670",
    "https://www.seriousgmod.com/threads/contest-thing.1288/#post-5763",
    "https://www.seriousgmod.com/threads/contest-thing.1288/#post-5739",
    "https://www.seriousgmod.com/threads/contest-thing.1288/#post-5731",
    "https://www.seriousgmod.com/threads/post-your-faces-old.1152/page-2#post-5729",
    "https://www.seriousgmod.com/threads/post-your-faces-old.1152/page-2#post-5943",
    "https://www.seriousgmod.com/threads/position-you-are-applying-for.1325/#post-6039",
    "https://www.seriousgmod.com/threads/post-your-faces-old.1152/page-3#post-6177",
    "https://www.seriousgmod.com/threads/post-your-faces-old.1152/page-3#post-6037",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/page-2#post-5690",
    "https://www.seriousgmod.com/threads/gta-5-crew.1226/page-2#post-6415",
    "https://www.seriousgmod.com/threads/who-is-getting-bf4.1203/#post-6638",
    "https://www.seriousgmod.com/threads/who-is-getting-bf4.1203/#post-6629",
    "https://www.seriousgmod.com/threads/who-is-getting-bf4.1203/#post-5471",
    "https://www.seriousgmod.com/threads/3-word-story-restart.1389/#post-6701",
    "https://www.seriousgmod.com/threads/3-word-story-restart.1389/#post-6614",
    "https://www.seriousgmod.com/threads/3-word-story-restart.1389/page-3#post-6839",
    "https://www.seriousgmod.com/threads/save-sttt-eu.1402/#post-6926",
    "https://www.seriousgmod.com/threads/anyone-want-to-buy-a-cpu.1455/#post-7087",
    "https://www.seriousgmod.com/threads/anyone-want-to-buy-a-cpu.1455/#post-7119",
    "https://www.seriousgmod.com/threads/anyone-want-to-buy-a-cpu.1455/#post-7077",
    "https://www.seriousgmod.com/threads/anyone-want-to-buy-a-cpu.1455/#post-7074",
    "https://www.seriousgmod.com/threads/contest-thing.1288/page-2#post-5795",
    "https://www.seriousgmod.com/threads/contest-thing.1288/page-2#post-7164",
    "https://www.seriousgmod.com/threads/contest-thing.1288/page-2#post-7137",
    "https://www.seriousgmod.com/threads/contest-thing.1288/page-3#post-7351",
    "https://www.seriousgmod.com/threads/battlefield-4.1322/#post-7506",
    "https://www.seriousgmod.com/threads/the-i-dont-give-a-s-t-about-groups-group.1541/#post-7743",
    "https://www.seriousgmod.com/threads/where-is-everyone-from.1549/#post-7840",
    "https://www.seriousgmod.com/threads/recording.1596/#post-8116",
    "https://www.seriousgmod.com/threads/hearthstone.1613/#post-8399",
    "https://www.seriousgmod.com/threads/hearthstone.1613/#post-8390",
    "https://www.seriousgmod.com/threads/hearthstone.1613/#post-8281",
    "https://www.seriousgmod.com/threads/hearthstone.1613/#post-8278",
    "https://www.seriousgmod.com/posts/8428/", "https://www.seriousgmod.com/posts/8450/", "https://www.seriousgmod.com/posts/8538/", "https://www.seriousgmod.com/posts/9088/", "https://www.seriousgmod.com/posts/9241/",
    "https://www.seriousgmod.com/posts/9244/", "https://www.seriousgmod.com/posts/9243/", "https://www.seriousgmod.com/posts/9263/", "https://www.seriousgmod.com/posts/9261/", "https://www.seriousgmod.com/posts/9834/",
    "https://www.seriousgmod.com/posts/9657/https://www.seriousgmod.com/posts/9835/", "https://www.seriousgmod.com/posts/9835/", "https://www.seriousgmod.com/posts/10528/", "https://www.seriousgmod.com/posts/10555/", "https://www.seriousgmod.com/posts/11181/",
    "https://www.seriousgmod.com/posts/11176/", "https://www.seriousgmod.com/posts/11079/", "https://www.seriousgmod.com/posts/11072/", "https://www.seriousgmod.com/posts/11073/", "https://www.seriousgmod.com/posts/11634/",
    "https://www.seriousgmod.com/posts/11782/", "https://www.seriousgmod.com/posts/11791/", "https://www.seriousgmod.com/posts/11772/", "https://www.seriousgmod.com/posts/11811/", "https://www.seriousgmod.com/posts/11793/",
    "https://www.seriousgmod.com/posts/11909/", "https://www.seriousgmod.com/posts/11849/", "https://www.seriousgmod.com/posts/12052/", "https://www.seriousgmod.com/posts/12047/", "https://www.seriousgmod.com/posts/12155/",
    "https://www.seriousgmod.com/posts/12158/", "https://www.seriousgmod.com/posts/12165/", "https://www.seriousgmod.com/posts/12309/", "https://www.seriousgmod.com/posts/12385/", "https://www.seriousgmod.com/posts/12386/",
    "https://www.seriousgmod.com/posts/12387/", "https://www.seriousgmod.com/posts/11804/", "https://www.seriousgmod.com/posts/12194/", "https://www.seriousgmod.com/posts/12225/", "https://www.seriousgmod.com/posts/12432/",
    "https://www.seriousgmod.com/posts/12437/", "https://www.seriousgmod.com/posts/12388/", "https://www.seriousgmod.com/posts/12445/", "https://www.seriousgmod.com/posts/12478/", "https://www.seriousgmod.com/posts/12616/", "https://www.seriousgmod.com/posts/12634/",
    "https://www.seriousgmod.com/posts/12544/", "https://www.seriousgmod.com/posts/12519/", "https://www.seriousgmod.com/posts/12505/", 
    "https://www.seriousgmod.com/posts/12614/", "https://www.seriousgmod.com/posts/12740/", "https://www.seriousgmod.com/posts/12725/", "https://www.seriousgmod.com/posts/12822/", "https://www.seriousgmod.com/posts/13183/", "https://www.seriousgmod.com/posts/13083/",
    "https://www.seriousgmod.com/posts/13168/", "https://www.seriousgmod.com/posts/13188/"];
    
    
$(document).ready(function() {
    $('li[data-author="Sir Lemoncakes"]').find('a[href*="rate?rating=13"]').click();
    $('ul[class="secondaryContent blockLinksList"]').append('<li><a href="' + window.location.pathname + '#" class="OverlayTrigger" id="endlemon">END LEMONCAKES</a></li>')
    $('#endlemon').click(function(){
        $('#endlemon').css("display", "none");
        runScript();
    });
});

var counter = 0;

function runScript(){
    if(counter >= lemonposts.length){
        return;
    }
    var win = window.open(lemonposts[counter], '_blank');
    setTimeout( function(){
        win.close();
        runScript(); 
        counter++;
    }, 1000);
}
