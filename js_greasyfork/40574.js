// ==UserScript==
// @name         Bihu CommentList
// @namespace    https://bihu.com/people/112225
// @version      0.2
// @description  Clear comments list.
// @author       Riley Ge
// @match        https://bihu.com/article/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40574/Bihu%20CommentList.user.js
// @updateURL https://update.greasyfork.org/scripts/40574/Bihu%20CommentList.meta.js
// ==/UserScript==

(function() {
    var clks = setInterval(function(){
        btn=$("button.LoaderButton.load");
        if(!btn.is(':visible'))
        {
            clearInterval(clks);
            //btn.hide();
            var comments = $("div.row.comment-info");
            //allitems += comments.length;
            /*comments.each(function() {
                //var innerText = $(this).find("p.first-comment-content").text().length;
                if($(this).find("p.first-comment-content").text().length < 5)
                    //deleteditems++;
                    $(this).remove();
            });*/
            var moneyArray = new Array(comments.length);
            var needChangeMoneyArray = [];
            var indexArray = [];
            var insertPosArray = [];
            for(var i = 0; i < comments.length; i++)
            {
                var comment = comments[i];
                moneyArray[i] = comment.children[0].children[2].children[3].children[1].innerText * 1;
                if(i === 0) continue;
                for(var m = 0; m < i; m++)
                {
                    //比较第 i 个变量和之前变量的大小
                    if(moneyArray[i] > moneyArray[m])
                    {
                        //进行互换
                        //var moneyTemp = moneyArray[i];
                        /*for(var n = i; n > m; n--)
                        {
                            moneyArray[n] = moneyArray[n-1];
                            //comments[n] = comments[n-1];
                        }
                        moneyArray[m] = moneyTemp;*/
                        //将第 i 个元素移动到第 m 个元素之前
                        indexArray.length = indexArray.length + 1;
                        needChangeMoneyArray.length = needChangeMoneyArray.length + 1;
                        insertPosArray.length = insertPosArray.length + 1;
                        if(indexArray.length === 0)
                        {
                            indexArray[0] = i;
                            needChangeMoneyArray[0] = moneyArray[i];
                            insertPosArray[0] = m;
                        }else
                        {
                            var thisMoney = moneyArray[i];
                            needChangeMoneyArray[needChangeMoneyArray.length - 1] = 0;
                            for(var k = 0; k < needChangeMoneyArray.length; k++)
                            {
                                if(needChangeMoneyArray[k] < thisMoney)
                                {
                                    for(var j = k + 1; j < needChangeMoneyArray.length; j++)
                                    {
                                        needChangeMoneyArray[j] = needChangeMoneyArray[j - 1];
                                        indexArray[j] = indexArray[j - 1];
                                        insertPosArray[j] = insertPosArray[j - 1];
                                    }
                                    needChangeMoneyArray[k] = thisMoney;
                                    indexArray[k] = i;
                                    insertPosArray[k] = m;
                                    break;
                                }
                            }
                        }
                        //var one_div = comments[m];    //  获取<ul>节点中第二个<li>元素节点
                        //var two_div = comments[i];    //  获取<ul>节点中第三个<li>元素节点
                        //two_div.parentElement.insertBefore(two_div, one_div);
                        break;//移动完成之后可以移动到下个节点
                        //two_div.insertBefore(one_div, true);    //移动节点
                    }//否则什么也不做
                }
            }
            for(var p = 0; p < indexArray.length; p++)
            {
                var one_div = comments[indexArray[p]];    //  获取<ul>节点中第二个<li>元素节点
                var two_div = comments[insertPosArray[p]];    //  获取<ul>节点中第三个<li>元素节点
                two_div.parentElement.insertBefore(one_div, two_div);
            }


        }else{
            btn.click();
        }
    },1000);
    /*var clks2 = setInterval(function(){
        var comments = $("div.row.comment-info");
        //allitems += comments.length;
        comments.each(function() {
            //var innerText = $(this).find("p.first-comment-content").text().length;
            if($(this).find("p.first-comment-content").text().length < 5)
                //deleteditems++;
                $(this).remove();
        });
    },3000);*/
})();