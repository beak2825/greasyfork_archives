// ==UserScript==
// @name        C&C:TA Who is online
// @namespace   CnC_TA_Who_is_online
// @author      Vulcano
// @version     1.0.0.5
// @date        2015-03-25
// @copyright   (c) by Vulcanion.com
// @license     Vulcanion.com
// @URL         http://Vulcanion.com
// @icon        http://Images.Vulcanion.com/Vulcanion/Vulcano_62x64.png
// @description Gives an overview of all online alliance members sorted by there member state.
// @include     http*://*.alliances.commandandconquer.com/*
// @include     https*://*.alliances.commandandconquer.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15070/CC%3ATA%20Who%20is%20online.user.js
// @updateURL https://update.greasyfork.org/scripts/15070/CC%3ATA%20Who%20is%20online.meta.js
// ==/UserScript==

(function(){
    console.log('C&C:TA Who is online loading ...');
	var WhoIsOnline0 = function()
	{
		function createClass()
		{
			qx.Class.define("WhoIsOnline.Main",
			{
				type: "singleton",
				extend: qx.core.Object,
				
				construct: function()
				{
					try
					{				
						console.log("Initializing WhoIsOnlineButton Button");
						var WhoIsOnlineButton = new qx.ui.form.Button("Who is online ?");
						WhoIsOnlineButton.set(
						{			
							alignY: "middle",							
							width : 120,							
							toolTipText : "open WhoIsOnline window",
							appearance: "button-text-small"
						});
												
						WhoIsOnlineButton.addListener("execute", this.__openWhoIsOnlineWindow, this);
		
						var app = qx.core.Init.getApplication();
						app.getDesktop().add(WhoIsOnlineButton, 
						{
							bottom: 0, 
							right: 120
						});

					}
					catch(e)
					{
//      				console.log("Failed to initialize WhoIsOnline: ", e);
					}
				},
				
				destruct: function()
				{
				},
				
				members:
				{				
					__openWhoIsOnlineWindow: function()
					{
						var WhoIsOnlineWindow = WhoIsOnline.Window.getInstance();
						
						if(WhoIsOnlineWindow.isVisible())
						{
//                          console.log("closing WhoIsOnlineWindow");
							WhoIsOnlineWindow.close();
						}
						else
						{
//                          console.log("opening WhoIsOnlineWindow");
							WhoIsOnlineWindow.open();
						}
					}
				}
			});		
			
			qx.Class.define("WhoIsOnline.Window",
			{
				type: "singleton",
				extend: qx.ui.window.Window,
				
				construct: function()
				{
					try
					{				
//						console.log("Creating WhoIsOnline.Window");
						this.base(arguments);
						this.setLayout(new qx.ui.layout.Canvas());
						
						this.set(
						{				
							width: 150,
							caption: "Online Members",
							allowMaximize: false,
							showMaximize: false,
							allowMinimize: false,
							showMinimize: false,
							resizable: false
						});		
						
						this.model = new qx.ui.table.model.Simple();
						this.model.setColumns(["Role", "Name", "OnlineState", "RoleText"]);
						this.model.sortByColumn(1, true);						
						this.list = new qx.ui.table.Table(this.model);
						this.list.setColumnVisibilityButtonVisible(false);
						this.list.setColumnWidth(0, 0);
						this.list.setColumnWidth(1, 130);					
						this.list.setColumnWidth(2, 0);
						this.list.setColumnWidth(3, 0);	
						this.list.set({ width: 130, minHeight: 250 });
						var tModel = this.list.getTableColumnModel();
						tModel.setColumnVisible(0, false);
						tModel.setColumnVisible(2, false);
						tModel.setColumnVisible(3, false);
						this.list.setStatusBarVisible(false);
						this.add(this.list, {
							bottom: 0, 
							left: 0
						});
						
						this.list.addListener("mousemove", function(e)
                        {
                            var cell = this.getCellUnderMouse(this.list, e);
                            var row  = cell.row;
                            var col  = cell.col;
                            if((row >= 0) && (col >= 0))
                            {
                                if((this._curTtRow != row) || (this._curTtCol != col))
                                {
                                    this.list.setToolTipText("");
                                    var ttManager = qx.ui.tooltip.Manager.getInstance();
                                    ttManager.resetCurrent();
                                    var ttText = this._onGetToolTipText(this.list, row, col);
                                    if(ttText && (ttText != ""))
                                    {
                                        this.list.setToolTipText(ttText);
                                        ttManager.showToolTip(this.list);
                                    }
                                }
                            }
                            else
                            {
                                if((this._curTtRow >= 0) && (this._curTtCol >= 0))
                                {
                                    this.list.setToolTipText("");
                                    var ttManager = qx.ui.tooltip.Manager.getInstance();
                                    ttManager.resetCurrent();
                                }
                            }
                            this._curTtRow = row;
                            this._curTtCol = col;
                        }, this);
						
						try
						{
							var timer = qx.util.TimerManager.getInstance();
						}
						catch(e)
						{
//							console.log("Failed to get timer");
							throw e;
						}
						timer.start(function()
						{
//										console.log("Timer function running");
//										console.log("Getting Members and members count");
										var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
										alliance.RefreshMemberData();
										var members = alliance.get_MemberDataAsArray();
						
//										console.log("Creating model");
										var rowArr=[];									
									
										var iCounter = 0;
										for(i = 0; i < alliance.get_NumMembers(); i++)
										{
											var member = members[i];
											var name = member.Name;
											if(member.OnlineState == ClientLib.Data.EMemberOnlineState.Away)
											     name=">>" + name;
											if(member.OnlineState == ClientLib.Data.EMemberOnlineState.Online || member.OnlineState == ClientLib.Data.EMemberOnlineState.Away)
											{	
											 
												rowArr.push([member.Role, name, member.OnlineState, member.RoleName]);
//												console.log(member.Role + " - " + member.Name);
//												console.log("WhoIsOnlineView: " + member.Name + " - " + member.OnlineState);
												iCounter++;
											}
										}
						
										this.model.removeRows(0, this.model.getRowCount(), true)
										this.model.setData(rowArr);
										this.model.sortByColumn(0, true);
						},
						5000,
						this,
						null,
						1000); 
					}
					catch(e)
					{
//						console.log("Failed to initialize WhoIsOnline.Window");
						console.log(e);
					}
//					console.log("C&C:TA Who is online loaded successfully !!!");
				},
				
                destruct: function()
				{
				},
				
				members:
				{			
					model: null,
					list: null,
				
					getCellUnderMouse : function(table, mouseEvent)
                    {
                        var row = -1, col = -1;
                        if(table && mouseEvent)
                        {
                            var pageX = mouseEvent.getDocumentLeft();
                            var pageY = mouseEvent.getDocumentTop();                    
                            var sc = table.getTablePaneScrollerAtPageX(pageX);                    
                            if(sc)                    
                            {                    
                              row = sc._getRowForPagePos(pageX, pageY);                    
                              col = sc._getColumnForPageX(pageX);                    
                              if((row === null) || (row === undefined)) { row = -1; }                    
                              if((col === null) || (col === undefined)) { col = -1; }                    
                            }                    
                          }                    
                          return({ "row": row, "col": col });
                    },
                    
                    _onGetToolTipText : function(table, row, col)
                    {     
                        return this.model.getValue(3, row);                          
                    } 
				}
			});
		}	
		
		
		function WhoIsOnline_checkIfLoaded() 
		{
			try 
			{
				if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible())
				{
					createClass();
					window.WhoIsOnline.Main.getInstance();			
				} else 
				{
					window.setTimeout(WhoIsOnline_checkIfLoaded, 1000);
				}
			} catch (e) 
			{
				console.log("WhoIsOnline_checkIfLoaded: ", e);
			}
		}
		
		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(WhoIsOnline_checkIfLoaded, 1000);
		}
	};	
	
	try 
	{
		var script = document.createElement("script");
		script.innerHTML = "(" + WhoIsOnline0.toString() + ")();";
		script.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(script);
		}
	} 
	catch (e) 
	{
		console.log("WhoIsOnline init error: ", e);
	}
	console.log('C&C:TA Who is online loaded successfully !!!');
})();