// ==UserScript==
// @name         zlzp
// @namespace    http://www.akuvox.com/
// @version      1.4
// @description  take on the world!
// @author       andy.wang
// @match        https://rd6.zhaopin.com/talent/search*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/437637/zlzp.user.js
// @updateURL https://update.greasyfork.org/scripts/437637/zlzp.meta.js
// ==/UserScript==

//使用全大写定义岗位名称或学校名称
var mywork = ["嵌入式", "C++", "软件工程师", "PYTHON", "C语言",'测试工程师'];
var filter_university_names = ['学院', '大专'];
var filter_companies = ['锐捷'];

//自己的方法
    function autoCloseNotice(){
        function filter_university(university_name){
            var bf = 0;
            university_name=university_name.toUpperCase();
            university_name = university_name.replace(/\r\n/g,"")
            university_name = university_name.replace(/\n/g,"");
            console.log(university_name)
            for(var j=0; j<filter_university_names.length; j++)
            {
                console.log("university_name" + university_name)
                var pos = university_name.indexOf(filter_university_names[j]);
                if(pos >= 0)
                {
                    bf = 1;
                    break;
                }
            }
            return !bf; //返回False表示要隐藏
        }
        function filter_company(company_name){
            var bf = 0;
            company_name=company_name.toUpperCase();
            company_name = company_name.replace(/\r\n/g,"")
            company_name = company_name.replace(/\n/g,"");
            console.log(company_name)
            for(var j=0; j<filter_companies.length; j++)
            {
                //console.log("company_name" + company_name)
                var pos = company_name.indexOf(filter_companies[j]);
                if(pos >= 0)
                {
                    bf = 1;
                    break;
                }
            }
            return !bf; //返回False表示要隐藏
        }
        function filter_work(works){

            var bf = 0;
            works=works.toUpperCase();
            works = works.replace(/\r\n/g,"")
            works = works.replace(/\n/g,"");
            console.log(works)
            for(var j=0; j<mywork.length; j++)
            {
                var pos = works.indexOf(mywork[j]);
                if(pos >= 0)
                {
                    bf = 1
                    break
                }
            }
            return bf; //返回False表示要隐藏
        }

        var z;
        var mytable = document.getElementsByClassName('search-resume-list')[0]
        var items = mytable.getElementsByClassName('resume-item')

        for(var i=0; i<items.length; i++)
        {
            var basic_info = items[i].getElementsByClassName('talent-basic-info__basic')[0]
            var basic_extra = items[i].getElementsByClassName('talent-basic-info__extra')[0]
            var basic_experience_names = items[i].getElementsByClassName('is-flex talent-experience__name')
            var basci_companies = items[i].getElementsByClassName('talent-experience__name mutil-line-ellipsis')
            var is_read_tag = items[i].getElementsByClassName('is-read-tag')[0]

            if(is_read_tag)
            {
                items[i].style.display = "none";
                console.log("filter read")
                continue;
            }

            if(!filter_work(basic_extra.innerText))
            {
                items[i].style.display = "none";
                console.log("filter work" + basic_extra.innerText)
                continue;
            }

            for(z=0; z<basic_experience_names.length; z++)
            {
                if(!filter_university(basic_experience_names[z].innerText))
                {
                    console.log("filter work" + basic_experience_names[z].innerText)
                    items[i].style.display = "none";
                    break;
                }
            }

            for(z=0; z<basci_companies.length; z++)
            {
                if(!filter_company(basci_companies[z].innerText))
                {
                    console.log("filter work" + basci_companies[z].innerText)
                    items[i].style.display = "none";
                    break;
                }
            }
        }
    };

function addBtn() {
            var div = document.createElement("div"); //创建一个div
            var button = document.createElement("button");
            button.style.cssText = "z-index: 9999; position: fixed ! important; left: 10px; top: 600px;width:100px;margin: 10px 0;padding: 2px 0;background: #e4cc78;";
            button.className = "btnclass";
            button.id = 'myfilter';
            button.onclick = function() {
               autoCloseNotice();
            };
            var text1 = document.createTextNode("筛选");
            button.appendChild(text1);
            div.appendChild(button);
            document.getElementsByClassName('app-nav')[0].appendChild(div);
};


(function() {
    //主函数开始
    //创建button
    console.log("zlzp")


     if (navigator.userAgent.indexOf('Firefox') >= 0) {
        //firefox 不支持 window.onload 直接调用函数
        addBtn();
    } else {
           window.onload = addBtn;

    }
})();