// ==UserScript==
// @name         SNow_Simplified
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Simplified HSCM Service Now Portal
// @author       Rajesh Kanna S
// @match        https://itsm.services.sap/*
// @match        https://sap.service-now.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        GM_addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/448884/SNow_Simplified.user.js
// @updateURL https://update.greasyfork.org/scripts/448884/SNow_Simplified.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //**********************Configuration*******************************

  //---------------Start Hiding Buttons------------------------------
  const hide_but_followup = true; //Hide Followup button
  const hide_but_follow = true; //Hide Followup button
  const hide_but_create_problem = true; //Hide Create Problem
  const hide_but_update = false; //Hide Update Button
  const hide_but_save = true; //Hide Save Button
  const hide_but_create_security_incident = true; //Hide create security incident button
  const hide_but_responses = true; //Hide button Responses
  const hide_but_remote_connection = true; //Hide Remote Connection
  const hide_but_reroute_initial_level = true; //Hide Reroute initial level
  const hide_but_reroute_keep_level = true; //Hide reroute keep level
  const hide_but_forward_next_level = true; // Hide Forward to next level

  //---------------Align Top buttons to Center-----------------------
  const align_but_center = true; //Align all buttons to the center

  //--------------Hide default warnign message on load---------------

  const hide_initial_warning_message = true;

  //-----------Initial post by Requester-----------------------------
  const requester_post_answer_color = "#6C2DC7";

  //-----------Hide Section tabs-------------------------------------

  const hide_system_tab = true; //Hide System tab
  const hide_related_records_tab = true;

  //---------------Hide Related Searches Button----------------------

  const hide_related_searches_button = true;

  //---------------Hide the buton bar below comments-----------------
  const hide_bottom_button_bar = true; //Hide the button bar below the comments

  //---------------Hide Related Links--------------------------------
  const hide_related_links = true; //Hide the related links section

  //--------------Hide list of Junk tabs-----------------------------

  const hide_child_tabs = true; //Hide all child tabs section
  const enable_incident_tasks = true; //Make Visible of incident Tasks

  //--------------Color button---------------------------------------

  let buttonColors = [
    ["ws_assign_incident_to_me", "#FFF9E3"], //Assign To me color: Egg Shell
    ["sysverb_update", "#F5FFFA"], //Update button, color: MintCream
    ["resolve_incident", "#C3FDB8"], //Resolve . Color: Light Jade
    ["awaiting_requestor", "#FFDAB9"], //Send Reply. Color: PeachPuff (W3C)
    ["retrieve_incident", "#e3c2f0"],
  ];

  //---------------Default Message Type -----------------------------
  // Communication tab default message type. comments => External Info, work_notes => Internal Info
  //const default_msg_type = "work_notes"; //SAP removed this field

  //-----------Default Resolution information fields(UX Team)----------
  //Set default values

  const enable_resoution_info_default_values = false; //Enable the following default values for these fields.
  //Reolution_code = solved-Fix-Provided
  //Affected Area = Application
  //Symptom = Others (specify)

  //--------increase left side section width to 65% from 50%---------
  const header_info_increase_width_left = true;

  //-----------------Font size----------------------------------------

  //--------increase font size for Text Area--------------------------
  // Message box font parameters..
  const text_area_font =
    'normal 400 13px/21px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';

  //--------Activities related variables------------------------------

  const activity_def_font =
    'normal 400 14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';

  //-----------Activities Descriptions Default font--------------------
  const activity_def_info_font =
    'normal 400 14px/21px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';

  const activity_ext_type_color = "#dd9119";
  const activity_int_type_color = "#3498DB";

  const activity_weighted_font =
    'normal 600 14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';

  //--------------------Incident List Filter page----------------------
  const incident_filter_list_page_font_size = "15px";

  //------------------Resolution tab field Defaults-----------------

  const enable_resolution_fields_default = false;
  //Enabling this value true will set the default values.

  //Resolution code = Solved-Fix Provided
  //Affected area = Application
  //Symptom = Other(Specify)
  // Add resolution notes to comments = true

  //******************End of Configuration****************************

  //******************Start of Developer Area*************************

  //-------------------Run Time Variables------------------------
  const questions = [
    "1.Please provide Landscape details and System ID/Client. Also explicitly mention if it is a private landscape/ Cloud Tenant (if it is cloud systems then provide tenant /logon).",
    "e.g.:  GSA - Public MG4/001 HE4/400 or S/4HC E0T (provide tenant URL)",
    "2.  Demo Scenario ID & Page Number (if applicable)? - Error description and steps to reproduce the error with screenshot/recordings.",
    "2. Demo Scenario ID & Page Number (if applicable)? - Error description and steps to reproduce the error with screenshot/recordings.",

    "3. Demo date & time and Demo ID (if applicable)?",
    "4. Please provide affected demo Users [ eg. purchaser or a personal demo user ( I/C/D) ]?",
    "5. Are you accessing Secure Demo Access or Storefront /Citrix Desktop? (*applicable for SDE landscape only)",
    "6. Information of your Network/Device.",
    "• Network type – F5-VPN or WiFi",
    "• Device Type - Laptop, Mobile Device",
    "Note: The Support SLAs exist only for Standard Scripts. We'll support any issues outside of this, but we are not governed by any SLAs",
    "1. Basic Information",
    "a. Demo ID from Demo Calendar ?",
    "b. Demo Date and Time ?",
    "c. How can you be contacted ?",
    "2. Demo Realm/Network Info",
    "a. What Demo script (Script ID and Name) are you using?",
    "a.\tWhat Demo script (Script ID and Name) are you using?",
    "a. User-ID and Password ? If Network are you logging in a buyer or supplier?",
    "b. Which Realm is used ?",
    "c. If integrated scenario which landscape are you in ?",
    "3. Detailed Problem Description",
    "a. Issue description:",
    "b. Steps to recreate the issue (screen shots or screen cam)",
    "c. Master Data used (PO, Inv, contract...)",
    "----------------------------------",
  ];

  var curr_activity_type = "";
  var field_changes_block_cnt = 0;
  var is_prev_field_change_sol_provided = false;
  var is_prev_field_change_sol_rejected = false;

  // Button id's and Svg Icons
  let buttonIcons = [
    [
      "ws_assign_incident_to_me",
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z" /></svg>',
    ],
    [
      "sysverb_update",
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H11.81C11.42,20.34 11.17,19.6 11.07,18.84C9.5,18.31 8.66,16.6 9.2,15.03C9.61,13.83 10.73,13 12,13C12.44,13 12.88,13.1 13.28,13.29C15.57,11.5 18.83,11.59 21,13.54V7L17,3M15,9H5V5H15V9M13,17H17V14L22,18.5L17,23V20H13V17" /></svg>',
    ],
    [
      "resolve_incident",
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z" /></svg>',
    ],
    [
      "awaiting_requestor",
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z" /></svg>',
    ],

    [
      "retrieve_incident",
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,3V5H8V3H16M16,7V9H8V7H16M16,11V13H8V11H16M5,15H19L12,22L5,15Z" /></svg>',
    ],
  ];

  const expand_btn_css =
    ".expand { background-color: #e0f5f0;color: #007958; cursor: pointer;padding: 2px 10px 3px 10px;text-decoration: none;margin-right: 10px;border-radius: 4px; box-sizing: border-box;font-weight: 500;border: 1px solid #b4e5d9; }";
  const console_css = "color:#c411e8;font-weight: 600"; // Default color to print in console (Works only in chrome)

  GM_addStyle(expand_btn_css); // will be used in Field Changes Block for expand hide.

  var gvBrowser = detectBrowser(); // Find the Browser type

  var listPageLoaded = false; //Variable to check whether load event is triggered for list page.

  print("Printing Window Name");
  //console.log(window.self);

  if (gvBrowser == "Firefox") {
    //Load Event is not trigged for firefox
    simplifySnow();
  } else {
    // For all browsers wait for load event
    print("Waiting for Load Event");

    setTimeout(function () {
      //Load Event is not triggered for Incident List page for back button. We will load the page in 3 seconds ..if load event is not triggered.
      validateAndLoadListPage();
    }, 3000);

    window.addEventListener(
      "load",
      function () {
        print("Load event Completed");
        simplifySnow();
      },
      false
    );
  }

  // End of Main Logic

  function simplifySnow() {
    if (window.self.name !== "undefined" && window.self.name == "gsft_main") {
      if (
        document.title !== "undefined" &&
        document.title.includes("| Incident | HCSM") && //Incident Detail page
        document.title.search("Create") < 0 //Skip Create Incident Page
      ) {
        print("Start Processing Incident Window");
        processHeaderToolbar(); //Toolbar with buttons
        processWarningMessage(); //Remove Warning Message
        processHeaderDetailSection(); //Header Detail Section
        processMidSectionTabs();
        hideBottomToolbarAndLinks();
        hideBottomChildTabs();
        autoDiscardOnBackButton();
      } else if (
        document.title !== "undefined" &&
        document.title.includes("Catalog Task | HCSM") && //Task Detail Page
        document.title.search("Create") < 0 //Skip Create Incident Page
      ) {
        print("Start Processing Task Window");
        processActivityList();
      }
      //Filter incidents page ...
      else if (
        document.title !== "undefined" &&
        document.title == "Incidents | HCSM"
      ) {
        processListPage();
      }
    }
  }

  function autoDiscardOnBackButton() {
    //Auto dicard changes on click on back button..
    waitForElm("#dirty_form_modal_confirmation").then((elm) => {
      elm.querySelector('button[data-action="discard"]').click();
    });
  }

  function processMidSectionTabs() {
    //Set default Message type to Internal ..
    // document.getElementById("incident.u_message_type").value = default_msg_type;
    processCommTabTextArea();
    processActivityList();
    addPageScrollButtons();
    hideSystemAndRelatedRec(); //Hide System and Related Records tab..
    processInitialDescTab();
    processResolutionTab();
  }

  function processResolutionTab() {
    //Resolution Tab

    waitForElm("#incident.close_notes_ifr").then((elm) => {
      formatResContent(elm);
    });

    let lv_iframe_res_desc = document.getElementById(
      "incident.close_notes_ifr"
    );

    //Add the default values button

    let sym_addon_elm = document.querySelector(
      "#element\\.incident\\.u_symptom"
    );
    let but_def_res = document.createElement("span");
    but_def_res.innerHTML = "Default Values";
    but_def_res.classList.add("expand");
    but_def_res.style.marginTop = "23px";

    let res_def_handler = function () {
      SetDefaultResValues();
    };
    but_def_res.onclick = res_def_handler;
    let lastElm = sym_addon_elm.lastElementChild;

    lastElm.insertBefore(but_def_res, null);

    function formatResContent(elm) {
      elm.style.height = "200px";
      //Resolution tab - increase height of the text area
      let lv_resol_txt_edit =
        elm.contentWindow.document.getElementById("tinymce");
      lv_resol_txt_edit.style.font = text_area_font;

      if (enable_resolution_fields_default) {
        SetDefaultResValues();
      }
    }
  }

  function SetDefaultResValues() {
    document.getElementById("incident.close_code").value =
      "solved_fix_provided";
    document.getElementById("incident.u_affected_area").value = "application";
    document.getElementById("incident.u_symptom").value = "other_specify";
    if (!document.getElementById("ni.incident.u_notes_to_comments").checked) {
      document.getElementById("ni.incident.u_notes_to_comments").click();
    }
  }

  function processInitialDescTab() {
    if (hide_related_searches_button) {
      let lv_desc_section = document.getElementById(
        "0fdb6af8db4b33803da8366af4961947"
      );
      if (lv_desc_section != null) {
        let lv_rel_search_section =
          lv_desc_section.getElementsByClassName("custom-form-group");
        lv_rel_search_section[0].style.display = "none";
        lv_rel_search_section[1].style.display = "none";
      }
    }
    //Increase the font size of Text Area
    //Inital Description  Tab
    let lv_iframe_initial_desc = document.getElementById(
      "incident.description_ifr"
    );

    if (lv_iframe_initial_desc != null) {
      formatInitialDescTextArea(lv_iframe_initial_desc);
    } else {
      //Firefox sometimes delaying to load
      waitForElm("#incident.description_ifr").then((elm) => {
        formatInitialDescTextArea(elm);
      });
    }

    function formatInitialDescTextArea(lv_iframe) {
      let lv_init_txt_edit =
        lv_iframe.contentWindow.document.getElementById("tinymce");
      lv_init_txt_edit.style.font = text_area_font;
    }
  }

  function hideSystemAndRelatedRec() {
    //Hide Section Tabs
    let lv_tab_section = document.getElementById("tabs2_section");

    if (hide_system_tab) {
      lv_tab_section.childNodes[2].style.display = "none"; //Hide 3rd Tab
    }

    if (hide_related_records_tab) {
      lv_tab_section.childNodes[3].style.display = "none"; //Hide 4rd Tab
    }
  }

  function hideBottomChildTabs() {
    if (hide_child_tabs && enable_incident_tasks) {
      waitForElm("#tabs2_list > span:nth-child(7) > span").then((elm) => {
        hideChildExceptIncident();
        // elm.click();
      });
      document.getElementById("page_timing_div").style.display = "none"; //load time  statistics of page

      function hideChildExceptIncident() {
        let lv_tabs2_list_cont = document.getElementById("tabs2_list");

        let lv_tab_sep_list =
          lv_tabs2_list_cont.getElementsByClassName("tab_spacer"); //Seperator for each tab
        if (lv_tab_sep_list.length > 0) {
          for (let i = 0; i < lv_tab_sep_list.length; i++) {
            lv_tab_sep_list[i].style.display = "none";
          }
        }

        let lv_tab_list =
          lv_tabs2_list_cont.getElementsByClassName("tab_header");

        if (lv_tab_list.length > 0) {
          for (let i = 0; i < lv_tab_list.length; i++) {
            //Tab 3 is the Incident Tasks where External reaction tickets can be added
            if (i == 3) {
              lv_tab_list[i].childNodes[0].click();
            } else {
              lv_tab_list[i].style.display = "none";
            }
          }
        }
      }
    } else if (hide_child_tabs) {
      //hide all child tabs..
      let lv_tabs2_list = document.getElementById("tabs2_list"); //Parent Continer of list of tabs.
      lv_tabs2_list.style.display = "none";
      document.getElementById("tabs2_spacer").style.display = "none"; //View of each tab
      document.getElementById("related_lists_wrapper").style.display = "none";
      document.getElementById("page_timing_div").style.display = "none"; //load time  statistics of page

      let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
          print("Mutation Triggered for Junk Tabs");
          lv_tabs2_list.style.display = "none";
        });
      });

      observer.observe(lv_tabs2_list, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }

    function hideChildTabCont(childElemContainer) {
      //Will be called multiple times.
      let lv_tab_sep_list =
        childElemContainer.getElementsByClassName("tab_spacer"); //Seperator for each tab
      if (lv_tab_sep_list !== "undefined") {
        for (let i = 0; i < lv_tab_sep_list.length; i++) {
          lv_tab_sep_list[i].style.display = "none";
        }
      }

      let lv_tab_list = childElemContainer.getElementsByClassName("tab_header");
      if (lv_tab_list !== "undefined") {
        for (let i = 0; i < lv_tab_list.length; i++) {
          //Tab 3 is the Incident Tasks where External reaction tickets can be added
          if (i != 3) lv_tab_list[i].style.display = "none";
        }
      }
    }
  }

  function hideBottomToolbarAndLinks() {
    if (hide_bottom_button_bar)
      document.getElementsByClassName(
        "form_action_button_container"
      )[0].style.display = "none";

    //Hide Related links section
    if (hide_related_links) {
      let related_container = document.querySelectorAll(
        '[aria-label="Related Links"]'
      );
      related_container[0].style.display = "none";
    }
  }

  function addPageScrollButtons() {
    //Add page bottom on communication element page
    let comm_elm = document.getElementById("element.incident.u_draft");
    let but_scroll_down = document.createElement("span");
    but_scroll_down.innerHTML = "Scroll botton";
    but_scroll_down.classList.add("expand");
    but_scroll_down.style.marginTop = "23px";

    let scroll_down_handler = function () {
      let scroll_elm = document.getElementById("incident.form_scroll");
      scroll_elm.scrollTop = scroll_elm.scrollHeight;
    };
    but_scroll_down.onclick = scroll_down_handler;
    comm_elm = comm_elm.append(but_scroll_down);

    //Add scroll to Top on below activities
    let activities_ul_parent = document.getElementById(
      "sn_form_inline_stream_entries"
    );

    let but_scroll_up = document.createElement("span");
    but_scroll_up.innerHTML = "Scroll up";
    but_scroll_up.classList.add("expand");
    but_scroll_up.style.float = "right";

    // but_scroll_up.style.marginTop = "23px";

    let scroll_up_handler = function () {
      let scroll_elm = document.getElementById("incident.form_scroll");
      scroll_elm.scrollTop = 0;
    };
    but_scroll_up.onclick = scroll_up_handler;
    activities_ul_parent = activities_ul_parent.append(but_scroll_up);
  }

  //Start of Communication tabs functions
  function processCommTabTextArea() {
    waitForElm("#incident.u_message_ifr").then((elm) => {
      elm.style.height = "170px";
      elm.style.font = text_area_font;
      let textAreaBody = elm.contentDocument.getElementById("tinymce");
      textAreaBody.style.font = text_area_font;
    });

    /*
                            let iframeCommCont = document.getElementById("incident.u_message_ifr"); //Iframe container for text area

                              iframeCommCont.style.height = "170px";
                              iframeCommCont.style.font = text_area_font;
                              let textAreaBody = iframeCommCont.contentDocument.getElementById("tinymce");
                              textAreaBody.style.font = text_area_font;
                          */
  }

  //start of activity formatting functions
  function processActivityList() {
    //Process Activity List from bottom to Top...

    //Get Parent of UL Element contains list of activities via li tag
    let activities_ul_cont = document.getElementById(
      "sn_form_inline_stream_entries"
    );
    let activitiyList = activities_ul_cont.childNodes[0]; // contains list of activities

    //loop on reverse order
    for (let i = activitiyList.childNodes.length - 1; i >= 0; i--) {
      processActivity(activitiyList.childNodes[i]);
    }

    //Start of activity inline functions..
    function processActivity(activity) {
      //Process Single activity
      //each activity containd 4 elements, only 3 is used.
      let elem_posted_by_cont = activity.childNodes[0];
      let elem_activity_type_cont = activity.childNodes[1];
      let elem_info_cont = activity.childNodes[2];

      //First Element - Format the User Name.
      formatActivityPostedByItem(elem_posted_by_cont);

      //Second Element format the activity types.
      formatActivityTypeItem(elem_activity_type_cont);

      //Third Element format the Activity Description section
      formatActivityInfo(elem_info_cont);
      //Fourth element not used
    }

    function formatActivityPostedByItem(activityPostedNameItem) {
      //First Reduce the width of the element, to Display more info Acitivity type element
      activityPostedNameItem.style.width = "30%"; // Decrease 50% width to 30% to print more content on Activity Type
      activityPostedNameItem.style.color = "#2c5cc5"; //Blue color
      activityPostedNameItem.style.font = activity_def_font;
    }

    function formatActivityTypeItem(activityTypeItem) {
      activityTypeItem.style.width = "70%"; //Increase width to 70% to print more content
      let activityTypeNameBox = activityTypeItem.childNodes[0];
      activityTypeNameBox.childNodes[0].style.font = activity_def_font;
      let activity_type =
        activityTypeItem.childNodes[0].childNodes[0].innerText;

      if (activity_type == "Internal Info") {
        activityTypeItem.childNodes[0].childNodes[0].style.font =
          activity_weighted_font;
        activityTypeItem.childNodes[0].childNodes[0].style.color =
          activity_int_type_color;
        curr_activity_type = "Internal Info";
      } else if (activity_type == "External Info") {
        activityTypeItem.childNodes[0].childNodes[0].style.font =
          activity_weighted_font;
        activityTypeItem.childNodes[0].childNodes[0].style.color =
          activity_ext_type_color;
        curr_activity_type = "External Info";
      } else if (activity_type == "Field changes") {
        field_changes_block_cnt = field_changes_block_cnt + 1; //Count the number of Field Changes
        curr_activity_type = "Field Changes";
        activityTypeItem.childNodes[0].style.opacity = 1; //Prevent opacity becomes 0 on hover
        if (field_changes_block_cnt != 1) {
          activityTypeItem.parentElement.childNodes[2].style.display = "none"; //Hide the Field Changes Desc View
          addExpandButton(activityTypeItem);
        }
      } else {
        activityTypeItem.childNodes[0].childNodes[0].style.font =
          activity_def_font;
        curr_activity_type = "";
      }
    }

    function addExpandButton(activityTypeItem) {
      let expandButton = document.createElement("span");
      expandButton.innerHTML = "Expand";
      expandButton.classList.add("expand");

      let expandHandler = function () {
        let lv_vis_status =
          this.parentElement.parentElement.childNodes[2].style.display;
        if (lv_vis_status == "none") {
          this.innerHTML = "Collapse";
          this.parentElement.parentElement.childNodes[2].style.display =
            "inline-block";
        } else {
          this.innerHTML = "Expand";
          this.parentElement.parentElement.childNodes[2].style.display = "none";
        }
      };
      expandButton.onclick = expandHandler;

      activityTypeItem.prepend(expandButton);
    }

    function formatActivityInfo(infoCont) {
      if (curr_activity_type == "Internal Info") {
        formatInfoView(infoCont);
      } else if (curr_activity_type == "External Info") {
        formatInfoView(infoCont);
      } else if (curr_activity_type == "Field Changes") {
        formatActivityFieldChanges(infoCont);
      } else {
        //For future block elements.
        infoCont.style.font = activity_def_font;
      }
    }

    function formatInfoView(infoCont) {
      let info_elem = infoCont.querySelector('span[id*="journal-content_"]'); //Find the span tag with the id containing Journal content

      if (info_elem != null) {
        info_elem.style.font = activity_def_font;
      } else {
        infoCont.childNodes[0].style.font = activity_def_font;
      }
      if (is_prev_field_change_sol_provided) {
        infoCont.parentElement.style.backgroundColor = "#f0ffed";
        resetPrevFieldChangeStatus();
      } else if (is_prev_field_change_sol_rejected) {
        infoCont.parentElement.style.backgroundColor = "#f5eae9";
        resetPrevFieldChangeStatus();
      } else {
        infoCont.parentElement.style.backgroundColor = "#F8F9F9";
        //backgroundImage = "linear-gradient(#f5f7f9,#f5f7f9)"; //Grey color
      }
    }

    //Format internal Info Container
    function formatActivityInternalInfo(infoCont) {}

    //Format External info container
    function formatActivityExternalInfo(infoCont) {}

    //Format Field Changes Container
    function formatActivityFieldChanges(infoCont) {
      if (field_changes_block_cnt == 1) {
        if (infoCont.childNodes[0].childNodes[0].nodeName == "UL")
          formatActivityInitialSubmissionFiledChanges(infoCont);
        //Only First post by Requester
        else {
          //Sometimes Field changes only contains Video and also it will be the First Block
          field_changes_block_cnt = 0;
          formatActivityFieldChangesOther(infoCont);
        }
      } else {
        formatActivityFieldChangesOther(infoCont);
      }
    }

    //Forth other Field Changes
    function formatActivityFieldChangesOther(infoCont) {
      if (!infoCont.classList.contains("sn-card-component_records")) {
        //Might be attachments..
        infoCont.style.font = activity_def_font;
        return;
      }

      //The field chagnes contains the list of recors.
      let ulList = infoCont.childNodes[0].childNodes[0];
      ulList.style.font = activity_def_font;
      for (let i = 0; i < ulList.childNodes.length; i++) {
        ulList.childNodes[i].childNodes[0].style.font = activity_def_info_font;
        ulList.childNodes[i].childNodes[1].style.font = activity_def_info_font;

        //Check For Priority
        if (ulList.childNodes[i].childNodes[0].innerText == "Priority") {
          if (
            parseInt(
              ulList.childNodes[i].childNodes[1].childNodes[0].innerText.charAt(
                0
              )
            ) < 3
          ) {
            ulList.childNodes[i].childNodes[1].childNodes[0].style.font =
              activity_weighted_font;
            ulList.childNodes[i].childNodes[1].childNodes[0].style.color =
              "#ee0935";
            generateFieldChangeInfoElement(
              infoCont,
              ulList.childNodes[i].childNodes[1].childNodes[0].innerText,
              "#ee0935"
            );
          } else {
            ulList.childNodes[i].childNodes[1].childNodes[0].style.font =
              activity_weighted_font;
            ulList.childNodes[i].childNodes[1].childNodes[0].style.color =
              "#0f8f3e";

            generateFieldChangeInfoElement(
              infoCont,
              ulList.childNodes[i].childNodes[1].childNodes[0].innerText,
              "#0f8f3e"
            );
          }
        }
        //Check For Assignment Group
        else if (
          ulList.childNodes[i].childNodes[0].innerText == "Assignment group"
        ) {
          ulList.childNodes[i].childNodes[1].childNodes[0].style.font =
            activity_weighted_font;
          ulList.childNodes[i].childNodes[1].childNodes[0].style.color =
            "#5a32af";

          generateFieldChangeInfoElement(
            infoCont,
            ulList.childNodes[i].childNodes[1].childNodes[0].innerText,
            "#5a32af"
          );
        }
        // Check for State Change
        else if (ulList.childNodes[i].childNodes[0].innerText == "State") {
          if (
            ulList.childNodes[i].childNodes[1].childNodes[0].innerText ==
            "Resolved"
          ) {
            is_prev_field_change_sol_provided = true;
            generateFieldChangeInfoElement(
              infoCont,
              "Solution Provided",
              "green"
            );
          } else if (
            ulList.childNodes[i].childNodes[1].childNodes[0].innerText ==
              "In Progress" &&
            ulList.childNodes[i].childNodes[1].childNodes[2].innerText ==
              "Resolved"
          ) {
            is_prev_field_change_sol_rejected = true;
            generateFieldChangeInfoElement(
              infoCont,
              "Solution Rejected",
              "red"
            );
          } else {
            generateFieldChangeInfoElement(
              infoCont,
              ulList.childNodes[i].childNodes[1].childNodes[0].innerText,
              "#2874A6"
            );
          }
        }
      }
    }

    function generateFieldChangeInfoElement(currElement, msgText, msgColor) {
      let InfoSpanText = document.createElement("span");
      InfoSpanText.innerText = msgText;
      InfoSpanText.style.font = activity_weighted_font;
      InfoSpanText.style.color = msgColor;
      InfoSpanText.style.marginRight = "10px";
      currElement.parentElement.childNodes[1].prepend(InfoSpanText);
    }

    //Format First Field Changes Container
    function formatActivityInitialSubmissionFiledChanges(infoCont) {
      let ulList = infoCont.childNodes[0].childNodes[0];
      ulList.style.font = activity_def_font;
      for (let i = 0; i < ulList.childNodes.length; i++) {
        ulList.childNodes[i].childNodes[0].style.font = activity_def_info_font;
        ulList.childNodes[i].childNodes[1].style.font = activity_def_info_font;

        //format Priority
        if (ulList.childNodes[i].childNodes[0].innerText == "Priority") {
          ulList.childNodes[i].childNodes[1].style.color =
            parseInt(ulList.childNodes[i].childNodes[1].innerText.charAt(0)) < 3
              ? "red"
              : "green";
        } else if (
          ulList.childNodes[i].childNodes[0].innerText == "Description"
        ) {
          let desc_content_div =
            ulList.childNodes[i].childNodes[1].childNodes[0].shadowRoot
              .childNodes[0];

          if (
            desc_content_div.getElementsByTagName("div").length == 0 &&
            desc_content_div.getElementsByTagName("ol").length == 0 &&
            desc_content_div.getElementsByTagName("ul").length == 0
          ) {
            //Format the paragraph in description, if there is no div containers.

            desc_content_div.style.font = activity_def_font;
            let text_area_elements = desc_content_div.childNodes;
            let new_html = "";

            for (let i = 0; i < text_area_elements.length; i++) {
              switch (text_area_elements[i].nodeName) {
                case "P":
                  new_html = new_html + parseParagraph(text_area_elements[i]);

                  break;
                case "BR":
                  new_html = new_html + "<br>";
                  break;
                case "#text":
                  new_html =
                    new_html +
                    format_answer(text_area_elements[i].nodeValue.trim());
                  break;
                case "A":
                  break;
                default:
                  console.log(
                    "<---------------------some other element------------>"
                  );
                  break;
              }
            }
            desc_content_div.innerHTML = new_html; //Set the formatter HTML
          }

          //Parse the Paragraph Tags..
          function parseParagraph(elem) {
            let new_html_p = "<p>";
            let p_nodes = elem.childNodes;
            for (let j = 0; j < p_nodes.length; j++)
              switch (p_nodes[j].nodeName) {
                case "BR":
                  new_html_p = new_html_p + "<br>";
                  break;
                case "#text":
                  new_html_p =
                    new_html_p + format_answer(p_nodes[j].nodeValue.trim());
                  break;
                case "A":
                  new_html_p = new_html_p + parseAnchor(p_nodes[j]);
                  break;
                default:
                  console.log(
                    "<---------------------some other element------------>"
                  );
                  break;
              }

            new_html_p = new_html_p + "</p>";
            return new_html_p;
          }

          //Parse the Anchor Tags
          function parseAnchor(aElem) {
            let a_html = "<a";
            for (let k = 0; k < aElem.attributes.length; k++) {
              a_html =
                a_html +
                " " +
                aElem.attributes[k].nodeName +
                '="' +
                aElem.attributes[k].nodeValue +
                '"';
            }
            a_html = a_html + ">";
            a_html = a_html + aElem.innerHTML + "</a>";

            return a_html;
          }

          function format_answer(text_msg) {
            if (questions.includes(text_msg)) {
              return text_msg;
            } else {
              return (
                '<span style="margin-left:20px;color:' +
                requester_post_answer_color +
                '">' +
                text_msg +
                "</span>"
              );
            }
          }
        }
      }
    }

    function formatActivityInitialSubmissionFiledChanges1(infoCont) {
      let ulList = infoCont.childNodes[0].childNodes[0];
      ulList.style.font = activity_def_font;
      for (let i = 0; i < ulList.childNodes.length; i++) {
        ulList.childNodes[i].childNodes[0].style.font = activity_def_info_font;
        ulList.childNodes[i].childNodes[1].style.font = activity_def_info_font;

        //format Priority
        if (ulList.childNodes[i].childNodes[0].innerText == "Priority") {
          ulList.childNodes[i].childNodes[1].style.color =
            parseInt(ulList.childNodes[i].childNodes[1].innerText.charAt(0)) < 3
              ? "red"
              : "green";
        } else if (
          ulList.childNodes[i].childNodes[0].innerText == "Description"
        ) {
          let desc_content_div =
            ulList.childNodes[i].childNodes[1].childNodes[0].shadowRoot
              .childNodes[0];

          let FindAnchors = desc_content_div.getElementsByTagName("a"); //If any anchors tags are there dont format the initial Submission

          let Msglines = desc_content_div.innerText.split(/\r?\n/); // Split content based on line breaks
          let new_html_cont = "";

          if (FindAnchors.length == 0) {
            for (let i = 0; i < Msglines.length; i++) {
              let curr_line = Msglines[i].replace(/(\r\n|\n|\r)/gm, ""); //Replace any line breaks
              if (questions.includes(Msglines[i])) {
                if (i == 0) {
                  new_html_cont = new_html_cont + curr_line;
                } else {
                  if (curr_line !== "") {
                    new_html_cont = new_html_cont + "<br>" + Msglines[i] + "";
                  }
                }
              } else {
                if (i == 0) {
                  new_html_cont =
                    new_html_cont +
                    "<div style='color:" +
                    requester_post_answer_color +
                    ";display:block;margin-left:25px;'>";
                  new_html_cont = new_html_cont + curr_line + "</div>";
                } else {
                  if (curr_line !== "") {
                    new_html_cont =
                      new_html_cont +
                      "<div style='color:" +
                      requester_post_answer_color +
                      ";display:block;margin-left:25px;'>";
                    new_html_cont = new_html_cont + curr_line + "</div>";
                  }
                }
              }
            }
            // new_html_cont = ReplaceAnchorsInDesc(new_html_cont, FindAnchors );
            desc_content_div.innerHTML = new_html_cont;
          }
        }
      }
    }

    function resetPrevFieldChangeStatus() {
      is_prev_field_change_sol_provided = false;
      is_prev_field_change_sol_rejected = false;
    }

    function questionSearch(line_text) {
      for (let i = 0; i < questions.length; i++) {
        if (line_text == questions[i]) {
          return true;
        }
      }
      return false;
    }

    //End of activity inline functions..
    //End of inline functions..
  }

  //End of activity formatting functions

  //End of communication tabs functions

  //Start of Header Detail Section

  function processHeaderDetailSection() {
    //Increase header details left side section
    if (header_info_increase_width_left) {
      if (isElementIdExists("1078e6b4db4b33803da8366af4961918")) {
        document
          .getElementById("1078e6b4db4b33803da8366af4961918")
          .childElements()[0].childNodes[1].style.width = "40%";
        //Increase left side header section to 60%
        document
          .getElementById("1078e6b4db4b33803da8366af4961918")
          .childElements()[0].childNodes[0].style.width = "60%";
      }
    }
  }

  //End of Header Detail Section

  //Start of Waring message functions..

  function processWarningMessage() {
    if (hide_initial_warning_message) {
      let warn_msg = document.getElementById("close-messages-btn");
      if (warn_msg !== null) warn_msg.click();
    }
  }

  //End of Warning Message fuctions

  //Toolbar button functions..
  function processHeaderToolbar() {
    //Hide Buttons..

    if (hide_but_followup) hideElementById("connectFollowWidget");
    if (hide_but_follow) hideElementById("notificationFollowWidgetAction");
    if (hide_but_create_problem)
      hideElementById("2f43c471c0a8006400a07440e49924c2");
    if (hide_but_update) hideElementById("sysverb_update");
    if (hide_but_save) hideElementById("sysverb_update_and_stay");
    if (hide_but_create_security_incident)
      hideElementById("create_security_incident");
    if (hide_but_responses) hideElementById("message_template");
    if (hide_but_remote_connection) hideElementById("remote_connection");
    if (hide_but_reroute_initial_level) hideElementById("reroute_incident");
    if (hide_but_reroute_keep_level) hideElementById("send_back_incident");
    if (hide_but_forward_next_level) hideElementById("forward_next_level_inc");

    //Color Buttons..

    //Add Icons to Toolbar Buttons
    addIconsToButtons();
    addColorsToButtons();

    //Align Buttons to Center
    if (align_but_center) {
      alignTopButtons();
      let header_but_toolbar_cont = document.getElementById(
        "section-1078e6b4db4b33803da8366af4961918.header"
      );

      let navObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
          print("Mutation Triggered for Navigation");
          alignTopButtons();
        });
      });

      navObserver.observe(header_but_toolbar_cont, {
        childList: true,
        subtree: true,
      });
    }

    function alignTopButtons() {
      let nav_cont = document.getElementsByClassName("navbar_ui_actions")[0];
      if (
        nav_cont.parentElement.classList.contains(
          "ui_action_container_overflow"
        )
      ) {
        let rightButSection = document.querySelector(
          "#section-1078e6b4db4b33803da8366af4961918\\.header > nav > div > div:nth-child(2)"
        );
        // .classList.add("navbar-right");
        // nav_cont.style.textAlign = "center";
        // nav_cont.style.marginLeft = "0%";
        rightButSection.style.marginRight = "30%";
      } else {
        let rightButSection = document.querySelector(
          "#section-1078e6b4db4b33803da8366af4961918\\.header > nav > div > div:nth-child(2)"
        );
        //rightButSection.classList.remove("navbar-right");
        rightButSection.style.marginRight = "30%";
      }
    }
  }

  function addIconsToButtons() {
    for (let i = 0; i < buttonIcons.length; i++) {
      let butItem = document.getElementById(buttonIcons[i][0]);
      if (butItem != null) {
        let iconElement = document.createElement("img");
        iconElement.style.backgroundImage = "url('" + buttonIcons[i][1] + "')";
        iconElement.style.backgroundRepeat = "no-repeat";
        iconElement.style.paddingTop = "9px";
        iconElement.style.paddingRight = "11px";
        iconElement.style.paddingBottom = "9px";
        iconElement.style.paddingLeft = "9px";

        butItem.prepend(iconElement);
      }
    }
  }

  function addColorsToButtons() {
    for (let i = 0; i < buttonColors.length; i++) {
      setBackgroundColorById(buttonColors[i][0], buttonColors[i][1]);
    }
  }

  //End of Toolbar button Functions..

  //functions for Modularization

  function processListPage() {
    listPageLoaded = true;
    // document.getElementById("incident_expanded").childNodes[4].style.font =
    //  incident_filter_list_font;

    document.getElementById("incident_expanded").childNodes[4].style.fontSize =
      incident_filter_list_page_font_size;
    // Hide Timing Statistics
    waitForElm("#page_timing_div").then((elm) => {
      hideElementById("page_timing_div");
    });
  }

  function validateAndLoadListPage() {
    if (!listPageLoaded) {
      if (window.self.name !== "undefined" && window.self.name == "gsft_main") {
        if (
          document.title !== "undefined" &&
          document.title == "Incidents | HCSM" //Incidents Filter Page
        ) {
          print("Triggered Custom Load Event");
          //Trigger load event if it is not triggered already
          dispatchEvent(new Event("load"));
        }
      }
    }
  }

  //End of Modularization

  //Start of Utility functions...

  function setBackgroundColorById(elementId, bgColor) {
    let item = document.getElementById(elementId);
    if (item != null) item.style.backgroundColor = bgColor;
  }

  function hideElementById(elementId) {
    let item = document.getElementById(elementId);
    if (item != null) {
      item.style.display = "none";
    }
  }

  function isElementIdExists(elementId) {
    return document.getElementById(elementId) != null ? true : false;
  }

  //Wait for the selector and disconnect the observer once it is found
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  function print(value) {
    if (gvBrowser == "Chrome")
      console.log("%c===>" + value + "<===", console_css);
    else console.log("===>" + value + "<===");
  }

  function detectBrowser() {
    if (
      (navigator.userAgent.indexOf("Opera") ||
        navigator.userAgent.indexOf("OPR")) != -1
    ) {
      return "Opera";
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return "Safari";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    } else if (
      navigator.userAgent.indexOf("MSIE") != -1 ||
      !!document.documentMode == true
    ) {
      return "IE"; //crap
    } else {
      return "Unknown";
    }
  }

  //End of Utilities
})();
