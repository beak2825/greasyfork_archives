// ==UserScript==
// @name         Kor더히로바
// @namespace
// @version      0.025
// @description  동더히로바 한국어 번역
// @author       응애나애기태고러
// @match        https://donderhiroba.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donderhiroba.jp
// @grant        none
// @namespace babytaikoer
// @downloadURL https://update.greasyfork.org/scripts/461684/Kor%EB%8D%94%ED%9E%88%EB%A1%9C%EB%B0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/461684/Kor%EB%8D%94%ED%9E%88%EB%A1%9C%EB%B0%94.meta.js
// ==/UserScript==

var url = new URL(window.location.href);

if (url.pathname == '/login.php') {//동더히로바 로?고
    if (document.querySelector('img').src == 'image/sp/640/top_16_640.png?dt=20200324') {
        document.querySelector('img').src = 'image/sp/640/top_16_640.png?dt=20200324'
    }

    //공지사항
    document.querySelector(`div#oshirase h2`).innerText = `공지다 쿵!`;




    //로그인
    var loginBtn = document.querySelector(`div#login`);
    loginBtn.previousElementSibling.innerHTML =
        `이「로그인」버튼을 눌러<br>동더히로바에 들어갈 수 있습니다.<br>`;

    loginBtn.nextElementSibling.innerHTML =
        `「동더히로바」를 이용할 때 에는、<br>
    <a href="./other_agreement.php" class="link_str">이용약관(필독)</a>에 동의해 주시기 바랍니다。
    <br><br>
    You must read and agree to these 
    <a href="./other_agreement.php" class="link_str">terms of service</a> before using Donder Hiroba.`;

    /*로그인 버튼 바꾸기
    loginBtn.querySelector(`img`).src = ``;
    **/




    //동더히로바 소개
    var otherBtns = loginBtn.nextElementSibling.nextElementSibling;
    otherBtns.querySelectorAll(`div`)[1].innerText = `동더히로바에서 할 수 있는 일을 소개할게!`;
    /*이거 이미지도 변경
    otherBtns.querySelectorAll(`div`)[0].querySelector(`img`).src = ``;
    **/
    //기타 버튼 바꾸기
    makeNewOtherBtns(otherBtns);




    //기타 버튼 바꾸는 함수
    function makeNewOtherBtns(element) {
        var otherBtnLinks = [
            'http://id.banapassport.net/entryInit.php?ptl_sv=nbgi_taiko&ptl_prev=https%3A%2F%2Fdonderhiroba.jp%2Flogin.php&ptl_error=https%3A%2F%2Fdonderhiroba.jp%2Flogin.php',
            'https://bandainamco-am.co.jp/privacy/',
            'https://account.bandainamcoid.com/account.html?client_id=nbgi_taiko',
            './other_faq.php'
        ];
        var otherBtnTexts = [
            `반다이남코 ID 무료 사용자 등록`,
            `개인정보 보호정책`,
            `프라이버시 옵션`,
            `질문·문의`
        ]
        element.querySelectorAll(`div.image_base`).forEach(e => { e.remove() });
        for (i = 0; i < 4; i++) {
            var newOtherBtn = document.createElement(`div`);
            newOtherBtn.setAttribute(`class`, `image_base`);
            //스타일
            newOtherBtn.style.marginTop = `20px`;
            newOtherBtn.style.width = `250px`;
            newOtherBtn.style.height = `30px`;
            newOtherBtn.style.backgroundImage = `url(image/sp/640/btn_p_04_640.png)`
            newOtherBtn.style.backgroundSize = `100% 40px`;
            newOtherBtn.style.cursor = `pointer`;
            newOtherBtn.style.color = `#FFFFFF`;
            newOtherBtn.style.paddingTop = '10px';
            //링크
            if (i == 1) {
                newOtherBtn.addEventListener(`click`, function () {
                    window.open(otherBtnLinks[1]);
                })
            }
            else {
                newOtherBtn.addEventListener(`click`, function () {
                    location.href(otherBtnLinks[i]);
                })
            }
            //내용
            newOtherBtn.innerText = otherBtnTexts[i];
            element.appendChild(newOtherBtn);
        }
    }
}




else if (url.pathname == '/login_select.php') {
    //동더히로바 로?고
    if (document.querySelector('img').src == 'image/sp/640/top_16_640.png?dt=20200324') {
        document.querySelector('img').src = 'image/sp/640/top_16_640.png?dt=20200324'
    }

    //맨 위에 변경
    var cardNumber = Number(document.querySelectorAll(`header div div`)[1].querySelector(`h1`).innerText.replace(/[^0-9]/g, ``));
    document.querySelectorAll(`header div div`)[1].querySelector(`h1`).innerText = `카드등록 (` + cardNumber + `장등록중)`;


    //내용 변경
    document.querySelectorAll(`div#content h2`)[0].innerText = `카드 등록 및 변경`;
    document.querySelectorAll(`div#content div div`)[0].innerHTML =
        `
게임 데이터를 열람하는 카드를
<br>
등록·변경합니다.
`;
    document.querySelectorAll(`div#content h2`)[1].innerText = `카드 신규 등록`;
    if (document.querySelectorAll(`div#content h2`)[1].nextElementSibling.innerHTML == `\n\t\t\tカードの登録上限に達しているため<br>\n\t\t\t新たなカードは登録できません。\n\t\t`) {
        document.querySelectorAll(`div#content h2`)[1].nextElementSibling.innerHTML = `카드를 최대 등록 개수만큼<br>등록하셨기 때문에,<br>새로운 카드를 등록할 수 없습니다.`;
    }
    document.querySelectorAll(`div#content div div`)[2].innerHTML =
        `
▼액세스 코드 입력
			<form name="card_add" id="card_add" method="post" action="card_add.php" onsubmit="return check()">
				<input type="text" id="accessCode" name="accessCode" maxlength="20" style="ime-mode:disabled;width:200px;"><br>
				※입력 예:01234567890123456789
				<input type="hidden" id="_tckt" name="_tckt" value="d3f595aebf9d672a905021e1e6ebcb8b">
				<div style="height:40px;width:284px;margin-top:20px;" class="buttonParentArea" onclick="check()">
					<img src="image/sp/640/btn_b_03_640.png" class="buttonImage">
					<div style="top:12px;" class="lableArea">
						<div class="buttonLabel shadowLabel">카드 등록</div>
					</div>
				</div>
			</form>
`
        ;
    //바나패스가 뭐예요?
    var banapassDiv = document.createElement('div');
    banapassDiv.innerHTML = `
<div style="height:28px;width:284px;margin-bottom:20px;padding-top:12px;background-Image:url(image/sp/640/btn_p_04_640.png);background-size:100% 40px;text-align:center" class="buttonParentArea buttonLabel shadowLabel">
바나패스가 뭐예요?
</div>
`;
    banapassDiv.addEventListener(`click`, function () { window.open(`https://banapass.net/`) });
    document.querySelector(`div#content div a`).remove();
    document.querySelector(`div#content div ul`).before(banapassDiv);
    //카드 정보 번역
    document.querySelectorAll(`div#content div ul`)[0].querySelectorAll(`li.cardSelect`).forEach((e) => {
        if (e.querySelector(`div div#mydon_area div p`)) {
            e.querySelector(`div div#mydon_area div p`).innerText = e.querySelector(`div div#mydon_area div p`).innerText.replace(`太鼓番`, `북번호`);
            e.querySelectorAll(`div`)[5].innerHTML = e.querySelectorAll(`div`)[5].innerHTML.replace(`アクセスコード：`, `액세스 코드:`);
            e.querySelectorAll(`div`)[8].innerHTML = e.querySelectorAll(`div`)[8].innerHTML.replace(`ログイン`, `로그인`)
        }
        else {
            e.querySelectorAll(`div.loginThumbArea div`)[1].innerHTML = e.querySelectorAll(`div.loginThumbArea div`)[1].innerHTML.replace(`アクセスコード：`, `액세스 코드:`);
            e.querySelectorAll(`div.loginThumbArea div`)[5].innerHTML =
                `
			※태고의 달인에서의 플레이 기록이 없기 때문에,<br>
			데이터를 열람할 수 없습니다.<br>
			데이터를 열람하기 위해서는 1회 이상<br>
			플레이해야 합니다.
		`;
        }
    })



    //맨 밑에 안내문? 번역
    var guide = document.querySelector(`div#content div ul`).nextElementSibling;
    guide.querySelectorAll(`li`)[0].innerText = `카드는 최대 3장까지 등록할 수 있습니다.`;
    guide.querySelectorAll(`li`)[1].innerText = `카드를 등록하기 위해서는 먼저 온라인 상태의 태고의 달인 기체에서 플레이해야 합니다.`;
    guide.querySelectorAll(`li`)[2].innerText = `등록한 카드는 반다이 남코  사이트에도 자동으로 등록되어 카드 분실 시 새 카드로 데이터를 이전할 수 있는 서비스 등을 받을 수 있습니다.`;







    //카드 등록 숫자가 이?상
    function check() {
        if ($("#accessCode").val().length == 20) {
            document.getElementById('card_add').submit();
        } else {
            alert("올바른 액세스 코드를 입력해주십시오.");
            return false;
        }
    }
}




else if (url.pathname == '/index.php' || url.pathname == '' || url.pathname == '/') {//동더히로바 로?고
    if(document.querySelector('img').src == 'image/sp/640/top_16_640.png?dt=20200324'){
        document.querySelector('img').src = 'image/sp/640/top_16_640.png?dt=20200324'
    }
    
    //공지사항
    document.querySelector(`div#oshirase h2`).innerText = `공지다 쿵!`;
    replaceHTML(document.querySelector(`#oshirase`), `以前のお知らせ`, `이전의 공지 `);
    
    
    /* 마이메뉴 이미지 변경
    document.querySelector(`div#oshirase`).nextElementSibling.querySelector(`img`).src = ``;
    **/
    
    
    
    //나라 지역명, 북 번호 번역
    var countryNameList = [
        {
            "value": "NON",
            "jpnCountryName": "未設定",
            "korCountryName": "미정"
        },
        {
            "value": "JPN",
            "jpnCountryName": "日本",
            "korCountryName": "일본"
        },
        {
            "value": "TWN",
            "jpnCountryName": "台湾",
            "korCountryName": "대만"
        },
        {
            "value": "KOR",
            "jpnCountryName": "韓国",
            "korCountryName": "한국"
        },
        {
            "value": "MYS",
            "jpnCountryName": "マレーシア",
            "korCountryName": "말레이시아"
        },
        {
            "value": "HKG",
            "jpnCountryName": "香港",
            "korCountryName": "홍콩"
        },
        {
            "value": "MAC",
            "jpnCountryName": "マカオ",
            "korCountryName": "마카오"
        },
        {
            "value": "SGP",
            "jpnCountryName": "シンガポール",
            "korCountryName": "싱가포르"
        },
        {
            "value": "AUS",
            "jpnCountryName": "オーストラリア",
            "korCountryName": "호주"
        },
        {
            "value": "NZL",
            "jpnCountryName": "ニュージーランド",
            "korCountryName": "뉴질랜드"
        },
        {
            "value": "VNM",
            "jpnCountryName": "ベトナム",
            "korCountryName": "베트남"
        },
        {
            "value": "IND",
            "jpnCountryName": "インド",
            "korCountryName": "인도"
        },
        {
            "value": "IDN",
            "jpnCountryName": "インドネシア",
            "korCountryName": "인도네시아"
        },
        {
            "value": "THA",
            "jpnCountryName": "タイ",
            "korCountryName": "태국"
        },
        {
            "value": "PHL",
            "jpnCountryName": "フィリピン",
            "korCountryName": "필리핀"
        },
        {
            "value": "KHM",
            "jpnCountryName": "カンボジア",
            "korCountryName": "캄보디아"
        },
        {
            "value": "BRN",
            "jpnCountryName": "ブルネイ",
            "korCountryName": "브루네이"
        },
        {
            "value": "LKA",
            "jpnCountryName": "スリランカ",
            "korCountryName": "스리랑카"
        },
        {
            "value": "MMR",
            "jpnCountryName": "ミャンマー",
            "korCountryName": "미얀마"
        }
    ];
    countryNameList.forEach(function(e){
        if(document.querySelectorAll('.detail p')[0].innerText.includes(e.jpnCountryName)){
            document.querySelectorAll('.detail p')[0].innerText = document.querySelectorAll('.detail p')[0].innerText.replace(`国・地域`, `국가·지역`).replace(e.jpnCountryName, e.korCountryName);
        }
    })
    document.querySelectorAll('.detail p')[1].innerText = document.querySelectorAll('.detail p')[1].innerText.replace(`太鼓番`, `북번호`);
    
    
    
    //동메달?
    var donMedal = document.querySelector(`.total_score`).nextElementSibling;
    if(donMedal.innerText.includes('どんメダル')){
        donMedal.querySelector('div').innerHTML = donMedal.querySelector('div').innerHTML.replace('どんメダル', `동메달 `);
        if(donMedal.innerText.includes(`春`)){
            replaceHTML(donMedal, `春`, ` 봄`);
        };
        if(donMedal.innerText.includes(`夏`)){
            replaceHTML(donMedal, `夏`, ` 여름`);
        };
        if(donMedal.innerText.includes(`秋`)){
            replaceHTML(donMedal, `秋`, ` 가을`);
        };
        if(donMedal.innerText.includes(`冬`)){
            replaceHTML(donMedal, `冬`, ` 겨울`);
        };
    }
    
    
    
    //마이버튼 번역
    document.querySelectorAll(`.mydon_button_area div.buttonParentArea`)[0].innerHTML = document.querySelectorAll(`.mydon_button_area div.buttonParentArea`)[0].innerHTML.replace(`マイページ`, `마이페이지`);
    document.querySelectorAll(`.mydon_button_area div.buttonParentArea`)[1].innerHTML = document.querySelectorAll(`.mydon_button_area div.buttonParentArea`)[1].innerHTML.replace(`自分の履歴`, `자신의 기록`);
    document.querySelectorAll(`.mydon_button_area div.buttonParentArea`)[2].innerHTML = document.querySelectorAll(`.mydon_button_area div.buttonParentArea`)[2].innerHTML.replace(`スコアデータ`, `스코어데이터`).replace(`閲覧`,`열람`);
    
    
    
    //단위도장 있으면 이미지 변경
    if(document.querySelector('.button_area.clearfix .bunkatsu_1 img')){
        document.querySelector('.button_area.clearfix .bunkatsu_1 img').src = 'image/sp/640/banner_dani_640.png';
    }
    
    
    
    //친구 리스트 번역
    document.querySelectorAll('div#friendmenu img')[0].src = 'image/sp/640/obi_friend_640.png';
    replaceHTML(document.querySelectorAll('div#friendmenu div#news div')[0], `ニュース`, `친구`);
    
    //친구 업적 변역
    newsTranslate();
    
    //친구 버튼
    document.querySelector('div#friendmenu').querySelectorAll('div')[2].querySelectorAll('div').forEach(function(e){
        if(e.innerHTML.includes(`フレンド一覧`)){
            replaceHTML(e,`フレンド一覧`,`친구 목록`);
        }
        else if(e.innerHTML.includes(`ユーザー検索`)){
            replaceHTML(e,`ユーザー検索`,`사용자 검색`);
        }
        else if(e.innerHTML.includes(`大会`)){
            replaceHTML(e,`大会`,`대회`);
            replaceHTML(e,`挑戦状`,`도전장`)
        }
    });
    
    //다른 메뉴
    document.querySelector('#footerothermenu').querySelector(`img`).src = `image/sp/640/obi_other_640.png`;
    document.querySelector('#footerothermenu').querySelector(`.buttonArea`).querySelectorAll('.buttonParentArea').forEach(function(e){
        if(e.innerText.includes('工事中')){
            replaceHTML(e, `工事中だドン！`, `공사 중이다쿵!`);
            replaceHTML(e, `工事中`, `공사 중`);
        }
        else if(e.innerText.includes(`ご質問`)){
            replaceHTML(e, `ご質問`, `질문`);
            replaceHTML(e, `お問合わせ`, `문의`)
        }
    })
    var linkToOther = document.querySelector('#footerothermenu').querySelector(`.textlinkarea`);
    replaceHTML(linkToOther,`◇利用規約(必読)`,`◇이용약관(필독)`);
    replaceHTML(linkToOther,`◇プライバシーポリシー`,`◇개인정보 보호정책`);
    replaceHTML(linkToOther,`◇プライバシーオプション`,`◇프라이버시 옵션`);
    replaceHTML(linkToOther,`◇バンダイナムコパスポート設定`,`◇반다이 남코 바나패스 설정`);
    replaceHTML(linkToOther,`◇ユーザー切り替え`,`◇사용자 전환`);
    replaceHTML(linkToOther,`◇ひろばを出る(ログアウト)`,`◇동더히로바 나가기 (로그아웃)`);
    replaceHTML(linkToOther,`ひろばを出ますか？`,`히로바를 나오시겠습니까?`);

    
}




else if (url.pathname == '/news_list.php') {//뉴스 번역
    //뉴스 번역
    newsTranslate();

    //맨 위에 변경
    document.querySelector(`header`).querySelector(`h1`).innerText = `소식`

    /* 마이메뉴 이미지 변경
    document.querySelector(`div#news`).nextElementSibling.querySelector(`img`).src = ``;
    **/


    //마이버튼 번역
    document.querySelectorAll(`.button_area div.buttonParentArea`)[0].innerHTML = document.querySelectorAll(`.button_area div.buttonParentArea`)[0].innerHTML.replace(`マイページ`, `마이페이지`);
    document.querySelectorAll(`.button_area div.buttonParentArea`)[1].innerHTML = document.querySelectorAll(`.button_area div.buttonParentArea`)[1].innerHTML.replace(`自分の履歴`, `자신의 기록`);
    document.querySelectorAll(`.button_area div.buttonParentArea`)[2].innerHTML = document.querySelectorAll(`.button_area div.buttonParentArea`)[2].innerHTML.replace(`スコアデータ`, `스코어데이터`).replace(`閲覧`, `열람`);

    //친구버튼 이미지
    document.querySelectorAll('div#friendmenu img')[0].src = 'image/sp/640/obi_friend_640.png';

    //친구 버튼
    document.querySelector('div#friendmenu').querySelectorAll('div')[0].querySelectorAll('div').forEach(function (e) {
        if (e.innerHTML.includes(`フレンド一覧`)) {
            replaceHTML(e, `フレンド一覧`, `친구 목록`);
        }
        else if (e.innerHTML.includes(`ユーザー検索`)) {
            replaceHTML(e, `ユーザー検索`, `사용자 검색`);
        }
        else if (e.innerHTML.includes(`大会`)) {
            replaceHTML(e, `大会`, `대회`);
            replaceHTML(e, `挑戦状`, `도전장`)
        }
    });

    //기타 메뉴 이미지
    document.querySelector('#footerothermenu').querySelector(`img`).src = `image/sp/640/obi_other_640.png`;

    //기타 메뉴
    document.querySelector('#footerothermenu').querySelector(`.buttonArea`).querySelectorAll('.buttonParentArea').forEach(function (e) {
        if (e.innerText.includes('工事中')) {
            replaceHTML(e, `工事中だドン！`, `공사 중이다쿵!`);
            replaceHTML(e, `工事中`, `공사 중`);
        }
        else if (e.innerText.includes(`ご質問`)) {
            replaceHTML(e, `ご質問`, `질문`);
            replaceHTML(e, `お問合わせ`, `문의`)
        }
    })
    var linkToOther = document.querySelector('#footerothermenu').querySelector(`.textlinkarea`);
    replaceHTML(linkToOther, `◇利用規約(必読)`, `◇이용약관(필독)`);
    replaceHTML(linkToOther, `◇プライバシーポリシー`, `◇개인정보 보호정책`);
    replaceHTML(linkToOther, `◇プライバシーオプション`, `◇프라이버시 옵션`);
    replaceHTML(linkToOther, `◇バンダイナムコパスポート設定`, `◇반다이 남코 바나패스 설정`);
    replaceHTML(linkToOther, `◇ユーザー切り替え`, `◇사용자 전환`);
    replaceHTML(linkToOther, `◇ひろばを出る(ログアウト)`, `◇동더히로바 나가기 (로그아웃)`);
    replaceHTML(linkToOther, `ひろばを出ますか？`, `히로바를 나오시겠습니까?`)

    //다음 페이지 계속 불러오기
    document.querySelector('ul#pager a').remove();

    var currentPage = 2;
    function loadNextPage(page) {
        document.querySelector('div#loading').style.display = "block";
        document.querySelector('ul#pager li div a').style.display = "none";
        $.ajax({
            type: "GET",
            url: "news_list.php?page=" + page,
            dataType: "text",
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            error: function () {
                loadNextPage(page);
            },
            success: function (data) {
                var newsData = document.createElement(`div`);
                newsData.innerHTML = data;
                var newsDataUl = newsData.querySelector(`div#news ul.newsThumbList`).querySelectorAll('li');
                document.querySelector('div#loading').style.display = "none";
                for (i = 0; i < newsDataUl.length; i++) {
                    document.querySelector(`div#news ul.newsThumbList`).appendChild(newsDataUl[i])
                }
                currentPage = currentPage + 1;
                newsTranslate();
                document.querySelector('ul#pager li div a').style.display = "inline";
            }

        });

    }

    var loadBtn = document.createElement('a');
    loadBtn.innerText = `더 보기`;
    loadBtn.style.color = `#0099FF`;
    loadBtn.style.cursor = `pointer`;
    loadBtn.addEventListener(`click`, function () {
        loadNextPage(currentPage);
    });
    document.querySelector('ul#pager li div').append(loadBtn);







}


else if (url.pathname == '/mypage_top.php'){//맨 위에
    document.querySelector(`header`).querySelector(`h1`).innerText = `마이페이지`;
    
    //나라 이름
    var countryNameList = [
        {
            "value": "NON",
            "jpnCountryName": "未設定",
            "korCountryName": "미정"
        },
        {
            "value": "JPN",
            "jpnCountryName": "日本",
            "korCountryName": "일본"
        },
        {
            "value": "TWN",
            "jpnCountryName": "台湾",
            "korCountryName": "대만"
        },
        {
            "value": "KOR",
            "jpnCountryName": "韓国",
            "korCountryName": "한국"
        },
        {
            "value": "MYS",
            "jpnCountryName": "マレーシア",
            "korCountryName": "말레이시아"
        },
        {
            "value": "HKG",
            "jpnCountryName": "香港",
            "korCountryName": "홍콩"
        },
        {
            "value": "MAC",
            "jpnCountryName": "マカオ",
            "korCountryName": "마카오"
        },
        {
            "value": "SGP",
            "jpnCountryName": "シンガポール",
            "korCountryName": "싱가포르"
        },
        {
            "value": "AUS",
            "jpnCountryName": "オーストラリア",
            "korCountryName": "호주"
        },
        {
            "value": "NZL",
            "jpnCountryName": "ニュージーランド",
            "korCountryName": "뉴질랜드"
        },
        {
            "value": "VNM",
            "jpnCountryName": "ベトナム",
            "korCountryName": "베트남"
        },
        {
            "value": "IND",
            "jpnCountryName": "インド",
            "korCountryName": "인도"
        },
        {
            "value": "IDN",
            "jpnCountryName": "インドネシア",
            "korCountryName": "인도네시아"
        },
        {
            "value": "THA",
            "jpnCountryName": "タイ",
            "korCountryName": "태국"
        },
        {
            "value": "PHL",
            "jpnCountryName": "フィリピン",
            "korCountryName": "필리핀"
        },
        {
            "value": "KHM",
            "jpnCountryName": "カンボジア",
            "korCountryName": "캄보디아"
        },
        {
            "value": "BRN",
            "jpnCountryName": "ブルネイ",
            "korCountryName": "브루네이"
        },
        {
            "value": "LKA",
            "jpnCountryName": "スリランカ",
            "korCountryName": "스리랑카"
        },
        {
            "value": "MMR",
            "jpnCountryName": "ミャンマー",
            "korCountryName": "미얀마"
        }
    ];
    countryNameList.forEach(function(e){
        if(document.querySelectorAll('.detail p')[0].innerText.includes(e.jpnCountryName)){
            document.querySelectorAll('.detail p')[0].innerText = document.querySelectorAll('.detail p')[0].innerText.replace(`国・地域`, `국가·지역`).replace(e.jpnCountryName, e.korCountryName);
        }
    })
    document.querySelectorAll('.detail p')[1].innerText = document.querySelectorAll('.detail p')[1].innerText.replace(`太鼓番`, `북번호`);
    
    //동메달?
    var donMedal = document.querySelector(`.total_score`).nextElementSibling;
    if(donMedal.innerText.includes('どんメダル')){
        donMedal.querySelector('div').innerHTML = donMedal.querySelector('div').innerHTML.replace('どんメダル', `동메달 `);
        if(donMedal.innerText.includes(`春`)){
            replaceHTML(donMedal, `春`, ` 봄`);
        };
        if(donMedal.innerText.includes(`夏`)){
            replaceHTML(donMedal, `夏`, ` 여름`);
        };
        if(donMedal.innerText.includes(`秋`)){
            replaceHTML(donMedal, `秋`, ` 가을`);
        };
        if(donMedal.innerText.includes(`冬`)){
            replaceHTML(donMedal, `冬`, ` 겨울`);
        };
    }
    
    //그 밑에 버튼
    replaceHTML(sa(`.mypage_menu .buttonParentArea.bunkatsu_2`)[0], `名前変更`, `이름 변경`);
    replaceHTML(sa(`.mypage_menu .buttonParentArea.bunkatsu_2 .lableArea`)[1], `きせかえ`, `의상 변경`);
    replaceHTML(sa(`.mypage_menu .buttonParentArea.bunkatsu_2 .lableArea`)[2], `称号編集`, `칭호 편집`);
    replaceHTML(sa(`.mypage_menu .buttonParentArea.bunkatsu_2 .lableArea`)[3], `ごほうび一覧`, `보상 목록`);
    
    //이름 변경 설정
    /*이거 하지마
    var blockDiv = document.createElement(`div`);
    blockDiv.innerHTML = `<div class="ui-widget-overlay" style="width: 100%; height: 100%; z-index: 1001; display:none"></div>`;
    s(`body`).append(blockDiv);
    */
    replaceHTML(sa(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all .buttonDialog`)[0], `これでOK！`, `이걸로 OK!`);
    replaceHTML(sa(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all .buttonDialog`)[2], `キャンセル`, `취소하기`);
    //(이름설정)
    s(`#newName`).value = sa(`#mydon_area div`)[2].innerText;
    replaceHTML(s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all p`), `新しい名前を入力するドン！`, `새 이름을 입력해라 동!`);
    s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all .errorArea`).style.display = `none`;
    sa(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all .buttonDialog`)[0].addEventListener(`click`, function(){
        rename();
    });
    sa(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all .buttonDialog`)[1].addEventListener(`click`, function(){
        rename();
    });
    function rename(){
        $.ajax({
            type:"POST",
            url:"/ajax/change_mydon_profile.php",
            data:$(`#renameForm`).serialize(),
            success:function(data){
                alert(`이름이 변경되었습니다.`);
                sa(`#mydon_area div`)[2].innerText = s(`#newName`).value;
                s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.display = `none`;
                s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.zIndex = 1000;
            },
            error:function(err){
                console.log('err');
            }
        }
        )
    }
    s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.width = 280 + "px";
    //창이 무빙맨
    s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.top = (window.innerHeight - 182) / 2 + "px";
    s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.left = (window.innerWidth - 280 - 23) / 2 + "px";
    window.addEventListener(`resize`, function(){
        s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.top = (window.innerHeight - 182) / 2 + "px";
        s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.left = (window.innerWidth - 280 - 23) / 2 + "px";
    })
    //버튼에 역할 할당
    sa(`.mypage_menu .buttonParentArea.bunkatsu_2`)[0].addEventListener(`click`, function(){
        s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.display = `block`;
        s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.zIndex = 1002;
        /*
        s(`.ui-widget-overlay`).style.display = `block`;*/
    })
    sa(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all .buttonDialog`)[2].addEventListener(`click`, function(){
        s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.display = `none`;
        s(`.ui-dialog.ui-widget.ui-widget-content.ui-corner-all`).style.zIndex = 1000;
        /*
        s(`.ui-widget-overlay`).style.display = `none`;*/
    })
    
    //마이버튼 번역
    replaceHTML(sa(`.button_area.clearfix div.buttonParentArea`)[0], `マイページ`, `마이페이지`);
    replaceHTML(sa(`.button_area.clearfix div.buttonParentArea`)[1], `自分の履歴`, `자신의 기록`);
    replaceHTML(sa(`.button_area.clearfix div.buttonParentArea`)[2], `スコアデータ`, `스코어데이터`);
    replaceHTML(sa(`.button_area.clearfix div.buttonParentArea`)[2], `閲覧`,`열람`);
    
    //친구 버튼
    document.querySelector('div#friendmenu').querySelectorAll('div')[0].querySelectorAll('div').forEach(function(e){
        if(e.innerHTML.includes(`フレンド一覧`)){
            replaceHTML(e,`フレンド一覧`,`친구 목록`);
        }
        else if(e.innerHTML.includes(`ユーザー検索`)){
            replaceHTML(e,`ユーザー検索`,`사용자 검색`);
        }
        else if(e.innerHTML.includes(`大会`)){
            replaceHTML(e,`大会`,`대회`);
            replaceHTML(e,`挑戦状`,`도전장`)
        }
    });
    
    //다른 메뉴
    document.querySelector('#footerothermenu').querySelector(`img`).src = `image/sp/640/obi_other_640.png`;
    document.querySelector('#footerothermenu').querySelector(`.buttonArea`).querySelectorAll('.buttonParentArea').forEach(function(e){
        if(e.innerText.includes('工事中')){
            replaceHTML(e, `工事中だドン！`, `공사 중이다쿵!`);
            replaceHTML(e, `工事中`, `공사 중`);
        }
        else if(e.innerText.includes(`ご質問`)){
            replaceHTML(e, `ご質問`, `질문`);
            replaceHTML(e, `お問合わせ`, `문의`)
        }
    })
    var linkToOther = document.querySelector('#footerothermenu').querySelector(`.textlinkarea`);
    replaceHTML(linkToOther,`◇利用規約(必読)`,`◇이용약관(필독)`);
    replaceHTML(linkToOther,`◇プライバシーポリシー`,`◇개인정보 보호정책`);
    replaceHTML(linkToOther,`◇プライバシーオプション`,`◇프라이버시 옵션`);
    replaceHTML(linkToOther,`◇バンダイナムコパスポート設定`,`◇반다이 남코 바나패스 설정`);
    replaceHTML(linkToOther,`◇ユーザー切り替え`,`◇사용자 전환`);
    replaceHTML(linkToOther,`◇ひろばを出る(ログアウト)`,`◇동더히로바 나가기 (로그아웃)`);
    replaceHTML(linkToOther,`ひろばを出ますか？`,`히로바를 나오시겠습니까?`);
    
    
    //좋아하는 곡
    replaceHTML(sa(`.subtitleMypage`)[0], `大好きな曲`, `좋아하는 곡`);
    replaceHTML(sa(`.mypageInfoArea`)[0], `設定する`, `설정하기`);
    
    replaceHTML(sa(`.subtitleMypage`)[1], `お気に入りの曲`, `즐겨찾기`);
    replaceHTML(sa(`.mypageInfoArea`)[1], `設定する`, `설정하기`);
    
    //기타정보
    replaceHTML(sa(`.subtitleMypage`)[2], `その他の情報`, `기타 정보`);
    replaceHTML(sa(`.mypageInfoArea`)[2], `その他設定・編集`, `기타 설정・편집`);
    replaceHTML(sa(`.mypageInfoArea`)[2], `ゲーム中やドンだーひろばの自分の設定を変更することができます。`, `게임중이나 동더히로바의 자신의 설정을 변경할 수 있습니다.`);
    replaceHTML(sa(`.mypageInfoArea`)[2], `ブロックリストの確認`, `차단 목록 확인`);
    replaceHTML(sa(`.mypageInfoArea`)[2], `ブロックリストに登録されている人の確認ができます。`, `차단 목록에 등록되어 있는 사람을 확인할 수 있습니다.`);
    
    //뭔가뭔가 중요한 함수
    (function($){
        /**
         * Setting
         */
        $.fn.settingDialog = function(){
            $( this ).dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                width: '280px'
            });
        }
    
        /**
         * キャンセル
         */
        $.fn.dialogClose = function( dialogId ){
            $( this ).click(function(){
                $( dialogId ).dialog('close');
            });
        }
    
        /**
         * 名前変更ダイアログ
         */
        $.fn.rename = function( dialogId, myname, _tckt, normal_maint ) {
            $( this ).click( function() {
                if (normal_maint == 1) {
                    alert('今は名前変更できないドン！');
                } else {
                    $( dialogId ).find( '.errorArea' ).hide();
                    $( dialogId ).find( '#titleFormArea' ).hide();
                    $( dialogId ).find( '#renameFormArea' ).show();
                    $( dialogId ).find( '#_tckt' ).val( _tckt );
                    $( dialogId ).find( '#oldName' ).val( myname );
                    $( dialogId ).find( '#newName' ).val( myname );
                    $( dialogId ).dialog( 'open' );
                }
            });
        }
    
        /**
         * 称号変更ダイアログ
         */
        $.fn.titleChange = function( dialogId ) {
            $( this ).click( function() {
                $( dialogId ).find( '.errorArea' ).hide();
                $( dialogId ).find( '#renameFormArea' ).hide();
                $( dialogId ).find( '#titleFormArea' ).show();
    
                $( dialogId ).dialog( 'open' );
            });
        }
    
        /**
         * 称号serected変更
         */
        $.fn.changeSelect = function( selectId ){
            var _pull = $( this );
            var _selectValue = $( selectId ).val();
    
            var _isValue = false;
            _pull.children().each(function(){
                if( $( this ).val() == _selectValue ){
                    _isValue = true;
                    $( this ).attr( 'selected', 'selected' );
                }else{
                    $( this ).removeAttr( 'selected' );
                }
            });
            if( !_isValue ){
                _pull.children(':first').attr( 'selected', 'selected' );
            }
        }
    
        /**
         * 名前変更確認・更新処理・GS同期処理
         */
        $.fn.renameConfirm = function( dialogId ){
            $( this ).submit(function(){
                $( this ).profileUpdate( dialogId );
                return false;
            });
        }
    
        /**
         * 称号変更確認・更新処理・GS同期処理
         */
        $.fn.titleChangeConfirm = function( dialogId ){
            $( this ).submit(function(){
                var _newTitleName = $('#dialog').find('#newTitle').children(':selected').html();
                $('#dialog').find('#newTitleName').val( _newTitleName );
    
                $( this ).profileUpdate( dialogId );
                return false;
            });
        }
    
        /**
         * ajax
         */
        $.fn.profileUpdate = function( dialogId ){
            var _this = this;
            $.ajax({
                async: true,
                type: $( this ).attr( 'method' ),
                url: $( this ).attr( 'action' ),
                async: false,
                cache: false,
                data: $( this ).serialize(),
                dataType: "json",
                timeout: 3000,
                error: function (XMLHttpRequest, textStatus, errorThrown){
                        alert("通信に失敗しました。");
                        return false;
                },
                success: function( data, dataType ){
                    if(data.result == 0 || data.result == 3){
                        /**
                         * DB更新成功
                         */
                        if(data.mode == 'name'){
                            $( '#rename_img' ).unbind('click').rename( '#dialog', data.detail['value'], data.detail['_tckt'] );
                        }else if(data.mode == 'title'){
                            $( dialogId ).find( '#oldTitle' ).val( data.detail['value'] );
                            $( '#newTitle' ).changeSelect( '#oldTitle' );/* selected change */
                        }
    
                        alert( '「' + data.detail['value_name'] + "」로 변경되었습니다。");
                        if(data.result == 3){
                            /**
                             * GS更新失敗
                             */
                            alert( "ゲームサーバーへの通信に失敗しました。設定が正しく行われていない可能性がありますので、再度設定してください。" );
                        }
                        $( dialogId ).dialog('close');
                        location.href = 'mypage_top.php';
                        return true;
                    }else if(data.result == 1){
                        /**
                         * 入力チェックエラー
                         */
                        // エラーメッセージを表示
                        $( dialogId ).find( '.errorArea' ).append( '<p/>' ).html( data.err_message );
                        $( dialogId ).find( '.errorArea' ).show();
                        return false;
                    }else if(data.result == 2){
                        /**
                         * DB更新失敗
                         */
                        if(data.mode == 'title'){
                            $( '#newTitle' ).changeSelect( '#oldTitle' );/* selected change */
                        }
                        alert("変更に失敗しました。");
                        $( dialogId ).dialog('close');
                        return false;
                    }else if(data.result == 705){
                        alert( '更新に失敗しました。再度画面の読み込みを行ってください。' );
                    }else if(data.result == 900){
                        alert( '現在メンテナンス中です。\nしばらくお待ちください。' );
                    }else if(data.result == 901){
                        alert( '現在メンテナンス中です。\nしばらくお待ちください。' );
                    }else{
                        alert("失敗しました。");
                    }
                    location.href = 'mypage_top.php';
                }
            });
        }
    
    })(jQuery);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}
















//필수함수
function changeSongName(liElement, nameTable) {
    liElement.querySelectorAll('li.contentBox').forEach(function (e) {
        var isUra = false;
        var songName = e.querySelector(`.songName`).innerText;
        if (e.querySelector(`.ura`)) {
            isUra = true;
        };
        var song = findSongName(songName, isUra, nameTable);
        if (song) {
            replaceHTML(e.querySelector(`.songName`), songName, song.KorName);
        }
    })
}
function replaceHTML(element, replacedText, replacingText) {
    element.innerHTML = element.innerHTML.replace(replacedText, replacingText);
};
function s(string) {
    return document.querySelector(string);
}
function sa(string) {
    return document.querySelectorAll(string);
}

function findSongName(jpnName, isUra, nameTable) {
    for (i = 0; i < nameTable.length; i++) {
        if (nameTable[i].JpnName == jpnName && nameTable[i].isUra == isUra) {
            return nameTable[i];
        }
    }
}

function newsTranslate(){
    var newsText = [
        {
            "jpnText":"あたらしい曲を",
            "korText":"새로운 곡을 "
        },
        {
            "jpnText":"称号を",
            "korText":"칭호를 "
        },
        {
            "jpnText":"個",
            "korText":"개 "
        },
        {
            "jpnText":"ゲットしたドン！",
            "korText":"획득했다쿵!"
        },
        {
            "jpnText":"あたらしいぷちキャラを",
            "korText":"새로운 쁘띠캐릭터를 "
        },
        {
            "jpnText":"が、",
            "korText":"(이)가 "
        },
        {
            "jpnText":"に昇段したドン！",
            "korText":"으로 승급했다쿵!"
        },
        {
            "jpnText":"自己ベスト更新！",
            "korText":"마이 베스트 갱신! "
        },
        {
            "jpnText":"の「おに【裏】」で",
            "korText":"의「귀신【뒤】」에서 "
        },
        {
            "jpnText":"の「おに」で",
            "korText":"의「귀신」에서 "
        },
        {
            "jpnText":"の「むずかしい」で",
            "korText":"의「어려움」에서 "
        },
        {
            "jpnText":"の「ふつう」で",
            "korText":"의「보통」에서 "
        },
        {
            "jpnText":"の「がんだん」で",
            "korText":"의「쉬움」에서 "
        },
        {
            "jpnText":"点とったドン！",
            "korText":"점을 획득했다쿵! "
        }
    ];
    document.querySelector('div#news ul').querySelectorAll('li').forEach( (e) => {
        newsText.forEach( el => {
            if(e.innerHTML.includes(el.jpnText)){
                replaceHTML(e, el.jpnText, el.korText);
            }
            if(e.innerHTML.includes(`ニュースをもっと見る`)){
                replaceHTML(e, `ニュースをもっと見る`, `소식 더 보기`)
            }
        })
    })
};