// ==UserScript==
// @name            DeleteAllMessages
// @version         14.10.31
// @description     Disable all messages button.
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author          Nogrod
// @downloadURL https://update.greasyfork.org/scripts/18085/DeleteAllMessages.user.js
// @updateURL https://update.greasyfork.org/scripts/18085/DeleteAllMessages.meta.js
// ==/UserScript==
(function () {
  var DeleteAllMessages_mainFunction = function () {
    function createTweak() {
      qx.Mixin.define("webfrontend.gui.mail.MMailTab", {
        construct : function () {
          var children = this.getChildren();
          var getObjId = function (children, objid) {
            for (var j = 0; j < children.length; j++) {
              if (children[j].objid == objid)
                return children[j];
            }
            return null;
          };
          for (var i = 0; i < children.length; i++) {
            if (children[i]instanceof qx.ui.container.Composite && getObjId(children[i].getChildren(), "btndelete") !== null) {
              var btnDeleteAllMessages = new qx.ui.form.Button(this.tr("tnf:delete mails"));
              btnDeleteAllMessages.addListener("execute", function () {
                btnDeleteAllMessages.setEnabled(false);
                ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("IGMGetFolders", {}, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, folders) {
                    console.log(folders);
                    if (folders !== null && folders.length >= 2 && folders[0].i > 0 && folders[1].i > 0) {
                      var folderId = folders[this.getMailboxType() == ClientLib.Data.Mail.EMailBox.Inbox ? 0 : 1].i;
                      ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("IGMGetMsgCount", {
                        folderId : folderId
                      }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (folderId, count) {
                          console.log(count);
                          if (count > 0) {
                            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("IGMGetMsgHeader", {
                              folder : folderId,
                              skip : 0,
                              take : count,
                              sortColumn : ClientLib.Data.Mail.EMailSort.Time,
                              ascending : false
                            }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, function (context, mails) {
                                console.log(mails);
                                var mailIds = [];
                                for (var i = 0; ((mails !== null) && (i < mails.length)); i++) {
                                  mailIds.push(mails[i].i);
                                }
                                if (mailIds.length > 0) {
                                  ClientLib.Data.MainData.GetInstance().get_Mail().DeleteMessages(mailIds, (this.getMailboxType() == ClientLib.Data.Mail.EMailBox.Inbox));
                                }
                                btnDeleteAllMessages.setEnabled(true);
                              }), null);
                          } else {
                            btnDeleteAllMessages.setEnabled(true);
                          }
                        }), folderId);
                    } else {
                      btnDeleteAllMessages.setEnabled(true);
                    }
                  }), null);
              }, this);
              children[i].addAfter(btnDeleteAllMessages, getObjId(children[i].getChildren(), "btndelete"));
              break;
            }
          }
        }
      });
      qx.Class.include(webfrontend.gui.mail.MailTab, webfrontend.gui.mail.MMailTab);
    }
    function DeleteAllMessages_checkIfLoaded() {
      try {
        if (typeof loader !== "undefined" && loader.complete && typeof loader.downloadScript === "undefined") {
          createTweak();
        } else {
          setTimeout(DeleteAllMessages_checkIfLoaded, 500);
        }
      } catch (e) {
        if (typeof console !== "undefined") {
          console.log(e + ": " + e.stack);
        } else if (window.opera) {
          opera.postError(e);
        } else {
          GM_log(e);
        }
      }
    }
    setTimeout(DeleteAllMessages_checkIfLoaded, 500);
  };
  var DeleteAllMessagesScript = document.createElement("script");
  var txt = DeleteAllMessages_mainFunction.toString();
  DeleteAllMessagesScript.innerHTML = "(" + txt + ")();";
  DeleteAllMessagesScript.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(DeleteAllMessagesScript);
})();