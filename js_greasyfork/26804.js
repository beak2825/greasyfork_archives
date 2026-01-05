// ==UserScript==
// @name         unicorn
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  there's jquery everywhere ¯\_(ツ)_/¯
// @author       justrunmyscripts
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/26804/unicorn.user.js
// @updateURL https://update.greasyfork.org/scripts/26804/unicorn.meta.js
// ==/UserScript==

const doReplacement = (element) => {
    var thestring = $(element).html();
    try {
        thestring = thestring.replace(/(\S*?)(skillful|ambitious|approachable|confident|accessible|goal-oriented|enterprising|quick|hurried|expeditious|flexible|insightful|perceptive|inquisitive|productive|structured|resourceful|responsible|technological|tech-savvy|affable|companionable|amicable|hilarious|amusing|comical|compassionate|faithful|committed|devoted|enduring|forbearing|incredible|unique|terrific|alluring|brilliant|courageous|fearless|valiant|abundant|plentiful|magnanimous|bountiful|seductive|enticing|beguiling|competent|accommodating|glittering|sensational|elegant|chic|dignified|fashionable|bewitching|unreserved|matter-of-fact|gleaming|glimmering|glistening|glowing|vibrant|flushed|mirthful|joyous|cheerful|prominent|remarkable|extraordinary|rousing|spectacular|stirring|lively|upbeat|optimistic|astonishing|miraculous|beautiful|wondrous|fabulous|gorgeous|fortuitous|blithesome|handsome|exquisite|unparalleled|faultless|impeccable|magnificent|reflective|rational|profound|promising|breathtaking|dazzling|impressive|enthusiastic|spirited|chirpy|luxurious|illustrious|courteous|heartfelt|awesome|lighthearted|carefree|gleeful|amazing|awe-inspiring|outstanding|astounding|stunning|supportive|encouraging|serendipitous|phenomenal|civilized|cordial|persistent|hard-working|industrious|hardworking|kind|likable|sincere|pleasant|sociable|caring|unselfish|effective|tactful|strategic|charismatic|artistic|enchanting|fascinating|harmonious|amenable|imaginative|inventive|patient|smart|intellectual|intelligent|affectionate|amiable|creative|charming|diligent|determined|dynamic|energetic|funny|generous|giving|gregarious|loving|adoring|honest|respectable|innocent|right|upright|blameless|charitable|dutiful|estimable|ethical|exemplary|guiltless|incorrupt|inculpable|irreprehensible|irreproachable|lily-white|obedient|praiseworthy|pure|righteous|tractable|uncorrupted|untainted|well-behaved|acceptable|excellent|exceptional|favorable|great|marvelous|positive|satisfactory|satisfying|superb|valuable|wonderful|choice|crack|nice|pleasing|prime|quality|rad|sound|spanking|sterling|super|superior|welcome|worthy|admirable|agreeable|commendable|congenial|deluxe|first-class|first-rate|gnarly|gratifying|honorable|jake|neat|precious|recherché|reputable|select|shipshape|splendid|stupendous|super-eminent|super-excellent|tiptop|up to snuff|efficient|proper|reliable|suitable|talented|useful|adept|expert|accomplished|adroit|au fait|capable|clever|dexterous|proficient|qualified|serviceable|advantageous|appropriate|beneficial|convenient|decent|desirable|fruitful|healthy|helpful|profitable|approving|brave|common|fit|fitting|meet|all right|apt|auspicious|becoming|benefic|benignant|commendatory|commending|conformable|congruous|favoring|healthful|hygienic|needed|opportune|propitious|salubrious|salutary|seemly|tolerable|toward|unobjectionable|wholesome|flawless|normal|perfect|safe|solid|stable|eatable|whole|dependable|fit to eat|fresh|intact|loyal|trustworthy|unblemished|uncontaminated|undamaged|undecayed|unhurt|unimpaired|unspoiled|vigorous|friendly|humanitarian|altruistic|beneficent|benevolent|considerate|gracious|humane|kindhearted|merciful|obliging|philanthropic|tolerant|well-disposed|legitimate|true|valid|kosher|regular|bona fide|conforming|genuine|justified|orthodox|strict|well-founded|orderly|decorous|kindly|mannerly|polite|respectful|thoughtful|well-mannered|adequate|big|large|sufficient|worthwhile|entire|full|much|complete|extensive|immeasurable|lucrative|paying|sizable|substantial|prosperity|welfare|well-being|asset|avail|behalf|benediction|blessing|boon|commonwealth|favor|gain|godsend|interest|nugget|plum|prize|profit|service|treasure|use|usefulness|windfall|good fortune|class|dignity|excellence|ideal|merit|prerogative|probity|rectitude|righteousness|straight|uprightness|value|virtue|worth)(\S*)/gi, '$1very good$3');
        thestring = thestring.replace(/unicode/gi, 'unicorn');
        thestring = thestring.replace(/know|understand/gi, 'grok');
        if (thestring.includes('men')) {
          thestring = thestring.replace(/(\S*?)men(\S*)/gi, '$1men$2 but also the $1women$2 and the $1children$2');
        } else {
          thestring = thestring.replace(/(\S*?)man(\S*)/gi, '$1man$2 but also the $1woman$2 and the $1children$2');
        }
        thestring = thestring.replace(/fuck/gi, 'frick');
        thestring = thestring.replace(/shit/gi, 'shiitaake mushroom');
        thestring = thestring.replace(/\S*?(retard|whore|idiot|bastard|bitch|slut|nigger|nigga|chink|asshole)(\S*)/gi, 'person$2 I don\'t like');
        $(element).html(thestring);
    }
    catch (err) {
        console.log('ERROR: ', err);
    }
}

window.addEventListener('load', () => {
    'use strict';

    console.log('unicorn is running! (tampermonkey script!)');

    $('a,ul,li,hr,div,ins,strong,em,' +
      'abbr,address,area,article,aside,base,big,button,canvas,caption,cite,code,' +
      'col,colgroup,command,dd,del,details,dir,dl,dt,embed,fieldset,figcaption,figure,' +
      'font,footer,form,frame,head,hr,html,body,i,iframe,input,ins,label,legend,link,map,' +
      'mark,menu,meta,meter,nav,noframes,object,ol,option,q,s,rp,rt,ruby,samp,section,' +
      'select,source,strike,sub,summary,sup,table,tbody,td,textarea,th,thead,time' +
      'title,tr,track,tt,u,ul,var').not(':has(*)').each((index, element )=>{
      doReplacement(element);
    });

      $('h1,h2,h3,h4,h5,h6,i,b,blockquote,p,span').each((index, element )=>{
        doReplacement(element);
    });

    $.noConflict();
}, false);