// ==UserScript==
// @name         Soccerline Memo
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  어그로 박멸하자.
// @author       ME
// @match        https://soccerline.kr/board/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soccerline.kr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441525/Soccerline%20Memo.user.js
// @updateURL https://update.greasyfork.org/scripts/441525/Soccerline%20Memo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){

        const db = createDataBase();
        createTable(db);
        writerUserMemo(db);
        commenterUserMemo(db);
    };

    function commenterUserMemo(db){
        const commentUser = Array.from(document.getElementById("board-view-comment-list").getElementsByClassName("btnUser"));

        commentUser.forEach(x =>{

            const id = x.innerText.split('(')[1].split(',')[0];

            db.transaction(function(tx){
                tx.executeSql("select * from USER_MEMO WHERE USERID = ?" , [id] , function(tx , result){
                    const div = appendCommentUserMemo(x.parentElement , id , db);
                    if(result.rows.length > 0){
                        setValue(div , result.rows.item(0));
                    }
                 });
            });
        });
    }

    function writerUserMemo(db){
        const writer = document.getElementsByClassName("nameBox")[0];

        const writerUserId = writer.innerText.split('(')[1].split(')')[0];

        db.transaction(function(tx){
            tx.executeSql("select * from USER_MEMO WHERE USERID = ?" , [writerUserId] , function(tx , result){
                const div = appendCommentUserMemo(writer , writerUserId , db);
                if(result.rows.length > 0){
                    setValue(div , result.rows.item(0));
                }
            });
        });
    }

    function createDataBase(){
        return openDatabase('UserMemo', '1.0', 'chrome dabase', 10 * 1024 * 1024);
    }

    function createTable(db){
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS USER_MEMO (USERID PRIMARY KEY , MEMO)')
        })
    }

    function appendCommentUserMemo(tag , id , db){
        const div = document.createElement("div");

        div.style.color='red';

        const sp = document.createElement("span");
        sp.innerText = "메모 : ";
        div.append(sp);
        const inputTag = document.createElement("input");

        const submitBtn = document.createElement("button");
        submitBtn.onClick = function(){
                const id = this.getAttribute("userId");
                const memo = this.value;

                if(memo.trim().lenght <= 0){
                    return;
                }

                db.transaction(function(tx){

                    let isExist = false;

                    tx.executeSql("select COUNT(*) AS c from USER_MEMO WHERE USERID = ?" , [id] , function(tx , result){
                        if(result.rows.item(0).c > 0){
                          updateMemo(db , memo , id);
                        }else{
                          insertMemo(db , memo , id);
                        }
                    });
                });
        }



        inputTag.className = "userCustom";
        inputTag.style.color='blue';
        inputTag.setAttribute("userId" ,id);

        inputTag.addEventListener('keypress', function(e) {
            if(e.key === 'Enter'){
                const id = this.getAttribute("userId");
                const memo = this.value;

                if(memo.trim().lenght <= 0){
                    return;
                }

                db.transaction(function(tx){

                    let isExist = false;

                    tx.executeSql("select COUNT(*) AS c from USER_MEMO WHERE USERID = ?" , [id] , function(tx , result){
                        if(result.rows.item(0).c > 0){
                          updateMemo(db , memo , id);
                        }else{
                          insertMemo(db , memo , id);
                        }
                    });
                });
            };
        });


        div.append(inputTag);
        div.append(submitBtn);
        tag.append(div);

        return div;
    };

    function setValue(ele , item){
        ele.getElementsByClassName("userCustom")[0].value = item.MEMO;
    };

    function findUserMemo(db , id){
        let rtn;
        db.transaction(function(tx){
            tx.executeSql("select * from USER_MEMO WHERE USERID = ?" , [id] , function(tx , result){
                rtn = result;
            });
        });
        return rtn;
    }

    function insertMemo(db , memo , id ){
        db.transaction(function(tx){
            tx.executeSql("insert into USER_MEMO (USERID , MEMO) VALUES ( ? , ? )" , [id , memo] , function(tx , result){
            },function(tx, error) {
                console.log(error);
            });
        },transError,transSuccess);
    }

    function updateMemo(db , memo , id ){
        db.transaction(function(tx){
            tx.executeSql("update USER_MEMO set MEMO=? where USERID = ?" , [ memo , id ] , function(tx , result){
            },function(tx, error) {
                console.log(error);
            });
        },transError,transSuccess);
    }

    function deleteMemo(db , id){
        db.transaction(function(tx){
            tx.executeSql("delete from USER_MEMO where USERID = ?" , [ id ] , function(tx , result){

            },function(tx, error) {
                console.log(error);
            });
        },transError,transSuccess);
    }


    function transError(t, e) {
        console.log(t);
        console.log(e);
        console.error("Error occured ! Code:" + e.code + " Message : " + e.message);
    }

    function transSuccess(t, r) {
        console.info("Transaction completed Successfully!");
        console.log(t);
        console.log(r);
    }

})();