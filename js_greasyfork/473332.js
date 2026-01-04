// ==UserScript==
// @name         效率提升1%
// @namespace    https://vbd.baicizhan.com
// @version      4.0
// @description  可以提升一丢丢效率的小插件
// @author       hr
// @match        https://vbd.baicizhan.com/*
// @grant        none
// @license      hr
// @downloadURL https://update.greasyfork.org/scripts/473332/%E6%95%88%E7%8E%87%E6%8F%90%E5%8D%871%25.user.js
// @updateURL https://update.greasyfork.org/scripts/473332/%E6%95%88%E7%8E%87%E6%8F%90%E5%8D%871%25.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.css';
    document.head.appendChild(link);

    const toastifyScript = document.createElement('script');
    toastifyScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js';
    document.head.appendChild(toastifyScript);
    var style = document.createElement('style');

    // 添加样式内容
    style.textContent = `
    .custom-toastify {
    border-radius: 12px; /* 圆角 */
}
/* 隐藏滚动条 */
.hidden-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

/* 定义滚动条样式 */
.hidden-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

.suggestion-item {
    scroll-margin: 5px;
}

textarea::placeholder {
  color: #CACFD2;
}

.transition {
      opacity: 0;
      transition: opacity 0.3s ease-in-out; /* 添加过渡效果 */
    }
.tooltip {
    color: #A9DFBF;
    font-size: 12px;
}
    `
    document.head.appendChild(style);

    function createButtonsForAllInputs() {
        const inputElements = document.querySelectorAll('input[type="text"]:not([data-flag="skip"])'); // 选择所有文本输入框和 textarea 元素

        inputElements.forEach(inputElement => {
            const actionButton = createButton(inputElement);

            // 监听输入框内容变化事件
            inputElement.addEventListener('input', function () {
                updateButton(actionButton, inputElement);
            });

            // 初始化按钮状态
            updateButton(actionButton, inputElement);

            insertAfter(inputElement, actionButton);
        });
    }

    function createButton(inputElement) {
        const button = document.createElement('button');
        button.style.marginLeft = '5px';
        button.style.border = 'none';
        button.style.background = 'none';
        button.style.padding = '5px';
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            event.preventDefault();

            const inputValue = inputElement.value.trim();

            if (inputValue === '') {
                // 如果输入为空，从剪贴板粘贴内容
                navigator.clipboard.readText()
                    .then(function (text) {
                    inputElement.value = text;
                    inputElement.dispatchEvent(new Event('input')); // 手动触发输入事件
                })
                    .catch(function (error) {
                    alert("无法读取剪贴板，请给予页面权限！")
                });
            } else {
                // 如果输入框有内容，清空它
                inputElement.value = '';
                inputElement.dispatchEvent(new Event('input')); // 手动触发输入事件
            }
        });

        return button;
    }

    function updateButton(button, inputElement) {
        const inputValue = inputElement.value.trim();

        if (inputValue === '') {
            button.textContent = '📋';
        } else {
            button.textContent = '🧹';
        }
    }

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextElementSibling);
    }

    function addDatePicker(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            const datePicker = createDatePicker();

            input.parentNode.insertBefore(datePicker, input.nextElementSibling);

            datePicker.addEventListener('change', function () {
                input.value = datePicker.value;
            });
        }
    }

    function createDatePicker() {
        const datePicker = document.createElement('input');
        datePicker.type = 'date';
        datePicker.style.marginLeft = '5px';
        datePicker.style.borderRadius = '5px';
        datePicker.style.border = '1px solid #ccc';
        return datePicker;
    }

    const textarea = document.getElementById('query_string');

    if (textarea) {
        textarea.style.width = '270px';
        textarea.style.height = '80px';
        textarea.style.resize = 'none';
        textarea.className = 'hidden-scrollbar';
        textarea.placeholder = '1.请输入需要查询的接口名称\n2.右侧会自动匹配推荐项\n3.支持直接↑↓⏎或使用鼠标选择\n4.键入「空格」会自动补全连接符号'; // 添加提示文本
    }


    const suggestions = {
        "ai_sentence_analysis": "",
        "betActivityInfo": "",
        "switchRankStatus": "",
        "get_promotion_info": "",
        "revival": "",
        "receiveCredit": "",
        "get_daily_listen_detail": "",
        "eureka": "",
        "saveCakeBasic": "",
        "submit_topic_correction": "",
        "getHomeInfo": "",
        "get_exam_paper_list": "",
        "getMessages": "获取客服消息",
        "getDayRank": "获取日榜",
        "get_loading_ad_info": "",
        "updateMachinePetInfo": "",
        "getBczBookRoadmap": "",
        "invitationHandle": "",
        "get_books_replace_info": "",
        "getIndexInfo": "",
        "userQuitGame": "",
        "get_word_media_update_info": "",
        "sendEventAward": "",
        "get_pdf_list": "",
        "discard_round": "",
        "myCoursesV6": "",
        "getMyBookshelf": "",
        "related_question": "客服系统问题推荐",
        "change_course_account": "",
        "submitFeedback": "",
        "sentenceDaka": "",
        "sessionTransfer": "",
        "getUserWxBindInfo": "",
        "orderCreate": "",
        "get_user_machine_infos_v2": "",
        "getGroupAvatarFrameBackPack": "",
        "todayReadingRecommend": "",
        "frientActSquareTeam": "",
        "lockWord": "",
        "addAuthorizationLimitNum": "",
        "getUserBookRoadmap": "",
        "mallHomeHtml": "",
        "getWrongQuestionList": "",
        "removeAddress": "",
        "get_user_study_mode": "",
        "has_new_feeds": "",
        "submit_word_book_new_task": "",
        "submit_chapter_exam_result": "",
        "get_course_info": "",
        "deletePackingJob": "",
        "reminderEnable": "",
        "getCakeFinalExam": "",
        "getMachinePetCorpusCollection": "",
        "discoveryItem": "",
        "currentSessionV2": "单词对战当前赛季信息",
        "blindBoxRecord": "",
        "save_vocabulary_count": "",
        "qiniuUpToken": "",
        "answer": "",
        "batchRecordReviewAnswers": "",
        "get_device_sku_info": "",
        "getCartList": "",
        "collectList": "",
        "getArticleDetail": "",
        "saveCakeDataV3": "",
        "getTodayArticle": "",
        "getBcz11Home": "",
        "addNote": "",
        "get_shopping_ad": "",
        "getDatesV2": "",
        "eliminateWordList": "",
        "get_all_device_zpk_info": "",
        "sessionAccess": "",
        "add_book_mode_v2": "",
        "redeem_course_book": "",
        "get_member_popup_sale_info": "",
        "createAddress": "",
        "notifyHome": "通知中心",
        "addNewWords": "",
        "set_article_read": "",
        "get_exam_listen_cates": "",
        "getArticleComments": "",
        "get_mark_book_list": "",
        "gameConfig": "",
        "match_words_ocr": "拍照查词",
        "machineReportEvent": "",
        "getZpkInfoWatch": "",
        "search_school": "搜索学校",
        "paySuccess#insertUserOrder": "",
        "minorModeDetail": "",
        "creditExchange": "",
        "get_dates": "",
        "submitSetting": "",
        "currentStatus": "",
        "getAnnualSummaryDataV2": "",
        "markTimeout": "",
        "bottle_read_list": "",
        "get_schools": "",
        "getCreditRecords": "获取铜板记录",
        "save_listening_vocabulary_count": "",
        "open_session": "",
        "get_report_week": "",
        "newUser": "",
        "faqList": "",
        "acceptTask": "领取任务",
        "MallApiClient#submitAndPay": "",
        "get_doll_info": "",
        "MintReadingUserInfo": "",
        "get_dict_by_word_v2": "",
        "check_quick_tips_v2": "",
        "getUserBookInfo": "",
        "getMinorModeTopicListByWord": "",
        "receive_award": "",
        "setReadMode": "",
        "receiveNewGuideReward": "",
        "mark": "",
        "getSessionList": "",
        "get_exam_data": "",
        "cake_topic_completion": "",
        "userReport": "",
        "buy_lock_screen": "",
        "grantCoupon": "",
        "upgrade_sentence_building": "",
        "getCakeTopicResource": "蛋糕模式资源",
        "reminderPageInfo": "",
        "sessionDetailList": "",
        "taskHome": "",
        "get_today_word": "获取每日一句",
        "get_primary_school_mode_config": "",
        "getReward": "",
        "bind_phone": "",
        "get_friend_msgs": "",
        "getLetterDraftBox": "",
        "submitResult": "",
        "frientActPublishTeam": "",
        "getBookReadInfo": "",
        "getSocialFeatureVisitRecord": "",
        "nodeSearch": "",
        "checkIdentityImg": "",
        "get_guide_for_new_strategy": "",
        "qrcode_scan_rest": "",
        "user_daka_days": "",
        "setOnlyPublicKeyJoin": "小班设置仅邀请码加入",
        "getReportWeek": "",
        "get_voa_listen_list": "",
        "select_book": "选择词书",
        "setGroupQrCode": "",
        "getTaskList": "获取任务列表",
        "paymentGrant": "",
        "getGroupMemberList": "",
        "gachaponInviteUser": "",
        "get_chapter_video_v2": "",
        "get_syllable_list_for_exam": "",
        "submitLectureRead": "",
        "getFullCalendar": "",
        "receiveGroupRankAward": "小班每日段位奖励",
        "updateMachinePetCorpusLimit": "",
        "school2024Egg": "",
        "get_auth_user_list": "",
        "nodeSave": "",
        "uploadPhoto": "",
        "get_app_beta_update_info": "",
        "getContinuousDetail": "",
        "queryRecording": "",
        "allSaList": "",
        "getMinorBookSalePage": "",
        "getMemberTodayAward": "",
        "get_cake_topic_list_from_book_id_v3": "",
        "logout": "",
        "getLetterOutbox": "",
        "getLetterDetail": "",
        "submitUserStudyRecord": "",
        "sources": "",
        "categoryList": "",
        "update_user_setting": "",
        "checkResource": "",
        "getUserStatDetail": "",
        "get_rank_info": "",
        "get_picture_book_detail": "",
        "refundOrder#refundOrderDelCourse": "",
        "creditRemedyActivitySignUp": "",
        "getMembershipOrder": "",
        "taskList": "",
        "resetBookStudyRecord": "",
        "getGroupAuthorizationApplyInfo": "",
        "all_in_one_v3": "",
        "resurrect": "",
        "search_word_v3": "",
        "course_redirect_url": "",
        "topComment": "",
        "get_equipments": "",
        "formalMainBo": "",
        "getSettings": "",
        "getFlowDiversionPageInfo": "",
        "get_candles": "",
        "getAnnualSummary2022": "",
        "groupAvatarPermissions": "",
        "report_school": "",
        "getNotifyTask": "",
        "monthUpgrade": "",
        "create_user_address": "",
        "getWordDictResource": "",
        "testNotify": "",
        "notifyMintHome": "",
        "getXModeTopicListByWord": "",
        "beginNotify": "",
        "applyDeregister": "",
        "getArticleReadResult": "",
        "proModeDetail": "",
        "get_user_info": "",
        "checkDeregisterStatus": "",
        "get_index_info": "",
        "searchGoods": "",
        "getHistoryRecord": "",
        "getCouponList": "",
        "bcz_bind_try_user": "",
        "addBookshelf": "",
        "chargeVC": "",
        "getWordMark": "",
        "practiceResult": "",
        "game_home": "",
        "duibaNotify": "",
        "delete_user_book": "删除自定义单词本",
        "useProp": "",
        "buyGoods": "小卖部购买商品",
        "discoveryExposure": "",
        "updateAdvPosMaterial": "",
        "coursePageGroup": "",
        "sessionList": "",
        "submit_ability_record": "",
        "get_activity_updated_time": "",
        "getSelling": "",
        "saveXModeStudyRecord": "保存深度模式学习记录",
        "bcz_login": "",
        "check_access_token": "检查登录信息",
        "update_word_note": "",
        "getResultAd": "",
        "sync": "",
        "BczAsrClient#queryAsrResp": "",
        "check_quick_tips": "",
        "update_book_info": "",
        "check_cake_res_v3": "",
        "get_grade_list": "",
        "getCakeExamTopicIds": "",
        "getRecommendFriends": "获取推荐好友列表",
        "exchangeContinuous": "",
        "search_word_v2": "查询单词信息",
        "save_user_ext_info": "",
        "query_pdf_job": "",
        "getMatchResult": "",
        "create_class": "",
        "getActivityInfo": "",
        "get_island_roadmap": "",
        "userList": "",
        "get_word_note_version": "",
        "update_banner": "",
        "studyRecord": "上传蛋糕模式学习记录并打卡",
        "userRecordings": "",
        "updateChildInfo": "",
        "deleteNote": "",
        "getSaleGoods": "获取在售商品",
        "receiveCETMaterial": "",
        "user_limit_info": "",
        "remove_bind_machine": "",
        "needSyncPlan": "",
        "getCakeBookList": "",
        "notify": "",
        "mock_send_captcha": "",
        "notifyList": "通知列表",
        "getAddOnItems": "",
        "update_done_data": "上传学习记录",
        "get_practice_popup_adv": "",
        "examActivityInfo": "",
        "edit": "",
        "minorMode": "",
        "buyBookNotify": "",
        "satisfaction": "",
        "submitArticleDone": "",
        "getMyDoneArticles": "",
        "report_event": "",
        "removePost": "删除招募海报",
        "getStoryPathSummary": "",
        "guess_home": "",
        "get_all_collect_words_v2": "",
        "correct_word": "",
        "rankHome": "",
        "get_collect_problems_by_chapter": "",
        "submitTime": "",
        "set_study_spell_mode": "",
        "switchBczBookStudy": "",
        "getPlanInfo": "",
        "next": "",
        "setGroupIntroduction": "",
        "get_top_tab_status": "",
        "submitArticleRecords": "",
        "credit_task_center": "",
        "feedbackLevelTree": "",
        "getInviteCode": "小班获取邀请码",
        "submit_collect_question": "",
        "start_round": "",
        "tournamentAuditInfoOperate": "",
        "listAll": "",
        "get_read_stat": "",
        "get_scan_device_notify": "",
        "getTodayCommend": "",
        "daka_rescue": "补日历",
        "buy_book": "",
        "book_mode_list": "当前词书可选模式",
        "acceptFriend": "接受好友申请",
        "getCardInfo": "",
        "exchangeQuota": "",
        "report_startup_ad_event": "",
        "enableDuiba": "",
        "addNewWordsV2": "",
        "getTermNotices": "",
        "customerChange": "",
        "getInviterInfoList": "",
        "daka": "深度模式h5打卡接口",
        "user_limit_info_v2": "学习设置信息",
        "todayReadingStat": "",
        "getIconList": "",
        "pictureMarkRead": "",
        "cleanNewStarWords": "",
        "register_user": "",
        "questionList": "",
        "get_contest_detail": "",
        "check_feedback_msg": "",
        "contextModeGenOption": "",
        "getGroupInfo": "",
        "authMiniProgram": "",
        "queryArticleRecord": "",
        "searchOrder": "",
        "updateIosUserDiscountRecord": "",
        "fightHistory": "",
        "getCakeTopicResourceV3": "",
        "upload": "",
        "get_recommend_books": "",
        "cancelCollectGoods": "",
        "getProductGroupSkuList": "",
        "periodUserRefund": "",
        "cancelBookshelf": "",
        "removeLetterInbox": "",
        "getMemberPopupSaleInfo": "",
        "get_latest_notify": "",
        "getSensitiveWords": "",
        "has_new_friend_msgs": "",
        "saveTask": "",
        "get_learn_stat_week": "",
        "getMyLinksForApp": "",
        "myBook": "",
        "annual2023Dress": "",
        "receive_login_award": "",
        "presell": "",
        "MallApiClient#sendUserCoupon": "",
        "getUserCouponCount": "",
        "maxSupport": "",
        "getLetterUserInfo": "",
        "getGroupRankInfo": "获取小班排行榜",
        "shareRecordingsList": "",
        "couponList": "",
        "restoreBook": "",
        "userInfo": "",
        "getTagInfos": "",
        "get_report_daily": "",
        "getProModeTopicListByWord": "",
        "getMyBookshelfPackages": "",
        "getDailyReward": "",
        "together_home": "一起背首页链接",
        "search_user": "",
        "payInfo": "",
        "apply_friend": "",
        "get_live_streaming_info": "",
        "endGameByCountDown": "",
        "get_ref_detail": "",
        "get_exam_zpk_info": "",
        "get_main_view_top_banner_advs": "",
        "reportEventWithoutLogin": "",
        "getFriendState": "",
        "get_correct_detail": "",
        "join": "加入小班",
        "fight_count_between_date": "",
        "livedone": "",
        "submit_record": "",
        "get_course_offline_info": "",
        "relearn_word_list": "",
        "itemFindPage202204": "",
        "exchangeRestCard": "",
        "getChnMean": "",
        "saveWorthyOpt": "",
        "receive": "",
        "contestModeTopicByBookId": "",
        "sendCoupon": "",
        "third_party_login": "第三方登录",
        "get_train_page_resource": "四大金刚和单词训练",
        "getRecommendList": "",
        "permissionAcquire": "",
        "maCodeExchange": "",
        "get_study_record_by_book_id": "",
        "get_user_entitlement_infos": "",
        "schoolRank": "",
        "get_member_tools_list": "",
        "searchPositions": "",
        "teacherExportData": "",
        "guess_reset": "",
        "getFreeMember": "",
        "bind_user": "",
        "result": "单词对战结果",
        "submitPreviewDone": "",
        "delete_beta_game_real": "",
        "getLetterSessionPage": "",
        "get_dress": "",
        "activityStatus": "",
        "daka_rescue_by_str": "打卡日历补卡",
        "eliminateSaveRecord": "",
        "set_study_extra_config": "",
        "wordMatchRemind": "",
        "get_improve_video_info": "",
        "proModeDemo": "",
        "getRecommendGoodByPage": "",
        "get_all_credit_mall": "",
        "match_word_list": "",
        "get_daka_background_datas": "",
        "getOnlineList": "",
        "notifyUserBookDone": "单词机完成单词本同步",
        "orderStatus": "",
        "getGoods": "",
        "batchRecordAnswers": "",
        "delete_write": "",
        "get_all_books_basic_info_v3": "",
        "get_c2_list": "",
        "eliminateHome": "",
        "getMachinePetCorpusNew": "",
        "initOrder": "",
        "machineNotify": "",
        "get_template_detail": "",
        "getWordMatchWeekReport": "",
        "confirm_bind": "",
        "switch_scholar_account": "",
        "ugcInfo": "",
        "getBanner": "",
        "star_word": "",
        "discoveryGeneralTrafficDriving": "",
        "cancel_cut_word_list": "",
        "matchAction": "",
        "submitTryVipOrder": "",
        "getNewUserCredit": "",
        "applyList": "",
        "get_user_study_config": "学习设置信息",
        "getAllRoles": "",
        "practiceMain": "",
        "get_loading_ad_items": "",
        "currentRankingList": "",
        "getMonthlyCalendar": "",
        "guess_level_tip": "",
        "getMarkWordCount": "",
        "userLatest": "",
        "get_book_list": "",
        "getBczBook": "单词机获取官方词书",
        "redirectForClient": "",
        "betUpgrade": "",
        "buy_life": "",
        "saveCakeExamTopicIds": "",
        "upgrade_4in1": "",
        "get_main_view_bottom_advs_v2": "",
        "get_all_books_basic_info": "",
        "getCakeTopicListByBookId": "",
        "getHistoryDeskmate": "获取历史同桌信息",
        "getGoodsInfo": "",
        "rhymeV2": "押韵模式资源",
        "setAlertTime": "",
        "allChapter": "",
        "getH5PracticeSuggestCourse": "",
        "deviceInfo": "",
        "practiceSummary": "",
        "skuList": "",
        "discoveryModule": "",
        "getLearnBookInfo": "",
        "qrcode_scan": "扫描二维码",
        "getCollectedWord": "",
        "download_topic": "",
        "getDiscoveryItems": "",
        "add_book_mode": "",
        "getPenRoadmapByBookId": "",
        "getRecommendOrdinaryGroups": "获取推荐小班列表",
        "machinePetCorpusCollection": "",
        "add_collect_words": "一键收藏单词",
        "school2024InviteUser": "",
        "getActivityId": "",
        "chargeVCV2": "",
        "updateAddress": "",
        "tournamentMain": "",
        "groupMemberInfo": "小班成员信息",
        "sentenceDetail": "",
        "getpgc": "",
        "invite": "邀请？",
        "myCourseV3": "",
        "subjectFindPage202204": "",
        "getLetterInbox": "",
        "contestReserve": "",
        "listCapacities": "",
        "study_addition": "",
        "listQuestionsNew": "",
        "setUserTags": "",
        "get_online_mode_list": "",
        "handle": "",
        "getRankAchievement": "",
        "getReviewProgress": "",
        "reportEventMaigc": "",
        "getUserIosPromotionIdList": "",
        "get_server_port": "",
        "getAllGoods": "",
        "saveContextModeTopic": "",
        "get_child_address": "",
        "getInviteeList": "",
        "updateFeedback": "",
        "changeUserRole": "",
        "get_paper_detail": "",
        "get_zpk_md5s": "",
        "sessionCreate": "",
        "modifyLetterDraftBox": "",
        "cancelThumb": "",
        "sendGroupLeaderAvatarFrame": "",
        "interestUpdate": "",
        "getExportDataList": "",
        "signAgreement": "",
        "delete_user_book_words": "批量删除单词本单词",
        "user_daka_v2": "客户端打卡接口",
        "getRemindCoupon": "",
        "claimRewardBackdoor": "",
        "list": "",
        "saveBooks": "",
        "changeSku": "",
        "wechatDict": "",
        "loginWX": "",
        "xMode": "深度模式资源",
        "getAdvPosRules": "",
        "get_voa_listen_detail": "",
        "get_all_selected_book_plan_info": "所选词书信息",
        "checkLastContinuous": "",
        "getCommentInfo": "",
        "submitBczStudyRecord": "单词机提交官方词书学习记录",
        "mergeAlreadyLearnedWords": "",
        "get_page_list": "",
        "get_group_role_pages": "",
        "get_latest_notify_v2": "",
        "contextModePackBook": "",
        "letterDressUpdate": "",
        "getUserCredit": "",
        "reissueMinorBook": "",
        "getGroupLeaderRank": "",
        "usePropCard": "",
        "currentSp": "",
        "get_collect_problems_all": "",
        "uploadRecording": "",
        "get_latest_feed_time_gz": "",
        "get_machine_bind_hint": "",
        "win_streak_status": "",
        "checkRhymeResource": "",
        "getBookPackages": "",
        "getIReadingArticle": "",
        "applyBet": "",
        "getAwardEvent": "",
        "getDeviceList": "获取设备列表",
        "export_words": "",
        "endNotify": "",
        "userPopInfo": "",
        "get_book_mall": "",
        "receiveXModeCredit": "领取深度拼写奖励",
        "upload_task_action": "",
        "getShopCartInfo": "",
        "quit": "退出小班",
        "get_category_list": "",
        "school2024Home": "",
        "getGoodsShowRule": "",
        "learnWord": "",
        "sellInfo": "",
        "notify_exam_data_done": "",
        "elastic": "",
        "submitStudying": "",
        "info": "",
        "getMachinePetCorpus": "",
        "get_lock_screens": "",
        "getUserStatData": "",
        "courseStatusV2": "",
        "checkXModeResource": "",
        "preApply": "",
        "getBindKey": "",
        "balance": "",
        "deleteFailedPuzzle": "",
        "mine": "",
        "word_pk": "",
        "getCakeTopicListByBookIdV3": "",
        "updateUserBook": "",
        "get_study_home_v2": "",
        "get_domain_whitelist": "",
        "submit": "",
        "tryVipNotify": "",
        "getChildAddress": "",
        "messageList": "客服消息列表",
        "myTerms": "",
        "contestCancelMatch": "",
        "getPenBindStatus": "",
        "get_star_daily_listen_list": "",
        "getAlertTime": "",
        "proMode": "",
        "user_basic_info": "",
        "updateMachinePetLevel": "",
        "getBoxState": "小班每日铜板情况",
        "generateCode": "",
        "getMyTeachersV2": "",
        "collectWord": "h5收藏单词接口",
        "getWeekDakas": "",
        "get_batch_records": "",
        "get_contest_status": "",
        "get_book_desc": "",
        "sendMsg": "同桌传纸条",
        "updateReadingTime": "",
        "export_words_v2": "",
        "frientActJionWaitList": "",
        "guess_level_detail": "",
        "sessionMemoModify": "",
        "eliminateQuota": "",
        "get_learned_words_list": "获取词书已学单词",
        "search": "",
        "winStreakDaily": "",
        "reset_sutdy_record": "",
        "on_mall_done": "",
        "listRedemptions": "",
        "initProp": "",
        "getBlackList": "获取好友黑名单",
        "set_study_listening_mode": "",
        "get_daily_listen_list": "",
        "getUserBookRoadmapV2": "",
        "report_finish_book": "上报完成整本词书",
        "getUserAvatarFrameBackpack": "",
        "departmentList": "",
        "addPreviewStarWords": "",
        "information": "小班信息",
        "getWeekRank": "获取小班周榜信息",
        "book_mall": "",
        "get_signature": "",
        "done_word_stat": "",
        "periodList": "",
        "getPdfEditionList": "",
        "heartBeat": "单词对战心跳",
        "get_star_joy_listen_list": "",
        "get_building_map": "",
        "share_bonus": "打卡分享领铜板",
        "merge_already_learned_words_async": "",
        "getCreditVo": "",
        "monthGetCopper": "",
        "getAdItems": "",
        "match": "单词对战匹配到用户",
        "check_new_version_v3": "",
        "saveXModeSetting": "保存深度模式设置",
        "practiceHeartbeat": "",
        "friendActUserInfo": "",
        "gachaponHome": "",
        "getFriends": "获取好友列表",
        "deleteArticleRecord": "",
        "saveCakeFinalExam": "保存蛋糕模式测验数据",
        "login": "",
        "submitWelcomeSurvey": "",
        "getGroupUserInfo": "",
        "recordList": "",
        "get_switches": "",
        "submit_result": "",
        "userAgreement": "",
        "getExamPaperVideo": "",
        "merge_already_learned_words": "",
        "get_login_total": "",
        "scan_for_watch_login": "",
        "choice_address": "",
        "home2024": "",
        "getNotify": "",
        "update_school": "",
        "getUserStarWords": "",
        "bookEvaluate": "",
        "getLetterTopicPage": "",
        "duibaLoginUrl": "",
        "getMemberInfoPage": "",
        "getDakaCalendar": "获取打卡日历",
        "getTags": "",
        "getHomePageInfo": "",
        "createLetterGenerateTask": "",
        "codeSession": "",
        "getRegionInfo": "",
        "discoveryItemComments": "",
        "get_shopping_imgs": "",
        "likeUnlike": "个人主页点赞",
        "startContinuousPlan": "",
        "getCakeTopicResourceV5": "",
        "periodDetail": "",
        "updateRule": "",
        "school2024SubmitLottery": "",
        "modifyGoods": "",
        "getChallenge": "",
        "watch_poll_login": "",
        "getDictData": "",
        "searchCrowds": "",
        "get_zpk_infos": "",
        "get_book_resource_update_info": "",
        "getMyNotes": "",
        "getQuestions": "",
        "get_flag_booking": "",
        "ugcShow": "",
        "huawei_pay": "",
        "guess_level_done": "",
        "online_cake_book_v3": "",
        "getGoodsInfoByIds": "",
        "getRhymeTopicListByWord": "",
        "get_problems_by_chapter": "",
        "submit_study_record": "",
        "getChallengeResult": "",
        "isWXBound": "",
        "get_new_concept_user_status": "",
        "get_today_scene_article": "",
        "ugcList": "",
        "delete_word_note": "",
        "update_roadmap": "",
        "mbtiMain": "",
        "getApplyStatus": "",
        "match_home": "",
        "currentMode": "",
        "upload_today_topic_ids": "",
        "homePage": "",
        "get_lavaquest_game_info": "",
        "actionPushTask": "",
        "check_pre_word_book_task": "",
        "getRecommendedGroups": "获取推荐小班列表",
        "friendActInvite": "",
        "get_all_selected_books": "",
        "recvDeskmate": "接受同桌申请",
        "upload_sentence": "",
        "cancelApplyDeregister": "",
        "winStreakStatus": "",
        "get_course_token": "",
        "getLetterDraft": "",
        "getPowerInfo": "",
        "cut_word": "",
        "setSocialFeatureVisitRecord": "",
        "inviteInfo": "",
        "getMoney": "",
        "saveAdvPosRules": "",
        "getUserBook": "单词机获取单词本",
        "get_user_ugc_list": "",
        "getThemeDetails": "",
        "roleList": "",
        "sentence_sku_info": "",
        "getProfileTags": "",
        "getUserBookReviewmap": "单词机获取单词本复习路线图",
        "open_lucky_envelope": "",
        "match_address": "",
        "getTask": "单词机轮询接口",
        "getBookRecommend": "",
        "contestSummary": "",
        "sendMessage": "发送消息",
        "get_tools_list": "",
        "updateDictData": "",
        "delComment": "",
        "search_major": "",
        "getUsersAvatarFrame": "",
        "save_data_detail": "",
        "deletePenWordsBook": "",
        "get_picture_books": "",
        "AdPlatformClient#getAdItem": "",
        "get_csldt_question": "",
        "getCakeConfig": "",
        "checkimg": "",
        "getUserIdByOrderIdOrUid": "",
        "get_word_note": "",
        "inviteStatus": "",
        "get_exploration_items": "",
        "getVersionList": "",
        "get_exam_listen_albums": "",
        "copper_exchange": "",
        "frientActRemind": "",
        "faqEdit": "",
        "remove_book_mode": "",
        "getAward": "",
        "get_export_activity_info": "",
        "queryCertificate": "",
        "add_user_book": "添加单词本",
        "giveUpContinuous": "",
        "operateGroupAvatarFrame": "",
        "rename_machine_v2": "",
        "addComment": "",
        "getAnnualSummary2023": "",
        "get_chapter_hot_comment": "",
        "get_custom_ads_config": "",
        "removeWxBound": "",
        "submitBczStudyRecordV2": "",
        "failedPuzzle": "",
        "groupListWithUser": "",
        "orderConfirm": "",
        "changeMode": "",
        "wecom_custom_notify": "",
        "duibaConsume": "",
        "machineUpdateCredit": "",
        "get_app_new_version_info": "",
        "deduct_life": "",
        "restrictGroup": "",
        "registerIOSDevice": "",
        "get_explore_popup_adv": "",
        "toggleQuestionCollection": "",
        "getUserRole": "",
        "zhanJiaList": "",
        "get_packages_to_add": "",
        "set_study_chn_mode": "",
        "get_loading_imgs": "",
        "get_user_machine_infos": "",
        "get_daily_listen_today": "",
        "getBooks": "",
        "saAdminList": "",
        "update_book_mall_desc": "",
        "answerLetter": "",
        "inviteJoinGroup": "邀请加入小班",
        "pkMain": "",
        "home": "",
        "deleteAutoReply": "",
        "searchGoodsByTagId": "",
        "currentUser": "",
        "inviteKey": "小班shareKey转inviteKey",
        "removeGoods": "",
        "post_select_role_action_config": "",
        "getUserStatus": "",
        "frientActNewbieReward": "",
        "roadmap_by_word_level_v2": "",
        "mallNotify": "",
        "contactsChange": "",
        "teacherCreate": "创建教师小班",
        "postAction": "",
        "subscribeSearchKey": "",
        "getCakeBookListV3": "",
        "get_practice_banner_adv": "",
        "get_word_list_word_meta_v2": "",
        "join_beta_4in1": "",
        "delete_word": "",
        "saveRhymeTopic": "",
        "prepareMain": "",
        "get_bind_info": "账号绑定信息",
        "quitChallenge": "",
        "add_ios_mall": "",
        "get_all_book_tags": "",
        "check_infos": "",
        "getCakeBadge": "小学新人成就",
        "batchUploadTaskList": "",
        "update_user_address": "",
        "getRedDotNotice": "",
        "save_correct_write": "",
        "join_beta_game_real": "",
        "getUserBlackState": "",
        "user_basic_info_v2": "用户详细信息",
        "orderReceive": "",
        "get_third_ad": "",
        "getMinorModeTopicByBookId": "",
        "allPaperBook": "",
        "completeGuide": "",
        "updateUserAssessResult": "",
        "rankingList": "",
        "getNotifies": "",
        "get_course_id_list": "",
        "getBczBookRoadmapV2": "",
        "get_device_pro_ireading": "",
        "revokeEditingTopic": "",
        "bind_phone_v3": "绑定手机",
        "get_today_sentence": "",
        "get_main_page_js": "",
        "periodUserList": "",
        "getThemeInfoList": "",
        "betReceiveAward": "",
        "get_school_2024_invite": "",
        "get_status": "",
        "salePageList": "",
        "submitMigrate": "",
        "getVocabBook": "",
        "get_article_resources": "",
        "getPractice": "",
        "get_books_ad_v2": "",
        "frientActApply": "",
        "get_activity_tools_list": "",
        "getRhymeBookList": "",
        "get_daka_bg_images": "",
        "saveItem": "",
        "sharedArticleRecord": "",
        "examPagerInfoV3": "",
        "searchSimpleWordData": "",
        "getPayPrice": "",
        "practiceMatch": "",
        "get_beta_user_types_v2": "",
        "remove_member": "",
        "redeemBookPackage": "",
        "check_new_version": "",
        "get_worth": "",
        "get_game_study_stat": "",
        "rejectInviter": "",
        "get_friend_msg_count": "",
        "analyze_clipboard": "",
        "star_content": "",
        "create": "创建小班",
        "translate_v2": "",
        "getWordBookLevel": "",
        "zhanJiaInfo": "",
        "myEndCourseV2": "",
        "getMyGroupRank": "获取我的小班段位",
        "getRhymeTopicByBookId": "",
        "submitInfo": "",
        "save_draft": "",
        "exportDataCallback": "",
        "getHomePage": "",
        "mine_v2": "",
        "certificate": "",
        "setGroupName": "",
        "BczAsrClient#speechAssessWithUrl": "",
        "submitStudyRecord": "",
        "delete_collect_words": "批量删除收藏单词",
        "get_user_books": "获取用户单词本",
        "getRankAward": "段位奖励",
        "add_word_to_books": "收藏单词",
        "getRecruitmentPostList": "获取招新海报列表",
        "get_user_entitlement_sale_info": "",
        "chargeMall": "",
        "discoveryLike": "",
        "getGoodsThemeList": "",
        "orderPay": "",
        "reset_password": "",
        "get_payed_books": "",
        "saveMinorModeTopic": "",
        "getRecommend": "",
        "collectGoods": "",
        "get_order_info": "",
        "getWordResource": "",
        "get_daka_base_info": "",
        "getDeskmateInfo": "获取同桌信息",
        "getGroupRank": "获取小班排名",
        "getUploadToken": "",
        "report_listen_stat": "",
        "getReportList": "",
        "upgrade": "",
        "correct_write": "",
        "get_study_info": "",
        "frientActMessage": "组队打卡消息",
        "addScholarByCode": "",
        "initXmodeData": "",
        "userGift": "",
        "get_user_plan_book": "",
        "getH5PracticeBannerAdv": "",
        "resetUserStudyRecord": "",
        "select_user_book": "单词机选择单词本计划",
        "setNickname": "",
        "gen_audio_neural": "",
        "get_token_status": "",
        "get_album_list": "",
        "getInvitationInfo": "",
        "getCouponExchangeRecord": "",
        "buyGroupGoods": "购买小班招新卡",
        "permissionAcquireCallback": "",
        "update_book_mall": "",
        "inviteMatch": "",
        "resetCakeExam": "",
        "get_exam_listen_albums_detail": "",
        "usualCustom": "",
        "getUserAddress": "",
        "get_word_list_status": "",
        "submit_word_error": "",
        "updateTopicData": "",
        "deleteFeedback": "",
        "have_a_try_v2": "",
        "getServicePackages": "",
        "challengePuzzle": "",
        "orderInfo": "",
        "getXModeBookList": "",
        "get_achievement": "",
        "uploadImg": "",
        "winStreakHome": "",
        "addUserTag": "",
        "verifyAliyunCaptcha": "",
        "getOpenLetterSession": "",
        "match_save_record": "",
        "user_finish_book_faunt": "",
        "seek": "h5查词接口",
        "submitArticleAnswer": "",
        "getSurveyResult": "",
        "submitQueryWord": "",
        "summary": "",
        "changeProvince": "",
        "get_book_mode": "",
        "saveProModeTopic": "",
        "gameDaka": "",
        "share_bonus_v2": "",
        "studyingList": "",
        "get_study_record": "",
        "syncPenInfo": "",
        "removeLetterDraft": "",
        "buy_life_v1": "",
        "getProBindStatus": "",
        "getTopicIds": "",
        "uploadAdEvent": "",
        "getTeacherInfoByOrder": "",
        "getCakeTopicListByWord": "",
        "sessionBaned": "",
        "getProModeTopicByBookId": "",
        "retry_pack_job": "",
        "get_little_module": "",
        "preCheck": "",
        "submit_win_streak_records": "",
        "show_color_egg": "",
        "getContextModeCreditStatus": "",
        "ownGroups": "拥有的小班信息",
        "submitPractice": "",
        "annual2024Dress": "",
        "choiceAddress": "",
        "get_study_home": "",
        "AdPlatformClient#sendAdOpLog": "",
        "getTryVipInfo": "",
        "notifyUserRoadmapDone": "",
        "refund_device_pro": "",
        "sendLetter": "",
        "get_credit": "",
        "inviteHomePage": "",
        "recordPreview": "",
        "getPenUserBooks": "",
        "cakeV4AB": "",
        "getUserGoods": "获取用户背包物品",
        "getBczBookReviewmap": "单词机获取官方词书复习路线图",
        "get_collect_words_updated_at": "",
        "blackListState": "",
        "getContinuousTasks": "",
        "registerDevice": "绑定单词机",
        "eliminateRecordList": "",
        "getPenWordsByBookId": "",
        "addCakeBookV3": "",
        "updateServMemo": "",
        "update_role": "",
        "selectMinorBook": "",
        "submit_improve_chapter_done": "",
        "send_share_success": "",
        "contextModeTopicByWord": "",
        "frientActHome": "",
        "get_contest_result": "",
        "submit_problem_progress": "",
        "set_custom_ads_config": "",
        "sync_info": "",
        "get_home_info": "",
        "indexInfo": "",
        "jsSdkInitSign": "",
        "get_strategy": "",
        "upgrade_sentence_building_v2": "",
        "get_chapter_report": "",
        "share_mail": "",
        "get_week_dakas": "",
        "reset_done_score_data": "重置词书",
        "get_cake_phonic": "",
        "addRule": "",
        "add_words_to_book": "收藏单词",
        "third_party_bind_try_user": "",
        "delete_user_address": "",
        "usualLotteryInfo": "",
        "batchChangeXmodeData": "",
        "addAdvPosMaterial": "",
        "get_word_exam_status": "",
        "reserveStatus": "",
        "unbind_third_party": "",
        "getSearchPageResource": "",
        "submit_word_book_task_continue": "",
        "getXModeTopicByBookId": "",
        "get_bind_list": "",
        "add_book_island_v2": "",
        "get_user_address": "",
        "getPropCardBackpackByChildCategory": "",
        "advPosMaterial": "",
        "check_new_version_v2": "",
        "BczAsrClient#contactAudios": "",
        "pageQuery": "",
        "getGrades": "",
        "applyFriend": "申请添加好友",
        "saList": "",
        "getHomeAd": "",
        "reportInformationOperate": "",
        "removeMembers": "移除小班成员",
        "match_words": "添加单词并识别",
        "winStreakMonthlyStatus": "",
        "cakeBasic": "",
        "userOnlineKeepAlive": "",
        "getCreditExpireUserInfo": "",
        "eliminateErrorWords": "",
        "byteDanceTv": "",
        "get_book_ids_by_sentence_id": "",
        "listChanges": "",
        "setNotice": "",
        "switchDevice": "",
        "mail_info": "",
        "getPreviewRecords": "",
        "get_data_detail": "",
        "getMyReadBooks": "",
        "uploadImage": "",
        "add_words_to_books": "收藏单词",
        "get_problems_all": "",
        "receiveLetter": "",
        "add_packing_job_mode": "",
        "like": "点赞",
        "get_star_exam_listen_list": "",
        "myCourse": "",
        "save": "",
        "match_words_ocr_draw": "",
        "submit_receive_course": "",
        "getChildStudyInfoV2": "",
        "getExamPaperAudios": "",
        "modify_class_name": "",
        "recordStoryNode": "",
        "getRhymeStatistics": "",
        "getAllArticles": "",
        "all_in_one": "",
        "orderCancel": "",
        "get_game_word_list": "",
        "setInviteKey": "",
        "get_free_member": "",
        "getWeiXinToken": "",
        "getOneUnEndTask": "",
        "getUserInfo": "",
        "in630": "",
        "unRegisterDevice": "解绑设备",
        "reportEvent": "",
        "charge": "",
        "frientActRandomName": "生成小队随机名称",
        "getTeacherState": "",
        "goodsAction": "",
        "choiceCourses": "",
        "getLetterGenerateTaskInfo": "",
        "get_suggest_friends": "",
        "ugcSubmit": "",
        "get_books_ad": "",
        "get_startup_ad": "",
        "paySuccess#insertUserBuyBook": "",
        "submit_experience_record": "",
        "itemAlbumList": "",
        "uploadImageV2": "",
        "discoveryWatch": "",
        "getPushTask": "",
        "annualSummary2024": "",
        "get_star_voa_listen_list": "",
        "save_word_down_score": "",
        "getUserTerms": "",
        "rename_machine": "",
        "reportFinishDailyPlan": "上报完成学习计划",
        "getAllMinorBooksInfo": "",
        "orderList": "",
        "getLiveInfo": "",
        "getAllBczChildBookInfo": "",
        "submitChallenge": "",
        "bottle_detail": "",
        "sendFeelings": "",
        "getMsgInfos": "",
        "get_copper_exchange_info": "",
        "getMergeState": "",
        "get_merge_state": "",
        "sentence_home": "",
        "roster": "",
        "prefixSearch": "",
        "upload_img": "",
        "updateIndexInfo": "",
        "get_user_lock_screen": "",
        "checkMigrate": "",
        "innerGrantGoods": "",
        "contextMode": "",
        "livecallback": "",
        "evaluateScore": "",
        "frientActReportInfo": "",
        "report_event_without_login": "",
        "uploadPenWords": "",
        "updateGroupInfo": "",
        "getRecommandGoods": "",
        "updateNote": "",
        "select_sentence_sku": "",
        "update_user_book_name": "",
        "permissionGet": "",
        "handleOrderCallback": "",
        "getAuditListAll": "",
        "get_joy_listen_cates": "",
        "personalDetails": "个人主页信息",
        "dealWithWords": "",
        "getTopicAuditListV2": "",
        "school2024Awards": "",
        "choiceGoods": "",
        "energy": "单词对战补充能量",
        "get_topic_resource_v2": "获取单词资源",
        "orderRefund": "",
        "update_grade": "",
        "startSchoolResult2023": "",
        "query": "",
        "contestRankList": "",
        "get_group": "",
        "finish_round": "",
        "get_startup_ad_v2": "",
        "userEdit": "",
        "authorizationHandle": "",
        "getGroupAuthorizationPage": "",
        "uploadIdentity": "",
        "update_ireading_trial_time": "",
        "getugc": "",
        "report_learn_stat": "",
        "getWordLevels": "",
        "getUnit": "",
        "weixinOauthInfo": "",
        "remove_bind_machine_v2": "",
        "getRecommendListV3": "",
        "frientActInfo": "",
        "getXModeStudyRecord": "获取深度模式学习数据",
        "batchSendNoticeToMentionedUsers": "",
        "paperListV3": "",
        "getGroupIntroduction": "",
        "scanResult": "",
        "operateGoods": "装扮背包物品",
        "delete_done_score_data": "删除词书",
        "getBookInfo": "",
        "get_book_description": "",
        "get_word_list_word_meta_v3": "",
        "specialTopicDetail": "",
        "saveNotifyTask": "",
        "search_syllable": "",
        "getPaidBookSaleInfo": "",
        "getFightHome": "",
        "set_study_fast_mode": "",
        "getUserRecordSentences": "",
        "writeOCR": "",
        "get_product_content_list": "",
        "getMsgRecord": "",
        "getTopicDataV2": "",
        "listWordsToLearn": "",
        "startWordMatchGame": "",
        "courseInfoV2": "",
        "get_data_list_by_template": "",
        "trySend": "",
        "get_dict_wiki_by_word": "",
        "login_wx": "",
        "get_position_list": "",
        "addStarWord": "",
        "removeDeskmate": "移除同桌",
        "updateUserActive": "",
        "get_all_replace_info": "",
        "sendMessageV2": "发送客服消息",
        "sentence_start": "",
        "apple_login": "",
        "getCreditClearActivityInfo": "",
        "getSetting": "",
        "setUserBookPlan": "",
        "getMemberRecord": "",
        "getAllBooks": "",
        "open_box": "",
        "notice": "小班公告",
        "exchange": "",
        "get_remind_info": "",
        "sendWordMatchReward": "",
        "getSyncStatus": "",
        "login_with_phone": "",
        "getGroupRankReport": "",
        "get_discovery_info_v3": "",
        "get_union_id": "",
        "watch_video": "",
        "get_resources": "",
        "getProQrCode": "",
        "get_audio_list": "",
        "send_sms_verify_code": "",
        "getInProcessApplyRecord": "",
        "bottle_like": "",
        "yapi": "",
        "getAbtestGroup": "",
        "getGroupExpressions": "",
        "markAllRead": "通知一键标记已读",
        "getRecommendGroups": "",
        "batchUpload": "",
        "paySuccess#successToAddTryVip": "",
        "frientActLotteryInfo": "",
        "applyPermission": "",
        "betSummary": "",
        "getSystemInfo": "",
        "getUserCenterInfo": "",
        "deleteFailPuzzle": "",
        "orderCallBackInfo": "",
        "remindDeskmate": "挽留同桌",
        "memberBasic": "小班成员信息",
        "update_position": "",
        "saveXModeTopic": "",
        "addIntoPeriod": "",
        "getStoryPathDetail": "",
        "monthInfo": "",
        "person_home": "",
        "download": "",
        "inTaskExperiment": "",
        "gamePage": "",
        "get_singleton_list": "",
        "getUserTermCoupons": "",
        "setNickName": "设置好友昵称",
        "autoReplayStatus": "",
        "roleDetail": "",
        "send_sms_verify_code_for_h5": "",
        "get_feeds": "",
        "cost_compass": "",
        "saveCakeData": "",
        "get_review_info": "",
        "get_user_book_words": "获取用户单词本中的单词",
        "submitugc": "",
        "get_exam_listen_audios": "",
        "getPdfEditionSections": "",
        "getGamePageInfo": "",
        "report_read_stat": "",
        "getStudyRecord": "",
        "<nil>": "",
        "finishTask": "任务中心完成任务",
        "writeHome": "",
        "get_beta_user_types": "",
        "searchGoodsByAlbumId": "",
        "updateOrderAddress": "",
        "get_vip_ad": "",
        "get_roadmap": "",
        "getXModeCreditStatus": "获取深度模式拼写铜板状态",
        "getBookPackageInfo": "",
        "notifyBczRoadmapDone": "单词机完成官方词书路线图同步",
        "cut_word_list": "",
        "saveExpressions": "",
        "guess_level_words": "",
        "get_4in1_tools_list": "",
        "openBox": "小班每日打卡奖励",
        "set_lock_screen": "",
        "getUserBlackList": "",
        "modify_class_notice": "",
        "get_discovery_info": "",
        "get_latest_device_type": "",
        "word_bug_report": "",
        "orderSubmit": "",
        "get_device_pro_refund": "",
        "get_main_view_bottom_advs_v3": "",
        "get_new_notification": "",
        "modify_class_desc": "",
        "unstar_content": "",
        "failPuzzles": "",
        "redemptionSummary": "",
        "getDailyList": "",
        "exportFileList": "",
        "studyWordsTogetherHomePage": "一起背首页信息",
        "get_launch_ad": "",
        "getQaInfo": "",
        "commentGetFindPage202204": "",
        "packBook": "",
        "lemmatization": "",
        "removeApplyList": "清空好友申请列表",
        "statusEdit": "",
        "getGroupList": "",
        "resetReviewProgress": "",
        "get_chapter_status": "",
        "recordAction": "",
        "getTopicData": "",
        "getCredit": "",
        "publishPost": "发布招新海报",
        "get_test_flags": "",
        "notifyBczBookDone": "单词机完成官方词书同步",
        "activityState": "",
        "removeFriend": "移除好友",
        "get_down_words": "",
        "use_tip": "",
        "callback": "",
        "userInfoByUid": "",
        "getWhistleblowerList": "",
        "check_resource_book": "",
        "getQuestionStatistic": "",
        "get_friends": "",
        "postList": "",
        "getDeviceInfo": "",
        "get_video_topics": "",
        "orderDelete": "",
        "getSellData": "",
        "get_course_info_v2": "",
        "getUserDeskmateInfo": "",
        "submit_bottle": "",
        "getInviterInfo": "",
        "getXModeSetting": "获取深度模式设置",
        "getApplyList": "获取好友申请列表",
        "getMinorModeBookList": "",
        "monthApply": "",
        "getMyRecruitmentPost": "获取我的招新海报",
        "preparePayOrder": "",
        "getCartSkuCount": "",
        "pack_bcz_book": "",
        "listComments": "",
        "BczAsrClient#xianShengAssess": "",
        "selectBczChildBook": "",
        "refreshToken": "",
        "sentenceCollect": "",
        "get_profile": "",
        "get_media_by_topic_ids": "",
        "get_app_feedback_info": "",
        "gameSettlement": "",
        "bottle_home": "",
        "get_calendar_daily_info": "获取打卡日历某天信息",
        "clockWord": "",
        "share_master": "",
        "getPreviewWords": "",
        "rebind_phone": "",
        "dakaReward": "同桌打卡铜板",
        "goodsThemeAction": "",
        "getTodaySuperDiscount": "",
        "getHomePageActivity": "",
        "get_main_view_bottom_advs": "",
        "removeChildBook": "",
        "packXmodeData": "",
        "add_book_replace_info": "",
        "cakeTopicGenOption": "",
        "setGroupAvatar": "",
        "get_book_list_japans": "",
        "get_progress": "",
        "sentence_current_info": "",
        "submit_user_info": "",
        "main": "",
        "receiveNotice": "",
        "personal_infos": "",
        "login_by_sn": "",
        "batch_update_topic_v2": "",
        "delStarWord": "",
        "getCakeTopicListByWordV3": "",
        "getSellTemplateInfo": "",
        "getRecruitmentPost": "获取招新海报信息",
        "settlementPriority": "",
        "addThumb": "",
        "getReadData": "",
        "select_game_book": "",
        "manageWordLevel": "",
        "getProModeBookList": "",
        "searchGoodsByCategoryId": "",
        "auditWord": "",
        "myEBookCourse": "",
        "get_static_config": "",
        "update_gender": "",
        "likeFindPage202204": "",
        "termBegin2022Home": "",
        "applyAuthorization": "",
        "blackListOperate": "好友黑名单操作",
        "inviteDeskmate": "邀请成为同桌",
        "check_files": "",
        "get_byte_live": "",
        "receiveContextModeCredit": "",
        "removeWord": "",
        "getCollectionList": "",
        "feedbackList": "",
        "getTaskAward": "",
        "set_remind_info": "",
        "get_majors": "",
        "searchSchool": "",
        "giftMain": "",
        "finish_plan_notify": "上报完成计划",
        "get_template_list_v2": "",
        "getJournalAppSellInfo": "",
        "skuDetail": "",
        "saveSetting": "",
        "getUserEntitlementSaleInfo": "",
        "createPrecheck": "",
        "restrictUser": "",
        "update_profile": "",
        "get_mall_tab_icon_info": "",
        "getTopicAuditList": "",
        "deleteUserTag": "",
        "getProfiles": "",
        "auditTopic": "",
        "letter_gray": "",
        "myLottery": "",
        "getBattleReport": "",
        "userBlackListOperate": "",
        "updateUserState": "",
        "operateUserAvatarFrame": "",
        "submit_chapter_done": "",
        "getBookWords": "",
        "get_year_paper_list": "",
        "notify_lock_screen_done": "",
        "getTopicInRoadmap": "",
        "batchUpsert": "",
        "submit_user_study_recordV2": "",
        "get_calendar_resign_info": "获取日历补卡信息",
        "cancelChoiceGoods": "",
        "get_ai_course_link": "",
        "betInfo": "",
        "getTaskReward": "获取任务奖励",
        "orderDetail": "",
        "get_device_packing_job": "",
        "attendance": "",
        "get_book_task_list": "",
        "getUserStatDetailTotal": "",
        "simple_chat": "",
        "getTopicList": "",
        "setUserPrivacy": "",
        "update_nickname": "更新个人昵称",
        "getStory": "",
        "get_word_means": "",
        "delete_friend": "",
        "getWordMatchInfo": "",
        "get_search_page_resource": "",
        "checkRecordingRight": "",
        "friendHandleInvite": "",
        "check_device_new_version": "",
        "share": "",
        "getCreditGoodsByIds": "",
        "getTournamentAuditInfoList": "",
        "getTopicAuditDetailV2": "",
        "audit_user_ugc": "",
        "addGroupLimitNum": "增加小班班位",
        "sessionFinish": "单词对战赛季结束",
        "update_role_extra": "更新个人信息",
        "activity": "",
        "discoveryPostComment": "",
        "workStatistic": "",
        "orderLogistics": "",
        "getRecruitmentStyleInfo": "",
        "get_exam_question": "",
        "get_sentence_by_word": "",
        "get_next_step": "",
        "getBook": "",
        "discoveryHome": "",
        "check_verify_code_for_old_phone": "",
        "saveWxLearnReportInfo": "",
        "have_a_try_v3": "",
        "get_privacy_agreement_version": "",
        "buyRound": "",
        "paySuccess#addUserBuyTerm": "",
        "update_album_list": "",
        "saveNotify": "",
        "tryBindUnionId": "",
        "get_little_collects": "",
        "sync_combo": "",
        "queryRecords": "",
        "subjects": "",
        "salePageDetail": "",
        "getBooksBasicInfo": "",
        "getGroupingList": "",
        "can_open_box": "",
        "getPenQrCode": "",
        "getTeacherInfo": "",
        "wordMatch": "",
        "finishNewUserGuide": "",
        "update_birthday": "",
        "byteDanceTvPlayTimes": "",
        "get_rank": "",
        "get_recommendation": "",
        "contextModeBookList": "",
        "get_book_task_error_info": "",
        "createEvaluate": "",
        "getCakeFinalExamWord": "获取蛋糕模式测验单词",
        "get_book_mall_desc": "",
        "getMachinePetInfo": "",
        "uploadFile": "",
        "buyContinuousCard": "",
        "getNotes": ""
    };

    let suggestionBox = null
    let lastInputValue = '';
    let lastSelectedIndex = -1;

    if (textarea) {
        suggestionBox = createSuggestionBox();
        textarea.addEventListener('input', function () {
            updateSuggestionBoxPosition();
            textarea.scrollTop = textarea.scrollHeight;
            const inputValue = textarea.value.trim();
            if (inputValue !== lastInputValue) {
                lastInputValue = inputValue;
                lastSelectedIndex = -1;
                updateSuggestions();
            }
        });

        textarea.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
                event.preventDefault();
                if (event.key === ' ' || event.code === 'Space') { // 检测空格键按下
                    event.preventDefault(); // 阻止默认行为（即输入空格）

                    const caretPos = textarea.selectionStart; // 获取光标位置
                    const textBeforeCursor = textarea.value.slice(0, caretPos); // 获取光标前的文本
                    const textAfterCursor = textarea.value.slice(caretPos); // 获取光标后的文本

                    textarea.value = textBeforeCursor + ' or ' + textAfterCursor; // 在光标位置插入 " or "
                    textarea.setSelectionRange(caretPos + 5, caretPos + 5); // 将光标定位到插入内容的末尾
                } else if (event.key === 'ArrowUp') {
                    lastSelectedIndex = lastSelectedIndex === 0 ? suggestionBox.children.length - 1 : lastSelectedIndex - 1;
                } else if (event.key === 'ArrowDown') {
                    lastSelectedIndex = lastSelectedIndex === suggestionBox.children.length - 1 ? 0 : lastSelectedIndex + 1;
                } else if (event.key === 'Enter' && lastSelectedIndex !== -1) {
                    const selectedItem = suggestionBox.children[lastSelectedIndex];
                    selectedItem.click();
                    return;
                }

                updateSuggestionHighlight();
            }
        });
    }


    function createSuggestionBox() {
        const suggestionBox = document.createElement('div');
        suggestionBox.id = "suggestionBox"
        suggestionBox.className = 'hidden-scrollbar transition';
        suggestionBox.style.position = 'fixed';
        suggestionBox.style.backgroundColor = 'white';
        suggestionBox.style.borderRadius = '10px';// 增加圆角的值
        suggestionBox.style.padding = '5px'
        suggestionBox.style.overflow = 'auto'; // 允许内容溢出时显示滚动条
        suggestionBox.style.maxHeight = '260px'; // 设定固定的高度，超出部分会滚动显示
        document.body.appendChild(suggestionBox);
        return suggestionBox;
    }

    function updateSuggestionBoxPosition() {
        if (textarea == null) {
            return
        }
        const rect = textarea.getBoundingClientRect();
        suggestionBox.style.left = rect.right + 10 + 'px';
        suggestionBox.style.top = rect.top + 'px';
    }

    function updateSuggestions() {
        const inputValue = textarea.value.trim();
        suggestionBox.innerHTML = '';

        if (inputValue) {
            const inputWords = inputValue.split(/\s+/);
            const lastWord = inputWords[inputWords.length - 1];
            lastSelectedIndex = -1;

            const inputLastWord = lastWord.replace(/\_/g, '').replace('method:', '');

            const matchedSuggestions = Object.keys(suggestions).filter(key =>
                                                                       inputLastWord!== 'and' && key.replace(/\_/g, '').toLowerCase().includes(inputLastWord.toLowerCase())
                                                                      );



            if (matchedSuggestions.length > 0) {
                const maxSuggestionsToShow = Math.min(2000, matchedSuggestions.length);

                for (let i = 0; i < maxSuggestionsToShow; i++) {
                    const key = matchedSuggestions[i];
                    const suggestionItem = createSuggestionItem(key, suggestions[key], i);
                    suggestionBox.appendChild(suggestionItem);
                }

                suggestionBox.style.visibility = 'visible';
                suggestionBox.style.opacity = '1';
                suggestionBox.scrollTop = 0;
            } else {
                suggestionBox.style.visibility = 'hidden';
                suggestionBox.style.opacity = '0';
            }

        } else {
            suggestionBox.style.visibility = 'hidden';
            suggestionBox.style.opacity = '0';
        }
    }

    function createSuggestionItem(key, value, index) {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.style.padding = '6px';
        suggestionItem.style.fontSize = '14px';
        suggestionItem.textContent = key;
        suggestionItem.setAttribute('data-tooltip', value);

        suggestionItem.addEventListener('mouseenter', function () {
            lastSelectedIndex = index;
            updateSuggestionHighlight();
        });

        suggestionItem.addEventListener('click', function () {
            replaceLastWord(lastInputValue.split(/\s+/).pop(), key);
            suggestionBox.style.opacity = '0'
            textarea.focus();
        });

        return suggestionItem;
    }

    function updateSuggestionHighlight() {
        const suggestionItems = suggestionBox.querySelectorAll('.suggestion-item');
        suggestionItems.forEach((item, index) => {
            // 清除其他项的提示框
            const tooltip = item.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
            if (index === lastSelectedIndex) {
                item.style.backgroundColor = '#239B56';
                item.style.color = 'white';
                item.style.borderRadius = '10px';// 重新应用圆角样式

                // 获取提示信息
                const tooltipText = item.getAttribute('data-tooltip') === '' ? '' : '*' + item.getAttribute('data-tooltip'); // 假设提示信息来自于 data-tooltip 属性

                // 创建并设置提示框
                const tooltip = document.createElement('div');
                tooltip.textContent = tooltipText;
                tooltip.classList.add('tooltip'); // 自定义样式类，设置提示框的样式
                item.appendChild(tooltip); // 将提示框添加到 .suggestion-item 元素中的右侧

                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.style.backgroundColor = 'white';
                item.style.color = 'black';
                item.style.borderRadius = '10px';// 重新应用圆角样式
            }
        });
    }


    function replaceLastWord(lastWord, replacement) {
        const inputValue = textarea.value.trim();
        const words = inputValue.split(/\s+/);
        words[words.length - 1] = 'method:' + replacement;
        textarea.value = words.join(' ');
        textarea.scrollTop = textarea.scrollHeight;
    }


    window.addEventListener('load', function () {
        createButtonsForAllInputs();
        addDatePicker('start_time');
        addDatePicker('end_time');
        updateSuggestionBoxPosition();

        // 获取所有 div 元素
        var divElements = document.querySelectorAll('div');

        // 遍历每个 div 元素
        divElements.forEach(function (div) {
            // 如果 div 包含子元素，则不添加移入和移出事件处理程序
            if (div.children.length > 0) {
                return;
            }

            // 原始文本内容
            var originalTextContent = div.textContent;

            // 添加鼠标移入事件处理程序
            div.addEventListener('mouseenter', function () {
                // 获取当前 div 中的文本内容
                var divTextContent = div.textContent;

                // 使用正则表达式匹配链接并替换
                var replacedDiv = divTextContent.replace(/"(https?:\/\/\S+|www\.\S+\.\S+)"/g, function (match) {
                    var url = match.slice(1, -1); // 去除双引号
                    // 用 <a> 标签替换链接文本
                    return '"<a href="' + url + '">' + url + '</a>"';
                });

                // 将替换后的文本重新设置到当前 div 中
                if (divTextContent !== replacedDiv) {
                    div.innerHTML = replacedDiv;
                }
            });
        });
        // 创建一个Toastify弹出框
        function showToast(message) {
            Toastify({
                text: message,
                duration: 3000,
                close: false,
                gravity: "top",
                position: 'right',
                stopOnFocus: true,
                className: "custom-toastify" // 添加自定义样式类名
            }).showToast();
        }

        // 监听文档选中事件
        document.addEventListener('mouseup', function (event) {
            const selection = window.getSelection();
            if (selection && selection.toString().trim() !== '') {
                const selectedText = selection.toString().trim();
                try {
                    if (/^\d{10}$/.test(selectedText)) { // 十位时间戳
                        const date = new Date(parseInt(selectedText) * 1000); // 转为毫秒
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并且补零
                        const day = String(date.getDate()).padStart(2, '0'); // 补零
                        const hours = String(date.getHours()).padStart(2, '0'); // 补零
                        const minutes = String(date.getMinutes()).padStart(2, '0'); // 补零
                        const seconds = String(date.getSeconds()).padStart(2, '0'); // 补零
                        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                        if (isWithinOneYear(date)) {
                            showToast(`选中的时间为：${formattedDate}`);
                        } else {
                            console.log('选中的时间不在当前时间的前后一年范围内！');
                        }
                    } else if (/^\d{13}$/.test(selectedText)) { // 十三位时间戳
                        const date = new Date(parseInt(selectedText));
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并且补零
                        const day = String(date.getDate()).padStart(2, '0'); // 补零
                        const hours = String(date.getHours()).padStart(2, '0'); // 补零
                        const minutes = String(date.getMinutes()).padStart(2, '0'); // 补零
                        const seconds = String(date.getSeconds()).padStart(2, '0'); // 补零
                        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                        if (isWithinOneYear(date)) {
                            showToast(`转换后的时间为：${formattedDate}`);
                        } else {
                            console.log('选中的时间不在当前时间的前后一年范围内！');
                        }
                    } else if (/^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(selectedText)) { // 时间字符串
                        const timestamp = new Date(selectedText).getTime() / 1000; // 转为秒
                        if (isWithinOneYear(new Date(timestamp * 1000))) {
                            showToast(`转换后的的时间戳为：${timestamp}`);
                        } else {
                            console.log('选中的时间不在当前时间的前后一年范围内！');
                        }
                    } else {
                        console.log('选中的文本不是一个有效的时间格式或时间戳！');
                    }
                } catch (error) {
                    console.log('选中的文本不是一个有效的时间格式或时间戳！');
                }
            }
        });

        // 判断时间是否在当前时间的前后一年范围内
        function isWithinOneYear(date) {
            const now = new Date();
            const oneYearAgo = new Date(now);
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            const oneYearLater = new Date(now);
            oneYearLater.setFullYear(now.getFullYear() + 1);
            return date >= oneYearAgo && date <= oneYearLater;
        }

    });

    window.addEventListener('resize', function () {
        updateSuggestionBoxPosition();
    });

    function lerpColor(startColor, endColor, t) {
        var r = Math.round(startColor[0] + t * (endColor[0] - startColor[0]));
        var g = Math.round(startColor[1] + t * (endColor[1] - startColor[1]));
        var b = Math.round(startColor[2] + t * (endColor[2] - startColor[2]));
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    }

    function smoothColorTransition(colors, duration) {
        var container = document.getElementById('suggestionBox');
        var currentIndex = 0;

        setInterval(function () {
            var startTime = new Date().getTime();
            var endTime = startTime + duration;
            var startColor = colors[currentIndex];
            var endColor = colors[(currentIndex + 1) % colors.length];

            var interval = setInterval(function () {
                var now = new Date().getTime();
                var timeLeft = Math.max(endTime - now, 0);
                var progress = 1 - (timeLeft / duration);

                container.style.boxShadow = `0 0 15px ${lerpColor(startColor, endColor, progress)}`;

                if (progress >= 1) {
                    clearInterval(interval);
                }
            }, 50); // 每50毫秒更新一次颜色

            currentIndex = (currentIndex + 1) % colors.length;
        }, duration);
    }

    var colors = [
        [255, 0, 0],
        [255, 165, 0],
        [255, 255, 0],
        [0, 255, 0],
        [0, 127, 255],
        [0, 0, 255],
        [139, 0, 255]
    ]; // 预定义的颜色数组（以 RGB 值表示）
    if (suggestionBox != null) {
        smoothColorTransition(colors, 500); // 使用函数开始平滑颜色循环变换，2000毫秒为例，你可以根据需要修改间隔时间
    }
})()