// ==UserScript==
// @name         Last.fm colored music tags [classic colors]
// @namespace    http://crice.ca
// @description  colorizes the tags shown on artist and album pages
// @author       crice
// @match        https://www.last.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      http://code.jquery.com/jquery-1.9.0.min.js
// @version      1.2
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491214/Lastfm%20colored%20music%20tags%20%5Bclassic%20colors%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/491214/Lastfm%20colored%20music%20tags%20%5Bclassic%20colors%5D.meta.js
// ==/UserScript==

function main_func() {

    function convertRange( value, r1, r2 ) {
        return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
    }

    function stringToColor (string, saturation = 50, lightness = 50) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
let magenta = ["poptron","video game music","deathgrind","italian","post-rock","blues rock","netflix","2010s","contemporary jazz","avant-garde","french","breakcore","soundtrack","alternative metal","j-pop","blackened death metal","post hardcore","avant-garde black metal","dungeon synth","electro","emo violence","industrial metal","progressive death metal","neofolk","ost","congo","space disco","folk punk","powerviolence","roots reggae","rhythmic noise","pop rock","japan","neo-psychedelia","musical","big beat","gypsy punk","2017","horror punk","jazz piano","desert rock","cuddlecore","future garage","cello rock"];
        if(magenta.includes(string))
        {
           // return "#CC0096";
            return "#D421A5";

        }
let purple = ["drum and bass","indie rock","netherlands","evil","world","heavy metal","sad","technical death metal","britpop","tuareg","funk fusion","forro","indie pop","hardcore","old school death metal","grunge","atmosphere","dream pop","90s","jam","swing","power pop","dancehall","incelcore","background","halo","death punk","chiptune","polish hip-hop","minimal techno","icelandic","rockabilly","live","fusion","modern classical","samba","fiesta","melancholy","norway","madchester"];
        if(purple.includes(string))
        {
            return "#9D00FB";
        }
let darkblue = ["2016","americana","avant-garde metal","bass","breakbeat","calm","comedy","djent","downtempo","electropop","indie","juice wrld","kansas","new wave","p-funk","psychedelic folk","exotica","russian","smooth jazz","synthwave","techno","deconstructed club","swiss","new zealand","greek rock","impressionist","experimental rock","egg punk","abstract hip-hop","niger","neurofunk","love metal","psych rock","lolicore","death industrial","apocalyptic folk","martial industrial","belfast","quirky","glee","neoclassical","broadway","signalwave","balkan","ska punk","twee","acid","spooky"];
        if(darkblue.includes(string))
        {
            return "#4131D6";
        }
let blue = ["hyperpop","chillwave","funk rock","blues","jazz fusion","new romantic","mathcore","banger","beats","japanese","rock","pop","straight edge","80s","rap","canadian","doom","kanye west","france","glitch","barcelona","riot grrrl","medieval","2010","ambient pop","minimal","brutal death metal","germany","viking metal","cello","anarcho-punk","easy listening","psych"];
        if(blue.includes(string))
        {
            return "#2A64FB";
        }
let turquoise = ["surf","wonky","minimalism","korean","ambient","african","salsa","celtic","spoken word","sound collage","phonk","furry","gangsta rap","funk","black metal","progressive rock","hypnagogic pop","city pop","rapcore","chillout","2015","zambia","power metal","atmospheric death metal","grime","haute areal","jingles","warp records","bebop","caterwaul society","afghanistan","space rock revival","alt rock","glam rock","american","dreampop","oldies","no wave","motown","gregorian chant","sixties punk mysteries"];
        if(turquoise.includes(string))
        {
            return "#18B0BF";
        }
let lightgreen = ["space rock","slovenian","vaporwave","trip-hop","dubstep","footwork","cover","bubble pop","beatles cover","swedish","plugg","metal","experimental hip-hop","jazz","lo-fi","metro boomin","new age","eurovision","unkcore","dance","zamrock","gypsy rock","dub","2014","indian","real post-hardcore","nigeria","chap hop","portugese","melodifestivalen","chinese","funk metal","irish","russia"];
        if(lightgreen.includes(string))
        {
            return "#86B91F";
        }
let darkgreen = ["doom metal","glo-fi","spanish indie pop","70s","instrumental","contemporary classical","1997","post-metal","art pop","dark ambient","kpop","nu metal","garage rock","rnb","digital hardcore","experimental","dark","art rock","hardcore punk","meloic death metal","german","krautrock","turkish","jazz rock","deutschpunk","chicago","crank wave","colombia","electro house","persian","1979","dance pop","deep house","factory records","arabic","sza","europop","covers","word"];
        if(darkgreen.includes(string))
        {
        return "#0F8755";
        }
let yellow = ["crust","spanish rock","mexico","pop punk","noise pop","electrojazz","gothic rock","punk rock","free jazz","across the universe","grindcore","60s","hip-hop","groove metal","post-punk","twizzy","czech","melodic hardcore","emo","noise rock","uk bass","progressive","post-disco","chamber pop","minimal synth","indie folk","jungle","hungarian","cold wave","drum machine","texas","epic black metal","awesome","synth pop","saxophone","electronica","argentine","vocaloid","goth pop","cybergrind","1980s","romantic","nu disco"];
        if(yellow.includes(string))
        {
            return "#FDC928";
        }
let orange = ["spanish","dark folk","stoner rock","depressive black metal","idm","sludge metal","noise","brony","female vocalists","screamo","shoegaze","alternative rock","hard rock","punk","21 savage","cloud rap","ethereal","slowcore","2022","alt-country","disco","bubblegum bass","emocore","goth","gothic","christmas","portugal","post-industrial","2018","eurodance","cambodian","polish","post-brexit new wave","lounge","mallsoft","qawwali","fantasy ambient","crossover","depressive","cabaret","80's","trip hop","soywave","industrial rock","neo-soul","midwest emo","psychobilly","belgian","experimental hip hop","underground hip-hop","early music","fire"];
        if(orange.includes(string))
        {
            return "#FD981C";
        }
let darkorange = ["atmospheric black metal","ska","romantic lyrics","post-hardcore","industrial","soft rock","classical","dreamworks","atmospheric","acoustic","deathcore","soul","k-pop","uk garage","alternative","drill","trap","vocal harmonies","sludge metal","piano","mpb","vaportrap","finnish","reggae","outsider house","northern soul","italo disco","southern rock","percussion","bolero","future funk","bedroom pop","chipmunk vocalists","sufi","sampling","witch house","baroque","gypsy jazz","folk metal","1985","parody","1994","modesto"];
        if(darkorange.includes(string))
        {
            return "#FD620E";
        }
let red = ["dutch","emotional","latin","psychedelic rock","house","sludge","reggaeton","chill","bossa nova","afrobeat","hip hop","folk","dnb","electronic","country","metalcore","drone","rock en espanol","progressive metal","ebm","australian","deutsch","mellow","2019","serbian","ninja tune","bluegrass","cool jazz","8-bit","psychedelic pop","jangle pop","taiwan","mysterious","funny","brazilian","gypsy","uk","composer","gothic doom metal","tropicalia","50s","future bass","mod","goofy"];
        if(red.includes(string))
        {
            return "#E43204";
        }
let darkred = ["cumbia","2021","math rock","psychedelic","british","alt country","garage punk","progressive folk","slovenia","afghan","singer-songwriter","death metal","all","classic rock","darkwave","mothcore","alternative rnb","coldwave","thrash metal","synthpop","deathrock","indietronica","2012","chile","soukous","symphonic metal","suomisaundi","goregrind","80s rare","youtube","ethereal wave","gothic metal","art punk","brasil","horrorcore","progressive metalcore","two-tone","progressive electronic","tiki"];
        if(darkred.includes(string))
        {
            return "#A60808";
        }
        return "#85929E";
        return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
    }

    $(".catalogue-tags .tag").each(function (i, el) {
        var color = stringToColor(el.textContent);
        var textcolor = (color=="#FDC928" | color=="#FD981C" | color=="#86B91F") ? "#451E03" : "#ECF0F1";
        $("a",this).css("color",textcolor).css("background-color",color).css("box-shadow","none");
    });

};

waitForKeyElements(".catalogue-tags", main_func);