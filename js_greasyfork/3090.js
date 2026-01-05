// ==UserScript==
// @name       Jira Annoying Guy
// @namespace  http://ciandt.com/
// @version    0.5.2
// @description  Jira custom options
// @match      http*://jiracloud.cit.com.br/secure/RapidBoard.jspa?rapidView=7215*
// @copyright  rafaelh
// @downloadURL https://update.greasyfork.org/scripts/3090/Jira%20Annoying%20Guy.user.js
// @updateURL https://update.greasyfork.org/scripts/3090/Jira%20Annoying%20Guy.meta.js
// ==/UserScript==

/*Change log
0.5.2 - 08/08/2014
Match url fix

0.5.1 - 28/07/2014
Menu bar fix

0.5.0 - 21/07/2014
Warning messages
Review story warning
Already assigned tasks warning

0.4.4 - 18/07/2014
Another refresh screen fix try

0.4.3 - 11/07/2014
Refresh screen fix

0.4.1 - 07/07/2014
Refactors, Constants
Bug when trying to attach file fixed

0.4.0 - 03/07/2014
When moving tasks to IN PROGRESS or IN CODE REVIEW, check if there is already a task assigned for the user

0.3.2 - 03/07/2014
Refresh work view was improved; refresh fails are going to happen less frequently

0.3.1 - 01/07/2014
Backlog column missing fix

0.3.0 - 30/06/2014
Task grab events - refreshing is still improvised

0.2 - 30/06/2014
ScrollTo error message

0.1 - 28/06/2014
Create Issue - Bug - Environment
Not working if issue is created in a new tab
*/

//Constants
var Constants = {
    ISSUE_TYPE_BUG: ["1", "8"],
    COLUMN_INDEX_IN_PROGRESS: 2,
    COLUMN_INDEX_IN_CODE_REVIEW: 4
}

//Utils
var Utils = {
    closeMessage: function() {
        $("#message").fadeOut("slow");
        return false;
    },
    obtainNthIndex: function(str, pat, n){
        var L= str.length, i= -1;
        while(n-- && i++<L){
            i= str.indexOf(pat, i);
        }
        return i;
    },
    parseFieldsBody: function(body, splitter) {
        var obj = {};
        var text = body.split(splitter);
        var field;
        var fieldName;
        var fieldVal;
        text.forEach(function(attr) {
            field = attr.split('=');
            fieldName = field[0];
            fieldVal = field[1];
            obj[fieldName] = fieldVal;
        });
        return obj;
    },
    
    parseReturnUrlFromDocumentUrl: function(documentUrl) {
        var returnUrl = document.URL.substring(this.obtainNthIndex(document.URL, '/', 3), document.URL.length);
        returnUrl = returnUrl.replace(/\?/g,'%3F');
        returnUrl = returnUrl.replace(/\=/g,'%3D');
        returnUrl = returnUrl.replace(/\&/g,'%26');
        return returnUrl;
    },
    
    refreshView: function() {
        setTimeout(function(){ 
        	GH.RefreshHandler.Poller.startPoller(true);
        }, 3500);
    },
    
    removeInsertedErrorMessages: function() {
        $('#inserted-error-message').remove();
    },
    
    addErrorAndScrollTo: function(fieldText, fieldId) {
        var errorMsg = '<div id="inserted-error-message" style="color:red; font-weight: bold;">You must specify '+fieldText+' of the issue.</div>';
        $(fieldId+'-wiki-edit').append(errorMsg);
        var scrollPosition = 0;
        $('.form-body')[0].scrollTop = scrollPosition;
        scrollPosition = $(fieldId).position().top - 5;
        $('.form-body')[0].scrollTop = scrollPosition;  
    },
    
};

//Top Message
var TopMessage = {
    addGlobalStyle: function(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    },
    
    closeMessage: function() {
        $("#message").fadeOut("slow");
        return false;
    },
    
    init: function() {
     	this.addGlobalStyle(
            '#message {'
            +'    font-family:Arial,Helvetica,sans-serif;'
            +'    position:fixed;'
            +'    top:0px;'
            +'    left:0px;'
            +'    width:100%;'
            +'    z-index:105;'
            +'    text-align:center;'
            +'    font-weight:bold;'
            +'    font-size:100%;'
            +'    color:white;'
            +'    padding:10px 0px 10px 0px;'
            +'    background-color:#8E1609;'
            +'}'
            +'#message span {'
            +'    text-align: center;'
            +'    width: 95%;'
            +'    float:left;'
            +'}'
            +'.close-notify {'
            +'    white-space: nowrap;'
            +'    float:right;'
            +'    margin-right:10px;'
            +'    color:#fff;'
            +'    text-decoration:none;'
            +'    border:2px #fff solid;'
            +'    padding-left:3px;'
            +'    padding-right:3px'
            +'} '
        );   
        var messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        messageDiv.style.cssText = 'display:none;';
        messageDiv.appendChild(document.createElement('span'));
        var button = document.createElement('button');
        button.classList.add('close-notify');
        button.id = 'close-notify-button';
        button.textContent = 'X';
        messageDiv.appendChild(button);
        document.body.appendChild(messageDiv);
        document.querySelector('#close-notify-button').addEventListener("click", this.closeMessage, false);
    }     
}
TopMessage.init();

//Overwriting .send
XMLHttpRequest.prototype.reallySend = XMLHttpRequest.prototype.send; 
XMLHttpRequest.prototype.send = function(body) { 
    if (body != null) { 
        //If .send body is a string (i.e. not a file)
        if (typeof body == 'string' || body instanceof String) {
            var obj = Utils.parseFieldsBody(body, '&');
            //Create-issue
            if (obj.isCreateIssue) {
                Utils.removeInsertedErrorMessages();
                //Bug
                if (Constants.ISSUE_TYPE_BUG.indexOf(obj.issuetype)!=-1) {
                    //Environment
                    if (obj.environment == '') {
                        Utils.addErrorAndScrollTo('an environment', '#environment');
                        this.abort();
                    }
                }
            }
        }
    }
    this.reallySend(body);
};

function checkIfColumnHasAssignedTasks(args, column, index, task) {
    var taskAssignee = $(task).find('.ghx-avatar img').attr('alt');
    var user = $('meta[name="ajs-remote-user-fullname"]').attr('content');
    if (taskAssignee == user) {
        args.alreadyAssignedToTask = true;
        args.alreadyAssignedTaskColumn = column;
        args.alreadyAssignedTaskIndex = index;
    }
    return args;
}

function checkIfUserHasAssignedTasks() {    
    var $allTasksInProgress = $('ul li:nth-child('+Constants.COLUMN_INDEX_IN_PROGRESS+') .ghx-has-avatar');
    var $allTasksInCodeReview = $('ul li:nth-child('+Constants.COLUMN_INDEX_IN_CODE_REVIEW+') .ghx-has-avatar');
    var args = {
        alreadyAssignedTaskColumn: null,
        alreadyAssignedTaskIndex: null,
        alreadyAssignedToTask: false
    };
    $allTasksInProgress.each( function(index, task) {
        args = checkIfColumnHasAssignedTasks(args, Constants.COLUMN_INDEX_IN_PROGRESS, index, task);
    });
    $allTasksInCodeReview.each( function(index, task) {;
        args = checkIfColumnHasAssignedTasks(args, Constants.COLUMN_INDEX_IN_CODE_REVIEW, index, task);
    });
    if (args.alreadyAssignedToTask) {
        $('#message span').text('Warning: You already have a task assigned to you!');
        $('#message').fadeIn('slow');
        window.scrollTo(0, $($('ul li:nth-child('+args.alreadyAssignedTaskColumn+') .ghx-has-avatar')[args.alreadyAssignedTaskIndex]).offset().top - 200);
    }
}
//Overwriting .open
XMLHttpRequest.prototype.reallyOpen = XMLHttpRequest.prototype.open; 
XMLHttpRequest.prototype.open = function() {
    var abortedRequest = false;
    var method = this.open.arguments[0];
    var url = this.open.arguments[1];
    var async = this.open.arguments[2];
    //GET
    if (method=="GET") {
        //Parsing url
        var parsedUrl = url.split('?');
        var file = parsedUrl[0];
        var body = parsedUrl[1];
        var fileFormat = file.substring(file.lastIndexOf('.')+1);
        var fileType = file.substring(file.lastIndexOf('/')+1, file.lastIndexOf('.'));
        var obj = Utils.parseFieldsBody(body, '&');
        //JSPA
        if (fileFormat == "jspa") {
            //WorkflowUIDispatcher
            if (fileType == "WorkflowUIDispatcher") {     
                //When moved to IN PROGRESS(41) and IN CODE REVIEW(61) columns
                if ((obj.action==41)||(obj.action==61)) {
                    checkIfUserHasAssignedTasks();
                    //Assign
                    this.onload = function() {
                        xmlHttp = new XMLHttpRequest();
                        xmlHttp.open("POST", "/secure/AssignIssue.jspa", true);
                        //Refresh
                        xmlHttp.onload = function(){
                            Utils.refreshView();
                        };
                        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        var returnUrl = Utils.parseReturnUrlFromDocumentUrl(document.URL);
                        xmlHttp.send("inline=true&decorator=dialog&returnUrl="+returnUrl+"&id="+obj.id+"&assignee="+$("meta[name='ajs-remote-user']").attr('content')+"&comment=&commentLevel=&atl_token="+$("meta[name='atlassian-token']").attr('content'));
                    };    
                }
                //When moved to TO DO(backlog (81), development(31)) and AWAITING CODE REVIEW(51) columns
                if ((obj.action==81)||(obj.action==31)||(obj.action==51)) {
                    //Unassign
                    this.onload = function() { 
                        setTimeout( function() {
                            $('[data-issue-id = '+obj.id+']').attr('class', $('[data-issue-id = '+obj.id+']').attr('class').replace('ghx-has-avatar ', ''));
                        }, 1000);
                        xmlHttp = new XMLHttpRequest();
                        xmlHttp.open("POST", "/secure/AssignIssue.jspa", true);
                        //Refresh
                        xmlHttp.onload = function(){
                            Utils.refreshView();
                        };
                        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        var returnUrl = Utils.parseReturnUrlFromDocumentUrl(document.URL);
                        xmlHttp.send("inline=true&decorator=dialog&returnUrl="+returnUrl+"&id="+obj.id+"&assignee=&comment=&commentLevel=&atl_token="+$("meta[name='atlassian-token']").attr('content'));
                    };
                }
            }
        }
        //JSON
        if (fileFormat == "json") {
            //subtasksInFinalColumn
            if (fileType == "subtasksInFinalColumn") {
                this.onload = function() {
                    var parsedResponse = JSON.parse(this.response);
                    if (parsedResponse.subtasksInFinalColumn) {
                        $('#message span').text('You have just closed a story, please remember to review it!');
                    	$('#message').fadeIn('slow');
                    }
                }
            }
        }
    }
    this.reallyOpen(method, url, async);
};