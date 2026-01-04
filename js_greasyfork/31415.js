// ==UserScript==
// @name         Festzeit PokemonFindHelper
// @namespace    https://pg.festzeit.ch/
// @version      0.1
// @description  pika pika?
// @author       PogoGaller
// @match        https://pg.festzeit.ch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31415/Festzeit%20PokemonFindHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/31415/Festzeit%20PokemonFindHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var toMyDate = function (newDate){
        var hh = newDate.getHours();
        var mm = newDate.getMinutes();
        var ss = newDate.getSeconds();

        if(hh<10) {
            hh='0'+hh;
        }

        if(mm<10) {
            mm='0'+mm;
        }
        if(ss<10) {
            ss='0'+ss;
        }

        var today = hh + ":" + mm + ":" + ss;
        return today;
    };

    window.toMyDate = toMyDate;
    
    window.tableCSS = {
            "border"            : "1px solid #B3BFAA",
            "padding"           : ".5em 1em",
            "border-collapse"	: "collapse"
        };

    //$("#pokeListView").remove();
    var createView = function(){

        var pokeListView = $("<div>",
                             {
            id:"pokeListView"
        });

        $(pokeListView).css({
            "width"				: "42%",
            "top"				: "20px",
            "left"				: "56%",
            "display"			: "block",
            "position"			: "absolute",
            "background-color"	: "white",
            "z-index"			: "999999",
            "box-shadow"		: "0px 0px 15px black",
            "border-radius"		: "15px",
            "padding"			: "10px 10px 10px 20px",
            "overflow"			: "hidden",
            "background"        : "linear-gradient(45deg, #49a09d, #5f2c82)",
            
        });

        var pokeListViewInner = $("<div>",
                                  {
            id:"pokeListViewInner"
        });

        pokeListViewInner.css({
            "height"			: "600px",
            "overflow"			: "auto"
        });

        var updateButton = $("<button>").text("업데이트").attr("id","update");
        updateButton.click(function () {
            updatePokeList(parseInt($("#minCP").val()));
        });

        var autoUpdateCheckBox = $("<input>").attr({
            "name"		: "autoupdate",
            "type"		: "checkbox",
            "checked"	: "ture"

        });
        autoUpdateCheckBox.click(function(){
            if(this.checked){
                window.updateID = window.setInterval(function(){
                    $("#update").click();
                }, 5000);
            }else{
                clearInterval(window.updateID);
            }
        });
        window.updateID = window.setInterval(function(){
                    $("#update").click();
                }, 5000);
        
        var autoUpdateLabel = $("<label>").attr("for","autoupdate").text("자동 업데이트");
        
        var minCP = $("<input>").attr({
            id : "minCP",
            "type" : "number",
            "name" : "pokeCP",
            "value" : "98"
        }).css("width","40px");

        var minCPLabel = $("<label>").attr("for","pokeCP").text("최소CP");

        var fontSizeInput= $("<input>").attr({
            id : "fontSize",
            "type" : "number",
            "name" : "fontSize",
            "value" : "10"
        }).css({
            "width":"40px",
            "margin": "10px"
        });

        var fontSizeLabel = $("<label>").attr("for","fontSize").text("글씨크기");
        
        var updateFontButton = $("<button>").text("변경")
                               .attr("id","updateFont")
                               .css("margin", "10px");
        $(updateFontButton).click(function(){
            var fontSize = $("#fontSize").val();
            $("#pokeListView").css("font-size",fontSize + "px");
            console.log(fontSize);
        });
        
        
        var settingBox = $("<div>").attr({
           id : "settingBox" 
        }).css({
          "padding" : "10px"  
        });
        
        settingBox.append(updateButton);
        settingBox.append(autoUpdateCheckBox);
        settingBox.append(autoUpdateLabel);

        settingBox.append(minCPLabel);
        settingBox.append(minCP);

        settingBox.append(fontSizeLabel);
        settingBox.append(fontSizeInput);
        settingBox.append(updateFontButton);
        
        pokeListView.append(settingBox);
        pokeListView.append(pokeListViewInner);

        $("body").append(pokeListView);



        var pokeTable = $("<table>",{ "id" : "pokeTable"} );
        var pokeTableHeader = $("<tr>").css({
            "background" : "#D5E0CC"
        });

        pokeTableHeader.append(		$("<th>").text("이름")			);
        pokeTableHeader.append(		$("<th>").text("시간")			);
        pokeTableHeader.append(		$("<th>").text("위치")			);
        pokeTableHeader.append(		$("<th>").text("IV")			);
        pokeTableHeader.append(		$("<th>").text("CP")			);
        pokeTableHeader.append(		$("<th>").text("무브셋")		);


        pokeTable.append(pokeTableHeader);



        $("#pokeListViewInner").append(pokeTable);

        updatePokeList(98);

        

        $("table, th, td").css( tableCSS );
        $("td").css("padding", "10px");


    };//end createView function
    window.createView = createView;


    var updatePokeList = function(pokemonCP){
        var excludedPokemon = JSON.parse(localStorage.getItem("excludedPokemon"));
        $("#pokeTable tr td").remove();
        $("tr.tableBody").remove();
        
        for(var key in map_pokemons){
            var visiblePokemon = true;
            for(var i=0;i<excludedPokemon.length;i++){
               if(excludedPokemon[i] === map_pokemons[key].pokemon_id){
                   visiblePokemon = false;
               }
            }
            
            
            if(typeof(map_pokemons[key].iv) !== 'undefined' && visiblePokemon){

                var poke = map_pokemons[key];

                if((poke.iv+55) >= parseInt(pokemonCP) ){

                    var pokeName = $("<td>").text ( pokeNames[lang][poke.pokemon_id]										);
                    var pokeDate = $("<td>").text ( toMyDate(	new Date(poke.disappear_time)	)						);
                    var pokeGPS  = $("<td>").text ( poke.latitude + "," + poke.longitude								);
                    var pokeIV   = $("<td>").text ( parseInt(poke.iv)  + 55												);
                    var pokeCP   = $("<td>").text ( poke.cp																);
                    var pokeMove = $("<td>").text ( getmove(parseInt(poke.move1)) + "," + getmove(parseInt(poke.move2)) );

                    var pokeTableBody = $("<tr>").attr("class","tableBody");

                    pokeTableBody.append(pokeName);
                    pokeTableBody.append(pokeDate);
                    pokeTableBody.append(pokeGPS);
                    pokeTableBody.append(pokeIV);
                    pokeTableBody.append(pokeCP);
                    pokeTableBody.append(pokeMove);
                    

                    $("#pokeTable").append(pokeTableBody);

                }//end if (iv > val )
            }//end if (typeof)
        }//end for

        $("table, th, td").css( tableCSS );
        $("td").css({
            "padding": "10px",
            "background": "#fff"
        });

    };
    window.updatePokeList = updatePokeList;

    createView();
    
    window.langs = {'de':'Deutsch', 'en':'English', 'fr':'Francais', 'it':'Italiano' ,'ko' : 'Korean'};
    window.pokeNames.ko = ['','이상해씨','이상해풀','이상해꽃','파이리','리자드','리자몽','꼬부기','어니부기','거북왕','캐터피','단데기','버터플','뿔충이','딱충이','독침붕','구구','피죤','피죤투','꼬렛','레트라','깨비참','깨비드릴조','아보','아보크','피카츄','라이츄','모래두지','고지','니드런♀','니드리나','니드퀸','니드런♂','니드리노','니드킹','삐삐','픽시','식스테일','나인테일','푸린','푸크린','주뱃','골뱃','뚜벅쵸','냄새꼬','라플레시아','파라스','파라섹트','콘팡','도나리','디그다','닥트리오','나옹','페르시온','고라파덕','골덕','망키','성원숭','가디','윈디','발챙이','슈륙챙이','강챙이','캐이시','윤겔라','후딘','알통몬','근육몬','괴력몬','모다피','우츠동','우츠보트','왕눈해','독파리','꼬마돌','데구리','딱구리','포니타','날쌩마','야돈','야도란','코일','레어코일','파오리','두두','두트리오','쥬쥬','쥬레곤','질퍽이','질뻐기','셀러','파르셀','고오스','고우스트','팬텀','롱스톤','슬리프','슬리퍼','크랩','킹크랩','찌리리공','붐볼','아라리','나시','탕구리','텅구리','시라소몬','홍수몬','내루미','또가스','또도가스','뿔카노','코뿌리','럭키','덩쿠리','캥카','쏘드라','시드라','콘치','왕콘치','별가사리','아쿠스타','마임맨','스라크','루주라','에레브','마그마','쁘사이저','켄타로스','잉어킹','갸라도스','라프라스','메타몽','이브이','샤미드','쥬피썬더','부스터','폴리곤','암나이트','암스타','투구','투구푸스','프테라','잠만보','프리져','썬더','파이어','미뇽','신뇽','망나뇽','뮤츠','뮤','치코리타','베이리프','메가니움','브케인','마그케인','블레이범','리아코','엘리게이','장크로다일','꼬리선','다꼬리','부우부','야부엉','레디바','레디안','페이검','아리아도스','크로뱃','초라기','랜턴','피츄','삐','푸푸린','토게피','토게틱','네이티','네이티오','메리프','보송송','전룡','아르코','마릴','마릴리','꼬지모','왕구리','통통코','두코','솜솜코','에이팜','해너츠','해루미','왕자리','우파','누오','에브이','블래키','니로우','야도킹','무우마','안농','마자용','키링키','피콘','쏘콘','노고치','글라이거','강철톤','블루','그랑블루','침바루','핫삼','단단지','헤라크로스','포푸니','깜지곰','링곰','마그마그','마그카르고','꾸꾸리','메꾸리','코산호','총어','대포무노','딜리버드','만타인','무장조','델빌','헬가','킹드라','코코리','코리갑','폴리곤2','노라키','루브도','배루키','카포에라','뽀뽀라','에레키드','마그비','밀탱크','해피너스','라이코','앤테이','스이쿤','애버라스','데기라스','마기라스','루기아','칠색조','세레비'];
    window.pokeMoves.ko = ["","전기쇼크","전광석화","할퀴기","불꽃세례","덩굴채찍","몸통박치기","잎날가르기","돌진","물대포","물기","막치기","연속뺨치기","김밥말이","파괴광선","핥기","악의파동","스모그","오물공격","메탈크로우","찝기","화염자동차","메가폰","날개치기","화염방사","기습","구멍파기","안다리걸기","크로스촙","사이코커터","환상빔","지진","스톤에지","냉동펀치","하트스탬프","방전","러스터캐논","쪼기","회전부리","냉동빔","눈보라","에어슬래시","열풍","더블니들","독찌르기","제비반환","드릴라이너","꽃보라","메가드레인","벌레의야단법석","독엄니","깜짝베기","베어가르기","거품광선","지옥의바퀴","태권당수","로킥","아쿠아제트","아쿠아테일","씨폭탄","사이코쇼크","돌떨구기","원시의힘","암석봉인","스톤샤워","파워젬","야습","섀도펀치","섀도크루","괴상한바람","섀도볼","불릿펀치","마그넷봄","강철날개","아이언헤드","파라볼라차지","스파크","번개펀치","번개","10만 볼트","회오리","용의숨결","용의파동","드래곤크루","차밍보이스","드레인키스","매지컬샤인","문포스","치근거리기","크로스포이즌","오물폭탄","오물웨이브","더스트슈트","머드숏","뼈다귀치기","땅고르기","진흙폭탄","연속자르기","벌레먹음","시그널빔","시저크로스","니트로차지","불꽃튀기기","불대문자","소금물","물의파동","열탕","하이드로펌프","사이코키네시스","사이코브레이크","얼음뭉치","얼다바람","얼음숨결","흡수","기가드레인","불꽃펀치","솔라빔","리프블레이드","파워휩","튀어오르기","용해액","에어컷터","폭풍","깨트리다","풀베기","스피드스타","뿔찌르기","짓밟기","박치기","필살앞니","힘껏치기","누르기","잠자기","발버둥","열탕","하이드로펌프","김밥말이 Green","김밥말이","연속자르기","벌레먹음","물기","기습","용의숨결","전기쇼크","스파크","안다리걸기","태권당수","불꽃세례","날개치기","쪼기","핥기","섀도크루","덩굴채찍","잎날가르기","머드숏","얼음뭉치","얼음숨결","전광석화","할퀴기","몸통박치기","막치기","풀베기","독찌르기","용해액","사이코커터","돌떨구기","메탈크로우","불릿펀치","물대포","튀어오르기","물대포","진흑뿌리기","사념의 박치기","염동력","독침","거품","속여때리기","강철날개","불꽃엄니","바위깨기","변신","카운터","눈싸라기","인파이트","폭발펀치","기합구슬","오로라빔","차지빔","볼트체인지","와일드볼트","전자포","드래곤테일","눈사태","에어슬래시","브레이브버드","불새","모래지옥","락블레스트","엉겨붙기","벌레의저항","은빛바람","놀래키기","병상첨병","나이트헤드","아이언테일","자이로볼","헤비봄버","회오리불꽃","오버히트","기관총","풀묶기","에너지볼","신통력","미래예지","미러코트","역린","바크아웃","깨물어부수기","속임수","잠재파워"];
    
})();