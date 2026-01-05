// ==UserScript==
// @name        PERSONAL GW Mod
// @include     http://game.galaxywarfare.com*
// @include     http://misc.hairballtech.net/test.php*
// @description HB and Marvel's personal Iteration of HB's GW Mod Beta 3 with the inclusion of an Admin Panel
// @version     Beta 4.8
// @require     http://code.jquery.com/jquery-3.1.0.js
// @namespace   https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/21510/PERSONAL%20GW%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/21510/PERSONAL%20GW%20Mod.meta.js
// ==/UserScript==

var Mod  = document.createElement  ('div')        ;
var menu = document.getElementById ('navigation') ;
	menu  .parentNode.insertBefore (Mod, menu)    ;

Mod.innerHTML = '<div class="well well-small" id="Mod1">'
+ '<a href="javascript:;" onclick="$(\'#Mod\').toggle(\'fast\');" class="medtext btn btn-block btn-primary">Mod Panel</a>'
+ '<ul id="Mod" style="display:none" class="nav nav-tabs nav-stacked">'

+ '</br>'

+ '<div class="well well-small" id="WBM1">'
+ '<a href="javascript:;" onclick="$(\'#WBM\').toggle(\'fast\');" class="medtext btn btn-block btn-warning">Warp Bookmarks</a>'
+ '<ul id="WBM" style="display:none" class="nav nav-tabs nav-stacked">'

+ '<!--'
+    'Each line of code below represents one bookmark.'
+    'To create a new bookmark, copy and paste the top line of code underneath the last line'
+    'Then alter the "X= and Y= variables inside the approximate middle of the code so that they represent your destination, without removing any other characters.'
+    'Please bear in mind that you cannot warp directly to any location outside of the 10,000\'s on the grid.'
+    'Lastly, change the name of the bookmark at the end of the code appropriately, beginning it with a space so as to keep the Chevron Idicator.'
+ '-->'

+ '<ul class="nav nav-tabs nav-stacked">'

+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=1&warp_y=1\');"><i class="icon-chevron-right">         </i> Origin              </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=400&warp_y=400\');"><i class="icon-chevron-right">     </i> Neutral Zone        </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=200&warp_y=200\');"><i class="icon-chevron-right">     </i> War Zone            </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=1111&warp_y=1111\');"><i class="icon-chevron-right">   </i> Ship Graveyard      </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=665&warp_y=-672\');"><i class="icon-chevron-right">    </i> Tularia             </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-1107&warp_y=-1873\');"><i class="icon-chevron-right">  </i> Easter Egg          </a></li>'

+ '</ul>'

+ '<div class="well well-small id="TulO1">'
+ '<a href="javascript:;" onclick="$(\'#TulO\').toggle(\'fast\');" class="medtext btn btn-block btn-info">Tularian Orbs</a>'
+ '<ul id="TulO" style="display:none" class="nav nav-tabs nav-stacked">'

+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=250&warp_y=250\');"><i class="icon-chevron-right">      </i> 250, 250      </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=250&warp_y=-250\');"><i class="icon-chevron-right">     </i> 250, -250     </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-250&warp_y=-250\');"><i class="icon-chevron-right">    </i> -250, -250    </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-250&warp_y=250\');"><i class="icon-chevron-right">     </i> -250, 250     </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=500&warp_y=500\');"><i class="icon-chevron-right">      </i> 500, 500      </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=500&warp_y=-500\');"><i class="icon-chevron-right">     </i> 500, -500     </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-500&warp_y=-500\');"><i class="icon-chevron-right">    </i> -500, -500    </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-500&warp_y=500\');"><i class="icon-chevron-right">     </i> -500, 500     </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=750&warp_y=750\');"><i class="icon-chevron-right">      </i> 750, 750      </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=750&warp_y=-750\');"><i class="icon-chevron-right">     </i> 750, -750     </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-750&warp_y=-750\');"><i class="icon-chevron-right">    </i> -750, -750    </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-750&warp_y=750\');"><i class="icon-chevron-right">     </i> -750, 750     </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=1000&warp_y=1000\');"><i class="icon-chevron-right">     </i> 1000, 1000   </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=1000&warp_y=-1000\');"><i class="icon-chevron-right">    </i> 1000, -1000  </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-1000&warp_y=-1000\');"><i class="icon-chevron-right">   </i> -1000, -1000 </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-1000&warp_y=1000\');"><i class="icon-chevron-right">    </i> -1000, 1000  </a></li>'

+ '</ul>'
+ '</div>'

+ '</ul>'
+ '</div>'

+ '<div class="well well-small" id="PPa">'
+ '<a href="javascript:;" onclick="$(\'#PPa1\').toggle(\'fast\');" class="medtext btn btn-block btn-success">Player Panel</a>'
+ '<ul id="PPa1" style="display:none" class="nav nav-tabs nav-stacked">'
+     '<li><a href="javascript:callWorkerForContent(\'profile\',\'\');"><i class="icon-chevron-right">                                      </i> Profile                         </a></li>'
+     '<li><a href="javascript:callWorkerForContent(\'options\',\'\');"><i class="icon-chevron-right">                                      </i> Options                         </a></li>'
+     '<li><a href="javascript:callWorkerForContent(\'messages\',\'\');"><i class="icon-chevron-right">                                     </i> Messages                        </a></li>'
+     '<li><a href="javascript:callWorkerForContent(\'log\',\'\');"><i class="icon-chevron-right">                                          </i> Captain\'s Log                  </a></li>'
+     '<li><a href="javascript:callWorkerForContent(\'universe\',\'&acceptpay=1\');'
+          'window.location.href = \'http://rpgvote.com/vote?id=1\';"><i class="icon-chevron-right">                                        </i> Collect Daily $                 </a></li>'
+     '<li><a href="javascript:window.location.href = \'http://game.galaxywarfare.com/index.php?logout=1\';"><i class="icon-chevron-right"> </i> Log Out                         </a></li>'

+ '</ul>'
+ '</div>'

+ '</br>'

+ '<ul class="nav nav-tabs nav-stacked">'
+ '<li><a href="javascript:callWorkerForContent(\'globaldailystats\',\'\');"><i class="icon-chevron-right">         </i> Daily Statistics </a></li>'
+ '<li><a href="javascript:callWorkerForContent(\'messages\',\'&compose=1&to=HB\');"><i class="icon-chevron-right"> </i> Suggestions?     </a></li>'
+ '</ul>'

+ '<div class="well well-small" id="HBAP1">'
+ '<a href="javascript:;" onclick="$(\'#HBAP\').toggle(\'fast\');" class="medtext btn btn-block btn-danger">Personal "Admin" Panel</a>'
+ '<ul id="HBAP" style="display:none" class="nav nav-tabs nav-stacked">'

+ '</br>'

+ '<div class="well well-small" id="CoP1">'
+ '<a href="javascript:;" onclick="$(\'#CoP\').toggle(\'fast\');" class="medtext btn btn-block btn-primary">Construction</a>'
+ '<ul id="CoP" style="display:none" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&buildgate=1\');"><i class="icon-chevron-right">  </i> Warp Gate     </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&buildtgate=1\');"><i class="icon-chevron-right"> </i> Tularian Gate </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&build=4\');"><i class="icon-chevron-right">      </i> Station       </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&buildarrow=1\');"><i class="icon-chevron-right"> </i> Arrow         </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&build=1\');"><i class="icon-chevron-right">      </i> Base          </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&build=2\');"><i class="icon-chevron-right">      </i> Nebula        </a></li>'
+ '</ul>'
+ '</div>'

+ '<div class="well well-small" id="ACCP1">'
+ '<a href="javascript:;" onclick="$(\'#ACCP\').toggle(\'fast\');" class="medtext btn btn-block btn-info">Access:</a>'
+ '<ul id="ACCP" style="display:none" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:storeItems(907086);"><i class="icon-chevron-right">     </i> Junk Base        </a></li>'
+	'<li><a href="javascript:storeItems(689766);"><i class="icon-chevron-right">     </i> Marvel\'s Base   </a></li>'
+	'<li><a href="javascript:storeItems(997406);"><i class="icon-chevron-right">     </i> Marvel\'s T Base </a></li>'
+	'<li><a href="javascript:storeItems(43239);"><i class="icon-chevron-right">      </i> NZ Planet        </a></li>'
+	'<li><a href="javascript:storeItems(23216);"><i class="icon-chevron-right">      </i> WZ Planet        </a></li>'
+	'<li><a href="javascript:storeItems(220784);"><i class="icon-chevron-right">     </i> Origin Planet    </a></li>'
+ '</ul>'
+ '</div>'


+ '<div class="well well-small" id="Auto1">'
+ '<a href="javascript:;" onclick="$(\'#Auto\').toggle(\'fast\');" class="medtext btn btn-block btn-success">Automated Hacks</a>'
+ '<ul id="Auto" style="display:none" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');"><i class="icon-chevron-right">   </i> (25) Scram R</a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');"><i class="icon-chevron-right">   </i> (25) Scram L</a></li>'
+	'<li><a href="javascript:javascript:callWorkerForContentNoScroll(\'universe\',\'&cdestroyobject=1\');"><i class="icon-chevron-right">                                                                                                                                                                                                                                                                                                                                                                              </i> (1) Kill Object </a></li>'
+	'<li><a href="javascript:attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();attackObject();"><i class="icon-chevron-right"></i> (100) Nuke </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScroll(\'shop\',\'\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:cpurchaseItem(\'31B32428-1998-61C8-F8CD-C5F4BC434A31\');javascript:callWorkerForContentNoScroll(\'universe\',\'\');"><i class="icon-chevron-right">    </i> (5) Fuel Cells  </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScroll(\'shop\',\'\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');cpurchaseItem(\'DEBD8C17-70DA-A37A-D1F9-EB904DC6B4C1\');javascript:callWorkerForContentNoScroll(\'universe\',\'\');"><i class="icon-chevron-right">  </i> (50) Hulls      </a></li>'
+ '</ul>'
+ '</div>'


+ '<div class="well well-small" id="TBP1">'
+ '<a href="javascript:;" onclick="$(\'#TBP\').toggle(\'fast\');" class="medtext btn btn-block btn-inverse">ToolBox</a>'
+ '<ul id="TBP" style="display:none" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:repairObject();"><i class="icon-chevron-right">         </i> Repair  Object </a></li>'
+	'<li><a href="javascript:attackObject();"><i class="icon-chevron-right">         </i> Attack  Object </a></li>'
+	'<li><a href="javascript:claimObject();"><i class="icon-chevron-right">          </i> Claim   Object </a></li>'
+	'<li><a href="javascript:acquireObject();"><i class="icon-chevron-right">        </i> Acquire Object </a></li>'
+	'<li><a href="javascript:moveObject();"><i class="icon-chevron-right">           </i> Move    Object </a></li>'
+	'<li><a href="javascript:destroyObject();"><i class="icon-chevron-right">        </i> Destroy Object </a></li>'
+	'<li><a href="javascript:closeModal();"><i class="icon-chevron-right">           </i> Close   Modal  </a></li>'
+ '</ul>'
+ '</div>'

+ '<div class="well well-small" id="Mov1">'
+ '<a href="javascript:;" onclick="$(\'#Mov\').toggle(\'fast\');" class="medtext btn btn-block btn-danger">Movement</a>'
+ '<ul id="Mov" style="display:none" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=U\');"><i class="icon-chevron-right">   </i> Up           </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=UR\');"><i class="icon-chevron-right">  </i> Up-Right     </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=R\');"><i class="icon-chevron-right">   </i> Right        </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=DR\');"><i class="icon-chevron-right">  </i> Down-Right   </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=D\');"><i class="icon-chevron-right">   </i> Down         </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=DL\');"><i class="icon-chevron-right">  </i> Down-Left    </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=L\');"><i class="icon-chevron-right">   </i> Left         </a></li>'
+	'<li><a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&dir=UL\');"><i class="icon-chevron-right">  </i> Up-Left      </a></li>'
+ '</ul>'
+ '</div>'

+ '<div class="well well-small" id="Misc1">'
+ '<a href="javascript:;" onclick="$(\'#Misc\').toggle(\'fast\');" class="medtext btn btn-block btn-warning">Miscellaneous</a>'
+ '<ul id="Misc" style="display:none" class="nav nav-tabs nav-stacked">'
+	'<li><a href="javascript:callWorkerForContent(\'armory\',\'\');"><i class="icon-chevron-right"> </i> Armory</a></li>'
+	'<li><a href="javascript:callWorkerForContent(\'search\',\'&nic=1\');"><i class="icon-chevron-right"> </i> Eligible Ppl</a></li>'
+ '</ul>'
+ '</div>'

+ '</ul>'
+ '</div>'

+ '<br />'

+ '<div class="well well-small" id="HGPLAYO">'
+ '<a href="javascript:;" onclick="$(\'#hglinkso\').slideToggle();" class="btn btn-block btn-mini btn-warning" style="z-index:100">Honor Guard: Old</a>'
+ '<div style="background-color: #DF6105; padding: 5px; margin-top: -3px; border-radius: 0 0 5px 5px; margin-bottom: 5px;display: none;" id="hglinkso">'
+ '<ul style="text-align: center; margin-bottom: 6px;" class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContent(\'battles\',\'&user_guid={376CDA85-8CD7-3567-3384-8FD71D45F7BC}\');">Battle Log</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'auctions\',\'&user_guid={376CDA85-8CD7-3567-3384-8FD71D45F7BC}\');">Auction Log</a></li>'
+ '</ul>'
+ '<hr style="margin: 5px;" class="blurline"/>'
+ '<ul style="text-align: center; margin-bottom: 6px;" class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContent(\'viewsimilar\',\'&ip=107.72.164.107\');">Last IP: 107.72.164.107</a></li>'
+ '</ul>'
+ '<hr style="margin: 5px;" class="blurline"/>'
+ '<ul style="text-align: center; margin-bottom: 6px;" class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContent(\'changeusername\',\'&for_user=HB\');">Change Username</a></li>'
+ '</ul>'
+ '<hr style="margin: 5px;" class="blurline"/>'
+ '<ul style="text-align: center; margin-bottom: 6px;" class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContent(\'profile\',\'&user_id=18279&ban_game=yes\');">Ban From Game</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'profile\',\'&user_id=18279&ban_chat=yes\');">Ban From Chat</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'profile\',\'&user_id=18279&ban_auction=yes\');">Ban From Auction</a></li>'
+ '</ul>'
+ '</div>'
+ '</div>'

+ '<br />'

+ '<div class="well well-small" id="HGPLAY">'
+ '<a href="javascript:;" onclick="$(\'#hglinks\').slideToggle();" class="btn btn-block btn-mini btn-warning" style="z-index:100">Honor Guard: New</a>'
+ '<div id="hglinks" style="display:none">'
+ '<ul class="nav nav-tabs nav-stacked" style="text-align: center;">'
+   '<li><a href="javascript:callWorkerForContent(\'battles\',\'&user_guid={376CDA85-8CD7-3567-3384-8FD71D45F7BC}\');">Battle Log</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'auctions\',\'&user_guid={376CDA85-8CD7-3567-3384-8FD71D45F7BC}\');">Auction Log</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'tokenspending\',\'&user_guid={376CDA85-8CD7-3567-3384-8FD71D45F7BC}\');">Token Log</a></li>'
+ '</ul>'
+ '<hr style="margin-top: 6px;" class="blurline"/>'
+ '<ul class="nav nav-tabs nav-stacked" style="text-align: center;">'
+   '<li><a style="color: #a3edff !important;" href="javascript:callWorkerForContent(\'viewsimilar\',\'&ip=107.72.164.107\');">Last IP: 107.72.164.107</a></li>'
+ '</ul>'
+ '<hr style="margin-top: 6px;" class="blurline"/>'
+ '<ul class="nav nav-tabs nav-stacked" style="text-align: center;">'
+   '<li><a href="javascript:callWorkerForContent(\'changeusername\',\'&for_user=HAL_9000\');">Change Username</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'changeshipname\',\'&for_user=HB\');">Change Ship Name</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'editbio\',\'&for_user=HB\');">Edit Player Bio</a></li>'
+ '</ul>'
+ '<hr style="margin-top: 6px;" class="blurline"/>'
+ '<ul class="nav nav-tabs nav-stacked">'
+   '<li><a href="javascript:callWorkerForContent(\'profile\',\'&user_id=0&ban_chat=yes\');">Ban: Chat</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'profile\',\'&user_id=0&ban_auction=yes\');">Ban: Auction / TC</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'profile\',\'&user_id=0&ban_forums=yes\');">Ban: Forums / News</a></li>'
+   '<li><a href="javascript:callWorkerForContent(\'profile\',\'&user_id=0&ban_pms=yes\');">Ban: PMs</a></li>'
+   '<li><a style="color: #ff4242 !important;" href="javascript:callWorkerForContent(\'profile\',\'&user_id=0&ban_game=yes\');">Ban: Game</a></li>'
+ '</ul>'
+ '</div>'

+ '</ul></div>';