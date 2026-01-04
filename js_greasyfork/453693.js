// ==UserScript==
// @name         MySF_prod
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  try to take over the world! Don't use this userscript unless invited!
// @author       Yan Yan.Zhang@f5.com
// @include      https://f5.lightning.force.com/desktopDashboards/dashboardApp.app*
// @include      https://f5.lightning.force.com/lightning/r/Dashboard/*
// @include      https://f5.lightning.force.com/lightning/*
// @include      https://f5--test.lightning.force.com/desktopDashboards/dashboardApp.app*
// @include      https://f5--test.lightning.force.com/lightning/r/Dashboard/*
// @include      https://f5--test.lightning.force.com/lightning/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453693/MySF_prod.user.js
// @updateURL https://update.greasyfork.org/scripts/453693/MySF_prod.meta.js
// ==/UserScript==

/*
Function:

1. Add "change Case status" dropdown list when publish new notes
2. Add 'ir' checkbox if it's not set, when publish new notes
3. Add Country column in dashboard  // not fully working, also it's not relible for now since it's mailing country actually.
4. Hide some bars in the right and top, refer below for how to use it.

How to use it:

1. Use keyborad 'ctrl +  leftarrow' to toggle the right side bar  >>>>> MACOS please use shift + arrow key
2. Use keyborad 'ctrl + rightarrow' to toggle the left side bar
3. Use keyborad 'ctrl + downarrow' to toggle the  Upper serach bar


Other tips:
1. Go your personal settings  --> Advanced User Details -->  Advanced User Details --> Edit button, disable 'Load Lightning Pages While Scrolling'.
   So that page will be display once for all, but not have to scroll to page bottom.

2. Please install SF offical extension as following and enable 'link grabber', then when you click any SF link, it will be opened in existing SF page, but not a new browser tab.
   https://chrome.google.com/webstore/detail/lightning-extension/hfglcknhngdnhbkccblidlkljgflofgh


Change log:
2.5 Add 'Resovled' tag in case page
*/


(function() {
    var restrict = ["UNITED STATES", "UNITED KINGDOM", "AUSTRALIA", "NEW ZEALAND", "AUSTRIA", "BELGIUM", "BULGARIA", "CROATIA", "CYPRUS", "CZECH REPUBLIC", "DENMARK", "ESTONIA", "FINLAND", "FRANCE", "GERMANY", "GREECE", "HUNGARY", "IRELAND", "ITALY", "LATVIA", "LITHUANIA", "LUXEMBOURG", "MALTA", "NETHERLANDS", "POLAND", "ROMANIA", "SLOVAKIA", "SLOVENIA", "SPAIN", "SWEDEN", "CANADA"];

    var map1 = {
        "P1": "Sev 1",
        "P2": "Sev 2",
        "P3": "Sev 3",
        "P4": "Sev 4"
    }
    var map2 = {
        "P1": "red",
        "P2": "#fe781e",
        "P3": "#1ba1e2",
        "P4": "#777"
    }
    var map3 = {
        'none': 'block',
        'block': 'none'
    }
    var map4 = {
        "none": "100%",
        "block": "75%"
    }

    document.onreadystatechange = function() {
        if (document.readyState == "complete") {
            if (/lightning\/r\/Dashboard\//.test(location.href)) {
                setTimeout(() => {
                    init()
                }, 1000)
            }
        }
    }

    document.onkeydown = function(e) { //对整个页面监听
        var evtobj = e
        if ("ArrowDown" == evtobj.code && (evtobj.ctrlKey || evtobj.metaKey)) {
            let header = document.getElementById('oneHeader')
            header.style.display = map3[window.getComputedStyle(header).display]
        }
        if (/^\/lightning\/r\/Case/.test(location.pathname)) {
            if ("ArrowLeft" == evtobj.code && (evtobj.ctrlKey || evtobj.shiftKey)) {
                evtobj.preventDefault()
                let rightcolmn = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelectorAll('flexipage-record-home-scrollable-column.right-col')[0]
                rightcolmn.style.display = map3[window.getComputedStyle(rightcolmn).display]
            }

            if ("ArrowRight" == evtobj.code && (evtobj.ctrlKey || evtobj.shiftKey)) {
                evtobj.preventDefault()
                let leftcolmn = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelectorAll('flexipage-record-home-scrollable-column.left-col')[0]
                let middlecolumn = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelector('.grouping[flexipage-recordhomethreecoltemplatedesktop2_recordhomethreecoltemplatedesktop2]')
                leftcolmn.style.display = map3[window.getComputedStyle(leftcolmn).display]
                middlecolumn.style.width = map4[leftcolmn.style.display];
            }

        }

    }

    function add_hierarchy() {
        let h = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelectorAll('article.slds-card.cHierarchyGrid')[0]
        let a = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelectorAll('records-highlights2')[0]
        if (h != undefined) a.appendChild(h)
    }

    let db
    const openRequest = indexedDB.open('test_db', 4);
    openRequest.onupgradeneeded = function(e) {
        let valuelist = ['country','product','version','platform','test']
        db = e.target.result;
        let trans = e.target.transaction;
        console.log('running onupgradeneeded');
        if (!db.objectStoreNames.contains('store')) {
            const storeOS = db.createObjectStore('store', {
                keyPath: 'case'
            });
            for (let i of valuelist) {
                storeOS.createIndex(i, i, {unique: false})
            }
            /*
            storeOS.createIndex('country', 'country', {
                unique: false
            });
            */
        } else {
            let storeOS = trans.objectStore('store');
            for (let i of valuelist) {
                if (!storeOS.indexNames.contains(i)) {
                    storeOS.createIndex(i, i, {unique: false})
                }
            }
        }
    };
    openRequest.onerror = function(e) {
        console.log('onerror!');
        console.dir(e);
    };
    openRequest.onsuccess = function(e) {
        console.log('running onsuccess');
        db = e.target.result;
        // objstore = db.transaction(['store']).objectStore('store')
        // db.transaction(['store'], 'readwrite').objectStore('store').add({
        // 	case: "akfjiejfkasdjf1",
        // 	country: "KR",
        // 	product: "i4500",
        // 	version: "v122.333"
        // })
    }
    /*
					rel({
						ship_mailing_country,
						owner,
						product,
						p_version,
						account
					})
					*/
    function retrivecountryfromDB(caseid) {
        return new Promise((rel, rej) => {
            let objstore = db.transaction(['store']).objectStore('store')
            let GET = objstore.get(caseid);
            GET.onerror = event => {
                console.log('failed')
            }
            GET.onsuccess = event => {
                if (GET.result) { // existing entry in indexDB
                    let resultX = {
                        country: GET.result.country,
                        product: GET.result.product,
                        version: GET.result.version,
                        platform: GET.result.platform
                    }
                    rel(resultX)
                } else {
                    retriveCountry(caseid).then(data => {
                        let result = {
                            country: data.ship_mailing_country,
                            product: data.product,
                            version: data.p_version,
                            platform: data.platform
                        }
                        db.transaction(['store'], 'readwrite').objectStore('store').add({
                            case:    caseid,
                            country: data.ship_mailing_country,
                            product: data.product,
                            version: data.p_version,
                            platform: data.platform
                        })
                        rel(result)
                    })
                }
            }
        })
    }
    window.addEventListener('load', (event) => {
        setcssforCases();
        var pushState = history.pushState;
        var replaceState = history.replaceState;
        console.log('window loaded')

        history.pushState = function() {
            pushState.apply(history, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
        };
        history.replaceState = function() {
            replaceState.apply(history, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
        };
        document.addEventListener('dblclick', async (e) => {
            if (e.target.role == 'tab' && e.target.hasAttribute('title')) {
                await navigator.clipboard.writeText(e.target.title)
            }
        });
        window.addEventListener('popstate', function() {
            window.dispatchEvent(new Event('locationchange'))
        });
        // window.addEventListener('locationchange', locationchange)
        casepagedealing()
    })

    function addheader(head_line, title, value, case_number) {
        let product_a = document.createElement("div")
        let product_b = document.createElement("div")
        let product_c = document.createElement("div")
        product_c.id = title + case_number // Country5001T00001kG8JYQA0
        if (title == 'Country') {
            product_a.style.background = restrict.indexOf(value.toUpperCase()) < 0 ? "palegreen" : "hotpink"
        }
        product_b.innerText = title
        product_c.innerText = value
        product_a.appendChild(product_b)
        product_a.appendChild(product_c)
        product_a.style.width = '90px'
        head_line.appendChild(product_a)
    }

    function casepagedealing() {
        // console.log('location changed')

        if (/\/r\/Case\//.test(location.href)) {
            setTimeout(() => {
                // add resolved status
                let head_line = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelectorAll('slot.slds-grid.slds-page-header__detail-row')[0]
                let priority = head_line.assignedNodes()[1]
                let replacepriory = 'P' + parseInt(priority.lastChild.innerText)
                priority.lastChild.innerText = replacepriory
                priority.style.background = map2[replacepriory]
                let allStatusChange = document.querySelectorAll('.active.oneWorkspace .active.oneConsoleTab article[data-type="ChangeStatusPost"]')
                for (let i of allStatusChange) {
                    if (/Resolved/.test(i.querySelectorAll(':scope > div:nth-child(2)')[0].innerText)) {
                        // console.log('issue is resolved once')
                        //let casenumber = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelector('slot.slds-grid.slds-page-header__detail-row records-highlights-details-item')
                        let casenumber = head_line.assignedNodes()[0]
                        casenumber.style.background = "palegreen"
                        break
                    }
                }
                let caseid = location.pathname.split('/')[4]

                if (!document.getElementById('Country' + caseid)) {
                    retrivecountryfromDB(caseid).then(data => {
                        addheader(head_line, 'Product', data.product.split(' ').slice(-1)[0], caseid)
                        addheader(head_line, 'Version', data.version, caseid)
                        addheader(head_line, 'Platform', data.platform, caseid)
                        addheader(head_line, 'Country', data.country, caseid)
                    })
                }
                // console.log('location changed to case folder')
                let xx = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelectorAll('.main-col li.slds-tabs_default__item')
                let HierarchyButton, FeedButton, currentActive
                for (let i of xx) {
                    if (i.innerText == 'Hierarchy') HierarchyButton = i;
                    if (i.classList.contains('slds-is-active')) currentActive = i;
                    if (i.innerText == 'Feed') FeedButton = i;
                }
                // console.log(HierarchyButton,currentActive,FeedButton)
                HierarchyButton.click()
                HierarchyButton.style.display = 'none'
                currentActive ? currentActive.click() : FeedButton.click()
                // setTimeout(add_hierarchy, 3000);
            }, 1000);
        }
    }

    function addstatusdropdownlist() {
        let ul1 = document.querySelector('.active.oneWorkspace .active.oneConsoleTab .forceChatterPublisherVisibility ul.items')
        let li1 = document.createElement('li')
        li1.innerHTML = '<label for="newStatus" style="padding-left: 50px; padding-right: 10px; font-weight: bold;">Case new Status:</label><select name="newStatus" id="newStatus" style = "background-color: aliceblue;">  <option value="--None--">--None--</option>  <option value="New">New</option>  <option value="Solving">Solving</option>  <option value="Monitor">Monitor</option>  <option value="Meeting Scheduled">Meeting Scheduled</option>  <option value="Needs Attention">Needs Attention</option>  <option value="Awaiting Customer">Awaiting Customer</option>  <option value="Escalated">Escalated</option>  <option value="Pending RMA">Pending RMA</option>  <option value="Resolved">Resolved</option>  <option value="1st Follow Up">1st Follow Up</option>  <option value="2nd Follow Up">2nd Follow Up</option>  <option value="Closed">Closed</option>  <option value="Closed - Duplicate">Closed - Duplicate</option></select>'
        let currentStatus
        try {
            currentStatus = document.querySelector('.active.oneWorkspace .active.oneConsoleTab ').querySelectorAll('.main-col slot[name="secondaryFields"] records-highlights-details-item')[2].innerText.split('\n')[2]
        } catch (err) {
            console.log('get current status failed')
            currentStatus = 'Monitor'
        }
        li1.querySelector('#newStatus').value = currentStatus
        ul1.appendChild(li1)
        let IRbutton = document.querySelector('.active.oneWorkspace .active.oneConsoleTab button.markCompleteButton')
        if (IRbutton) {
            // console.log(IRbutton)
            let li2 = document.createElement('li')
            li2.innerHTML = '<label class="container" style="padding-left:50px; font-weight: bold;">Init Response <input type="checkbox" style="margin-left: 10px;" id="initR">  <span class="checkmark"></span> </label>'
            ul1.appendChild(li2)
        }
        let sharebutton = document.querySelector('.active.oneWorkspace .active.oneConsoleTab .forceChatterPublisherPresentationDesktop button.cuf-publisherShareButton')
        sharebutton.onclick = function() {
            submitStatus(currentStatus)
        }
    }

    function submitStatus(currentStatus) {
        let newStatus = document.querySelector('.active.oneWorkspace .active.oneConsoleTab #newStatus').value
        try {
            if (document.getElementById('initR').checked) {
                document.querySelector('.active.oneWorkspace .active.oneConsoleTab button.markCompleteButton').click()
            }
        } catch (err) {
            console.log(err)
        }
        if (newStatus == currentStatus) {
            return
        } else {
            let NewStatusbody = '{"actions": [{"id": "5956;a","descriptor": "serviceComponent://ui.force.components.controllers.recordGlobalValueProvider.RecordGvpController/ACTION$saveRecord","callingDescriptor": "UNKNOWN","params": {"recordRep": {"id": "------------","apiName": "Case","fields": {"Status": {"value": ".........","displayValue": "........."}}},"recordSaveParams": {},"successAction": "{\\"id\\":\\"5955;a\\",\\"descriptor\\":\\"serviceComponent://ui.force.components.controllers.inlineEdit.InlineEditController/ACTION$getPostSaveNavigationEvent\\",\\"callingDescriptor\\":\\"UNKNOWN\\",\\"params\\":{\\"crudAction\\":\\"EDIT\\"}}","refreshFields": ["Id", "RecordTypeId", "AccountId", "ParentId", "AssetId", "Status", "Owner.Name", "Priority", "OwnerId", "CaseNumber", "Recommended_Action__c", "Origin", "LastModifiedDate", "Asset.Id", "Business_Impact_Escalation__c", "Parent.Id", "Parent.CaseNumber", "Owner.Id", "Version__c", "CreatedById", "Platform__c", "CreatedBy.Name", "Product__c", "Analysis__c", "CaseNumber_ExtId__c", "Reproducibility__c", "Account.RecordTypeId", "Distribution__c", "Parent_Case_Current_Owner__c", "Reg_Key_Serial_Number_Formula__c", "Deadline__c", "CurrencyIsoCode", "Resolution_Code__c", "F5_Description__c", "CreatedDate", "Environment__c", "Cloud_Provider__c", "Asset.RecordTypeId", "Available_Information__c", "Is_this_system_in_production__c", "Action_Required__c", "LastModifiedBy.Id", "ContactId", "Parent.RecordTypeId", "Cause__c", "Product_Group__c", "Additional_Information__c", "Contact.Id", "Bug_IDs__c", "Account.Id", "CreatedBy.Id", "US_Only_Support__c", "Contact.RecordTypeId", "What_is_the_best_way_to_contact_the_cust__c", "Cause_Code__c", "Troubleshooting_Steps_Completed__c", "Contact.Name", "LastModifiedBy.Name", "Siebel_Activities__c", "SystemModstamp", "Enhanced_Service__c", "Special_Handling__c", "Reason_for_Contact__c", "Asset.Name", "Steps_to_Reproduce__c", "Location_of_Collected_Data__c", "Account.Name", "Plus_Version__c", "ClosedDate", "LastModifiedById", "What_is_the_customer_s_drop_dead_date__c"]}}]}'
            let token = $A.clientService.Ec
            let caseid = location.pathname.split('/')[4]
            // let fwuid = $A.yb.oh
            let fwuid = $A.yb.qh
            let part2 = '&aura.context={"mode":"PROD","fwuid":"' + fwuid + '","app":"one:one","loaded":{"APPLICATION@markup://one:one":"Ax4Y4_plC8-FsJYtLEfU1A"},"dn":[],"globals":{"density":"VIEW_ONE","appContextId":"06m50000000eiwKAAQ"},"uad":true}&aura.pageURI=/lightning/r/Case/'
            let body = "message=" + NewStatusbody.replace('------------', caseid).replaceAll('.........', newStatus) + part2 + caseid + '/view&aura.token=' + token
            fetch("https://" + location.host + "/aura?r=103&ui-force-components-controllers-recordGlobalValueProvider.RecordGvp.saveRecord=1", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-sfdc-request-id": "8702167900004f640e"
                },
                "referrer": "https://f5.lightning.force.com/lightning/r/Case/5001T00001iQZ5IQAW/view",
                "referrerPolicy": "origin-when-cross-origin",
                "body": body,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(function(response) {
                var z = response.json();
                return z;
            }).then(function(data) {
                if (data.actions[0].state = "SUCCESS") {
                    // document.querySelector("body > div.desktop.container.forceStyle.oneOne.navexDesktopLayoutContainer.lafAppLayoutHost.forceAccess.tablet > div.viewport > section > div.navexWorkspaceManager > div > div.tabsetHeader.slds-context-bar.slds-context-bar--tabs.slds-no-print > div.slds-context-bar__secondary.navCenter.tabBarContainer > div > div > ul.tabBarItems.slds-grid > li.oneConsoleTabItem.tabItem.slds-context-bar__item.slds-context-bar__item_tab.slds-is-active.active.hasActions.hideAnimation.navexConsoleTabItem > a").style.backgroundColor = "LightSkyBlue"
                }
            })
        }
    }

    function setcssforCases() {
        // document.getElementById('oneHeader').style.display = 'none'
        addGlobalStyle("header#oneHeader {display: none}")
        addGlobalStyle(".supportCompactFeedItem .forceChatterFeedAuxBody, .supportCompactFeedItem div.cuf-body { margin-left:0px; border-style:solid; border-color:grey; border-width:thin; border-radius: 4px; padding: 13px; background-color:#e1eaea;}")
        // addGlobalStyle(".supportCompactFeedItem .forceChatterFeedAuxBody, .supportCompactFeedItem div.cuf-body { margin-left:0px; border-style:solid; border-color:grey; border-width:thin; border-radius: 4px; padding: 13px; background:linear-gradient(to top, #e3d7e0 0%, #a6c1ee 100%);}")
        addGlobalStyle(".supportCompactFeedItem .supportCompactFeedItemFooter, .supportCompactFeedItem div.interactions, .supportCompactFeedItem .cuf-compactFeedBack div.cuf-feedback { margin-left:0px; }")
        addGlobalStyle('.feedBodyInner {font-weight:500; font-family: Monaco,Menlo,Consolas,"DejaVu Sans Mono","Courier New",monospace; }')
        addGlobalStyle(".slds-rich-text-area__content, .forceChatterBasePublisher.forceChatterTextPostDesktop .activeState div.lightningInputRichText {max-height: none}")
        addGlobalStyle(".forceStyle .form-element_1-col .slds-form-element_horizontal:not(.empty-label) div.slds-form-element__control { padding-left:0px; }")
        // addGlobalStyle("span.word-break-ie11[records-recordLayoutItem_recordLayoutItem] {border-style: solid; border-radius:4px; padding: 13px;}")
        addGlobalStyle('span.word-break-ie11[records-recordLayoutItem_recordLayoutItem] {font-family: Monaco,Menlo,Consolas,"DejaVu Sans Mono","Courier New",monospace; font-size: 13px; background-color:#e1eaea;}')
        addGlobalStyle("article[data-type='TrackedChange'], article[data-type='MilestoneEvent'],  .right-col[flexipage-recordHomeThreeColTemplateDesktop2_recordHomeThreeColTemplateDesktop2], flexipage-component2[slot='leftsidebar'][data-component-id='flexipage_tabset2'] {display: none}")
        // document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelector('.right-col[flexipage-recordHomeThreeColTemplateDesktop2_recordHomeThreeColTemplateDesktop2] > slot').style.display = 'none';
    }

    function retriveCountry(caseid) {
        return new Promise((rel, rej) => {
            let p1 = 'message={"actions":[{"id":"11421;a","descriptor":"aura://RecordUiController/ACTION$executeAggregateUi","callingDescriptor":"UNKNOWN","params":{"input":{"compositeRequest":[{"url":"/services/data/v' + $A.qa.version + '/ui-api/records/';
            let p2 = '?optionalFields=Case.Parent.Contact.MailingCountryCode,Case.CaseNumber,Case.Account.BillingCountryCode,Case.platform__c,Case.Account.ShippingCountryCode,Case.Contact.MailingCountryCode,Case.Contact.Name,Case.ContactPhone,Case.CreatedBy.Id,Case.CreatedBy.Name,Case.CreatedById,Case.CreatedDate,Case.CurrencyIsoCode,Case.LastModifiedBy.Email,Case.LastModifiedBy.Id,Case.LastModifiedBy.Name,Case.LastModifiedById,Case.LastModifiedDate,Case.Location_Time_Zone__c,Case.Origin,Case.MailingCountryCode,Case.Owner.Id,Case.Owner.Name,Case.OwnerId,Case.RestrictedServiceArea__c,Case.Status,Case.Subject,Case.SubscriptionId__c,Case.SubscriptionId__r,Case.Supported_Services__c,Case.SystemModstamp,Case.Time_zone__c,Case.US_Only_Support__c,Case.Product__c,Case.Version__c","referenceId":"LDS_Records_AggregateUi_optionalFields_2"}]}}}]}&aura.context={"mode":"PROD","fwuid":"' + $A.yb.qh + '","app":"one:one","loaded":' + JSON.stringify($A.yb.loaded) + ',"dn":[],"globals":{"density":"VIEW_ONE","appContextId":"06m50000000eiwKAAQ"},"uad":true}&aura.pageURI=/lightning/o/Case/list?filterName=Recent&aura.token=';
            let fake_caseid = caseid;
            let fake_token = $A.clientService.Ec;
            let postbody = p1 + fake_caseid + p2 + fake_token;
            let url = "https://" + location.host + "/aura?r=141&aura.RecordUi.executeAggregateUi=1";
            fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                "credentials": "include",
                headers: {
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache"
                },
                "referrer": "https://f5.lightning.force.com/lightning/o/Case/list?filterName=Recent",
                body: postbody
            }).then(function(response) {
                let z = response.json();
                return z;
            }).then(function(data) {
                let ship_mailing_country, last_modify_user, last_modify_date, case_number, product, p_version, owner, account, current_status, platform
                try {
                    ship_mailing_country = data.actions[0].returnValue.compositeResponse[0].body.fields.Asset.value.fields.Parent.value.fields.Account.value.fields.ShippingCountryCode.displayValue
                } catch (err) {
                    try {
                        ship_mailing_country = data.actions[0].returnValue.compositeResponse[0].body.fields.Parent.value.fields.Contact.value.fields.MailingCountryCode.displayValue
                    } catch (err) {
                        ship_mailing_country = data.actions[0].returnValue.compositeResponse[0].body.fields.Contact.value.fields.MailingCountryCode.displayValue
                    }
                }
                try {
                    last_modify_user = data.actions[0].returnValue.compositeResponse[0].body.fields.LastModifiedBy.displayValue;
                    last_modify_date = data.actions[0].returnValue.compositeResponse[0].body.fields.LastModifiedDate.value;
                    case_number = data.actions[0].returnValue.compositeResponse[0].body.fields.CaseNumber.value
                    product = data.actions[0].returnValue.compositeResponse[0].body.fields.Product__c.value
                    p_version = data.actions[0].returnValue.compositeResponse[0].body.fields.Version__c.value
                    owner = data.actions[0].returnValue.compositeResponse[0].body.fields.Owner.displayValue
                    account = data.actions[0].returnValue.compositeResponse[0].body.fields.Account.displayValue
                    current_status = data.actions[0].returnValue.compositeResponse[0].body.fields.Status.displayValue
                    platform = data.actions[0].returnValue.compositeResponse[0].body.fields.Platform__c.value.replace(/F5-BIG-/,'')
                } catch (err) {
                    console.log(err)
                }
                rel({
                    ship_mailing_country,
                    owner,
                    product,
                    p_version,
                    account,
                    platform
                })
            })
        })
    }

    const formatDuration = ms => {
        let ms1
        if (ms < 0) {
            ms1 = -ms;
        } else {
            ms1 = ms
        }
        const time = {
            d: Math.floor(ms1 / 86400000),
            h: Math.floor(ms1 / 3600000) % 24,
            min: Math.floor(ms1 / 60000) % 60
            //    second: Math.floor(ms1 / 1000) % 60,
            //    millisecond: Math.floor(ms1) % 1000
        };
        let xx = Object.entries(time)
        .filter(val => val[1] !== 0)
        .map(val => val[1] + val[0])
        .join(',');
        return ms < 0 ? '-' + xx : xx
    };

    function processENEtable(ENEtable) {
        let trs = ENEtable.getElementsByTagName('tr')
        let ths = trs[0].querySelectorAll('th')
        let thlength = ths.length
        let timeindex = []
        for (let i in ths) {
            if (/country/i.test(ths[i].innerText)) {
                var countryindex = i
                }
            if (/slm/i.test(ths[i].innerText)) {
                timeindex.push(i)
            }
        }
        console.log(timeindex)
        for (let trr in trs) {
            if (trr > 0) {
                let alltds = trs[trr].querySelectorAll('td');
                if (alltds.length == thlength - 2) {
                    var back = 1
                    console.log('run in background? bugs? no last column')

                } else {
                    back = 0
                }
                if (alltds[0].innerText == '') continue
                alltds[1].style.fontSize = "larger"
                alltds[1].style.color = 'white'
                alltds[1].style.backgroundColor = map2[alltds[1].innerText]

                for (let i of timeindex) {
                    alltds[i].innerText = formatDuration(parseInt(alltds[i].innerText) * 60 * 1000)
                }
                let caseid = alltds[0].getElementsByTagName('a')[0].href.split('/')[5]
                let lasttd = alltds[countryindex].innerText

                if (lasttd == '-' || /^\d+$/.test(lasttd)) { // if no existing country
                    retrivecountryfromDB(caseid).then(data => {
                        let ship_mailing_country = data.country
                        try {
                            if (back == 0) alltds[countryindex].querySelector('div > div').innerText = ship_mailing_country
                        } catch (err) {
                            console.log('no country clummn')
                        }
                        if (restrict.indexOf(ship_mailing_country.toUpperCase()) >= 0) { // if it's restriction country
                            alltds.forEach((el, index) => {
                                if (index != 1) {
                                    el.style.backgroundColor = "#ebe8ab";
                                }
                            })
                        }
                    })
                } else {
                    if (restrict.indexOf(alltds[alltds.length - 1].innerText.toUpperCase()) >= 0) {
                        alltds.forEach((el, index) => {
                            if (index != 1) {
                                el.style.backgroundColor = "#ebe8ab";
                            }
                        })
                    }
                }
            }
        }
    }

    function init() {
        let frames = window.top.document.getElementsByTagName('iframe');

        var reportFrame
        var dashboardFrame
        if (frames.length > 0) {
            for (let i of frames) {
                if (i.id == "iframeScrtWidget") continue
                let herff = i.contentDocument.location.href
                if (/lightningReportApp/.test(herff)) {
                    console.log('report frame found')
                    reportFrame = i
                }
                if (/DashboardApp/i.test(herff)) {
                    console.log('dashboard frame found')
                    dashboardFrame = i
                }

            }
        }

        if (!reportFrame && !dashboardFrame) return
        if (reportFrame) {
            //             setTimeout(() => {
            //                 let refreshbotton = reportFrame.contentDocument.querySelectorAll('button.action-bar-action-refreshReport')[0];
            //                 refreshbotton.click();
            //             }, 61000)
            reportFrame.contentDocument.getElementsByClassName('widget-container_reportMetrics')[0].style.display = 'none' // hide useless header
            try {
                var ENEtable = reportFrame.contentDocument.getElementsByClassName('report-header')[0].nextSibling.querySelectorAll('table.data-grid-full-table')[0]
                } catch (err) {
                    console.log('get ENEtable in report frame failed')
                    return
                }
            setTimeout(() => {
                processENEtable(ENEtable)
            }, 10000)
        }

        if (dashboardFrame) {
            /*             setTimeout(() => {
			    let refreshbotton = dashboardFrame.contentDocument.querySelector('button.refresh')
			    refreshbotton.click();
			}, 61000) */

            try {
                var ENEtable1 = dashboardFrame.contentDocument.querySelectorAll('div[title="ENE Queue"]')[0].parentElement.nextSibling.getElementsByClassName('data-grid-full-table')[0]
                } catch (err) {
                    return
                }
            let tables = dashboardFrame.contentDocument.querySelectorAll('.data-grid-full-table')
            let widgets = dashboardFrame.contentDocument.querySelectorAll('div.widget-container')
            var xx = widgets[0].style.top
            tables.forEach((el, i) => {
                el.parentElement.style.height = (el.offsetHeight + 30) + 'px';
                widgets[i].style.height = (el.offsetHeight + 120) + 'px'
                widgets[i].style.top = xx
                xx = (10 + parseInt(widgets[i].style.top) + parseInt(widgets[i].style.height)) + 'px';
            })
            setTimeout(() => {
                processENEtable(ENEtable1)
            }, 2000)
        }
    }

    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;

    function openReplacement(method, url, async, user, password) {
        this._url = url;
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        if (/RecordFeedContainer/.test(this._url)) {
            data = data.replace('firstPageSize%22%3A6%2C', 'firstPageSize%22%3A66%2C')
        }
        /**
			* PLACE HERE YOUR CODE WHEN REQUEST IS SENT
			*/
        if (/(LeadAccept)|(ownerChangeContent)/.test(this._url)) {
            console.log('accept event triggerd')
            //            return open.apply(this, arguments);

            let caseid = location.pathname.split('/')[4]
            retriveCountry(caseid).then(data1 => {
                let owner = data1.owner
                // let userid = Object.keys($A.g.bb['markup://force:recordLibrary'].Zb.recordsStore._records)[0]
                // let pageowner = $A.g.bb['markup://force:recordLibrary'].Zb.recordsStore._records[userid].record.fields.Name.value
                // console.log('Current Owner onpage is ' + pageowner)
                console.log('Current Owner in db  is ' + owner)
                let accept = document.querySelector(".active.oneWorkspace .active.oneConsoleTab").querySelector('runtime_platform_actions-action-renderer[title="Accept"]')
                if (accept != null && !/(queue|pod)/i.test(owner)) {
                    alert('User ' + owner + ' has taken this case..')
                    // this._url = 'https://10.154.175.88/newCasetaken'
                    this.abort()
                    this.onreadystatechange = onReadyStateChangeReplacement
                    return send.apply(this, arguments)
                } else {
                    // console.log(this);
                    this.onreadystatechange = onReadyStateChangeReplacement
                    return send.apply(this, arguments)
                }
            })
        } else {
            this.onreadystatechange = onReadyStateChangeReplacement;
            return send.apply(this, arguments);
        }
    }

    function onReadyStateChangeReplacement() {
        /**
			* PLACE HERE YOUR CODE FOR READYSTATECHANGE
			*/
        if (this.readyState == 4) {
            // console.log("ajax complete for ---> " + this.responseURL)
            if (/DashboardApp\.loadComponents/.test(this.responseURL)) {
                try {
                    let resobj = JSON.parse(this.response);
                    try {
                        let reportName = resobj.actions[0].returnValue.componentData[0].reportResult.attributes.reportName
                        if (/ENE QUEUE/.test(reportName.toUpperCase())) {
                            setTimeout(() => {
                                init();
                            }, 1000)
                        }
                    } catch (err) {
                        console.log('reportname invalid')
                    }

                } catch (err) {
                    console.log("parse response as json failed")
                    console.log(this.response)
                }

            }
            if (/ReportPage\.runReport/.test(this.responseURL)) {
                setTimeout(() => {
                    init();
                }, 3000)
            }
            if (/ui-chatter-components-aura-components-forceChatter-chatter.TopicAutoCompleteInput.getTalkingAboutStatus/.test(this.responseURL)) {
                addstatusdropdownlist()
            }
            if (/HierarchyGrid/.test(this.responseURL)) {
                add_hierarchy()
            }
            // if (/Milestones.retrieveAllMilestones/.test(this.responseURL)) {
            if (/RecordFeedContainer/.test(this.responseURL)) {
                casepagedealing()
            }
        }
        if (this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }
    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.id = 'useradded'
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();