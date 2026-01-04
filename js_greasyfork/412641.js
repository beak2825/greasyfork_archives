// ==UserScript==
// @name         딤채 점수 치트
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://game.winiadimchae.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412641/%EB%94%A4%EC%B1%84%20%EC%A0%90%EC%88%98%20%EC%B9%98%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/412641/%EB%94%A4%EC%B1%84%20%EC%A0%90%EC%88%98%20%EC%B9%98%ED%8A%B8.meta.js
// ==/UserScript==
var crack_score_final;
var crack_time_final;

function AjaxCall_HashedScore_Crack(method, p_data){
    $.ajax
    (
        {
            type : method,
            url : "/libs/api/game.ef",
            async:false,
            data : p_data,
            contentType: 'application/x-www-form-urlencoded; charset=euc-kr',
            dataType : "json",
            success : function(data, status, xhr) {
                console.log(data);
                let jsonData = data.game_rank;
                console.log(jsonData);
                crack_score_final = data.score;
                crack_time_final = data.time;


                // rank 변수 값은 +1을 해주면 된다.
            },
            error: this.GetRankListCallBack
        }
    );


}


function AjaxCall_Insert_Crack(method, p_data) {
    console.log("hasdsihi");
    /*
			this.request.open('POST', 'UpdateScore.php', true);
			this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			this.request.send(p_data);
			this.request.onreadystatechange = this.UpdateScoreCallBack;
		*/
    let scene = this;
    $.ajax(
        {
            type: method, url : "/libs/api/game.ab?mode=" + method,
            data: p_data,
            dataType:"json",
            contentType: 'application/x-www-form-urlencoded; charset=euc-kr',
            success : function(data, status, xhr) {
                // success response
                console.log("success");
                console.log(data);

                if(data.error != -1)
                {
                    alert(crack_score_origin+"점으로 정상적으로 주작되었습니다 ^^v");
                }
                else
                {
                    alert("오류가 발생하였습니다...");
                }

            },
            error: this.UpdateScoreCallBack
        }
    );
}



let crack_score_origin = prompt('주작할 점수를 입력하세요');
let crack_nick_final = prompt('영어로 닉네임을 입력하세요  대소문자 3~7자리로 입력 가능합니다 예시: Noala');
let crack_name_final = prompt('한글로 주작할 이름을 입력하세요 예시: 노무현');
let crack_sex_final = prompt('대문자 M, F로 성별을 입력하세요!! 예시: M');
let crack_phone_final = prompt('숫자로만 주작할 휴대폰번호를 입력하세요 예시: 01012345678');
let crack_birth_final = prompt('숫자로만 주작할 생일를 입력하세요 예시: 20020202');

var send_data_hash_crack =
    {
        score: crack_score_origin
    };


AjaxCall_HashedScore_Crack('POST', send_data_hash_crack);

var send_data_Insert_crack =
    {
        tel: crack_phone_final,
        score: crack_score_final,
        time: crack_time_final,
        sex: crack_sex_final,
        birthdate : crack_birth_final,
        user_name : crack_name_final,
        nick_name : crack_nick_final
    };

console.log(send_data_Insert_crack);


AjaxCall_Insert_Crack('POST',send_data_Insert_crack);
