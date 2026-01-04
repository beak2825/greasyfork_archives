// ==UserScript==
// @name         炎黄盈动-内网PIF流程页面优化(VUE)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  PIF表单图片直接展示
// @author       haifennj
// @match        https://my.awspaas.com/*
// @match        http://192.168.0.4:30991/*
// @grant        GM_xmlhttpRequest


// @downloadURL https://update.greasyfork.org/scripts/528765/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8-%E5%86%85%E7%BD%91PIF%E6%B5%81%E7%A8%8B%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96%28VUE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528765/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8-%E5%86%85%E7%BD%91PIF%E6%B5%81%E7%A8%8B%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96%28VUE%29.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const pageCheck = settingParam && settingParam.processDefId == 'obj_24996ee732df448fac828927be204952'
	if(!pageCheck){
		return;
	}
	
	let css = `
        a:LINK{color:#53709A}
        a:VISITED{color:#53709A; TEXT-DECORATION: none;}
        a:HOVER{color:#53709A}
        .query-dots {
            position: absolute;
            top: 30px;
            font-size: 10px;
            line-height: 10px;
        }
        .query-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin: 0 4px;
            border-radius: 50%;
            background-color: #ccc;
            animation: query 0.6s infinite ease-in-out;
        }
        .query-dot:nth-child(1) {
            animation-delay: 0.1s;
        }
        .query-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .query-dot:nth-child(3) {
            animation-delay: 0.3s;
        }
        @keyframes query {
            0% {
            transform: scale(0);
            }
            50% {
            transform: scale(1);
            }
            100% {
            transform: scale(0);
            }
        }
        .query-result {
            position: absolute;
            top: 30px;
            font-size: 10px;
            line-height: 10px;
        }
    `
	let el = document.createElement('style')
	el.type = 'text/css'
	el.innerHTML = css
	document.head.appendChild(el);


    function showLoadingAnimation(titleCellDiv) {
        const loadingAnimation = document.createElement('div');
        loadingAnimation.id = 'loading-animation';
        loadingAnimation.className = 'query-dots';
        loadingAnimation.innerHTML = '<div class="query-dot"></div><div class="query-dot"></div><div class="query-dot"></div>';

        titleCellDiv.appendChild(loadingAnimation);
    }
    function hideLoadingAnimation() {
        const loadingAnimation = document.getElementById('loading-animation');
        if (loadingAnimation) {
            loadingAnimation.remove();
        }
    }
    function objtostr(json) {
        var arr = new Array()
        for (var k in json) {
            var v = json[k]
            var val = k + '=' + v
            arr.push(val)
        }
        var str = arr.join('&')
        return str
    }
    function getDWData(pifNo, callback) {
        fetch('./jd', { // Replace with your API endpoint
            "method": 'POST',
            "headers": {
                "accept": "application/json, text/plain, */*",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
            },
            "body": "pageId=6271&editRelease=true",
            "mode": "cors",
            "credentials": "include",
            body: objtostr({
                cmd: "CLIENT_DW_DATA_GRIDJSON",
                msaAppId: "com.crmpaas.apps.service",
                sid: settingParam.sessionId,
                isDesign: false,
                appId: "com.crmpaas.apps.service",
                pageNow: 1,
                dwViewId: "obj_a0b3d16a0f754c80951318503b4e990f",
                processGroupId: "obj_40522b2a44c44d55bf264b968d1da3af",
                processGroupName: "产品改善",
                limit: 1,
                condition: JSON.stringify({ "cond": { "likeC": [{ "Type": "TEXT", "Compare": "like", "Field": "PIFNOOBJ_936301EB43D341D0A3421927FE05E80D", "FieldName": "PIF编号", "ConditionValue": pifNo }] }, "tcond": { "qk": "" } })
            })
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                callback(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function queryState(pifNo) {
        const titleCellDiv = document.querySelector('#process-header');
        showLoadingAnimation(titleCellDiv);
        getDWData(pifNo, function (r) {
            let newText = "";
            // PLANTIME 计划完成时间
            var boData = r.data.maindata.items.length > 0 ? r.data.maindata.items[0] : {};
            var PLANTIME = boData.PLANTIME;
            var PLANTIME_SHOW_RULE_SUFFIX = boData.PLANTIME_SHOW_RULE_SUFFIX;
            var DELAYWARNSTA = boData.DELAYWARNSTA;
            newText += "<span style='margin-right:5px'>";
            newText += "计划完成时间：<b style='color:red;'>"+PLANTIME_SHOW_RULE_SUFFIX+"</b>";
            newText += "</span>";
            newText += "<span style='margin-right:5px'>";
            newText += "状态：<b style='color:"+(DELAYWARNSTA=="1"?"#ffa726":DELAYWARNSTA=="2"?"red":"")+";'>"+boData.DELAYWARNSTA_SHOW_RULE_SUFFIX+"</b>";
            newText += "</span>";
            if (titleCellDiv) {
                const newDiv = document.createElement('div');
                newDiv.className = 'query-result';
                newDiv.innerHTML = newText;
                titleCellDiv.appendChild(newDiv);
            }
            hideLoadingAnimation();
        });
    }

	function setNewTitle() {
		var titleElement = document.querySelector('.title-name');
		var toolbarText = titleElement.textContent;
		var title = toolbarText;
		var pattern = /PIF(\d+)/;
		var match = pattern.exec(toolbarText);
		var pifNo = "";
		var shortNo = '';//$("#PIFNO_Readonly").text().substring(9);
		if (match) {
			pifNo = match[0];
		}
		shortNo = pifNo.substring(9);
		var pifQueryUrl = "https://my.awspaas.com/r/w?sid=" + settingParam.sessionId + "&msaDefSvcId=oa&&msaAppId=com.crmpaas.apps.service&cmd=CLIENT_DW_PORTAL&processGroupId=obj_40522b2a44c44d55bf264b968d1da3af&appId=com.crmpaas.apps.service&hideToolbar=true&hideTitle=true&condition=";
		pifQueryUrl += encodeURIComponent("[{cp:'=',fd:'PIFNOOBJ_936301EB43D341D0A3421927FE05E80D',cv:'" + pifNo + "'}]");
		//var aTag = '<a href="' + pifQueryUrl + '" target="' + pifNo + '">' + shortNo + '</a>';
        var aTag = `<a href="#" class="pif-link" data-pif="${pifNo}">${shortNo}</a>`;
		titleElement.innerHTML = aTag + "-" + toolbarText;
		title = shortNo + "-" + toolbarText
		document.title = title;
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('pif-link')) {
                e.preventDefault();
                const pifNo = e.target.dataset.pif;
                queryState(pifNo);
            }
        });
	}

    function modifyDate(domId, fieldName) {
        // Find the div with the specified ID
        const targetDiv = document.getElementById(domId);
        if (targetDiv) {
            const contentDiv = targetDiv.querySelector('.el-form-item__content');
            if (contentDiv) {
                let oldDate = formApi.ui(fieldName).getVal();
                let newDate = oldDate.split(' ')[0] + " 23:00:00";
                const anchor = document.createElement('a');
                anchor.href = 'javascript:void(0)';
                anchor.textContent = "调整";
                anchor.style.marginRight = '10px';
                anchor.style.lineHeight = '14px';
                anchor.style.fontSize = '12px';
                anchor.style.cursor = 'pointer';
                anchor.style.marginLeft = '12px'; // Adjust the value as needed
                anchor.addEventListener('click', function () {
                    formApi.ui(fieldName).setVal(newDate);
                });
                contentDiv.appendChild(anchor);
            }
        }
    }

    function sendXT(user) {
        console.log("协同接收人",user);
        const commentData = formApi.context.processApi.data.getUserTaskCommentData().value;
        const data = {
            sid: settingParam.sessionId,
            cmd: "CLIENT_BPM_TASK_ADHOC_TASK",
            processInstId: formApi.context.processApi.pageContext.processContext.processInstId,
            taskInstId: formApi.context.processApi.pageContext.processContext.taskInstId,
            participant: user,
            title: formApi.context.processApi.pageContext.processContext.taskInstInfo.title,
            commentInfo: JSON.stringify({
                msg: commentData.msg,
                commentId: commentData.commentId,
                isCommentCreate: commentData.isCommentCreate,
                hasFiles: commentData.hasFiles
            }),
            type: 3,
            transfer: ""
        };
        console.log("参数",data);
        formApi.api.setLoading(true, "正在发送");
        fetch("./jd", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(data)
        })
        .then(res => res.json())
        .then(r => {
            if (r.result === 'ok') {
                try {
                    if (window.opener.refreshWorkbenchGrid) {
                        window.opener.refreshWorkbenchGrid();
                    }
                } catch (e) {
                    alert(e)
                }
                formApi.api.setLoading(false);
                formApi.context.instance.$message({
                    type: 'success',
                    message: r.msg
                })
                setTimeout(function () {
					window.close();
                }, 2000);
            }

        })
        .catch(err => console.error("出错:", err));
    }

    function initAddress(domId, fieldName, addressList, isSingle) {
        const targetDiv = document.getElementById(domId);
        if (!targetDiv) return;

        const contentDiv = targetDiv.querySelector('.el-form-item__content');
        if (!contentDiv) return;

        addressList.forEach((item, index) => {
            const key = Object.keys(item)[0];
            const value = item[key];

            const anchor = document.createElement('a');
            anchor.href = 'javascript:void(0)';
            anchor.textContent = value;
            anchor.style.fontSize = '12px';
            anchor.style.cursor = 'pointer';
            anchor.style.marginLeft = '10px';

            /** ========= 仅处理协同多人 ========= */
            if (key === '_all_') {
                anchor.style.color = '#E55392';

                anchor.addEventListener('click', function () {
                    const currentValue = formApi.ui(fieldName).getVal() || '';
                    if (!currentValue) {
                        return;
                    }

                    // 逗号转空格
                    const xtValue = currentValue
                    .split(',')
                    .filter(Boolean)
                    .join(' ');

                    formApi.data.saveData({
                        isValidate: false,
                        formType: "BTN_ADHOC_TASK",
                        isNew: '',
                        isTransact: false,
                        showMsg: false,
                        callBack: () => {
                            sendXT(xtValue);
                        }
                    });
                });

                contentDiv.appendChild(anchor);
                return; // ⭐ 不进入下面的原有逻辑
            }

            /** ========= 以下全部保持原样 ========= */
            anchor.addEventListener('click', function() {
                if (isSingle) {
                    formApi.ui(fieldName).setVal(key);
                } else {
                    const currentValue = formApi.ui(fieldName).getVal() || '';
                    const currentValues = currentValue.split(',').filter(Boolean);

                    if (!currentValues.includes(key)) {
                        currentValues.push(key);
                        formApi.ui(fieldName).setVal(currentValues.join(','));
                    }
                }
            });

            contentDiv.appendChild(anchor);

            // 原 TASKHOLDER + (协同) 逻辑仍在，但不会作用于 _all_
            if (fieldName == "TASKHOLDER") {
                const anchorXt = document.createElement('a');
                anchorXt.href = 'javascript:void(0)';
                anchorXt.textContent = "(协同)";
                anchorXt.style.fontSize = '12px';
                anchorXt.style.cursor = 'pointer';
                anchorXt.style.color = '#E55392';
                anchorXt.style.marginLeft = '2px';

                anchorXt.addEventListener('click', function() {
                    if (formApi.ui(fieldName).getVal() == '') {
                        formApi.context.instance.$message({
                            type: 'info',
                            message: "请选择执行人"
                        });
                        return;
                    }
                    formApi.data.saveData({
                        isValidate: false,
                        formType: "BTN_ADHOC_TASK",
                        isNew: '',
                        isTransact: false,
                        showMsg: false,
                        callBack: () => {
                            sendXT(key);
                        }
                    });
                });

                if (index > 0) {
                    contentDiv.appendChild(anchorXt);
                }
            }
        });
    }
    const addressEXECUID = [{"zhanghf":"张海峰"},{"wangsb":"王石宝"},{"sunlianhui":"孙连辉"},{"zhanghq":"张红旗"}];

    const addressTASKHOLDER = [{"zhanghf":"张海峰"},
                               {"_all_":"协同多人"},
                               {"wangzw":"王兆伟"},
                               {"lishan":"李山"},
                               {"zhaok":"赵阔"},
                               {"chenzt":"陈志涛"},
                               {"zhaof":"赵芬"},
                               {"xias":"夏爽"},
                               {"liss":"李沙沙"},
                               {"fulp":"付利萍"},
                               {"mahuilin":"马慧琳"},
                               {"liuaj":"刘艾佳"}];

    function init() {
        setNewTitle();
        if (!formApi.context.processApi.pageContext.formReadonly) {
            initAddress('_14e1aa9e-01b7-4b73-a3b0-adcf77caad4e', "EXECUID", addressEXECUID, true);
            initAddress('_415f481f-2b5c-401e-81c1-68a0923a14a2', "TASKHOLDER", addressTASKHOLDER, false);
            modifyDate('_da5f2e02-73e6-4acd-aa2d-1eaf6df5ff7a', 'PLANTIME');
        }
    }
	
	function addXMLRequestCallback(callback) {
		var oldSend, i;
		if (XMLHttpRequest.callbacks) {
			XMLHttpRequest.callbacks.push(callback);
		} else {
			XMLHttpRequest.callbacks = [callback];
			oldSend = XMLHttpRequest.prototype.send;
			XMLHttpRequest.prototype.send = function () {
				for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
					XMLHttpRequest.callbacks[i](this);
				}
				oldSend.apply(this, arguments);
			}
		}
	}
	addXMLRequestCallback(function (xhr) {
		xhr.addEventListener("load", function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var r = JSON.parse(xhr.response)
				//console.log('拦截返回：', r.data);
				if (r.data && r.data["usertaskHistoryOpinion"]) {
					setTimeout(function () {
						init();
					}, 300);
				}
			}
		});
	});
})();