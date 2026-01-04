// ==UserScript==
// @name        QuickNAI
// @namespace   QuickNAI
// @match       *://novelai.net/*
// @grant       none
// @run-at      document-start
// @version     1.1.0
// @author      Zanzu
// @description 2022. 10. 12. 오후 6:39:59
// @downloadURL https://update.greasyfork.org/scripts/452999/QuickNAI.user.js
// @updateURL https://update.greasyfork.org/scripts/452999/QuickNAI.meta.js
// ==/UserScript==


globalThis.XMLHttpRequestOrigin = globalThis.XMLHttpRequest
class XMLHTTPQ extends globalThis.XMLHttpRequestOrigin{
    send(arg1){
        let sended = false
        try {
            let v = JSON.parse(arg1)
            const keys = (Object.keys(v))
            const puriRegex = /\{|\}|\(|\)|\[|\]/g
            if(keys.includes('input') && keys.includes("model") && keys.includes("parameters")){
                const splited = (v.input.split(','))
                const modifications = globalThis.ModifiedValue
                const queris = modifications.concat(splited)
                let result = []
                let Puris = ['',' ','-']
                for(let val of queris){
                    if(val.startsWith(' ')){
                        val = val.substring(1)
                    }
                    if(val.endsWith(' ')){
                        val = val.substring(0,val.length - 2)
                    }
                    const puri = val.replace(puriRegex, '').replace('_',' ')
                    if(!Puris.includes(puri)){
                        result.push(val)
                        Puris.push(puri)
                    }
                }
                v.input = result.join(', ')
                arg1 = JSON.stringify(v)
            }
        } catch (error) {}
        super.send(arg1)
    }
    isModified = true
}
globalThis.XMLHttpRequest = XMLHTTPQ;

(() => {var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let allTagsX = [];
let userTags = [];
let nsfws = [];
let prefixes = {};
let disabled = false;
let idindex = 0;
let mode = 0;
const puriRegex = /\{|\}|\(|\)|\[|\]/g;
let pluginAddition = null;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
localStorage.setItem('x-plugin-mode-bbw', 'able');
function main() {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep(100);
        openFol();
        while (true) {
            const head = (_c = (_b = (_a = document.querySelector('button.button')) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.querySelector('span');
            const inputElement = document.querySelector('input[type="text"]');
            const GenerateElement = (_e = (_d = document.querySelector('button span div')) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.parentElement;
            const cont = document.querySelector('#x-plugin-container');
            const PluginLoaded = !!document.querySelector('.Monkey_AI_Plugin');
            if (head && (location.pathname.includes('image')) && inputElement) {
                if ((!PluginLoaded)) {
                    const ele = document.createElement('a');
                    ele.style.fontSize = '0.875rem;';
                    ele.classList.add('Monkey_AI_Plugin');
                    const txt = document.createElement('span');
                    txt.innerText = 'Quick NAI Plugin';
                    ele.appendChild(txt);
                    ele.style.marginLeft = '10px';
                    handleMenu(txt);
                    head.appendChild(ele);
                    const promotContainer = (_f = inputElement.parentElement) === null || _f === void 0 ? void 0 : _f.parentElement;
                    if (promotContainer) {
                        const ele = document.createElement('div');
                        ele.style.border = '1px solid rgb(34, 37, 63)';
                        ele.style.whiteSpace = 'nowrap';
                        ele.id = 'plugin-addition';
                        ele.style.marginTop = "-10px";
                        ele.style.background = 'rgb(14, 15, 33)';
                        ele.style.padding = '5px 20px';
                        pluginAddition = ele;
                        promotContainer.appendChild(ele);
                    }
                    // inputElement.addEventListener('input', (e) => {
                    //     if(inputElement.value === 'p::bbw'){
                    //         if(localStorage.getItem('x-plugin-mode-bbw') !== 'able'){
                    //             localStorage.setItem('x-plugin-mode-bbw', 'able')
                    //             location.reload()
                    //         }
                    //     }
                    //     if(inputElement.value === 'p::nsfw'){
                    //         if(localStorage.getItem('x-plugin-mode-nsfw') !== 'able'){
                    //             localStorage.setItem('x-plugin-mode-nsfw', 'able')
                    //             location.reload()
                    //         }
                    //     }
                    // })
                }
                if (cont) {
                    if (mode === 0) {
                        cont.style.display = 'flex';
                    }
                    else {
                        cont.style.display = 'none';
                    }
                }
            }
            else {
                if (cont) {
                    cont.style.display = 'none';
                }
            }
            yield sleep(100);
        }
    });
}
function updateTags() {
    var _a, _b;
    const inputElement = document.querySelector('input[type="text"]');
    const GenerateElement = (_b = (_a = document.querySelector('button span div')) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
    if (inputElement && GenerateElement) {
        let tagList = [];
        for (const t of userTags) {
            const tags = t.tag.split('|');
            for (const tag of tags) {
                let tagDat = tag;
                if (t.prefix !== '') {
                    tagDat = `${prefixes[t.prefix]} ${tagDat}`;
                }
                for (let i = 0; i < t.strong; i++) {
                    tagDat = `{${tagDat}}`;
                }
                tagList.push(tagDat);
            }
        }
        globalThis.ModifiedValue = tagList;
        const v = tagList.join(', ');
        if (pluginAddition) {
            if (pluginAddition.innerText !== v) {
                pluginAddition.style.fontSize = "0.3rem";
                pluginAddition.innerText = globalThis.ModifiedValue.join(', ');
            }
        }
    }
}
function genColorStrong(txt, color = '#f1c40f', tag = 'strong') {
    const ele = document.createElement(tag);
    ele.textContent = txt;
    ele.setAttribute('style', `color: ${color};`);
    return ele;
}
function genText(text, type, size = null) {
    const ele = document.createElement(type);
    ele.textContent = text;
    if (size) {
        ele.setAttribute('style', `font-size: ${size}px;`);
    }
    return ele;
}
function genCheckBox(text) {
    const label = document.createElement('label');
    label.style.border = '1px solid rgb(34, 37, 63)';
    label.style.padding = '8px 8px';
    label.appendChild(genText(text, 'span'));
    label.style.width = '80%';
    return label;
}
function KeyboardInput() {
    const ele = document.querySelector('input[type="text"]');
    ele === null || ele === void 0 ? void 0 : ele.select();
    document.dispatchEvent(new KeyboardEvent("keydown", {
        key: "e",
        keyCode: 69,
        code: "KeyE",
        which: 69,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
        bubbles: true
    }));
    console.log('inputed');
}
function genSelect(txt, clistarg, prefixarg = -1, type = 'normal') {
    const prefix = prefixarg < 0 ? '' : prefixarg.toString();
    let tagStrength = 0;
    idindex += 1;
    while (txt.startsWith('!')) {
        txt = txt.substring(1);
        tagStrength += 1;
    }
    function filterlize(text) {
        if (text === '') {
            return '';
        }
        if (text.startsWith('$')) {
            text = text.substring(1);
        }
        return text;
    }
    function selectStyling(ele, width = 300) {
        ele.style.border = '1px solid rgb(34, 37, 63)';
        ele.style.padding = '8px 8px';
        ele.style.width = `${width}px`;
        ele.style.backgroundColor = '#13152c';
        ele.style.textAlign = 'center';
    }
    let clist = {};
    const repl = /_/g;
    for (const key in clistarg) {
        let key2 = key;
        key2 = filterlize(key2);
        clist[key2] = (clistarg[key]).replace(repl, ' ');
    }
    function updateThis() {
        var _a;
        const selectId = parseInt((_a = select.getAttribute('x-plugin-id-index')) !== null && _a !== void 0 ? _a : '');
        userTags = userTags.filter((val) => {
            return val.bid !== selectId;
        });
        const value = select.value;
        if (value !== '' && (!value.startsWith('■'))) {
            userTags.push({
                tag: select.value,
                bid: selectId,
                strong: tagStrength,
                prefix: prefix
            });
        }
        const t = document.querySelectorAll(`[x-plugin-id-index="${selectId}"]`);
        for (let i = 0; i < t.length; i++) {
            t[i].value = value;
        }
        updateTags();
    }
    const container = document.createElement('div');
    container.classList.add('x-plugin-select');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    const text = genText(txt, 'span');
    text.style.width = '80px';
    const select = document.createElement('select');
    selectStyling(select, type === 'normal' ? 300 : 160);
    if (type === 'usecolor') {
        select.style.marginLeft = '-5px';
    }
    select.setAttribute('x-plugin-id-index', `${prefixarg === -1 ? idindex : (100000 + prefixarg)}`);
    container.style.gap = '5px';
    for (const i in clist) {
        const option = document.createElement('option');
        option.value = i;
        option.innerText = clist[i];
        if (nsfws.includes(i)) {
            option.style.color = '#ec9f19';
            if (!true) {
                continue;
            }
        }
        select.appendChild(option);
    }
    container.appendChild(text);
    if (type === 'usecolor') {
        function prefixeChange() {
            prefixes[prefix] = select2.value;
            updateTags();
        }
        const colors = colorList();
        const select2 = document.createElement('select');
        selectStyling(select2, 120);
        for (let i in colors) {
            const option = document.createElement('option');
            option.value = i;
            //@ts-ignore
            option.innerText = colors[i];
            select2.appendChild(option);
        }
        select2.addEventListener('change', prefixeChange);
        container.appendChild(select2);
        prefixes[prefix] = '';
    }
    container.appendChild(select);
    {
        function setElementStyle(ele) {
            ele.style.border = '1px solid rgb(34, 37, 63)';
            ele.style.padding = '4px 4px';
            ele.style.width = '20px';
            ele.style.textAlign = 'center';
        }
        const container2 = document.createElement('div');
        container.appendChild(container2);
        container2.style.display = 'flex';
        container2.style.alignItems = 'center';
        const plusDiv = document.createElement('div');
        plusDiv.innerText = '+';
        setElementStyle(plusDiv);
        container2.appendChild(plusDiv);
        const StrengthDiv = document.createElement('div');
        StrengthDiv.innerText = '0';
        setElementStyle(StrengthDiv);
        container2.appendChild(StrengthDiv);
        const minusDiv = document.createElement('div');
        minusDiv.innerText = '-';
        setElementStyle(minusDiv);
        plusDiv.onclick = () => {
            if (tagStrength < 9) {
                tagStrength += 1;
                StrengthDiv.innerText = `${tagStrength}`;
                updateThis();
            }
        };
        minusDiv.onclick = () => {
            if (tagStrength > 0) {
                tagStrength -= 1;
                StrengthDiv.innerText = `${tagStrength}`;
                updateThis();
            }
        };
        container2.appendChild(minusDiv);
    }
    {
        for (const i in clist) {
            const v = i.split('|');
            for (const key of v) {
                allTagsX.push(key);
            }
        }
        select.addEventListener('change', updateThis);
    }
    return container;
}
function colorList() {
    return {
        '': '색 설정 안함',
        'grey ': '회색',
        'white ': '흰색',
        'brown ': '갈색',
        'red ': '빨강색',
        'pink ': '분홍색',
        'orange ': '주황색',
        'yellow ': '노란색',
        'golden ': '황금색',
        'light green ': '연두색',
        'green ': '초록색',
        'sky blue ': '하늘색',
        'blue ': '파란색',
        'purple ': '보라색',
        'black ': '검은색',
    };
}
function genWarn(text) {
    const txt = genText(text, 'span');
    txt.style.color = '#e74c3c';
    txt.style.fontSize = '8px';
    txt.style.marginTop = '5px';
    return txt;
}
function genOpenClose(innerDom, name = "[펼치기/접기]") {
    const ele = document.createElement("details");
    ele.classList.add('x-plugin-select');
    ele.style.border = '1px solid rgb(34, 37, 63)';
    ele.style.padding = '0.5em 0.5em';
    ele.classList.add('x-plugin-openclose');
    const summary = document.createElement("summary");
    summary.textContent = name;
    ele.appendChild(summary);
    const seperator = document.createElement('div');
    seperator.style.marginTop = '10px';
    seperator.style.borderTop = '1px solid rgb(34, 37, 63)';
    seperator.style.marginBottom = '10px';
    seperator.style.width = '100%';
    ele.appendChild(seperator);
    ele.appendChild(innerDom);
    return ele;
}
function genFlexDiv() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    return container;
}
function openFol() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.backgroundColor = '#13152c';
    container.style.border = '1px solid rgb(34, 37, 63)';
    container.style.minHeight = '200px';
    container.style.maxHeight = '600px';
    container.style.overflow = 'scroll';
    container.style.zIndex = '999';
    container.style.top = '200px';
    container.style.left = '50px';
    container.style.padding = '16px 16px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.id = "x-plugin-container";
    container.appendChild(genText('Quick NAI 플러그인', 'h2'));
    //기본
    {
        const commonContainer = genFlexDiv();
        container.appendChild(genOpenClose(commonContainer, '기본 외모'));
        commonContainer.appendChild(genSelect('나이성별', {
            '': '설정 안함',
            '{mature_female}': '성숙한 여자',
            '{girl}': '여자',
            '{little_girl}': '어린 여자',
            '${loli}|{female_child}': '로리',
            '{old_woman}': '늙은 여자',
        }));
        commonContainer.appendChild(genSelect('눈 색', {
            '': '설정 안함',
            grey_eyes: '회색',
            white_eyes: '흰색',
            brown_eyes: '갈색',
            Red_eyes: '빨강색',
            pink_eyes: '분홍색',
            orange_eyes: '주황색',
            yellow_eyes: '노란색',
            golden_eyes: '황금색',
            light_green_eyes: '연두색',
            green_eyes: '초록색',
            sky_blue_eyes: '하늘색',
            blue_eyes: '파란색',
            Purple_eyes: '보라색',
            black_eyes: '검은색',
            heterochromia: '오드아이',
            multicolored_eye: '멀티컬러'
        }));
        commonContainer.appendChild(genSelect('눈 상태', {
            '': '설정 안함',
            sconstricted_pupils: '수축',
            dilated_pupils: '확장',
            horizontal_pupils: '수평',
            bloodshot_pupils: '충혈',
            flaming_pupils: '발화',
            glowing_pupils: '발광',
        }));
        commonContainer.appendChild(genSelect('눈 무늬', {
            '': '설정 안함 / 없음',
            'heart-shaped_pupils': '하트',
            'spade-shaped_pupils': '스페이드',
            'clover-shaped_pupils': '클로버',
            'diamond-shaped_pupils': '다이아몬드',
            'star-shaped_pupils': '별',
            'flower-shaped_pupils': '꽃'
        }));
        commonContainer.appendChild(genSelect('입술', {
            '': '설정 안함',
            Thin_lips: '얇은 입술',
            Puffy_lips: '부은 입술',
            Dry_lips: '건조한 입술',
            Thick_lips: '두꺼운 입술',
            Pouty_lips: '통통한 입술'
        }));
    }
    //특징
    {
        const commonContainer = genFlexDiv();
        container.appendChild(genOpenClose(commonContainer, '특징'));
        commonContainer.appendChild(genSelect('피부색', {
            '': '설정 안함',
            'yellow man': '동양인',
            'White man': '백인',
            'black man': '흑인',
        }));
        commonContainer.appendChild(genSelect('종족', {
            '': '설정 안함 / 인간',
            Goblin: '고블린',
            Elf: '엘프',
            'Dark Elf': '다크 엘프',
            'High Elf': '하이 엘프',
            Orc: '오크',
            Monster: '요괴',
            Fairy: '요정',
            Dragon: '용',
            Ghost: '유령',
            Spirit: '정령',
            Angel: '천사',
            devil: '악마',
            Vampire: '흡혈귀',
            'dog anthro': '강아지 수인',
            'Gorilla anthro': '고릴라 수인',
            'cat anthro': '고양이 수인',
            'bear anthro': '곰 수인',
            'raccoon anthro': '너구리 수인',
            'wolf anthro': '늑대 수인',
            'squirrel anthro': '다람쥐 수인',
            'pig anthro': '돼지 수인',
            'horse anthro': '말 수인',
            'bat anthro': '박쥐 수인',
            'deer anthro': '사슴 수인',
            'lion anthro': '사자 수인',
            'cow anthro': '소 수인',
            'sheep anthro': '양 수인',
            'fox anthro': '여우 수인',
            'goat anthro': '염소 수인',
            'monkey anthro': '원숭이 수인',
            'ferret anthro': '족제비 수인',
            'mouse anthro': '쥐 수인',
            'rabbit anthro': '토끼 수인',
            'panda anthro': '팬더 수인',
            'tiger anthro': '호랑이 수인'
        }));
        commonContainer.appendChild(genSelect('직업', {
            '': '설정 안함',
            burglar: '강도',
            gyaru: '갸루',
            'construction worker': '건설 노동자',
            miner: '광부',
            florist: '꽃집 직원',
            lumberjack: '나무꾼',
            librarian: '사서',
            croupier: '상인',
            merchant: '상인',
            shepherd: '양치기',
            mechanic: '정비공',
            politician: '정치가',
            terrorist: '테러리스트',
            judge: '판사',
            student: '학생',
            hacker: '해커',
            salaryman: '회사원(남성)',
            'office lady': '회사원(여성)',
            hikikomori: '히키코모리',
            guard: '경비원',
            police: '경찰',
            janitor: '관리인',
            soldier: '군인',
            'standard-bearer': '군인(기수)',
            officer: '군인(장교)',
            lifeguard: '근위대',
            sailor: '선원',
            firefighter: '소방관',
            spy: '스파이',
            astronaut: '우주 비행사',
            chef: '요리사',
            conductor: '지휘자',
            bodyguard: '친위대',
            bartender: '바텐더',
            waiter: '웨이터',
            waitress: '웨이트리스',
            butler: '집사',
            cashier: '카운터 직원',
            maid: '메이드',
            'Nuss Made': '너스 메이드',
            'Ladies Made': '레이디스 메이드',
            'Military Made': '밀리터리 메이드',
            'Victoria Maid': '빅토리아 메이드',
            Cybermade: '사이버 메이드',
            'Steampunk Made': '스팀펑크 메이드',
            'Japanese-style made': '일본풍 메이드',
            'China-style made': '차이나 메이드',
            'Classic maid': '클래식 메이드',
            'Kitchen Made': '키친 메이드',
            'Faller Made': '팔러 메이드',
            'French Made': '프렌치 메이드',
            'House Made': '하우스 메이드',
            Housekeeper: '하우스키퍼',
            scientist: '과학자',
            chemist: '화학자',
            engineer: '엔지니어',
            dj: '디제이',
            geisha: '게이샤',
            idol: '아이돌',
            actor: '남성 배우',
            actress: '여성 배우',
            musician: '음악가',
            painter: '화가',
            artist: '예술가',
            athlete: '운동선수',
            Footballer: '축구선수',
            'a basketball player.': '농구선수',
            'Baseball player': '야구선수',
            'volleyball player': '배구선수',
            golfer: '골프 선수',
            'tennis player': '테니스 선수',
            cyclist: '자전거 선수',
            teacher: '교사',
            'math teacher': '수학 교사',
            'science teacher': '과학 교사',
            'English teacher': '영어 교사',
            'health teacher': '보건 교사',
            'school nurse': '보건 교사',
            driver: '운전사',
            pilot: '조종사',
            'train attendant': '기차 안내원',
            'train conductor': '기차 운전사',
            'flight attendant': '비행기 안내원',
            trucker: '트럭 운전사',
            doctor: '의사',
            nurse: '간호사',
            dentist: '치과 의사',
            slave: '노예',
            farmer: '농장주',
            queen: '여왕',
            king: '왕',
            prisoner: '죄인',
            dominatrix: '지배자',
            knight: '기사',
            ninja: '닌자',
            witch: '마녀',
            wizard: '마법사',
            miko: '무녀',
            samurai: '사무라이',
            priest: '성직자',
            nun: '수녀',
            monk: '수도사',
            alchemist: '연금술사',
            warrior: '전사',
            whore: '창녀',
            stripper: '스트립퍼',
            prostitution: '매춘부',
            'Porno Actor': '포르노 배우',
            'Adult Video Actor': '성인물 배우'
        }));
    }
    //머리카락
    {
        const hairContainer = genFlexDiv();
        container.appendChild(genOpenClose(hairContainer, '머리카락'));
        hairContainer.appendChild(genSelect('!색', {
            '': '설정 안함',
            grey_hair: '회색',
            'blonde_hair': '금발',
            white_hair: '흰색',
            brown_hair: '갈색',
            Red_hair: '빨강색',
            pink_hair: '분홍색',
            orange_hair: '주황색',
            golden_hair: '황금색',
            light_green_hair: '연두색',
            green_hair: '초록색',
            sky_blue_hair: '하늘색',
            blue_hair: '파란색',
            Purple_hair: '보라색',
            black_hair: '검은색',
            rainbow_hair: '무지개색',
            'two-tone_hair': '투 톤',
            streaked_hair: '줄무늬',
            gradient_hair: '그라데이션',
        }));
        hairContainer.appendChild(genSelect('!길이', {
            '': '설정 안함',
            long_hair: '길게',
            medium_hair: '중간',
            short_hair: '짧게',
            very_long_hair: '매우 길게',
            absurdly_long_hair: '엄청 길게',
            very_short_hair: '매우 짧게',
            absurdly_short_hair: '엄청 짧게',
            asymmetrical_bangs: '비대칭'
        }));
        hairContainer.appendChild(genSelect('!스타일', {
            '': '설정 안함 / 기본',
            pixie_cut: '픽시컷',
            undercut: '언더컷',
            cornrows: '콘로우',
            dreadlocks: '드레드',
            hime_cut: '히메컷',
            hair_bun: '롤빵',
            braided_bun: '묶은 롤빵',
            single_hair_bun: '싱글 롤빵',
            double_bun: '더블 롤빵',
            triple_bun: '트윈 롤빵',
            cone_hair_bun: '콘 헤어 롤빵',
            doughnut_hair_bun: '도넛 헤어 롤빵',
            heart_hair_bun: '하트 헤어 롤빵',
            one_side_up: '원 사이드 업',
            two_side_up: '투 사이드 업',
            ponytail: '포니테일',
            folded_ponytail: '접힌 포니테일',
            front_ponytail: '앞머리 포니테일',
            high_ponytail: '높은 포니테일',
            short_ponytail: '낮은 포니테일',
            side_ponytail: '사이드 포니테일',
            split_ponytail: '스플릿 포니테일',
            twintails: '트윈테일',
            low_twintails: '낮은 트윈테일',
            short_twintails: '짧은 트윈테일',
            uneven_twintails: '험한 트윈테일',
            tri_tails: '트라티 테일',
            quad_tails: '퀴드 테일',
            quin_tails: '퀸 테일'
        }));
        hairContainer.appendChild(genSelect('!상태', {
            '': '설정 안함 / 기본',
            curly_hair: '곱슬',
            'blunt bangs': '뭉툭',
            pointy_hair: '뾰족',
            messy_hair: '헝클어짐',
            spiked_hair: '날카로움',
            wavy_hair: '구불댐',
            flipped_hair: '뒤집힘'
        }));
        hairContainer.appendChild(genSelect('!눈 가림', {
            '': '설정 안함',
            hair_over_eyes: '눈 전체를 가림',
            hair_over_one_eye: '눈 하나를 가림',
            hair_between_eyes: '눈 사이를 가림'
        }));
        hairContainer.appendChild(genSelect('!앞머리', {
            '': '설정 안함 / 기본',
            'blunt_bangs': '뭉툭',
            'parted_bangs': '갈라짐',
            'swept_bangs': '쓸어담은듯함',
            'crossed_bangs': '크로스',
        }));
    }
    //가슴
    {
        const commonContainer = genFlexDiv();
        container.appendChild(genOpenClose(commonContainer, '가슴'));
        commonContainer.appendChild(genSelect('크기', {
            '': '설정 안함',
            flat_chest: '초빈유',
            small_breasts: '빈유',
            medium_breasts: '보통',
            large_breasts: '큼',
            huge_breasts: '거유',
            gigantic_breasts: '초거유'
        }, -2));
        commonContainer.appendChild(genSelect('상태', {
            '': '설정 안함',
            bouncing_breasts: '튐',
            breasts_apart: '벌림',
            floating_breasts: '떠다닌다',
            hanging_breasts: '젖걸이',
            perky_breasts: '활기참',
            sagging_breasts: '처짐',
            unaligned_breasts: '요동침',
            veiny_breasts: '풍선같음',
            pointy_breasts: '뾰족함',
            asymmetrical_breasts: '비대칭',
        }));
        if (localStorage.getItem('x-plugin-mode-nsfw') === 'able') {
            commonContainer.appendChild(genSelect('젖꼭지', {
                '': '설정 안함 / 없음',
                '$nipples': '사용',
                '$no_nipples': '젖꼭지가 없음',
                '$nipples|long_nipples': '젖꼭지가 김',
                '$nipples|small_nipples': '젖꼭지가 작음'
            }));
            commonContainer.appendChild(genSelect('젖꼭지 상태', {
                '': '설정 안함',
                '$inverted_nipples': '젖꼭지가 반대다',
                '$puffy_nipples': '젖꼭지가 부품',
                '$nipple_slip': '젖꼭지가 빠짐',
                '$dark_nipples': '젖꼭지가 어두움'
            }));
            commonContainer.appendChild(genSelect('유룬 크기', {
                '': '설정 안함',
                '$light_areolae': '작음',
                '$large_areolae': '큼',
            }));
            commonContainer.appendChild(genSelect('유룬 상태 ', {
                '': '설정 안함',
                '$dark_areolae': '어두움',
                '$areola_slip': '가려짐',
            }));
            commonContainer.appendChild(genSelect('도구', {
                '': '설정 안함',
                '$nipple_clamps': '젖꽂기 클램프',
                '$nipple_leash': '젖꼭지 가죽끈',
                '$nipple_piercing': '젖꼭지 피어싱',
                '$nipple_rings': '젖꼭지 고리',
                '$nipple_sleeves': '젖꼭지 긴 줄',
                '$nipple_ribbon': '젖꼭지 리본',
                '$nipple_bar': '젖꼭지 바',
                '$nipple_lock': '젖꼭지 자물쇠',
                '$nipple_bells': '젖꼭지 종',
                '$vibrator_on_nipple': '젖꼭지 진동기',
                '$nipple_chain': '젖꼭지 체인',
                '$nipple_plug': '젖꼭지 플러그'
            }));
        }
    }
    //구도
    {
        const locContainer = genFlexDiv();
        container.appendChild(genOpenClose(locContainer, '구도'));
        locContainer.appendChild(genSelect('!동작', {
            '': '설정 안함',
            walking: '걸음',
            running: '달림',
            reclining: '기댐',
            hug: '껴안음',
            faceplant: '넘어짐',
            sitting: '앉음',
            standing: '서 있음',
            stretching: '스트레칭',
            contrapposto: '엉덩이를 내밈',
            crucifixion: '온몸이 묶임',
            jumping: '점프',
            fighting_stance: '전투 자세',
            battoujutsu_stance: '발도술',
            balancing: '균형잡음',
            full_scorpion: '전갈 자세',
            lying: '누움',
            crossed_legs: '다리를 꼼',
            fetal_position: '웅크려 누음',
            on_back: '뒤로 누움',
            on_side: '옆으로 누움',
            on_stomach: '엎드림',
            prostration: '도게자',
            butterfly_sitting: '나비처럼 앉음',
            seiza: '일본식 앉음',
            sitting_on_lap: '무릎에 앉음',
            sitting_on_person: '사람 위에 앉음',
            squatting: '쪼그려 앉음',
            wariza: '일본식 언니 앉음',
            yokozuwari: '한쪽으로 앉음',
            Hugging: '껴안음',
            'eye contact': '눈을 맞춤',
            'leg lock': '다리를 잡음',
            'back-to-back': '등을 맞댐',
            'cheek-to-cheek': '뺨을 맞댐',
            'holding hands': '손을 잡음',
            'heads together': '머리를 맞댐',
            'forehead-to-forehead': '이마를 맞댐',
            hugging_own_legs: '다리를 껴안다',
            object_hug: '물건을 껴안음',
            hug_from_behind: '뒤에서 허그',
            arm_hug: '팔로 허그',
            waist_hug: '허리를 허그',
            Carrying_someone: '누군가를 껴안음',
            carried_breast_rest: '가슴을 듬',
            thigh_straddling: '허벅지에 올림',
            upright_straddle: '마주보고 올림',
            Torso_inclination: '몸을 기울임',
            twisted_torso: '뒤틀음',
            arched_back: '허리를 휨',
            bent_over: '등이 구부림',
            handstand: '물구나무서기',
            wallwalking: '벽을 걸음',
            leaning_back: '뒤로 기댐',
            leaning_forward: '앞으로 기댐',
            box_tie: '팔을 뒤로 묶음',
            bound_arms: '팔을 묶음',
            bound_feet: '발을 묶음',
            bound_legs: '다리를 묶음',
            bound_calves: '종아리를 묶음',
            bound_knees: '무릎을 묶음',
            bound_thighs: '허벅지를 묶음',
            bound_torso: '몸을 묶음',
            bound_wrists: '손목을 묶음',
            frogtie: '개구리처럼 묶음',
            hogtie: '팔과 다리를 뒤로 묶음',
            strappado: '사람을 묶어 장식함',
            suspension: '사람을 묶어 매달음',
            carrying_under_arm: '겨드랑이에 듬',
            princess_carry: '공주님 안기',
            "fireman's_carry": '소방관처럼 듬',
            baby_carry: '아기를 안음',
            child_carry: '아이를 듬',
            carrying_over_shoulder: '어깨 위로 듬',
            standing_on_shoulder: '어깨에 위에 슴',
            shoulder_carry: '어깨에 앉음',
            sitting_on_shoulder: '어깨에 앉음',
            piggyback: '엎고 나름',
            carrying: '어떤거를 나름',
            tail_hug: '꼬리로 껴안음',
            wing_hug: '날개로 껴안음',
            standing_on_one_leg: '서(한쪽) 있다',
            superhero_landing: '슈퍼 히어로 랜딩',
            'top-down_bottom-up': '유혹하듯이 엉덩이를 듬',
        }));
        locContainer.appendChild(genSelect('감정', {
            '': '설정 안함',
            Happy: '행복',
            surprised: '놀람',
            Giddy: '들뜸',
            smiling: '웃음',
            touched: '감동함',
            easygoing: '느긋함',
            envious: '부러운',
            gentle: '상냥한',
            sacred: '신성한',
            joyful: '즐거운',
            frightened: '질겁한',
            bright: '해맑은',
            desired: '희망한',
            Shameful: '부끄러운',
            benevolent: '자비로운',
            pretentious: '잘난 척한',
            earnest: '간절한',
            worried: '걱정한',
            scornful: '경멸하는',
            distressed: '괴로운',
            determined: '단호한',
            Embarrassed: '당황한',
            Scary: '무서운',
            expression: '무표정한',
            Crazy: '미친',
            outraged: '분노한',
            Unstable: '불안한',
            unfortunate: '불행한',
            'turn red': '붉히다',
            scoffing: '비웃는',
            miserable: '비참한',
            evil: '사악한',
            idea: '생각한',
            Upset: '속상한',
            Sad: '슬픈',
            Disappointed: '실망한',
            Serious: '심각한',
            Gloomy: '우울한',
            sorrowful: '애달픈',
            suppressed: '억눌린',
            unfair: '억울한',
            'With distaste': '억지로',
            arrogant: '오만한',
            Lonely: '외로운',
            crying: '우는',
            tearful: '울먹이는',
            suspicious: '의심한',
            despair: '절망함',
            Sleepy: '졸린',
            frustrated: '좌절함',
            Boring: '지루함',
            irritating: '짜증',
            pale: '창백함',
            Nervous: '초조함',
            Tired: '피곤함',
            Angry: '화남',
            pathetic: '한심함',
            lamented: '한탄함',
            confused: '혼란함',
            charmed: '매혹함',
            seduced: '유혹함',
            drunk: '취한',
            ecstasy: '황홀한',
            aroused: '흥분한'
        }));
        locContainer.appendChild(genSelect('입술', {
            '': '설정 안함',
            Closed_mouth: '다문다',
            Licking_lips: '핥음',
            Lip_biting: '깨뭄',
            Pursed_lips: '내밀다',
            Open_mouth: '열다',
            Spread_lips: '벌림',
            Puckered_lips: '오므림',
            Parted_lips: '가르다'
        }));
        locContainer.appendChild(genSelect('손', {
            '': '설정 안함',
            arm_behind_back: '한팔을 뒤로',
            arms_behind_back: '양팔을 뒤로',
            arm_up: '팔을 위로',
            arm_behind_head: '팔을 머리 위로',
            heart_arms: '팔로 하트',
            hand_on_ear: '손을 귀에',
            hand_on_headwear: '손을 모자에',
            adjusting_eyewear: '손을 안경에',
            hand_on_own_forehead: '손을 이마에',
            hand_on_own_head: '손을 내 머리에',
            "hand_on_another's_head": '손을 남의 머리에',
            hand_on_own_cheek: '손을 내 뺨에',
            "hand_on_another's_cheek": '손을 남의 뺨에',
            hand_on_own_face: '손을 내 얼굴',
            "hand_on_another's_face": '손을 남의 얼굴에',
            hand_on_own_chin: '손을 내 턱에',
            "hand_on_another's_chin": '손을 남의 턱에',
            hand_on_own_shoulder: '손을 내 어깨에',
            "hand_on_another's_shoulder": '손을 남의 어깨에',
            hand_on_own_chest: '손을 가슴에',
            "hand_on_another's_chest": '손을 남의 가슴에',
            breast_hold: '손으로 가슴을 쥠',
            breast_grab: '손으로 가슴을 잡음',
            breast_lift: '손으로 가슴을 듬',
            breast_poke: '손으로 가슴을 찌름',
            breast_press: '손으로 가슴을 누름',
            breast_squeeze: '손으로 가슴을 짬',
            '{belly grab}': '배를 만짐',
            groping: '손으로 가슴을 더듬음',
            hands_on_hips: '손을 엉덩이에',
            hand_on_own_ass: '양손을 엉덩이에',
            hands_on_ass: '한손을 엉덩이에',
            hand_on_own_knee: '한손을 무릎에',
            hands_on_own_knees: '양손을 무릎에',
            hand_between_legs: '손을 다리에',
            hands_on_feet: '손을 발에',
            holding_hands: '손을 손에',
            "hand_on_another's_hand": '손을 남의 손에',
            hand_in_pocket: '한손을 주머니에',
            hands_in_pockets: '양손을 주머니에',
            hand_mouth: '손을 입에',
            raised_fist: '손을 뻗음',
            salute: '손가락으로 경례함',
            shushing: '손가락을 입술에 얹음',
            waving: '손가락을 흔듬',
            interlocked_fingers: '손을 맞물림',
            own_hands_clasped: '손을 얽음',
            fist_in_hand: '손에 주먹을 쥠',
            carry_me: '손을 뻗음',
            clenched_hands: '손을 움켜쥡',
            own_hands_together: '손을 겹침',
            Whole_closed_hand: '손을 닫음',
            clenched_hand: '손을 쥡',
            cupping_hands: '손으로 무언가를 담음',
            air_quotes: '손으로 무언가를 강조함',
            noogie: '손으로 누름',
            hat_tip: '손으로 모자를 잡음',
            steepled_fingers: '손을 세음',
            pinky_swear: '손으로 약속함',
            'palm-fist_greeting': '손으로 인사함',
            fig_sign: '손으로 주먹쥠',
            power_fist: '손으로 세게 주먹쥠',
            'palm-fist_tap': '손으로 탭함',
            fist_bump: '피스트 범프',
            high_five: '하이 파이브',
            pointing: '손가락으로 가리킴',
            pointing_up: '손가락으로 위를 가리킴',
            pointing_at_self: '손가락으로 자신을 가리킴',
            pointing_at_viewer: '손가락으로 관찰자를 가리킴',
            pointing_down: '손가락으로 아래를 가리킴',
            pointing_forward: '손가락으로 앞을 가리킴',
            saturday_night_fever: '손가락으로 높이 가리킴',
            crossed_fingers: '손가락을 교차함',
            spread_fingers: '손가락을 벌림',
            reaching: '손가락을 뻗음',
            akanbe: '손가락으로 눈을 당김',
            finger_counting: '숫자를 셈',
            beckoning: '손가락으로 손짓함',
            facepalm: '손가락으로 자기 얼굴을 팸',
            open_hand: '손가락을 염',
            ohikaenasutte: '손가락으로 인사함',
            v_sign: 'V 사인',
            'two-finger_salute': '두 손가락 경례',
            fox_shadow_puppet: '여우 그림자 놀이',
            finger_gun: '손가락 총',
            finger_heart: '손가락 하트',
            money_gesture: '돈 사인',
            w_sign: 'W 사인',
            Whole_open_hand: '손가락 전체 열기',
            animal_pose: '동물 포즈',
            paw_pose: '발톱 포즈',
            horns_pose: '뿔 포즈',
            bunny_pose: '토끼 포즈',
            claw_pose: '할퀴는 포즈',
            gendou_pose: '겐도 포즈',
            archer_pose: '궁수 포즈',
            shadow_puppet: '그림자 연극',
            dojikko_pose: '도짓코 포즈',
            finger_frame: '사진 프레임',
            tsuki_ni_kawatte_oshioki_yo: '세일러문 포즈',
            victory_pose: '승리 포즈',
            'ojou-sama_pose': '아가씨 포즈',
            zombie_pose: '악당',
            villain_pose: '악당 포즈',
            hand_glasses: '안경 포즈',
            jojo_pose: '죠죠 포즈',
        }));
        locContainer.appendChild(genSelect('다리', {
            '': '설정 안함',
            leg_lift: '다리를 듬',
            folded: '다리를 잡음',
            spread_legs: '다리를 벌림',
            crossed_legs: '다리를 꼼',
            watson_cross: '서서 다리를 꼼',
            figure_four_sitting: '다리를 앉아서 껴안다',
            hugging_own_legs: '자신의 다리를 껴안음',
            leg_up: '한 다리를 위로',
            legs_up: '양 다리을 위로',
            knees_to_chest: '다리를 가슴 위로',
            legs_over_head: '다리를 머리 위로',
            outstretched_leg: '다리를 길게 뻗다',
            pigeon_pose: '다리를 뒤로 뻗다',
            split: '다리를 서서 뻗다',
            standing_split: '다리를 서서 뻗다',
            Knee_location: '무릎 자세',
            'one knee': '무릎(한쪽)을 꿇다',
            kneeling: '무릎(양쪽)을 꿇다',
            knees_together_feet_apart: '무릎을 모으고 발을 벌림',
            knees_apart_feet_together: '무릎을 벌리고 발을 발림',
            Foot_position: '발 자세',
            dorsiflexion: '발을 위쪽으로 구부림',
            crossed_ankles: '발목을 겹치다',
            'pigeon-toed': '발가락이 위를 향함',
            plantar_flexion: '발바닥이 아래로 향함',
            tiptoes: '발가락을 들고 균형잡다',
            tiptoe_kiss: '발가락을 들고 키스함'
        }));
        locContainer.appendChild(genSelect('혀', {
            '': '설정 안함',
            tongue_out: '혀를 내밀다',
            biting_tongue: '혀를 깨뭄',
            licking_stomach: '혀로 핥아서 먹음',
            licking: '혀로 핥음',
            licking_ear: '귀를 핥음',
            licking_neck: '목을 핥음',
            licking_cheek: '뺨을 핥음',
            licking_lips: '입술을 핥음',
            licking_face: '얼굴을 핥음',
            licking_hand: '손을 핥음',
            licking_foot: '발을 핥음',
            licking_arm: '팔을 핥음',
            licking_leg: '다리를 핥음',
            licking_finger: '손가락을 핥음',
            licking_toe: '발가락을 핥음',
            licking_collarbone: '쇄골을 핥음',
            licking_breast: '가슴을 핥음',
            licking_nipple: '젖꼭지를 핥음',
            licking_armpit: '겨드랑이를 핥음',
            licking_belly: '배를 핥음',
            licking_navel: '배꼽을 핥음',
            licking_thigh: '허벅지를 핥음',
            licking_ass: '엉덩이를 핥음',
            tongue_grab: '혀를 잡음',
        }));
        locContainer.appendChild(genSelect('가슴', {
            '': '설정 안함',
            'breast_awe': '가슴을 경외함',
            'breast_conscious': '가슴을 의식함',
            'breast_envy': '가슴을 질투함',
            '$breast_reduction': '가슴을 축소함',
            'bust_measuring': '가슴을 측정함',
            '$flying_button': '가슴을 팽창함',
            '$breast_expansion': '가슴을 확장함',
            'weighing_breasts': '가슴이 무거움',
            'inconvenient_breasts': '가슴이 불편함',
            'convenient_breasts': '편한 가슴',
            '$breast_suppress': '가슴을 가림',
            '$breast_press': '가슴을 누름',
            '$breast_pull': '가슴을 당김',
            'groping': '가슴을 더듬음',
            'breast_lift': '가슴을 듬',
            '$breast_punch': '가슴을 주먹으로 때림',
            '$breast_slap': '가슴을 손으로 때림',
            '$breast_sucking': '가슴을 빰',
            '$self_breast_sucking': '자신의 가슴을 빰',
            '$mutual_breast_sucking': '남의 가슴을 빰',
            '$breastfeeding': '가슴을 수유함',
            'breast_grab': '가슴을 잡음',
            '$guided_breast_grab': '가슴을 쥐게 함',
            '$breast_hold': '가슴을 쥠',
            '$breast_squeeze': '가슴을 짜냄',
            '$breast_pok': '가슴을 찌름'
        }));
        locContainer.appendChild(genSelect('시점', {
            '': '설정 안함',
            looking_at_viewer: '시점을 뷰어에',
            looking_up: '시점을 위에',
            looking_down: '시점을 아래로',
            looking_front: '시점을 앞으로',
            looking_back: '시점을 뒤로',
            looking_away: '시점을 멀리',
            looking_afar: '시점을 멀리',
            looking_outside: '시점을 밖에',
            looking_to_the_side: '시점을 측면에',
            eye_contact: '시점을 눈에',
            looking_at_hand: '시점을 손에',
            looking_through_legs: '시점을 다리에',
            looking_at_breasts: '시점을 가슴에',
            looking_at_ass: '시점을 가슴에',
            looking_at_another: '시점을 다른 사람에',
            looking_at_mirror: '시점을 거울에',
            looking_at_phone: '시점을 전화에',
            looking_over_eyewear: '시점을 안경 밖에'
        }));
        locContainer.appendChild(genSelect('배경', {
            '': '설정 안함',
            'indoors': '실내',
            'house': '집',
            'forest': '숲',
            'dungeon': '던전',
            'garden': '정원',
            'library': '도서관',
            'on_bed': '침대 위',
        }));
    }
    //복장
    {
        const clothesContainer = genFlexDiv();
        container.appendChild(genOpenClose(clothesContainer, '기본 복장'));
        clothesContainer.appendChild(genSelect('상의', {
            '': '설정 안함',
            '$topless': '상의실종',
            '$adhesive_bra': '접착 브래지어',
            '$beltbra': '벨트 브래지어',
            '$frilled_bra': '프릴 브래지어',
            '$bow_bra': '리본 브래지어',
            '$sports_bra': '스포츠 브래지어',
            '$training_bra': '트레이닝 브래지어',
            '$cupless_bra': '노출된 브래지어',
            '$shelf_bra': '노출된 브래지어',
            '$plaid_bra': '격자 무늬 브래지어',
            '$strawberry_bra': '딸기 무늬 브래지어',
            '$lace-trimmed_bra': '레이스 장식 브래지어',
            '$polka_dot_bra': '물방울 무늬 브래지어',
            '$print_bra': '인쇄한 무늬 브래지어',
            '$striped_bra': '줄무늬 브래지어',
            '$vertical-striped_bra': '세로 줄무늬 브래지어',
            '$lace_bra': '레이스 브래지어',
            '$checkered_bra': '체크 무늬 브래지어',
            'bandeau ': '가슴 가리개',
            underbust: '가슴 아래',
            crop_top: '배꼽티',
            bustier: '뷔스티에',
            blouse: '블라우스',
            'criss-cross halter': '십자형 고삐',
            camisole: '캐미솔',
            corset: '코르셋',
            'tank_top ': '탱크탑',
            'tube_top ': '튜브탑',
            halterneck: '홀터넥',
            't-shirt': '티셔츠',
            rilled_shirt: '프릴 셔츠',
            collared_shirt: '칼라 셔츠',
            dress_shirt: '드레스 셔츠',
            striped_shirt: '줄무늬 셔츠',
            sleeveless_shirt: '민소매 셔츠',
            'compression shirt': '밀착한 셔츠',
            'off-shoulder_shirt': '오픈숄더 셔츠',
        }, 96, 'usecolor'));
        clothesContainer.appendChild(genSelect('하의', {
            '': '설정 안함',
            '$no_pants': '하의 없음',
            pelvic_curtain: '골반 커튼',
            buruma: '부루마',
            bloomers: '블루머',
            chaps: '카우보이 바지',
            sarong: '파레오',
            jeans: '청바지',
            cutoff_jeans: '청반바지',
            'bell-bottoms': '무릎 아래가 넓은 바지',
            capri_pants: '발목 위까지 오는 바지',
            lowleg_pants: '엉덩이와 허벅지에 꽉 끼는 바지',
            pants_rolled_up: '발목과 무릎 사이가 접힌 바지',
            tight_pants: '몸에 꽉 끼는',
            shorts: '반바지',
            denim_shorts: '데님 반바지',
            dolphin_shorts: '돌핀 팬츠',
            lowleg_shorts: '로우레그 반바지',
            micro_shorts: '마이크로 반바지',
            bike_shorts: '자전거 번바비',
            short_shorts: '짧은 반바지',
            gym_shorts: '체육복 반바지',
            shorts_under_skirt: '치마 아래 반바지',
            skirt: '치마',
            long_skirt: '긴 치마',
            miniskirt: '짧은 치마',
            lowleg_skirt: '살짝 짧은 치마',
            microskirt: '매우 짧은 치마',
            'high-waist_skirt': '매우 넓은 치마',
            'high-low_skirt': '매우 좁은 치마',
            suspender_skirt: '멜빵이 잡는 치마',
            overall_skirt: '멜빵과 연결된 치마',
            petticoat: '발레 치마',
            pleated_skirt: '주름진 치마',
            bubble_skirt: '물방울 무늬',
            plaid_skir: '체크 치마'
        }, 95, 'usecolor'));
        clothesContainer.appendChild(genSelect('걷옷', {
            '': '설정 안함',
            sweater: '스웨터',
            'pullover': '풀오버',
            turtleneck: '터틀넥',
            sweater_vest: '스웨터 조끼',
            sweater_dress: '스웨터 드레스',
            ribbed_sweater: '선 그인 스웨터',
            aran_sweater: '털 있는 스웨터',
            'sleeveless_turtleneck': '민소매 터틀넥',
            jacket: '재킷',
            blazer: '블레이저',
            cropped_jacket: '크롭 재킷',
            letterman_jacket: '레터맨 재킷',
            safari_jacket: '사파리 재킷',
            suit_jacket: '정장 재킷',
            sukajan: '스카잔(일본 불량배)',
            trench_coat: '트레치 코트',
            coat: '코트',
            overcoat: '외투',
            raincoat: '우비',
            tailcoat: '연미복',
            duffel_coat: '더플 코트',
            long_coat: '롱코트',
            peacoat: '피코트',
            'fur_coat': '모피 코트',
            'fur-trimmed coat': '모피 장식 코트',
            apron: '앞치마',
            robe: '로브',
            bathrobe: '목욕 가운',
            open_robe: '열린 로브',
            cape: '어깨를 덮는 망토',
            capelet: '어깨만 덮는 작은 망토',
            shoulder_cape: '어깨 망토'
        }, 94, 'usecolor'));
        clothesContainer.appendChild(genSelect('한벌옷', {
            '': '설정 안함',
            $nude: '누드 / 벗음',
            '$underwear|underwear_only': '속옷만',
            gakuran: '가쿠란',
            'nontraditional miko': '개조한 무녀복',
            'school uniform': '교복',
            'military uniform': '군복',
            maid: '메이드',
            'meiji schoolgirl uniform': '메이지 여학생 교복',
            miko: '무녀복',
            tutu: '발레복',
            hazmat_suit: '방호복',
            band_uniform: '밴드복',
            hev_suit: '보호복',
            'santa costume': '산타 복장',
            'sailor (naval uniform)': '선원복',
            'serafuku (sailor uniform)': '세일러복',
            sweatshirt: '스웨트 셔츠',
            sweatpants: '운동복',
            'track suit': '운동복',
            overalls: '작업복',
            waitress: '점원복',
            gym_uniform: '체육복',
            cheerleader: '치어리더',
            'cowboy western ': '카우보이',
            habit: '교회 복장',
            cassock: '교회 복장',
            harem_outfit: '벨리댄서',
            loincloth: '원시 의복',
            suit: '정장(남성)',
            skirtsuit: '정장(여성)',
            'business suit': '신사복',
            'pant suit': '정장 바지',
            'skirt suit': '정장 치마',
            tuxedo: '턱시도',
            bikesuit: '자전거 슈트',
            'racing suit': '레이싱 슈트',
            bodysuit: '바디슈트',
            jumpsuit: '점프슈트',
            'short jumpsuit': '짧은 점프 슈트',
            pajamas: '잠옷',
            leotard: '레오타드',
            strapless_leotard: '끈 없는 레오타드',
            playboy_bunny: '플레이보이 토끼',
            armor: '갑옷',
            armored_dress: '갑옷 드레스',
            bikini_armor: '비키니 아머',
            'pilot suit': '파일럿 슈트',
            plugsuit: '플러그 슈트',
            tangzhuang: '탕좡',
            changpao: '치파오',
            'china_dress (cheongsam/qipao)': '차이나 드레스',
            dirndl: '디른들',
            fundoshi: '훈도시',
            yamakasa: '야마카사',
            hakama: '하카마',
            hakama_pants: '하카마 바지',
            hakama_skirt: '하카마 치마',
            hakama_short_skirt: '하카마 짧은 치마',
            kimono: '기모노',
            furisode: '후리소데',
            yukata: '유카타',
            'uchikake': '우치카케',
            short_kimono: '짧은 기모노',
            kimono_skirt: '기모노 스커트',
            layered_kimono: '몇 겹 겹친 기모노',
            haori: '하오리',
            happi: '반소매 하오리',
            chanchanko: '긴 하오리',
            dotera: '도테라',
            hanten: '한텐',
            nontraditional_miko: '개조한 무녀',
            sarashi: '사라시',
            Midriff_sarashi: '복부 사라시',
            Chest_sarashi: '가슴 사라시',
            Budget_sarashi: '몸통 사라시',
            Undone_sarashi: '풀린 사라시',
            tasuki: '기모노 끈',
            'fur-trimmed_dress': '모피 장식 드레스',
            'lace-trimmed_dress': '레이스 장식 드레스',
            layered_dress: '여러 겹인 드레스',
            collared_dress: '칼라 드레스',
            mermaid_dress: '인어 드레스',
            sailor_dress: '세일러 드레스',
            santa_dress: '산타 드레스',
            china_dress: '차이나 드레스',
            vietnamese_dress: '베트남',
            gown: '가운',
            negligee: '네글리제(자기 전)',
            wedding_dress: '웨딩 드레스',
            tennis_dress: '테니스 드레스',
            evening_gown: '이브닝 드레스',
            nightgown: '잠옷 드레스',
            funeral_dress: '장례식 드레스',
            cocktail_dress: '칵테일 드레스',
            coat_dress: '코트 드레스',
            long_dress: '긴 드레스',
            highleg_dress: '매우 긴',
            'high-low_skirt': '매우 짧은',
            short_dress: '짧은 드레스',
            strapless_dress: '끈 없는 드레스',
            tube_dress: '끈 없이 밀착한 드레스',
            backless_dress: '등이 노출된 드레스',
            sundress: '산책용 드레스',
            taut_dress: '팽팽한 드레스',
            trapeze_dress: '밑단이 넓은 드레스',
            'see-through_dress': '비쳐 보이는 드레스',
            flowing_dress: '흐르는 듯한 드레스',
            halter_dress: '목과 연결된',
            pencil_dress: '몸에 꼭 맞는',
            sleeveless_dress: '민소매 소매 없는',
            hobble_dress: '발목까지 내려오는 드레스',
            pleated_dress: '세로로 천이 접힌 드레스',
            'off-shoulder_dress': '어깨가 보이는',
            'half-dress': '절반으로 나뉜 드레스',
            impossible_dress: '피부가 꽉 조이는 드레스',
            side_slit: '허벅지가 갈라진 드레스',
            plaid_dress: '격자 무늬 드레스',
            flag_dress: '국기 무늬 드레스',
            ribbed_dress: '골지 문양 드레스',
            polka_dot_dress: '물방울 무늬 드레스',
            argyle_dress: '아가일 무늬 드레스',
            striped_dress: '줄무늬 드레스',
            'vertical-striped_dress': '세로 줄무늬',
            checkered_dress: '체크 무늬',
            bikini: '비키니',
            slingshot_swimsuit: '슬링샷',
            'rash_guard': '레쉬 가드',
            bikini_skirt: '비키니 스커트',
            sports_bikini: '스포츠 비키니',
            'old-fashioned_swimsuit': '옛날 수영복',
            school_swimsuit: '학생용 수영복',
            competition_swimsuit: '선수용 수영복',
            'one-piece_swimsuit': '원피스 수영복',
            dress_swimsuit: '드레스 수영복',
            'casual_one-piece_swimsuit': '캐주얼 원피스 수영복'
        }, 93, 'usecolor'));
        // clothesContainer.appendChild(genWarn('되도록 상하의/한벌옷 중 하나만 설정해주세요'))
    }
    //추가 복장
    {
        const clothesContainer = genFlexDiv();
        container.appendChild(genOpenClose(clothesContainer, '추가 복장'));
        if (true) {
            clothesContainer.appendChild(genSelect('팬티', {
                '': '설정 안함',
                '$no_panties': '팬티 없음',
                '$bow_panties': '삼각형 팬티',
                '$side-tie_panties': '끈(양쪽) 팬티',
                '$string_panties': '끈 팬티',
                '$plaid_panties': '격자 무늬',
                '$cat_panties': '고양이 무늬',
                '$bear_panties': '곰 무늬',
                '$strawberry_panties': '딸기 무늬',
                '$lace_panties': '레이스',
                '$lace-trimmed_panties': '레이스 장식',
                '$polka_dot_panties': '물방울 무늬',
                '$print_panties': '인쇄한 무늬',
                '$striped_panties': '줄무늬',
                '$vertical-striped_panties': '세로 줄무늬',
                '$checkered_pantie': '체크 무늬'
            }));
        }
        clothesContainer.appendChild(genSelect('양말', {
            '': '설정 안함',
            socks: '양말',
            kneehighs: '니 삭스(무릎)',
            'over-kneehighs': '오버 니 삭스(무릎 위)',
            thighhighs: '하이 식스(허벅지)',
            Thigh_High_Socks: '사이 하이 삭스(허벅지)',
            leggings: '레깅스',
            High_Legs: '하이레그',
            detached_leggings: '분리된 레깅스',
            pantyhose: '팬티 스타킹'
        }));
        clothesContainer.appendChild(genSelect('양말 디자인', {
            '': '설정 안함',
            plaid_legwear: '격자 무늬',
            rainbow_legwear: '무지개 무늬',
            polka_dot_legwear: '물방울 무늬',
            american_flag_legwear: '미국 국기 무늬',
            argyle_legwear: '아가일 무늬',
            camouflage_legwear: '위장 무늬',
            striped_legwear: '줄무늬',
            'diagonal-striped_legwear': '사선 줄무늬',
            'vertical-striped_legwear': '세로 줄무늬',
            checkered_legwear: '체크 무늬',
            print_legwear: '프린트 무늬',
            seamed_legwear: '선이 있는',
            'front-seamed_legwear': '앞에 선 있는',
            'back-seamed_legwear': '뒤에 선 있는',
            'side-seamed_legwear': '옆에 선 있는',
            'side-tie_legwear': '끈(한쪽)이 달린',
            stirrup_legwear: '등자가 달린',
            spiked_legwear: '스파이크 달린',
            zipper_legwear: '지퍼 달린',
            studded_legwear: '징이 박힌',
            'lace-trimmed_legwear': '레이스 장식',
            legwear_bell: '종 장식',
            ribbon_legwear: '리본 장식',
            'ribbon-trimmed_legwear': '리본 장식',
            'fur-trimmed_legwear': '모피 장식',
            'o-ring_legwear': '원형 고리 장식',
            trimmed_legwear: '장식 약말',
            'cross-laced_legwear': '끈(십자형) 장식'
        }));
        clothesContainer.appendChild(genSelect('머리 장식', {
            '': '설정 안함',
            hairband: '머리띠',
            headband: '머리띠',
            headdress: '머리 장식',
            'hair ribbon': '머리 리본',
            'forehead protector': '이마 보호대',
            sweatband: '땀띠',
            bow_hairband: '양갈래 머리띠',
            frilled_hairband: '프릴 머리띠',
            lace_hairband: '레이스 머리띠',
            'lace-trimmed_hairband': '레이스 장식 머리띠',
            lolita_hairband: '로리라 머리띠',
            spiked_hairband: '스파이크 머리티',
            striped_hairband: '줄무늬 머리띠',
            'two-tone_hairband': '투 톤 머리띠',
            winged_hairband: '날개 달린',
            'maid headdress': '메이드 머리 장식',
            fur_hat: '모피 모자',
            nightcap: '수면 모자',
            party_hat: '파티 모자',
            cloche_hat: '동그란 모자',
            peaked_cap: '뾰족한 모자',
            tricorne: '삼각뿔 모자',
            garrison_cap: '삼각형 모자',
            fez_hat: '원통형 모자',
            bowler_hat: '챙이 작은 모자',
            sun_hat: '챙이 긴 모자',
            boater_hat: '챙이 넓고 납작한 모자',
            bucket_hat: '폭이 넓고 길쭉한 모짜',
            flat_cap: '한쪽으로 기울인 모자',
            mob_cap: '머리카락을 덮는 모자',
            bandana: '두건(반다나)',
            visor_cap: '바이저 캡',
            beret: '베레모',
            veil: '베일',
            bonnet: '보닛(머리 장식)',
            beanie: '비니',
            circlet: '서클릿',
            sombrero: '솜브레로(멕시코 모자)',
            Crowns: '왕관',
            'mini crown': '작은 왕관',
            diadem: '천 왕관',
            tiara: '티아라',
            hijab: '히잡',
            nurse_cap: '간호사 모자',
            jester_cap: '광대 모자',
            kepi: '군사 모자',
            shako_cap: '군용 모자',
            campaign_hat: '군인(상관) 모자',
            tate_eboshi: '귀족 모자',
            witch_hat: '마녀 모자',
            mini_witch_hat: '작은 마녀 모자',
            wizard_hat: '마법사 모자',
            top_hat: '마술사 모자',
            mini_top_hat: '작은 마술사 모자',
            santa_hat: '산타',
            mini_santa_hat: '미니 산타',
            straw_hat: '밀짚모자',
            rice_hat: '밀짚모자(도사)',
            ajirogasa: '밀짚모자(승려)',
            aviator_cap: '비행사 모자',
            mitre: '사제 모자',
            sailor_hat: '선원 모자',
            habit: '성직자 모자',
            baseball_cap: '야구 모자',
            female_service_cap: '여성 유니폼 모자',
            chef_hat: '요리사 모자',
            toque_blanche: '빵 요리사 모자',
            flat_top_chef_hat: '접힌 요리사 모자',
            tsunokakushi: '일본 결혼식 모자',
            mortarboard_collage_graduation_hat: '졸업 모자',
            cowboy_hat: '카우보이 모자',
            deerstalker: '탐정 모자',
            fedora: '탐정 모자',
            pith_helmet: '탐험가 모자',
            tokin_hat: '텐구 모자',
            dixie_cup_hat: '해군 모자',
            bicorne: '해적 모자',
            pirate_hat: '해적 모자',
            winged_helmet: '날개 달린 헬맷',
            diving_helmet: '다이빙 헬맷',
            pickelhaube: '독일군 헬맷',
            american_football_helmet: '미식축구',
            horned_helmet: '뿔 달린 헬맷',
            baseball_helmet: '야구 헬맷',
            motorcycle_helmet: '오토바이 헬멧',
            bicycle_helmet: '자전거 헬맷'
        }, 97, 'usecolor'));
        clothesContainer.appendChild(genSelect('안경 종류', {
            '': '설정 안함',
            '3d_glasses': '3D 안경',
            'x-ray_glasses': 'X-레이 안경',
            goggles: '고글',
            monocle: '단안경',
            opera_glasses: '오페라 안경',
            funny_glasses: '재밌는 안결',
            triangular_eyewear: '반투명한 안경',
            opaque_glasses: '불투명한 안경',
            lorgnette: '손으로 잡는 안경',
            'pince-nez': '콧대에 지지하는 안경',
            diving_mask: '다이빙 안경',
            safety_glasses: '보호 안결',
            flight_goggles: '비행 고글',
            aviator_sunglasses: '비행가 안경',
            shooting_glasses: '사격 안경',
            ski_goggles: '스키 고글',
            'coke-bottle_glasses': '연구원 안경'
        }));
        clothesContainer.appendChild(genSelect('안경 색', {
            '': '설정 안함',
            'brown-Frame_colors ': '갈색',
            'red-Frame_colors ': '빨간색',
            'pink-Frame_colors ': '분홍색',
            'orange-Frame_colors ': '주황색',
            'yellow-Frame_colors ': '노란색',
            'green-Frame_colors ': '연녹색',
            'blue-Frame_colors ': '파란색',
            'purple-Frame_colors': '보라색'
        }));
        clothesContainer.appendChild(genSelect('마스크/가면', {
            '': '설정 안함',
            clown_mask: '광대 가면',
            ninja_mask: '닌자 가면',
            domino_mask: '도미노 가면',
            wrestling_mask: '레슬링',
            luchador_mask: '루차도르 가면',
            eye_mask: '안대',
            plague_doctor_mask: '역병의사 가면',
            oni_mask: '오니 마스크',
            carnival_mask: '축제 가면',
            character_mask: '캐릭터 가면',
            hockey_mask: '하키 가면',
            skull_mask: '해골 마스크',
            hyottoko_mask: '효토코 가면',
            diving_mask: '다이빙 마스크',
            gas_mask: '방독면',
            oxygen_mask: '산소 마스크',
            sleep_mask: '수면 마스크',
            surgical_mask: '수술 마스크',
            welding_mask: '용접 마스크'
        }));
        if (true) {
            clothesContainer.appendChild(genSelect('피어싱', {
                '': '설정 안함',
                $Magatama_earrings: '곡옥 귀걸이',
                $Tassel_earrings: '술이 달린 귀걸이',
                $Shell_earrings: '쉘 귀걸이',
                $Yin_yang_earrings: '음양사 귀걸이',
                $Bell_earrings: '종 귀걸이',
                $Crescent_earrings: '초승달 귀걸이',
                $Pom_pom_earrings: '털 장식 귀걸이',
                $Skull_earrings: '해골 귀걸이',
                $Flower_earrings: '꽃 귀걸이',
                $Crystal_earrings: '수정 귀걸이',
                $Snowflake_earrings: '눈송이 귀걸이',
                $Strawberry_earrings: '딸기 귀걸이',
                $Star_earrings: '별 귀걸이',
                $Spade_earrings: '스페이드 귀걸이',
                $Cross_earrings: '십자가 귀걸이',
                $Pill_earrings: '알약 귀걸이',
                $Heart_earrings: '하트 귀걸이',
                $Planet_earrings: '행성 귀걸이'
            }));
            clothesContainer.appendChild(genSelect('피어싱 위치', {
                '': '설정 안함',
                $Nose_piercing: '코 피어싱',
                '$Collarbone piercing': '배꼽 피어싱',
                $Ear_piercing: '귀 피어싱',
                $Industrial_piercing: '위쪽 귀 두 개 피어싱',
                $Eyebrow_piercing: '눈썹 피어싱',
                '$Anti-eyebrow_piercing': '눈썹 아래 피어싱',
                $Eyelid_piercing: '눈꺼풀 피어싱',
                $Tongue_piercing: '혀 피어싱',
                $Areola_piercing: '유륜 피어싱',
                $Nipple_piercing: '젖꼭지 피어싱',
                $Labia_piercing: '음순 피어링',
                $Clitoris_piercing: '클리토리스 피어싱'
            }));
        }
        clothesContainer.appendChild(genSelect('목 장신구', {
            '': '설정 안함',
            choker: '쵸커',
            ribbon_choker: '리본 쵸커',
            bolo_tie: '끈 넥타이',
            bowtie: '나비 넥타이',
            collar: '칼라',
            spiked_collar: '징이 박힌',
            studded_collar: '징이 박힌(보호용)',
            ascot: '애스콧(끝 넓은 스카프)',
            scarf: '스카프',
            lanyard: '사원증',
            neckerchief: '목도리',
            necklace: '목걸이',
            locket: '로켓',
            amulet: '팬던트',
            pentacle: '팬타클',
            flower_necklace: '꽃 목걸이',
            pendant: '진주 목걸이',
            chain_necklace: '체인 목걸이',
            magatama: '마가타마(일본 옥 목걸이)',
            neck_bell: '목의 종',
            animal_collar: '동물',
            feather_boa: '목에 장식(깃털)',
            goggles_around_neck: '목에 고글',
            headphones_around_neck: '목에 해드폰',
            stole: '목 뒤에 두르는 띠',
            jabot: '목, 옷에 달린 프릴',
            neck_ribbon: '목에 리본',
            neck_ruff: '목에 주름 장식(삐에로 장식)',
            cross_tie: '목에 맨 끈'
        }));
        clothesContainer.appendChild(genSelect('신발', {
            '': '설정 안함',
            sneakers: '운동화',
            converse: '운동화',
            high_tops: '하이탑',
            loafers: '교복 신발',
            pumps: '정장 신발',
            flats: '중국 신발',
            mary_janes: '영국 신발',
            uwabaki: '학교 실내화',
            high_heels: '하이힐',
            wedge_heels: '웨지힐',
            pointy_footwear: '뾰족한 신발',
            kiltie_loafers: '끈 달린 교복 신발',
            footwear_ribbon: '리본 달린 신발',
            'cross-laced_footwear': '끈이 달린 신발',
            platform_footwear: '두꺼운 굽 있는 신발',
            toeless_footwear: '발가락이 보이는 신발',
            winged_footwear: '발꿈치에 날개 달린 신발',
            boots: '부츠',
            knee_boots: '무릎 부츠',
            ankle_boots: '발목 부츠',
            'lace-up_boots': '발목 위 부츠',
            thigh_boots: '허벅지 부츠',
            armored_boots: '보호 부츠',
            high_heel_boots: '하이힐 부츠',
            rubber_boots: '고무 장화',
            cowboy_boots: '카우보이 부츠',
            sandals: '샌들',
            'clog sandals': '나막신 샌들',
            gladiator_sandals: '검투사 샌들',
            'cross-laced sandals': '끈이 얽힌 샌들',
            'flip-flops': '발목이 고정되지 않는 샌들',
            geta: '게다(일본 나무 샌들)',
            okobo: '오코보(일본 게이샤 샌들)',
            waraji: '와자지(일본 짚신)',
            zouri: '조리(일본 샌들)'
        }));
    }
    //초점
    {
        const effectContainer = genFlexDiv();
        container.appendChild(genOpenClose(effectContainer, '초점'));
        effectContainer.appendChild(genSelect('기본', {
            '': '설정 안함',
            male_focus: '초점을 남자에',
            female_focus: '초점을 여자에',
            front_focus: '초점을 앞쪽에',
            back_focus: '초점을 뒤쪽에',
            other_focus: '초점을 기타에'
        }));
        effectContainer.appendChild(genSelect('신체', {
            '': '설정 안함',
            eye_focus: '초점을 눈에',
            hand_focus: '초점을 손에',
            foot_focus: '초점을 발에',
            breast_focus: '초점을 가슴에',
            pectoral_focus: '초점을 가슴에',
            armpit_focus: '초점을 겨드랑이에',
            navel_focus: '초점을 배꼽에',
            thigh_focus: '초점을 허벅지에',
            ass_focus: '초점을 엉덩이에',
        }));
        effectContainer.appendChild(genSelect('영역', {
            '': '설정 안함',
            face: '얼굴만',
            portrait: '초상화',
            upper_body: '상체(얼굴~몸통)',
            lower_body: '하체(상체~하체)',
            cowboy_shot: '얼굴~허벅지만',
            feet_out_of_frame: '얼굴~발목만',
            'full body': '전신',
            wide_shot: '멀리서 전신',
            very_wide_shot: '매우 멀리서 전신'
        }));
    }
    //작화
    {
        const effectContainer = genFlexDiv();
        container.appendChild(genOpenClose(effectContainer, '작화'));
        effectContainer.appendChild(genSelect('조명효과', {
            '': '설정 안함',
            'sidelighting': '양면',
            'cinematic lighting': '시네마틱',
        }));
        effectContainer.appendChild(genSelect('화풍', {
            '': '설정 안함',
            '{game_cg}': '게임 CG',
            '{bishoujo}': '미소녀',
            '{pixel_art}': '픽셀',
            '{realistic}': '실사',
            '{semi_realistic}': '반실사',
            '{manga_realistic}': '일본식 실사',
            '{Cartoon_realistic}': '미국식 실사',
        }));
        effectContainer.appendChild(genSelect('스타일', {
            '': '설정 안함',
            '{pixiv}': '픽시브',
            '{eromanga}': '에로망가',
            'animation|anime_art_style|Japanese_animation': '애니메이션',
            '{Cartoon}': '카툰',
            '{Graphic_Novel}': '그래픽 노벨',
            '{American_cartoon}': '미국식 카툰',
            '{American_comic}': '미국 만화',
            '{unfinished}': '러프'
        }));
        effectContainer.appendChild(genSelect('장르', {
            '': '설정 안함',
            "Fantasy": "판타지",
            "Dark_Fantasy": "다크 판타지",
            "Gothic_Fantasy": "고딕 판타지",
            "Urban_Fantasy": "어반 판타지",
            "Romance_Fantasy": "로맨스 판타지",
            "Steampunk": "스팀펑크",
            "Dieselpunk": "디젤펑크",
            "Cyberpunk": "사이버펑크",
            "Arcanepunk": "아케인펑크"
        }));
        effectContainer.appendChild(genSelect('퀄향상태그', {
            '': '사용 안함',
            'lustrous skin|colorful|high resolution illustration': '사용 (주의: 극단적)'
        }));
    }
    //수인
    {
        const commonContainer = genFlexDiv();
        container.appendChild(genOpenClose(commonContainer, '수인'));
        commonContainer.appendChild(genSelect('동물귀', {
            '': '설정 안함 / 없음',
            dog_ears: '강아지',
            cat_ears: '고양이',
            bear_ears: '곰',
            raccoon_ears: '너구리',
            wolf_ears: '늑대',
            squirrel_ears: '다람쥐',
            pig_ears: '돼지',
            horse_ears: '말',
            kemonomimi_mode: '모에',
            bat_ears: '박쥐',
            deer_ears: '사슴',
            lion_ears: '사자',
            cow_ears: '소',
            sheep_ears: '양',
            fox_ears: '여우',
            goat_ears: '염소',
            monkey_ears: '원숭이',
            ferret_ears: '족제비',
            mouse_ears: '쥐',
            rabbit_ears: '토끼',
            panda_ears: '팬더',
            tiger_ears: '호랑이'
        }, 99, 'usecolor'));
        commonContainer.appendChild(genSelect('꼬리', {
            '': '설정 안함 / 없음',
            Bear_tail: '곰',
            Rabbit_tail: '토끼',
            Cat_tail: '고양이',
            Cow_tail: '소',
            Deer_tail: '사슴',
            Dog_tail: '강아지',
            Ermine_tail: '족제비',
            Fox_tail: '여우',
            Horse_tail: '말',
            Leopard_tail: '표범',
            Lion_tail: '사자',
            Monkey_tail: '원숭이',
            'Mouse_tail': '쥐',
            Pig_tail: '돼지',
            Sheep_tail: '양',
            Squirrel_tail: '다람쥐',
            Tiger_tail: '호랑이',
            Wolf_tail: '늑대'
        }, 100, 'usecolor'));
    }
    //행위
    //bbw
    if (localStorage.getItem('x-plugin-mode-bbw') === 'able') {
        const bbwContainer = genFlexDiv();
        container.appendChild(genOpenClose(bbwContainer, 'BBW'));
        bbwContainer.appendChild(genSelect('기본 체형', {
            '': '마름',
            '{curvy}': '글래머',
            '{plump}': '통통',
            '{fat}': '뚱뚱',
            '{obese}': '비만'
        }));
        bbwContainer.appendChild(genSelect('뱃살', {
            '': '체형대로',
            'thin stomach': '없음',
            'slender stomach': '보통',
            'heavy stomach': '꽤',
            'chubby stomach': '조금 많이',
            'big belly|{chubby stomach}': '많이',
            'big belly|{hyper pregnant}|{{chubby stomach}}': '매우 많이',
        }));
        bbwContainer.appendChild(genSelect('허리', {
            '': '체형대로',
            'thin waist ': '없음',
            'slender waist ': '보통',
            'thick waist': '조금',
            'chubby waist ': '조금 많이',
        }));
        bbwContainer.appendChild(genSelect('살 표현 추가', {
            '': '미사용',
            'fat rolls|muffin top': '사용'
        }));
        bbwContainer.appendChild(genSelect('가슴', {
            '': '설정 안함',
            flat_chest: '초빈유',
            small_breasts: '빈유',
            medium_breasts: '보통',
            large_breasts: '큼',
            huge_breasts: '거유',
            gigantic_breasts: '초거유'
        }, -2));
        bbwContainer.appendChild(genSelect('살 삐져나옴', {
            '': '없음',
            'crop_top': '있음',
        }));
        bbwContainer.appendChild(genSelect('옷 찢어짐', {
            '': '없음',
            'torn clothes': '있음',
        }));
        bbwContainer.appendChild(genSelect('엉덩이', {
            '': '강조하지 않기',
            'flat_ass': '강조하기 (작은 엉덩이)',
            'huge_ass': '강조하기 (큰 엉덩이)',
        }));
        bbwContainer.appendChild(genSelect('음식', {
            '': '없음',
            'holding_food': '듬',
            'eating': '먹음',
            'holding_food|eating': '둘다',
        }));
        bbwContainer.appendChild(genSelect('땀', {
            '': '없음',
            'sweat|sweating_profusely|wet clothes|wet shirt': '있음 (복장 있음)',
            'sweat|sweating_profusely': '있음 (복장 없음)',
            'sweat|sweating_profusely|wet clothes|wet shirt|steam': '있음 + 파오운 (복장 있음)',
            'sweat|sweating_profusely|steam': '있음 + 파오운 (복장 없음)',
        }));
    }
    if (!document.querySelector('#x-plugin-container')) {
        document.body.appendChild(container);
    }
}
function handleMenu(ele) {
    ele.onclick = () => {
        if (mode === 0) {
            mode = 1;
        }
        else {
            mode = 0;
        }
    };
}
main();

})();