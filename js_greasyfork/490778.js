// ==UserScript==
// @name         감정 이미지
// @namespace    https://novelai.net/
// @version      2.0
// @description  코멘트 아바타를 깡통의 아바타로
// @author       깡갤
// @match        https://novelai.net/*
// @icon         https://novelai.net/_next/static/media/pen-tip-light.47883c90.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490778/%EA%B0%90%EC%A0%95%20%EC%9D%B4%EB%AF%B8%EC%A7%80.user.js
// @updateURL https://update.greasyfork.org/scripts/490778/%EA%B0%90%EC%A0%95%20%EC%9D%B4%EB%AF%B8%EC%A7%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* 1. 기본 이미지 및 키워드 */

// 디폴트 이미지 주소
const happyImageUrl = 'https://i.postimg.cc/sQxDgHdg/happy.png';
const sadImageUrl = 'https://i.postimg.cc/PL3T9bps/sad.png';
const angryImageUrl = 'https://i.postimg.cc/P598qWLp/angry.png';
const arousedImageUrl = 'https://i.postimg.cc/hJptgWYY/aroused.png';
const thinkingImageUrl = 'https://i.postimg.cc/xJBYT036/thinking.png';
const confusedImageUrl = 'https://i.postimg.cc/CZFxWLcD/confused.png';
const scaredImageUrl = 'https://i.postimg.cc/DSc2d37z/scared.png';
const surprisedImageUrl = 'https://i.postimg.cc/qtMp1D7x/surprised.png';
const embarrassedImageUrl ='https://i.postimg.cc/47047vsb/embarrassed.png';;
const disgustedImageUrl = 'https://i.postimg.cc/Lhq8dW3y/disgusted.png';
const smugImageUrl = 'https://i.postimg.cc/WFdTvDgD/smug.png';
const excitedImageUrl ='https://i.postimg.cc/mh02TSdT/excited.png';
const hurtImageUrl = 'https://i.postimg.cc/D8Lf0bDL/hurt.png';
const tiredImageUrl = 'https://i.postimg.cc/JzGkm6hC/tired.png';
const determinedImageUrl = 'https://i.postimg.cc/H87YQJLG/determined.png';
const loveImageUrl = 'https://i.postimg.cc/Sn4SMxF5/love.png';
const defaultImageUrl = `https://i.postimg.cc/k2P4vy8T/tired.png`;


// 감지할 키워드 배열
const happyKeywords = ['smile','delighted', 'ecstatic', 'cheerful', 'pleased', 'satisfied', 'exuberant', 'blissful', 'jubilant', 'merry', 'radiant', 'gleeful', 'grateful', 'blessed', 'contented', 'lighthearted', 'festive', 'sunny', 'smiling', 'positive', 'vibrant', 'amused', 'carefree', 'enthusiastic', 'buoyant', 'euphoric', 'high-spirited', 'animated', 'optimistic', 'jovial', 'charmed', 'playful', 'jolly', 'satisfied', 'gratified', 'exultant', 'mirthful', 'festive', 'lively', 'overjoyed', 'joyous', 'warmhearted', 'blithe', 'uplifting', 'heartwarming', 'celebrate', 'enjoy', 'cherish', 'rejoice', 'delight', 'radiate', 'bask', 'savor', 'thrive', 'appreciate', 'bless', 'admire', 'grin', 'smile', 'beam', 'glow', 'succeed', 'prosper', 'excel', 'succeed', 'fulfill', 'uplift', 'delight', 'cherish', 'giggle', 'greet', 'hug', 'embrace', 'treasure', 'thank', 'appreciate', 'succeed', 'soar', 'triumph', 'blossom', 'bask', 'radiate', 'exult', 'bubble', 'overflow', 'thrive', 'jubilate', 'bask', 'gladden','happy'];
const sadKeywords = ['sad','unhappy', 'sorrowful', 'mournful', 'melancholy', 'gloomy', 'dejected', 'downcast', 'downhearted', 'woeful', 'disheartened', 'discouraged', 'dismal', 'forlorn', 'crestfallen', 'despondent', 'depressed', 'down in the dumps', 'down in the dumps', 'down in the mouth', 'low-spirited', 'miserable', 'despairing', 'hopeless', 'grief-stricken', 'heartbroken', 'anguished', 'brokenhearted', 'tearful', 'wretched', 'sulky', 'dour', 'glum', 'morose', 'disconsolate', 'disappointed', 'regretful', 'unfulfilled', 'grieved', 'heavy-hearted', 'lugubrious', 'pensive', 'plaintive', 'somber', 'doleful', 'funereal', 'plaintive', 'lamenting', 'moping'];
const angryKeywords = ['irate', 'enraged', 'furious', 'indignant', 'incensed', 'annoyed', 'agitated', 'resentful', 'exasperated', 'livid', 'irritated', 'outraged', 'angry', 'mad', 'cross', 'upset', 'aggravated', 'frustrated', 'infuriated', 'vexed', 'irascible', 'impatient', 'displeased', 'offended', 'disgruntled', 'hostile', 'acerbic', 'bitter', 'testy', 'sour', 'cranky', 'grumpy', 'irritable', 'snappish', 'spiteful', 'miffed', 'peevish', 'provoked', 'riled up', 'choleric', 'wrathful', 'stormy', 'tempestuous', 'fiery', 'hot-tempered', 'intemperate', 'irate', 'incandescent','attack'];
const arousedKeywords = ['stimulated', 'erect', 'fired up', 'animated', 'fervent', 'zealous', 'eager','animated', 'invigorated', 'enthusiastic', 'charged', 'aroused', 'energized', 'electrified', 'exhilarated', 'passionate', 'enraptured', 'thrilled', 'elated', 'enthusiastic', 'eager', 'vibrant', 'lively', 'intense','invigorated', 'enthralled', 'captivated', 'rapturous', 'fuck','horn','kiss','penis','womb','vagina','lick'];
const thinkingKeywords = ['reflective', 'contemplative', 'thoughtful', 'pondering', 'introspective', 'meditative', 'cogitative', 'analytical', 'deliberative', 'reflective', 'ruminative', 'philosophical', 'intellectual', 'pensive', 'musing', 'brooding', 'reflective', 'contemplative', 'considerate', 'cerebral', 'inquiring', 'curious', 'inquisitive', 'speculative', 'wondering', 'questioning', 'doubtful', 'skeptical', 'inquisitive', 'inquiring', 'speculative', 'probing', 'analytical', 'examinative', 'scrutinizing', 'judicious', 'discerning', 'perceptive', 'insightful', 'intelligent', 'wise', 'rational', 'logical', 'cognitive', 'thought-provoking', 'inquiring', 'think','agree'];
const confusedKeywords = ['bewildered', 'perplexed', 'confounded', 'baffled', 'mystified', 'puzzled', 'dazed', 'disoriented', 'disconcerted', 'flustered', 'discombobulated', 'upset', 'disturbed', 'unsettled', 'troubled', 'uncertain', 'doubtful', 'undecided', 'hesitant', 'dubious', 'ambivalent', 'muddled', 'fuddled', 'stupefied', 'stunned', 'stumped', 'befuddled', 'dumbfounded', 'confused', 'mixed-up', 'perplexed', 'nonplussed', 'lost', 'abashed', 'aberrant', 'disordered', 'at sea', 'at a loss', 'bemused', 'discomposed', 'disorganized', 'flummoxed', 'knocked sideways', 'mystified', 'rattled', 'thrown','confused'];
const scaredKeywords = ['afraid', 'frightened', 'terrified', 'panicked', 'anxious', 'nervous', 'worried', 'apprehensive', 'dismayed', 'petrified', 'horrified', 'spooked', 'timid', 'trepidatious', 'startled', 'alarmed', 'uneasy', 'shaky', 'jittery', 'edgy', 'unsettled', 'paranoid', 'scared', 'fearful', 'phobic', 'tense', 'fear-stricken', 'scared stiff', 'frozen with fear', 'apprehensive', 'febrile', 'nervous wreck', 'panic-stricken', 'terrified'];
const surprisedKeywords = ['astonished', 'amazed', 'bewildered', 'startled', 'stunned', 'shocked', 'dumbfounded', 'flabbergasted', 'gobsmacked', 'aghast', 'stupefied', 'disbelieving', 'incredulous', 'nonplussed', 'confounded', 'taken aback', 'speechless', 'jolted', 'staggered', 'astounded', 'appalled', 'perplexed', 'unbelievable', 'unexpected', 'mind-blowing', 'jaw-dropping', 'unanticipated', 'unforeseen', 'disconcerting', 'unsettling', 'mind-boggling', 'unimaginable', 'unpredicted', 'shiver-inducing', 'awe-struck', 'dazed', 'wonderstruck', 'marveling', 'astonishing', 'awe-inspiring'];
const embarrassedKeywords = ['awkward', 'self-conscious', 'shy', 'uncomfortable', 'mortified', 'chagrined', 'flustered', 'abashed', 'disconcerted', 'sheepish', 'humiliated', 'blushing', 'bashful', 'confused', 'apologetic', 'guilty', 'ashamed', 'regretful', 'discomfited', 'red-faced', 'unsteady', 'nervous', 'awkwardness', 'self-consciousness', 'shyness', 'discomfort', 'mortification', 'chagrin', 'fluster', 'abashment', 'confusion', 'apology', 'guilt', 'shame', 'regret', 'discomfiture', 'blush', 'bashfulness', 'uneasiness', 'apology', 'humility'];
const disgustedKeywords = ['nauseated', 'repulsed', 'revolted', 'displeased', 'sickened', 'abhorrent', 'offended', 'appalled', 'disturbed', 'loathsome', 'disgusting', 'vile', 'repugnant', 'abominable', 'grossed out', 'odious', 'horrified', 'hateful', 'detestable', 'outraged', 'intolerable', 'noxious', 'obnoxious', 'obscene', 'aberrant', 'deplorable', 'off-putting', 'objectionable', 'repellent', 'dislikable', 'unpleasant', 'antipathetic', 'unpalatable', 'unsavory', 'disheartening', 'despicable', 'contemptible', 'aberration', 'aversion', 'loathing', 'disdain', 'abhorrence', 'repulsion'];
const smugKeywords = ['self-satisfied', 'complacent', 'self-righteous', 'conceited', 'egotistical', 'arrogant', 'proud', 'superior', 'vainglorious', 'snobbish', 'egotistic', 'condescending', 'self-assured', 'self-content', 'self-congratulatory', 'smirking', 'self-important', 'self-content', 'self-sufficient', 'self-admiring', 'self-approving', 'self-loving', 'contented', 'self-esteem', 'egotism', 'vanity', 'arrogance', 'pride', 'complacency', 'conceit', 'snobbery', 'self-approval', 'self-love', 'satisfaction', 'self-congratulation', 'superiority', 'smirk', 'self-approval', 'smug', 'self-righteousness'];
const excitedKeywords = ['thrilled', 'enthusiastic', 'eager', 'animated', 'exhilarated', 'elated', 'overjoyed', 'ecstatic', 'electrified', 'vibrant', 'buoyant', 'joyful', 'upbeat', 'passionate', 'energetic', 'fired-up', 'stimulated', 'exuberant', 'dynamic', 'fervent', 'intoxicated', 'elation', 'exhilaration', 'enthusiasm', 'eagerness', 'joy', 'elation', 'thrill', 'glee', 'exuberance', 'rapture', 'euphoria', 'jubilation', 'excitement', 'passion', 'zeal', 'fascination', 'frenzy', 'elation'];
const hurtKeywords = ['wounded', 'injured', 'upset', 'offended', 'disheartened', 'crushed', 'betrayed', 'heartbroken', 'bruised', 'damaged', 'harmed', 'suffering', 'painful', 'emotional', 'distressed', 'aggrieved', 'affected', 'brokenhearted', 'crushed', 'hurtful', 'injured', 'damaged', 'harm', 'displeased', 'aggrieved', 'injury', 'pain', 'heartbreak', 'disappointment', 'betrayal', 'suffering', 'anguish', 'distress', 'damage', 'hurtfulness', 'discomfort', 'grief', 'woe', 'unhappiness', 'tears', 'heartache'];
const tiredKeywords = ['exhausted', 'weary', 'fatigued', 'drained', 'spent', 'worn out', 'burned out', 'listless', 'lethargic', 'sluggish', 'drowsy', 'sleepy', 'dull', 'lifeless', 'sapped', 'fagged', 'pooped', 'run-down', 'debilitated', 'enervated', 'weakened', 'deadbeat', 'droopy', 'jaded', 'languid', 'low-energy', 'bedraggled', 'overworked', 'bushed', 'tuckered out', 'exerted', 'lackluster', 'broken', 'exhaustion', 'weariness', 'fatigue', 'drain', 'lassitude', 'drowsiness', 'dullness', 'torpor', 'lethargy', 'burnout'];
const determinedKeywords = ['resolute', 'committed', 'decisive', 'persistent', 'driven', 'dedicated', 'tenacious', 'steadfast', 'unyielding', 'purposeful', 'focused', 'resolved', 'strong-willed', 'ambitious', 'persevering', 'indomitable', 'unshakeable', 'unwavering', 'unflinching', 'courageous', 'energetic', 'tenacity', 'perseverance', 'dedication', 'commitment', 'resolve', 'drive', 'ambition', 'willpower', 'steadiness', 'intention', 'conviction', 'decision', 'assurance', 'determination', 'fortitude', 'single-minded', 'purpose-driven', 'goal-oriented', 'undeterred', 'unswerving', 'uncompromising', 'unflagging', 'persistent', 'unrelenting'];
const loveKeywords = ['love', 'affection', 'hug','pat'];

const keywordsToDetect = happyKeywords.concat(sadKeywords).concat(angryKeywords).concat(arousedKeywords).concat(thinkingKeywords).concat(confusedKeywords).concat(scaredKeywords).concat(surprisedKeywords).concat(embarrassedKeywords).concat(disgustedKeywords).concat(smugKeywords).concat(excitedKeywords).concat(hurtKeywords).concat(tiredKeywords).concat(determinedKeywords).concat(loveKeywords);

       /* 2. 메인 기능 */

// 이미지 URL을 가져오는 함수
function getImageUrl(emotion) {
    // 로컬 스토리지에서 저장된 데이터를 가져옵니다.
    const storedData = JSON.parse(localStorage.getItem('emotionData')) || {};

    // 해당 감정에 대한 이미지 URL이 저장되어 있다면 가져오고, 그렇지 않으면 스페어 URL을 반환합니다.
    return storedData[emotion] || getSparedImageUrl(emotion) || defaultImageUrl;
}

// 스페어 URL을 가져오는 함수
function getSparedImageUrl(emotion) {
    switch(emotion) {
        case 'happy':
            return happyImageUrl;
        case 'sad':
            return sadImageUrl;
        case 'angry':
            return angryImageUrl;
        case 'aroused':
            return arousedImageUrl;
        case 'thinking':
            return thinkingImageUrl;
        case 'confused':
            return confusedImageUrl;
        case 'scared':
            return scaredImageUrl;
        case 'surprised':
            return surprisedImageUrl;
        case 'embarrassed':
            return embarrassedImageUrl;
        case 'disgusted':
            return disgustedImageUrl;
        case 'smug':
            return smugImageUrl;
        case 'excited':
            return excitedImageUrl;
        case 'hurt':
            return hurtImageUrl;
        case 'tired':
            return tiredImageUrl;
        case 'determined':
            return determinedImageUrl;
        case 'love':
            return loveImageUrl;
        default:
            return null;
    }
}


// 감정에 따라 적용할 CSS 반환
function getEmotionCSS(emotion, emotionname) {
    return `
        .comment-avatar-idle, .comment-avatar-speaking, .comment-avatar {
            background-image: url(${emotion}) !important;
            border-radius: 30px !important;
        }
        .comment-name::after {
            content: '${emotionname}' !important;
            font-size: 120% !important;
            width: 560px;  !important;
        }
    `;
}



// 텍스트 감지 함수 수정
function detectTextAndApplyCSS() {
    // 대상 클래스 내부의 p 태그 중에서 class가 "paragraph"이면서 span.aiText를 포함한 것들만 선택
    const paragraphs = document.querySelectorAll('.ProseMirror p.paragraph span.aiText');

    // 가장 최근에 생성된 키워드에 대한 이미지 URL 및 감정 초기화
    let latestKeywordImageUrl = '';
    let latestKeywordEmotion = '';

    // 가장 하단의 세 개의 p 태그에서 텍스트 추출 및 키워드 감지
    for (let i = Math.max(0, paragraphs.length - 300); i < paragraphs.length; i++) {
        const paragraphText = paragraphs[i].textContent.toLowerCase();

        if (happyKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('happy');
            latestKeywordEmotion = 'happy';
            break; // 이미지를 찾았으면 반복문 종료
        } else if (sadKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('sad');
            latestKeywordEmotion = 'sad';
            break;
        } else if (angryKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('angry');
            latestKeywordEmotion = 'angry';
            break;
        } else if (arousedKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('aroused');
            latestKeywordEmotion = 'aroused';
            break;
        } else if (thinkingKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('thinking');
            latestKeywordEmotion = 'thinking';
            break;
        } else if (confusedKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('confused');
            latestKeywordEmotion = 'confused';
            break;
        } else if (scaredKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('scared');
            latestKeywordEmotion = 'scared';
            break;
        } else if (surprisedKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('surprised');
            latestKeywordEmotion = 'surprised';
            break;
        } else if (embarrassedKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('embarrassed');
            latestKeywordEmotion = 'embarrassed';
            break;
        } else if (disgustedKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('disgusted');
            latestKeywordEmotion = 'disgusted';
            break;
        } else if (smugKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('smug');
            latestKeywordEmotion = 'smug';
            break;
        } else if (excitedKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('excited');
            latestKeywordEmotion = 'excited';
            break;
        } else if (hurtKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('hurt');
            latestKeywordEmotion = 'hurt';
            break;
        } else if (tiredKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('tired');
            latestKeywordEmotion = 'tired';
            break;
        } else if (determinedKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('determined');
            latestKeywordEmotion = 'determined';
            break;
        } else if (loveKeywords.some(keyword => paragraphText.includes(keyword))) {
            latestKeywordImageUrl = getImageUrl('love');
            latestKeywordEmotion = 'love';
            break;
        }
    }

    // 키워드를 찾았을 경우 CSS 적용
    if (latestKeywordImageUrl) {
        applyCSS(getEmotionCSS(latestKeywordImageUrl, latestKeywordEmotion)); // latestKeywordEmotion 추가하여 전달
        //console.log(`감정을 찾았습니다.`);
    } else {
        //console.log('키워드를 찾지 못했습니다.');
        applyCSS(getEmotionCSS(getImageUrl('default')||defaultImageUrl, 'default')); // 기본값으로 설정
    }
}


    // 스타일을 동적으로 추가하는 함수
    function applyCSS(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

// 페이지 로드 후 실행
window.addEventListener('load', function () {
    // 초기 실행
    detectTextAndApplyCSS();

    // 주기적 실행 (예: 5초마다)
    setInterval(detectTextAndApplyCSS, 5000);
});

    /* 3. css */

    var styleElement = document.createElement('style');
    var cssCode = `
    :root {
    --Tmain-color: azure;
}
            .comment-box {
           border-radius: 8px !important;
           width: 594px !important;
           border-color: rgb(255 255 255 / 0%) !important;
        }
        .comment-avartar-box, .bLTRiL {
           border-color: rgb(255 255 255 / 0%) !important;
        }
        .comment-name::after {
        font-style: italic  !important;
        }
        .biEXyW {
            border: 1px solid #ffffffb3 !important;
            background-color: #ffffffb3 !important;
        }
        .ckLqqc, .ckLqqc::after {
            border-right: 10px solid #ffffffb3 !important;
        }
        .ozyya {
            justify-content: space-evenly !important;
        }

    #overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 80;
}

.container{
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: none;
}

#happy-input,
#sad-input,
#angry-input,
#aroused-input,
#thinking-input,
#confused-input,
#scared-input,
#surprised-input,
#embarrassed-input,
#disgusted-input,
#smug-input,
#excited-input,
#hurt-input,
#tired-input,
#determined-input,
#love-input,
#default-input {
  border: 2px solid transparent;
  width: 13em;
  height: 2.5em;
  padding-left: 0.8em;
  outline: none;
  overflow: hidden;
  background-color: #F3F3F3;
  border-radius: 10px;
  transition: all 0.5s;
  display: inline-block;
  vertical-align: middle;
}

#happy-input:hover,
#happy-input:focus,
#sad-input:hover,
#sad-input:focus,
#angry-input:hover,
#angry-input:focus,
#aroused-input:hover,
#aroused-input:focus,
#thinking-input:hover,
#thinking-input:focus,
#confused-input:hover,
#confused-input:focus,
#scared-input:hover,
#scared-input:focus,
#surprised-input:hover,
#surprised-input:focus,
#embarrassed-input:hover,
#embarrassed-input:focus,
#disgusted-input:hover,
#disgusted-input:focus,
#smug-input:hover,
#smug-input:focus,
#excited-input:hover,
#excited-input:focus,
#hurt-input:hover,
#hurt-input:focus,
#tired-input:hover,
#tired-input:focus,
#determined-input:hover,
#determined-input:focus,
#love-input:hover,
#love-input:focus,
#default-input:hover,
#default-input:focus {
  border: 2px solid #4A9DEC;
  box-shadow: 0px 0px 0px 7px rgb(74, 157, 236, 20%);
  background-color: white;
}
.saveButton {
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: pointer;
  width: 55px;
  height: 35px;
  background-image: linear-gradient(to top, #D8D9DB 0%, #fff 80%, #FDFDFD 100%);
  border-radius: 7px;
  border: 1px solid #8F9092;
  transition: all 0.2s ease;
  font-weight: 600;
  color: #606060;
  text-shadow: 0 1px #fff;
  font-size: 12px;
  height: 25px;
}

.saveButton:hover {
  box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 3px 3px #CECFD1;
}

.saveButton:active {
  box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
}

.saveButton:focus {
  box-shadow: 0 4px 3px 1px #FCFCFC, 0 6px 8px #D6D7D9, 0 -4px 4px #CECFD1, 0 -6px 4px #FEFEFE, inset 0 0 5px 3px #999, inset 0 0 30px #aaa;
}

#gridBox{
  display:grid;
  align-items:center;
  margin-top:2px;
  height:90px;
  justify-content: space-around;
}
#gridBox2 {
display: flex;
gap: 5px;
}
#gridBox2:before{
  content:'';
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
#labelcs{
display: inline-block;
width: 100px;
vertical-align:middle;
}

#form{
    position: relative;
}

#modal{
  background-color: var(--Tmain-color);
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 30px;
  margin: 10px;
  width: 280px;
  height: 520px;
}

.hamburger {
  cursor: pointer;
  position: fixed;
    top: 15px;
    left: 58px;
    z-index: 9999; /* 다른 요소들 위에 배치되도록 하는 값 */
}

.hamburger input {
  display: none;
}

.hamburger svg {
  /* The size of the SVG defines the overall size */
  height: 3em;
  /* Define the transition for transforming the SVG */
  transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.line {
  fill: none;
  stroke: white;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
  /* Define the transition for transforming the Stroke */
  transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
              stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.line-top-bottom {
  stroke-dasharray: 12 63;
}

.hamburger input:checked + svg {
  transform: rotate(-45deg);
}

.hamburger input:checked + svg .line-top-bottom {
  stroke-dasharray: 20 300;
  stroke-dashoffset: -32.42;
}

.box {
display: block;
    padding: 5px;
    height: 250px;
    overflow: auto;
}
.radio-buttons-container {
  display: flex;
  align-items: center;
  gap: 24px;
}

.radio-button {
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.radio-button__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-button__label {
  display: inline-block;
  padding-left: 30px;
  margin-bottom: 10px;
  position: relative;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
}

.radio-button__custom {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #555;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
}

.radio-button__input:checked + .radio-button__label .radio-button__custom {
  transform: translateY(-50%) scale(0.9);
  border: 5px solid #4c8bf5;
  color: #4c8bf5;
}

.radio-button__input:checked + .radio-button__label {
  color: #4c8bf5;
}

.radio-button__label:hover .radio-button__custom {
  transform: translateY(-50%) scale(1.2);
  border-color: #4c8bf5;
  box-shadow: 0 0 10px #4c8bf580;
}
    `;

    var tMainColor = localStorage.getItem('tMainColor');
    document.documentElement.style.setProperty('--Tmain-color', tMainColor);

        function ColorEx () {
        // 설정창 배경색
        var infobarElement = document.querySelector('.menubar');
        if (infobarElement) {
            tMainColor = window.getComputedStyle(infobarElement).backgroundColor;
            document.documentElement.style.setProperty('--Tmain-color', tMainColor);
            localStorage.setItem('tMainColor', tMainColor);
        };
    }

    // style 요소에 CSS 코드를 추가합니다.
    styleElement.textContent = cssCode;
    // style 요소를 문서의 head에 추가합니다.
    document.head.appendChild(styleElement);

    /* 4. 세팅창 ui*/

    function saveImageUrlToLocalStorage(emotion, imageUrl) {
        // 이전에 저장된 값을 불러옵니다.
        const storedData = JSON.parse(localStorage.getItem('emotionData')) || {};

        // 새로운 이미지 URL을 저장합니다.
        storedData[emotion] = imageUrl;

        // 로컬 스토리지에 저장합니다.
        localStorage.setItem('emotionData', JSON.stringify(storedData));

        //alert('저장됨.');

        console.log(`${emotion} 이미지 URL이 로컬 스토리지에 저장되었습니다: ${imageUrl}`);
    }

    //실행 버튼

// 전역 변수로 overlay 선언
const overlay = document.createElement('div');
overlay.id = `overlay`;

// 페이지 로드 후 UI 생성 함수 호출
    createBtn();
    createUI();



function createBtn() {
    // alert('실행됨');
    // 라벨 요소 생성
    const label = document.createElement('label');
    label.classList.add('hamburger');

    // 체크박스 요소 생성
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    // SVG 요소 생성
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');

    // 첫 번째 path 요소 생성
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('class', 'line line-top-bottom');
    path1.setAttribute('d', 'M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22');

    // 두 번째 path 요소 생성
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('class', 'line');
    path2.setAttribute('d', 'M7 16 27 16');

    // SVG에 path 요소 추가
    svg.appendChild(path1);
    svg.appendChild(path2);

    // 라벨에 체크박스와 SVG 추가
    label.appendChild(checkbox);
    label.appendChild(svg);

    // body에 추가 또는 원하는 곳에 추가
    document.body.appendChild(label);

    // 햄버거 체크박스 상태 변화 감지
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            // 햄버거 체크된 경우: overlay를 보이게 함
            overlay.style.display = 'flex';
                ColorEx();
        } else {
            // 햄버거 체크 해제된 경우: overlay를 숨김
            overlay.style.display = 'none';
        }
    });
}

// UI를 생성하고 이미지 URL을 입력받아 localStorage에 저장하는 함수
function createUI() {
    const modal = document.createElement('div');
    modal.id = `modal`;

    const h2 = document.createElement('h2');
    h2.innerText = `감정 이미지`;
    modal.appendChild(h2);

    const box = document.createElement('div');
    box.style.padding = '5px';
    box.classList.add('box');

    const copyButton = document.createElement('button');
    copyButton.innerText = '복사';
    copyButton.id = 'copyButton'; // id 추가
    copyButton.classList.add('saveButton');
    //copyButton.style.width = 'auto';

    const overwriteButton = document.createElement('button');
    overwriteButton.innerText = '덮어쓰기';
    overwriteButton.id = 'overwriteButton'; // id 추가
    overwriteButton.classList.add('saveButton');
    overwriteButton.style.width = 'auto';

     const resetButton = document.createElement('button');
    resetButton.innerText = '초기화';
    resetButton.id = 'resetButton'; // id 추가
    resetButton.classList.add('saveButton');
    resetButton.style.width = 'auto';

    //url 복사 덮어쓰기 저장
    document.addEventListener('DOMContentLoaded', function() {
        copyButton.addEventListener('click', function() { // 수정
            // 복사 버튼을 클릭하면 localStorage 데이터를 복사합니다.
            let emotionData = JSON.parse(localStorage.getItem('emotionData'));
            navigator.clipboard.writeText(JSON.stringify(emotionData))
                .then(function() {
                    alert('데이터 복사됨.');
                })
                .catch(function() {
                    alert('데이터 복사 실패.');
                });
        });

        overwriteButton.addEventListener('click', function() { // 수정
            navigator.clipboard.readText().then(function(clipboardData) {
                try {
                    const emotionData = JSON.parse(clipboardData);
                    localStorage.setItem('emotionData', JSON.stringify(emotionData));
                    alert('클립보드 정보로 덮어쓰기 됨.');
                } catch (error) {
                    alert('클립보드 데이터 로딩 오류. 형식 맞추셈.');
                    console.error(error);
                }
            }).catch(function(error) {
                alert('오류 발생.');
                console.error(error);
            });
        });
    });

    const gridBox2 = document.createElement('div');
    gridBox2.id = `gridBox2`;

    const emotions = ['happy', 'sad', 'angry', 'aroused', 'thinking', 'confused', 'scared', 'surprised', 'embarrassed', 'disgusted', 'smug', 'excited', 'hurt', 'tired', 'determined', 'love', 'default'];

    emotions.forEach(emotion => {
        const form = document.createElement('div');
        form.id = `form`;

        const gridBox = document.createElement('div');
        gridBox.id = `gridBox`;

        const label = document.createElement('label');
        label.innerText = `${emotion}: `;
        label.id = `labelcs`;

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.id = `${emotion}-input`;
        input.setAttribute('placeholer','여기에 url 주소 입력');

        const saveButton = document.createElement('button');
        saveButton.innerText = '저장';
        saveButton.classList.add('saveButton');
        saveButton.addEventListener('click', () => {
            const imageUrl = document.getElementById(`${emotion}-input`).value;
            saveImageUrlToLocalStorage(emotion, imageUrl);
        });



        gridBox.appendChild(label);
        gridBox.appendChild(input);
        gridBox.appendChild(saveButton);

        form.appendChild(gridBox);

        box.appendChild(form);
    });
    const label2 = document.createElement('h3');
    label2.innerHTML = `<br>데이터`;

function handleRadioChange() {
    var radioOption1 = document.getElementById('radio1');
    var radioOption2 = document.getElementById('radio2');

    if (radioOption1.checked) {
        document.querySelector('.comment-box').style.display = 'none';
        document.querySelector('.comment-avatar-box').style.width = '700px';
        document.querySelector('.comment-avatar-box').style.height = '160px';
    } else if (radioOption2.checked) {
        document.querySelector('.comment-box').style.display = 'block';
        document.querySelector('.comment-avatar-box').style.width = '125px';
        document.querySelector('.comment-avatar-box').style.height = '125px';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('radio1').addEventListener('change', handleRadioChange);
    document.getElementById('radio2').addEventListener('change', handleRadioChange);
    document.getElementById("resetButton").addEventListener("click", function() {
    var confirmReset = confirm("정말 저장된 모든 이미지 주소 삭제할거임?");

    // 사용자가 확인을 눌렀을 때만 초기화 작업 수행
    if(confirmReset) {
        // 로컬 스토리지에서 emotionData 키의 값을 삭제
        localStorage.removeItem("emotionData");
        alert("삭제됨.");
    } else {
        alert("취소됨.");
    }
});
});

const radiocontainer = document.createElement('div');
radiocontainer.classList.add('radio-buttons-container');
radiocontainer.innerHTML = `
<div class="radio-buttons-container">
<div class="radio-button">
  <input name="radio-group" id="radio2" class="radio-button__input" type="radio">
  <label for="radio2" class="radio-button__label">
    <span class="radio-button__custom"></span>

        기본
  </label>
</div>
<div class="radio-button">
  <input name="radio-group" id="radio1" class="radio-button__input" type="radio">
  <label for="radio1" class="radio-button__label">
    <span class="radio-button__custom"></span>

    와이드
  </label>
</div>
</div>
`;

   const label3 = document.createElement('h3');
    label3.innerHTML = `<br>UI`;

    modal.appendChild(box);
    modal.appendChild(label2);
    modal.appendChild(gridBox2);
    gridBox2.appendChild(copyButton);
    gridBox2.appendChild(overwriteButton);
    gridBox2.appendChild(resetButton);

    modal.appendChild(label3);
    modal.appendChild(radiocontainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}





})();









