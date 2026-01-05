// ==UserScript==
// @name        PUBLIC GW Mod
// @include     http://game.galaxywarfare.com*
// @description In progress warp bookmarking system and convenience player panel.
// @version     Beta 1.2
// @require     http://code.jquery.com/jquery-3.1.0.js
// @namespace   https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/21511/PUBLIC%20GW%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/21511/PUBLIC%20GW%20Mod.meta.js
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
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=1000&warp_y=1000\');"><i class="icon-chevron-right">    </i> 1000, 1000   </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=1000&warp_y=-1000\');"><i class="icon-chevron-right">   </i> 1000, -1000  </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-1000&warp_y=-1000\');"><i class="icon-chevron-right">  </i> -1000, -1000 </a></li>'
+	'<li> <a href="javascript:callWorkerForContentNoScrollNoLoading(\'universe\',\'&warp=1&warp_x=-1000&warp_y=1000\');"><i class="icon-chevron-right">   </i> -1000, 1000  </a></li>'

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
+ '<li><a href="javascript:callWorkerForContent(\'globaldailystats\',\'\');"><i class="icon-chevron-right">                                                         </i> Daily Statistics </a></li>'
+ '<li><a href="javascript:callWorkerForContent(\'messages\',\'&compose=1&to=HB\');"><i class="icon-chevron-right"> </i> Suggestions?     </a></li>'
+ '</ul>'
+ '</ul></div>';