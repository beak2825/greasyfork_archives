// ==UserScript==
// @name         NADENADE gesture
// @namespace    http://tampermonkey.net/
// @version      2023-12-30
// @description  イラストの頭をなでるといいねを押してくれます。
// @author       koragen
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483480/NADENADE%20gesture.user.js
// @updateURL https://update.greasyfork.org/scripts/483480/NADENADE%20gesture.meta.js
// ==/UserScript==


(()=>{
    class ComboManager{
        constructor(COMBO_ARRAY_,onSucceedsCombo_,TIME_DIFER_ = 2000,COOLDOWN_ = 600,debugMode=false){
            this.DEBUGMODE = debugMode;

            this.COMBO_ARRAY = COMBO_ARRAY_;
            this.COMBO_LENGH = COMBO_ARRAY_.length;
            this.TIME_DIFER = TIME_DIFER_;
            this.COOLDOWN = COOLDOWN_;
            this.comboProgress = 0;
            this.comboStartedTime = -Infinity;
            this.LastTriggerdTime = -Infinity;

            this.onSucceedsCombo = onSucceedsCombo_;
            this.timeOutId=0;
        }

        reset(){
            let date=new Date();
            let currentTime = date.getTime();
            this.comboProgress = 0;
            this.comboStartedTime = currentTime;
        }
        _continue(){
            clearTimeout(this.timeOutId);
            this.timeOutId = setTimeout(()=>{
                this.reset()
            },1000)
        }

        onEvent(ID,event){
            this._continue();
            let date=new Date();
            let currentTime = date.getTime();
            let status = false;
            if(this.DEBUGMODE)console.log({"ID":ID,"prog":this.comboProgress})
            if(this.COMBO_ARRAY[this.comboProgress] == ID){
                this.comboProgress++;
                let d = currentTime - this.comboStartedTime;
                let d2 = currentTime - this.LastTriggerdTime;
                if(this.comboProgress == this.COMBO_LENGH){
                    if((d<this.TIME_DIFER)&&(d2>this.COOLDOWN)){
                        status = true;
                        this.onSucceedsCombo(event);
                    }
                    this.LastTriggerdTime = currentTime;
                    this.reset();
                }
            }else{
                this.reset();
            }

            return status;
        }
    }

    class GestureManager{
        constructor(){
            this.BufferLen=100;
            this.currentAcceraration ={x:0,y:0};
            this.currentAcceraration_={x:0,y:0};
            this.currentMousePos ={x:0,y:0};
            this.currentMousePos_={x:0,y:0};
            this.currentATheta = 0;
            this.currentATheta_= 0;
            this.currentF = 0;
            this.currentF_= 0;
            this.currentArrowID = -1;
            this.currentArrowID_= -1;

            this.comboManagers = [];
        }

        AddComboManager(comboManager){
            this.comboManagers.push(comboManager);
        }

        onComboEvent(arrowID,event){
            for(let cm of this.comboManagers){
                let reult = cm.onEvent(arrowID,event);
            }
        }

        // ベクトルの長さを計算する関数
        vectorLength(vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        }

        // 正規化されたベクトルを返す関数
        normalizeVector(vector) {
            var length = this.vectorLength(vector);
            return {x: vector.x / length, y: vector.y / length};
        }

        isVaildForce(F){
            return (1<F&&F<15);
        }

        convTheta2ArrowID(theta){
            let N=4
            theta += (Math.PI*2)/(N*2)
            let f = Math.floor((theta/(Math.PI*2))*N)
            return f%N
        }

        tick(mx,my,event){
            this.currentAcceraration_ = this.currentAcceraration
            this.currentAcceraration = {}

            this.currentMousePos_ = this.currentMousePos;
            this.currentMousePos = {};
            this.currentMousePos.x=mx;
            this.currentMousePos.y=my;

            this.currentAcceraration.x = this.currentMousePos_.x-this.currentMousePos.x;
            this.currentAcceraration.y = this.currentMousePos_.y-this.currentMousePos.y;

            this.currentF_ = this.currentF*0.2;
            this.currentF = this.vectorLength(this.currentAcceraration)*0.2;

            this.currentATheta_ = this.currentATheta;
            this.currentATheta = Math.atan2(this.currentAcceraration.x,this.currentAcceraration.y)+Math.PI;

            this.currentArrowID = this.convTheta2ArrowID(this.currentATheta);

            window.mf = Math.max(window.mf,this.currentF)

            if(this.isVaildForce(this.currentF)&&this.currentArrowID_!=this.currentArrowID){
                this.currentArrowID_ = this.currentArrowID;
                this.onComboEvent(this.currentArrowID,event);
            }
        }


    }

    window.onload = function(){
        function GetArticleFromTargetElm(elm){
            if(elm.tagName=="ARTICLE")return elm;
            if(elm.parentElement)return GetArticleFromTargetElm(elm.parentElement);
            return null;
        }

        function GetMainFromTargetElm(elm){
            if(elm.tagName=="MAIN")return elm;
            if(elm.parentElement)return GetMainFromTargetElm(elm.parentElement);
            return null;
        }

        function GetDialogFromTargetElm(elm){
            if(elm.getAttribute("role")=="dialog")return elm;
            if(elm.parentElement)return GetDialogFromTargetElm(elm.parentElement);
            return null;
        }

        let gm = new GestureManager();

        gm.AddComboManager(new ComboManager([3,1,3,1],onSucceedsCombo_= (event)=>{//NADENADE IINE
            let likeElms = document.querySelectorAll('[data-testid="like"]');
            if(likeElms.length==1){
                likeElms[0].click();
                return;
            }

            let article = GetArticleFromTargetElm(event.target);
            if(article){
                let t = article.querySelector('[data-testid="like"]');
                if(t)t.click();
                return;
            }

            let main = GetMainFromTargetElm(event.target);
            if(main){
                let t = main.querySelector('[data-testid="like"]');
                if(t)t.click();
                return;
            }

            let dialog = GetDialogFromTargetElm(event.target);
            if(dialog){
                let t = dialog.querySelectorAll('[data-testid="unlike"],[data-testid="like"]')[0];
                if(!t)return;
                if(t.getAttribute("data-testid")=="like")t.click();
                return;
            }

            console.log(event.target)

        },2000,0,false));

        gm.AddComboManager(new ComboManager([2,0,2,0],(event)=>{//閉じる,戻る
            let elm = document.querySelector('[aria-label="閉じる"],[aria-label="戻る"]');
            if(elm)elm.click();
        }));

        gm.AddComboManager(new ComboManager([0,3],(event)=>{
            let elm = document.querySelector('[aria-label="次のスライド"]');
            if(elm)elm.click();
        }));

        gm.AddComboManager(new ComboManager([0,1],(event)=>{
            let elm = document.querySelector('[aria-label="前のスライド"]');
            if(elm)elm.click();
        }));



        let fc=0;
        document.body.addEventListener("mousemove", function(e){
            var mX = e.pageX; //X座標
            var mY = e.pageY; //Y座標
            (fc%8==0)?0:gm.tick(mX,mY,e);
            fc++;
        });
    }
})()