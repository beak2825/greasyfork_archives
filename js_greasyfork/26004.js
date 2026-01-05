// ==UserScript==
// @name            Chaturbate Age-Filter & Locations
// @version         1.061
// @namespace       Frank_Einstein@greasyfork.org
// @description     Age filter, Locations under each thumbnail, Locations list with links, and more!
// @include         /^https?:\/\/(\w+\.)?chaturbate\.com(\/.*)?/
// @run-at          document-end
// @grant           none
// @icon            https://en.chaturbate.com/favicon.ico
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/26004/Chaturbate%20Age-Filter%20%20Locations.user.js
// @updateURL https://update.greasyfork.org/scripts/26004/Chaturbate%20Age-Filter%20%20Locations.meta.js
// ==/UserScript==

console.log("Loading: " + GM_info.script.name + " " + GM_info.script.version);

// MAIN SCRIPT FUNCTION

(function() {

    // CURRENT URL //
    var _URL = location.href;

    //====================================================================================================

    // OPTIONS VARIABLES
    var AgeMin = 18;
    var AgeMax = 99;
    var AlwaysHideMales = 0;
    var AlwaysHideTrans = 0;
    var AlwaysHideGirls = 0;
    var AlwaysHideCouples = 0;
    var Filter_Interval = 2000;
    var Chat_Fix_Width = 1;
    var Remove_Ads = 1;
    
    // MORE OPTIONS //
    // PROFILE'S REFRESH DELAY
    // Website's default is 45000 (45 Sec)
    var Profiles_Refresh_Delay;
    Profiles_Refresh_Delay = 60000;  // 1 Min
    //Profiles_Refresh_Delay = 300000; // 5 Min
    
    //====================================================================================================

    // GLOBAL VARIABLES

    // AGE FILTER
    var AgeFilters_Label;
    var AgeMin_Label;
    var AgeMin_Textbox;
    var AgeMax_Label;
    var AgeMax_Textbox;

    // LOCATIONS
    var Locations_List;
    var CSS_Mod;

    // LOCATION WINDOW
    var Locations_List_Text;
    var Locations_List_Link;
    var Locations_List_Window;
    var Locations_List_Window_ID;
    var Locations_List_Button;
    var Locations_List_Div;
    var Locations_List_Width;
    var Locations_List_Height;

    // CONTROL_BOX - WHERE WE PUT OUR NEW CONTROLS
    var Control_Box;
    
    //====================================================================================================
    
    // ID OF THE LOCATION WINDOW //
    Locations_List_Window_ID = "Locations_List_Window";

    // PLACE WHERE TO PUT OUR BUTTONS AND OTHER INPUTS //
    var Target_Inputs ;
    Target_Inputs = document.querySelector(".nav-bar");
    Target_Inputs = document.querySelector("#nav");
    Target_Inputs = document.querySelector(".content");
    Target_Inputs = document.querySelector(".sub-nav");

    // MODULE VARIABLES
    DRAGING_OBJECTS_STARTUP();

    //====================================================================================================

    // MAIN SCRIPT CODE

    // Show_Profile_Locations();

    var Pattern_Main       = /^https?:\/\/(\w+\.)?chaturbate\.com(\/|\/\?page)?$/;
    var Pattern_Followed   = /^https?:\/\/(\w+\.)?chaturbate\.com\/followed\-cams(\/.*)?$/;
    var Pattern_Exhibition = /^https?:\/\/(\w+\.)?chaturbate\.com\/exhibitionist\-cams(\/.*)?$/;
    var Pattern_Female     = /^https?:\/\/(\w+\.)?chaturbate\.com\/female\-cams(\/.*)?$/;
    var Pattern_Male       = /^https?:\/\/(\w+\.)?chaturbate\.com\/male\-cams(\/.*)?$/;
    var Pattern_Couple     = /^https?:\/\/(\w+\.)?chaturbate\.com\/couple\-cams(\/.*)?$/;
    var Pattern_Trans      = /^https?:\/\/(\w+\.)?chaturbate\.com\/trans\-cams(\/.*)?$/;
    var Pattern_Spy        = /^https?:\/\/(\w+\.)?chaturbate\.com\/spy\-on\-cams(\/.*)?$/;

    // Not seems to be needed here...
    // Patern = Pattern.source.replace(/\^http/g,'http').replace(/:/g,'%3A').replace(/\\\//g,'%2F').replace(/\//g,'%2F');

    if ( Pattern_Main.test(_URL) || 
        Pattern_Exhibition.test(_URL) || 
        Pattern_Female.test(_URL) || 
        Pattern_Male.test(_URL) || 
        Pattern_Couple.test(_URL) || 
        Pattern_Trans.test(_URL) || 
        Pattern_Spy.test(_URL) ) {

        // MAIN PAGES //

        console.log("[" + GM_info.script.name + " " + GM_info.script.version + "] - " + "DEBUG INFO: MAIN PAGE");

        // UPDATE HERE //
        Append_Age_Controls();
        Age_Filter();
        Clone_Pages_Numbers();
        Show_All_Locations();
        //Show_Refresh_Button();
        
        
        // CHANGE REFRESH DELAY FOR THE PROFILES ON THE MAIN PAGES
        reload_rooms.delay = Profiles_Refresh_Delay; // 5 Min
        
        var Filter_Loop = setInterval(function() {
            Show_Profile_Locations(); // BUG
            Age_Filter();
        }, Filter_Interval);

    } else {

        // WEBCAM PAGES //
        if (Chat_Fix_Width === 1) { Chat_Fix(); }
    }
    
    // DEBUG BUTTON
    // Show_Debug_Button();

    // REMOVE ADS //
    if (Remove_Ads) { Hide_Ads(); }
    
    //====================================================================================================
    // FUNCTIONS
    //====================================================================================================
    
    function Chat_Fix() {
        Injection_CSS(".c-1 { width: 95% !important; } #defchat { width: 100% !important; }", "Chat_Fix", document.body);
    }
    
    //====================================================================================================
    
    function Hide_Ads() {
        Hide_This_Node(".ad");
        Hide_This_Node(".remove_ads");
    }

    //====================================================================================================
    
    function Debug_Actions() {
        
        // users_that_can_chat
        // LINE: 1169
        // LINE: 1242
        
        // Useless?
        // alert(defchat_settings.users_that_can_chat);
        
        // alert("DeBuG!!");
        return;
        
        
        // REFRESH THE MAIN PAGE
        // female-cams - Line 2455
        reload_rooms.schedule_refresh();
        // unsafeWindow.reload_rooms.schedule_refresh();
        return;
        
        
        // CHANGE REFRESH DELAY FOR THE PROFILES ON THE MAIN PAGES
        // 1000 = 1 Sec
        reload_rooms.delay = 300000; // 5 Min
        return;
        
        
        
        // TMP
        // var reload_rooms = {
        // delay: 45000,
        // on_timeout: function () {...},
        // schedule_refresh: function () {...}
        
    }

    //====================================================================================================

    // reload_rooms.schedule_refresh();
    
    function Show_Debug_Button() {

        // DEBUG BUTTON //

        // Append the new controls inside this node.
        // var Target = document.querySelector(".sub-nav");
        // var Target = document.querySelector(".nav-bar");
        

        var Debug_Target ;
        Debug_Target = document.querySelector(".nav-bar");
        Debug_Target = document.querySelector("#nav");
        Debug_Target = document.querySelector(".content");
        Debug_Target = document.querySelector(".sub-nav");
        
        // top-section
        // Debug_Target = document.querySelector(".top-section");
        Debug_Target = document.querySelector(".sub-nav");
        
        // NEW LINE BREAK
        // Append_BR(Target_Inputs);

        // function Append_Button(TARGET_NODE, NEW_TEXTBOX_ID, NEW_BUTTON_DISPLAY, NEW_TEXTBOX_CAPTION)
        Debug_Button = Append_Button(Debug_Target, "Debug_Button", "block");
        Debug_Button.innerHTML = "Debug";

        // STYLE
        Debug_Button.style.marginTop = "10px";
        Debug_Button.style.marginBottom = "5px";
        // Debug_Button.style.margin = "10px";
        // Debug_Button.style.width = "110px";
        
        
        // CLICK EVENT
        Debug_Button.addEventListener("click", Debug_Actions);

    }

    //====================================================================================================
    
    function Refresh_Profiles() {
       
       console.log("[" + GM_info.script.name + " " + GM_info.script.version + "] - " + "DEBUG INFO: reload_rooms.schedule_refresh()");
        
        // REFRESH THE MAIN PAGE
        // female-cams - Line 2455
        reload_rooms.schedule_refresh();
        // unsafeWindow.reload_rooms.schedule_refresh();
        
        
        // TMP
        // var reload_rooms = {
        // delay: 45000,
        // on_timeout: function () {...},
        // schedule_refresh: function () {...}
        
    }

    //====================================================================================================

    // reload_rooms.schedule_refresh();
    
    function Show_Refresh_Button() {

        // DEBUG BUTTON //

        // Append the new controls inside this node.
        // var Target = document.querySelector(".sub-nav");
        // var Target = document.querySelector(".nav-bar");
        

        var Refresh_Target ;
        Refresh_Target = document.querySelector(".nav-bar");
        Refresh_Target = document.querySelector("#nav");
        Refresh_Target = document.querySelector(".content");
        Refresh_Target = document.querySelector(".sub-nav");
        
        
        // NEW LINE BREAK
        // Append_BR(Target_Inputs);

        // function Append_Button(TARGET_NODE, NEW_TEXTBOX_ID, NEW_BUTTON_DISPLAY, NEW_TEXTBOX_CAPTION)
        Refresh_Button = Append_Button(Refresh_Target, "Refresh_Button", "block");
        Refresh_Button.innerHTML = "Refresh Profiles";

        // STYLE
        Refresh_Button.style.marginTop = "5px";
        // Debug_Button.style.margin = "10px";
        // Debug_Button.style.width = "110px";
        
        
        // CLICK EVENT
        Refresh_Button.addEventListener("click", Refresh_Profiles );
        //Refresh_Button.addEventListener("click", function() { reload_rooms.schedule_refresh(); });

    }

    //====================================================================================================
    
    function Show_All_Locations() {

        // LOCATIONS-LIST BUTTON //

        // Append the new controls inside this node.
        // var Target = document.querySelector(".sub-nav");
        // var Target = document.querySelector(".nav-bar");

        // NEW LINE BREAK
        // Append_BR(Target_Inputs);

        // Create & Append AgeMin DIV
        // function Append_Button(TARGET_NODE, NEW_TEXTBOX_ID, NEW_BUTTON_DISPLAY, NEW_TEXTBOX_CAPTION)
        Locations_List_Button = Append_Button(Target_Inputs, "AgeMin_Label", "inline");
        Locations_List_Button.innerHTML = "Locations List";

        // STYLE
        // Locations_List_Button.style.margin = "10px";
        Locations_List_Button.style.marginTop = "5px";
        Locations_List_Button.style.width = "110px";

        // CALC CENTER
        var Box_Width = parseInt(Control_Box.style.width);
        var Button_Width = parseInt(Locations_List_Button.style.width);
        var Calc_Center = (Box_Width / 2) - (Button_Width / 2);
        Locations_List_Button.style.marginLeft = Calc_Center + "px";

        // CLICK EVENT
        Locations_List_Button.addEventListener("click", Show_Locations_List_Click);

    }

    //====================================================================================================

    function Show_Locations_List_Click() {

        // LOCATIONS-LIST BUTTON //

        var Current_Location;
        var All_Locations = document.querySelectorAll("li.location");
        var i;

        Locations_List = [];
        Locations_List_Text = "";

        for (i = 0; i < All_Locations.length; i++) {

            // console.log("DEBUG: Show_Profile_Locations();");

            if (All_Locations[i].parentNode.childNodes.length < 7 ) {

                Current_Location = All_Locations[i].innerHTML;
                Locations_List[i] = Current_Location;
                Locations_List_Text += Current_Location + "\n";

                // DEBUG
                // console.log("Location = " + Location);

            }
        }


        // CHECK IF "LOCATIONS_LIST_WINDOW" IS ALREADY CREATED
        if (Locations_List_Window) {

            Locations_List_Window.style.display = "block";

        } else {

            // NEW CUSTOM WINDOW FOR LOCATIONS LIST

            // function Custom_Window(WINDOW_ID, TITLE, WIDTH, HEIGHT, POS_LEFT, POS_TOP) {
            Locations_List_Window = Custom_Window(Locations_List_Window_ID, "Locations", "512px", "512px", "250px", "50px");
            
            // Fixed: Not moving while scrolling... (Bad if the screen is too small)
            Locations_List_Window.style.position = "fixed";
            
            // Absolute: Good if the screen is too small
            // Locations_List_Window.style.position = "absolute";
            
            
            
            
            // SET "LOCATIONS_LIST_WINDOW" ON CENTER OF THE SCREEN

            // OPEN THE CUSTOM WINDOW IN THE CENTER //
            // IT WORKS ALSO WITH THE DRAGGING CODE //
            var Win_Width = parseInt(Locations_List_Window.style.width);
            var Calc_Center = (parseInt(window.innerWidth) / 2) - (Win_Width / 2);
            Locations_List_Window.style.left = Calc_Center + "px";


            // Enable of resising the window
            Locations_List_Window.style.overflow = "auto";
            Locations_List_Window.style.resize = "both";
            
            // UPDATE HERE //
            
            /*
            Locations_List_Window.onresize = function(event) {
                // SAVE WINDOW'S SIZE //
            }
            */
            
            // OLD CENTER CODES //

            // MANUAL CALCULATION //
            // BREAKS THE DRAGGING CODE... (marginLeft) //
            // Locations_List_Window.style.marginLeft = "-256px";


            // FULL AUTOMATIC //
            // BREAKS THE DRAGGING CODE... (marginLeft) //
            
            /*
            // ((WIDTH / 2) * -1) //
            var Calc_Width;
            Calc_Width = Locations_List_Window.style.width;
            Calc_Width = parseInt(Calc_Width) / 2 * -1;
            Locations_List_Window.style.marginLeft = calc_width + "px";
            */

        }

        // BUILD AND INSERT THE LOCATIONS IN LOCATIONS_LIST_WINDOW
        Fill_Locations_List_Window();
        
        
        // DEBUG
        // alert(Locations_List_Text);
        
        // console.log("DEBUG: Fill_Locations_List_Window();");
        
    }

    //====================================================================================================

    function Fill_Locations_List_Window() {

        // LOOP FOR BUILDING THE LOCATIONS LIST
        var i;
        var Current_Link;
        var Current_Location;
        var Link_Position_Top;

        // QUERY ALL LOCATIONS
        Locations_List_Link = document.querySelectorAll(".details .title a");

        if (Locations_List_Div) {
            Locations_List_Div.innerHTML = "";
        } else {
            Locations_List_Div = document.createElement( 'div' );
            Locations_List_Div.id = "Locations_List_Div";
            
            // UPDATE //
            Injection_CSS("#Locations_List_Div { width: calc(100% - 10px);  height: calc(100% - 50px); } ","Locations_List_CSS", document.body);
            // Injection_CSS("#Locations_List_Div { height: 1000px; width: 1000px; } ","Locations_List_CSS", document.body);
            // Locations_List_Div.style.height = (parseInt(tmp_height) - 50) + "px";
            
        }

        // LOOP: BUILD LOCATIONS LIST
        // console.log("DEBUG: Building the Locations List");
        for (i = 0; i < Locations_List.length; i++) {

            Current_Link = Locations_List_Link[i].outerHTML;
            Current_Location = Locations_List[i];

            Locations_List_Div.innerHTML += Current_Location + '  :  ';
            Locations_List_Div.innerHTML += Current_Link + '<br>\n';

            //console.log('Locations_List_Link[i].outerHTML = ' + Locations_List_Link[i].outerHTML);
        }

        // APPEND LOCATIONS_LIST_DIV
        Locations_List_Window.appendChild(Locations_List_Div);

        // CALCULATE THE HEIGHT OF "LOCATIONS_LIST_DIV"
        var tmp_height = Locations_List_Window.style.height;
        var tmp_width = Locations_List_Window.style.height;
        Locations_List_Div.style.position = "relative";
        Locations_List_Div.style.display = "block";
        Locations_List_Div.style.top = "10px";
        Locations_List_Div.style.overflowY = "scroll";
        Locations_List_Div.style.margin = "5px";
        //Locations_List_Div.style.height = (parseInt(tmp_height) - 50) + "px";
        //Locations_List_Div.style.width = (parseInt(tmp_width) - 10) + "px";
        
        // UPDATE HERE //
        
    }
    
    //====================================================================================================

    function Show_Profile_Locations() {

        // VARIABLES //
        var Target;
        var Location;
        var Div_Location;
        var Test;

        // LOCATION LOOP //
        var All_Locations = document.querySelectorAll("li.location");
        var i;

        // TEST
        // alert(All_Locations[2].innerHTML);

        if (!CSS_Mod) {
            // NO MORE BUG HERE --> DOCUMENT.BODY //
            Injection_CSS(".list li { max-height: 255px !important; } div.details { min-height: 110px !important; }","Profile_Locations", document.body);
            CSS_Mod = 1;
        }

        for (i = 0; i < All_Locations.length; i++) {

            // console.log("DEBUG: Show_Profile_Locations();");

            if (All_Locations[i].parentNode.childNodes.length < 6 ) {

                Target = All_Locations[i].parentNode;         
                Location = All_Locations[i].innerHTML;
                Div_Location = document.createElement( 'div' );
                Div_Location.innerHTML = "Location: " + Location;
                Target.appendChild(Div_Location);

                // Div_Location.setAttribute("class") = "ShowLocation";  // BAD
                // Div_Location.style.margin = "10px";
                // Div_Location.style.display="inline";

            }
        }
    }

    //====================================================================================================

    function Age_SetValue() {


        // AGE MIN //
        window.localStorage.setItem( 'CUB.AgeMin', AgeMin_Textbox.value );
        AgeMin = AgeMin_Textbox.value;

        // AGE MAX //
        window.localStorage.setItem( 'CUB.AgeMax', AgeMax_Textbox.value );
        AgeMax = AgeMax_Textbox.value;

        // HIDE YOUR MOM //
        Age_Filter();


        // Capturing the Enter Key (Not needed here, but it can be useful)
        // 
        // var key = e.which || e.keyCode;
        // 
        // 13 = Enter Key
        // if (key === 13) { ... }

    }

    //====================================================================================================

    function Append_Age_Controls() {

        // APPEND THE NEW CONTROLS INSIDE THIS NODE.
        // var Target = document.querySelector(".sub-nav");

        // NEW DIV BOX AND PUT EVERYTHING INSIDE IT //
        Control_Box = Append_Div(Target_Inputs, "Control_Box", "block");
        Control_Box.style.borderStyle = "solid";
        Control_Box.style.borderWidth = "thin";
        Control_Box.style.marginTop = "35px";
        //Control_Box.style.marginLeft = "30px";

      // Box Size
        Control_Box.style.width = "250px";
        Control_Box.style.height = "90px";

        // REPLACE TARGET WITH THIS BOX //
        Target_Inputs = document.querySelector("#Control_Box");


        // NEW LINE BREAKS //
        //Append_BR(Target_Inputs);


        // THE AGE-FILTERS LABEL (OPTIONNAL - MAY TAKES UNNECESSARY SPACE)
        AgeFilters_Label = Append_Div(Target_Inputs, "AgeFilters_Label", "block");
        AgeFilters_Label.innerHTML = "Age Filters:";
        AgeFilters_Label.style.marginLeft = "10px";
        AgeFilters_Label.style.marginTop = "5px";

        // THE AGE-MIN LABEL
        AgeMin_Label = Append_Div(Target_Inputs, "AgeMin_Label", "inline-block");
        AgeMin_Label.innerHTML = "Age Min: ";
        AgeMin_Label.style.margin = "10px";
        //AgeMin_Label.style.marginTop = "5px";

        // THE AGE-MIN TEXTBOX (INPUT)
        AgeMin_Textbox = Append_Textbox(Target_Inputs, "AgeMin_Textbox", "inline");
        AgeMin_Textbox.setAttribute("type", "text");
        AgeMin_Textbox.maxLength = 2;
        AgeMin_Textbox.style.width = "25px";

        // THE THE AGE-MAX LABEL
        AgeMax_Label = Append_Div(Target_Inputs, "AgeMax_Textbox", "inline");
        AgeMax_Label.innerHTML = "Age Max: ";
        AgeMax_Label.style.margin = "10px";
        AgeMax_Label.style.marginLeft = "40px";

        // THE AGE-MAX TEXTBOX (INPUT)
        AgeMax_Textbox = Append_Textbox(Target_Inputs, "AgeMax_Textbox", "inline");
        AgeMax_Textbox.setAttribute("type", "text");
        AgeMax_Textbox.maxLength = 2;
        AgeMax_Textbox.style.width = "25px";


        // TEMPORARY VARIABLES //
        var tmp_AgeMin;
        var tmp_AgeMax;

        // DEBUG INFO //
        console.log("[" + GM_info.script.name + " " + GM_info.script.version + "] - " + "DEBUG INFO:");
        
        // GET THE STORED AGE-MIN //
        tmp_AgeMin = window.localStorage.getItem('CUB.AgeMin');
        console.log("window.localStorage.getItem('CUB.AgeMin') = '" + tmp_AgeMin + "'");  // DEBUG

        if (tmp_AgeMin !== null) {
            AgeMin =  tmp_AgeMin;
        }

        // GET THE STORED AGE-MAX //
        tmp_AgeMax = window.localStorage.getItem('CUB.AgeMax');
        console.log("window.localStorage.getItem('CUB.AgeMax') = " + tmp_AgeMax);  // DEBUG

        if (tmp_AgeMax !== null) {
            AgeMax =  tmp_AgeMax;
        }

        // SET VALUE FOR AGE INPUTS //
        AgeMin_Textbox.value = AgeMin;
        AgeMax_Textbox.value = AgeMax;

        // INPUTS CHANGE EVENTS //
        AgeMin_Textbox.addEventListener("change", Age_SetValue);
        AgeMax_Textbox.addEventListener("change", Age_SetValue);

    }

    //====================================================================================================

    function Age_Filter() {

        var span = document.querySelectorAll("SPAN");
        var age_class;
        var i;

        for (i = 0; i < span.length; i++) {

            age_class = span[i].getAttribute("class");
            if (
                age_class === "age genderc" || 
                age_class === "age genderf" || 
                age_class === "age genderm" || 
                age_class === "age genders"
            ) {

                age = span[i].innerHTML;

                Parent = span[i].parentNode.parentNode.parentNode;

                if (age < AgeMin || age > AgeMax) {
                    Parent.style.display = "none";
                } else if (AlwaysHideMales === 1 && age_class === "age genderm") {
                    Parent.style.display = "none";
                } else if (AlwaysHideTrans === 1 && age_class === "age genders") {
                    Parent.style.display = "none";
                } else if (AlwaysHideGirls === 1 && age_class === "age genderf") {
                    Parent.style.display = "none";
                } else if (AlwaysHideCouples === 1 && age_class === "age genderc") {
                    Parent.style.display = "none";
                } else {
                    Parent.style.display = "block";
                }

            }

        }

    }

    //====================================================================================================

    function Clone_Pages_Numbers() {

        // Get the last <li> element ("Milk") of <ul> with id="myList2"
        var itm = document.querySelector("ul.paging");

        // Copy the <li> element and its child nodes
        var cln = itm.cloneNode(true);

        // Append the cloned <li> element to <ul> with id="myList1"
        document.querySelector("div.top-section").appendChild(cln);

    }

    //====================================================================================================





    //====================================================================================================
    // FUNCTIONS MODULES
    //====================================================================================================


    //====================================================================================================
    // MODULE
    // CODE INJECTIONS
    //====================================================================================================

    function Injection_CSS(STR_CSS, CSS_ID, WhereToInject) {

        // REFERENCE:
        // http://stackoverflow.com/questions/11833759/add-stylesheet-to-head-using-javascript-in-body


        // if (BOOL_BODY == true) {
        //     var Inject_Section = document.body;
        // } else {
        //     var Inject_Section = document.head;
        // }


        var Inject_Section;

        if (WhereToInject !== null) {
            Inject_Section = WhereToInject;
        } else {
            Inject_Section = document.head;
        }

        var style_css = document.createElement('style');
        if (CSS_ID !== null) { style_css.id = CSS_ID; }  // TEST
        // if (CSS_ID !== '') { style_css.id = CSS_ID; }

        // style_css.href = '{url}';
        style_css.type = 'text/css';
        style_css.rel = 'stylesheet';
        style_css.innerHTML = STR_CSS;
        Inject_Section.appendChild(style_css);

        //document.head.appendChild(style_css);
    }

    //====================================================================================================


    //====================================================================================================
    // MODULE: HIDE_THIS_NODE
    // REQUIREMENT: Injection_CSS
    //====================================================================================================

    function Hide_This_Node(Css_Element) {
        Injection_CSS(Css_Element + ' { display: none !important; }');
    }

    //====================================================================================================


    //====================================================================================================
    // MODULE: ADD CONTROLS
    // BR, DIV, WINDOW, BUTTON, TEXTBOX
    //====================================================================================================

    // APPEND NEW LINE BREAK
    function Append_BR(TARGET_NODE) {

        // createElement
        var NEW_BR = document.createElement( 'br' );

        // appendChild
        TARGET_NODE.appendChild(NEW_BR);

      // Display Style
      NEW_BR.style.display = "block";

      // HEIGHT STYLE (NOT WORKING!)
      // if (HEIGHT) { NEW_BR.style.height = HEIGHT; }

      // LINE-HEIGHT STYLE (WORKS ONLY WITH POSITIVE VALUES. Ex: "150%" BUT NOT "50%")
      // if (LINE_HEIGHT) { NEW_BR.style.lineHeight = LINE_HEIGHT; }

      // MarginTop Size (NOT WORKING!)
      // if (MARGIN_TOP) { NEW_BR.style.marginTop = MARGIN_TOP; }

        // Return Created Node
        return NEW_BR;
    }


    //====================================================================================================

    // APPEND NEW PARAGRAPH
    function Append_P(TARGET_NODE) {

        // createElement
        var NEW_P = document.createElement( 'p' );

        // appendChild
        TARGET_NODE.appendChild(NEW_P);

        // Return Created Node
        return NEW_P;
    }

    // EXAMPLE:
    // <p></p>

    //====================================================================================================

    function Append_Div(TARGET_NODE, NEW_DIV_ID, NEW_DIV_DISPLAY) {

        // createElement //
        var New_Div = document.createElement( 'div' );

        // APPEND PARAMETERS //
        if (NEW_DIV_ID)        { New_Div.id = NEW_DIV_ID; }
        if (NEW_DIV_DISPLAY)   { New_Div.style.display = NEW_DIV_DISPLAY; }

        // appendChild //
        TARGET_NODE.appendChild(New_Div);

        return New_Div;

    }

    //====================================================================================================

    function Custom_Window(WINDOW_ID, TITLE, WIDTH, HEIGHT, POS_LEFT, POS_TOP) {

        // RESET THE POSITION EVERYTIME YOU OPEN THE WINDOW
        var Reset_Position = 0;

        // NEW_WINDOW //
        var New_Window = document.getElementById(WINDOW_ID);

        if (New_Window) {

            // POSITION RESET //
            if (Reset_Position) {
                New_Window.style.left = POS_LEFT;
                New_Window.style.top = POS_TOP;
            }

            // UNHIDE //
            New_Window.style.display = "block";

            // New_Window.style.visibility = "visible";
            // return New_Window;

        } else {

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            // NEW_WINDOW
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

            New_Window = document.createElement( 'div' );
            New_Window.id = WINDOW_ID;

            // NEW_WINDOW STYLE
            New_Window.style.position = "fixed";   // Not moving while scrolling...
            New_Window.style.display = "none";
            New_Window.style.border = "1px solid";
            
            // New_Window.style.visibility = "hidden"; // BAD

            // NEW_WINDOW SIZE
            New_Window.style.width = WIDTH;
            New_Window.style.height = HEIGHT;

            // NEW_WINDOW POSITION
            New_Window.style.left = POS_LEFT;
            New_Window.style.top = POS_TOP;

            // NEW_WINDOW BACKGROUND COLOR
            New_Window.style.backgroundColor = "white";


            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            // Div_Title_Bar
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

            var Div_Title_Bar_ID = WINDOW_ID + "_Title";
            // function Append_Div(TARGET_NODE, NEW_DIV_ID, NEW_DIV_DISPLAY) {
            var Div_Title_Bar = Append_Div(New_Window, Div_Title_Bar_ID, "block");

            Div_Title_Bar.style.position = "relative";
            Div_Title_Bar.style.top = "5px";
            Div_Title_Bar.style.height = "30px";
            Div_Title_Bar.style.marginLeft = "5px";
            Div_Title_Bar.style.marginRight = "5px";
            Div_Title_Bar.style.backgroundColor = "blue";


            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            // Div_Title
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

            var Div_Title_ID = WINDOW_ID + "_Title";
            // function Append_Div(TARGET_NODE, NEW_DIV_ID, NEW_DIV_DISPLAY) {
            var Div_Title = Append_Div(Div_Title_Bar, Div_Title_ID, "inline");

            Div_Title.innerHTML = TITLE;
            Div_Title.style.position = "relative";
            Div_Title.style.fontSize = "24px";
            Div_Title.style.top = "5px";
            Div_Title.style.marginLeft = "5px";
            Div_Title.style.color = "white";


            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            // Close_Button
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

            var Close_Button;
            var Close_Button_ID = WINDOW_ID + "_Close_Button";
            Close_Button = Append_Button(Div_Title_Bar, Close_Button_ID, "inline");

            Close_Button.innerHTML = "X";

            Close_Button.style.position = "relative";
            Close_Button.style.marginRight = "5px";
            Close_Button.style.top = "5px";
            Close_Button.style.cssFloat = "right";


            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            // CloseButton Click Event
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

            
            Close_Button.addEventListener("click", Custom_Window_Close);
            /* Close_Button.addEventListener("click", Custom_Window_Close(WINDOW_ID)); */
            
            /*
            Close_Button.addEventListener("click", function() {
                
                // SAVE THE SIZE OF LOCATIONS_LIST //
                
                // Locations_List_Width = Locations_List_Window.style.Width;
                // Locations_List_Height = Locations_List_Window.style.Height;
                
                Locations_List_Width = document.getElementById(WINDOW_ID).style.Width;
                Locations_List_Height = document.getElementById(WINDOW_ID).style.Height;
                
                //window.localStorage.setItem( 'CUB.Locations_List_Width', Locations_List_Width );
                //window.localStorage.setItem( 'CUB.Locations_List_Height', Locations_List_Height );
                
                console.log("[" + GM_info.script.name + " " + GM_info.script.version + "] - " + "DEBUG INFO:");
                console.log("WINDOW_ID = '" + WINDOW_ID + "'");
                console.log("window.localStorage.setItem( 'CUB.Locations_List_Width', '" + Locations_List_Width + "' );");
                console.log("window.localStorage.setItem( 'CUB.Locations_List_Height', '" + Locations_List_Height + "' );");
                
                
                // HIDE LOCATIONS_LIST //
                New_Window.style.display = "none";
                
            });
            */

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            // Line Breaks
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            //Append_BR(New_Window);
            //Append_BR(New_Window);


            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            // APPEND NEW_WINDOW TO DOCUMENT
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

            New_Window.style.display = "block";
            document.body.appendChild(New_Window);

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
            // Drag_This
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

            Div_Title_Bar.style.cursor = "move";
            Drag_This(Div_Title_Bar, New_Window);

        }

        return New_Window;

    }

    //====================================================================================================
    
    function Custom_Window_Close() {

        var CURRENT_WINDOW = document.getElementById(Locations_List_Window_ID);

        // SAVE THE SIZE OF LOCATIONS_LIST //

        // Locations_List_Width = Locations_List_Window.style.Width;
        // Locations_List_Height = Locations_List_Window.style.Height;

        var Locations_List_Width = CURRENT_WINDOW.style.width;
        var Locations_List_Height = CURRENT_WINDOW.style.height;

        window.localStorage.setItem( 'CUB.Locations_List_Width', Locations_List_Width );
        window.localStorage.setItem( 'CUB.Locations_List_Height', Locations_List_Height );

        console.log("[" + GM_info.script.name + " " + GM_info.script.version + "] - " + "DEBUG INFO:");
        console.log("WINDOW = '" + Locations_List_Window_ID + "'");
        //console.log("CURRENT_WINDOW.style.Width = '" + CURRENT_WINDOW.style.width + "'");
        console.log("window.localStorage.setItem( 'CUB.Locations_List_Width', '" + Locations_List_Width + "' );");
        console.log("window.localStorage.setItem( 'CUB.Locations_List_Height', '" + Locations_List_Height + "' );");


        // HIDE LOCATIONS_LIST //
        CURRENT_WINDOW.style.display = "none";
    
    }
 
    //====================================================================================================

    function Append_Button(TARGET_NODE, NEW_BUTTON_ID, NEW_BUTTON_DISPLAY, NEW_BUTTON_CAPTION) {

        // createElement //
        var NEW_BUTTON = document.createElement( 'BUTTON' );

        // PARAMETERS //
        if (NEW_BUTTON_ID)        { NEW_BUTTON.id = NEW_BUTTON_ID; }
        if (NEW_BUTTON_DISPLAY)   { NEW_BUTTON.style.display = NEW_BUTTON_DISPLAY; }

        // BUTTON CAPTION //
        if (NEW_BUTTON_CAPTION) {
            var tmp_caption = document.createTextNode(NEW_BUTTON_CAPTION);
            NEW_BUTTON.appendChild(tmp_caption);
            // var t = document.createTextNode("Click me");
            // x.appendChild(t);
        }

        // appendChild //
        TARGET_NODE.appendChild(NEW_BUTTON);

        return NEW_BUTTON;

    }

    //====================================================================================================


    function Append_Textbox(TARGET_NODE, NEW_TEXTBOX_ID, NEW_TEXTBOX_DISPLAY) {

        // createElement //
        var NEW_TEXTBOX = document.createElement( 'input' );

        // PARAMETERS //
        if (NEW_TEXTBOX_ID)        { NEW_TEXTBOX.id = NEW_TEXTBOX_ID; }
        if (NEW_TEXTBOX_DISPLAY)   { NEW_TEXTBOX.style.display = NEW_TEXTBOX_DISPLAY; }

        // appendChild //
        TARGET_NODE.appendChild(NEW_TEXTBOX);

        // Return Created Node
        return NEW_TEXTBOX;

    }

    //====================================================================================================


    //====================================================================================================
    // MODULE: DRAGING OBJECTS
    // SOURCE: https://jsfiddle.net/tovic/Xcb8d/
    //====================================================================================================

    
    function DRAGING_OBJECTS_STARTUP() {
        document.onmousemove = _move_elem;
        document.onmouseup = _destroy;
    }
    
    
    var selected = null, // Object of the element to be moved
        x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
        x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element
    
    
    // Will be called when user starts dragging an element
    function _drag_init(elem) {
        // Store the object of the element which needs to be moved
        selected = elem;
        x_elem = x_pos - selected.offsetLeft;
        y_elem = y_pos - selected.offsetTop;
    }

    
    // Will be called when user dragging an element
    function _move_elem(e) {
        x_pos = document.all ? window.event.clientX : e.pageX;
        y_pos = document.all ? window.event.clientY : e.pageY;
        if (selected !== null) {
            selected.style.left = (x_pos - x_elem) + 'px';
            selected.style.top = (y_pos - y_elem) + 'px';
        }
    }

    
    // Destroy the object when we are done
    function _destroy() {
        selected = null;
    }

    
    // Bind the functions...
    function Drag_This(GRAB_ELEMENT, MOVE_ELEMENT) {
        // OR...
        // document.querySelector(GRAB_ELEMENT).onmousedown = function () {
        GRAB_ELEMENT.onmousedown = function () {
            _drag_init(MOVE_ELEMENT);
            return false;
        };
    }

    
    // ORIGINAL CODE // 
    /*
    
    // Bind the functions...
    document.getElementById('draggable-element').onmousedown = function () {
        _drag_init(this);
        return false;
    };
    
    */
    

    //====================================================================================================

    


})();

// THE END


