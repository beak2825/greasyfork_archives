// ==UserScript==
// @name        Plater's GameInformer Dungeon
// @namespace      http://kol.coldfront.net/thekolwiki/index.php/User:Plater
// @description Tracks (and solves?) the various puzzles in gameinformer dungeons
// @include     http://*kingdomofloathing.com/choice.php*
// @version     2
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/4108/Plater%27s%20GameInformer%20Dungeon.user.js
// @updateURL https://update.greasyfork.org/scripts/4108/Plater%27s%20GameInformer%20Dungeon.meta.js
// ==/UserScript==

//The reason it looks so "drawn out" is because this section used to be in a much bigger script ~Plater


var prekeyname="GameInformerDungeon_";
var ShowChoiceLabel=false;

var SECTION_NAME=0;
var SECTION_MAZE=1;
var SECTION_CHOICE=2;


/**
 * ReplaceAll by Fagner Brack (MIT Licensed)
 * Replaces all occurrences of a substring in a string
 */
if(!String.prototype.replaceAll)
{
String.prototype.replaceAll = function( token, newToken, ignoreCase ) 
{
  var _token;
  var str = this + "";
  var i = -1;
  if ( typeof token === "string" ) 
  {
      if ( ignoreCase ) 
      {
          _token = token.toLowerCase();
          while( (i = str.toLowerCase().indexOf(token, i >= 0 ? i + newToken.length : 0) ) !== -1) 
          {	str = str.substring( 0, i ) + newToken + str.substring( i + token.length );	}
      } 
      else {	return this.split( token ).join( newToken );	}
  }
	return str;
};
}

if(!String.prototype.trim) {	String.prototype.trim = function () {	return this.replace(/^\s+|\s+$/g,'');	};	}
if(!String.prototype.trim) {	String.prototype.endsWith = function(suffix) {	    return this.indexOf(suffix, this.length - suffix.length) !== -1;	};	}

//alert((GM_info.scriptMetaStr));
//Switch on which page we're looking at (for safety sake?)
switch(document.location.pathname) 
{
	case "/choice.php":
			//for choice also do a thing that ID's it
			var aryObj=document.getElementsByName('whichchoice');
			var ChoiceNumber=(aryObj.length>0)?aryObj[0].value:-1;
			if(ShowChoiceLabel==true)//Insert label
			{
				var myNode=document.createTextNode(("ChoiceAdventure="+((ChoiceNumber>-1)?ChoiceNumber:"???")));
				var chNode=document.body.childNodes[0];
				document.body.insertBefore(myNode,chNode);
			}
			ProcessChoice(ChoiceNumber);
			break;
	default:
}


function ProcessChoice(ChoiceNumber)
{
	if(ChoiceNumber==-1)
	{}
	/*****************************************************/
	/*****************************************************/
	else if (ChoiceNumber==570) //reading the gameinformer magazine
	{		DoWalkthroughFromAdventureChoice(ChoiceNumber);	}
	else if (ChoiceNumber==659 || ChoiceNumber==660 || ChoiceNumber==661 || ChoiceNumber==662 || ChoiceNumber==663)//these are the 3-way choice
	{		DoWalkthroughFromAdventureChoice(ChoiceNumber);	}
	else if (ChoiceNumber==665)//the maze
	{		DoWalkthroughFromAdventureChoice(ChoiceNumber);	}
	/*****************************************************/
	/*****************************************************/
}


function ExtractString(s, StartDelim, EndDelim)
{// You should check for errors in real-world code, omitted for brevity
  var retval = "";  
  var startIndex = s.indexOf(StartDelim);
  var EndIndex=-1;
  if (startIndex != -1)
  {
      startIndex = startIndex + StartDelim.length;
      EndIndex = s.indexOf(EndDelim, startIndex);
      if (EndIndex != -1)      {          retval=s.substring(startIndex, EndIndex);      }
  }
  return retval;
}

function DoMaze(strDirections)
{//You will start out facing A. You should go B, C, D, E, F and then, assuming 
	var turndirections="";
	var StartDirection=ExtractString(strDirections,"You will start out facing",".");
	var CurDirectionsList=ExtractString(strDirections,"You should go","and");

	var splits=CurDirectionsList.split(",");
	var CD=StartDirection;	

	for(var i=0;i<splits.length;i++)	{		if(splits[i].trim()!="")		{			turndirections+=((i+1))+") "+ProduceTurn(CD,splits[i])+"<br/>";			CD=splits[i];		}	}

	turndirections=turndirections.trim();
	if (turndirections.endsWith(" THEN"))turndirections=turndirections.substring(0,turndirections.length-5);
	return turndirections;
}

function ProduceTurn(strCurrentDirection,strNextDirection)
{
	var MazeDirections={north:0,east:1,south:2,west:3};
	var retval="Don't know. Facing "+strCurrentDirection+", turn towards the "+strNextDirection;
	var CD=MazeDirections[strCurrentDirection.trim()];
	var ND=MazeDirections[strNextDirection.trim()];
	/*
			0
		3		1
			2
	*/
	//Facing North
	if(CD==0 && ND ==0)	{		retval="go forward";	}
	else if(CD==0 && ND ==1)	{		retval="go right";	}
	else if(CD==0 && ND ==2)	{	}
	else if(CD==0 && ND ==3)	{		retval="go left";		}
	//Facing East
	if(CD==1 && ND ==0)	{		retval="go left";		}
	else if(CD==1 && ND ==1)	{		retval="go forward";	}
	else if(CD==1 && ND ==2)	{		retval="go right";	}
	else if(CD==1 && ND ==3)	{			}
	//Facing South
	if(CD==2 && ND ==0)	{			}
	else if(CD==2 && ND ==1)	{		retval="go left";		}
	else if(CD==2 && ND ==2)	{		retval="go forward";	}
	else if(CD==2 && ND ==3)	{		retval="go right";	}
	//Facing West
	if(CD==3 && ND ==0)	{		retval="go right";	}
	else if(CD==3 && ND ==1)	{			}
	else if(CD==3 && ND ==2)	{		retval="go left";		}
	else if(CD==3 && ND ==3)	{		retval="go forward";	}
	
	return retval;
}

function DoWalkthroughFromAdventureChoice(ChoiceNumber)
{
	//570 is the gameinformer walkthrough
	//660 is the "pick 1 of 3" in game dungeon
	//661 is the "pick 1 of 3" in game dungeon
	//662 is the "pick 1 of 3" in game dungeon
	//663 is the "pick 1 of 3" in game dungeon
	//659 is the "pick 1 of 3" in game dungeon
	//665 is the maze
	/*
	    Challenges:
        (Done)At the end of the level, you'll encounter a terrifying sphinx, with a terrifying riddle! (Okay, the riddle isn't particularly terrifying I guess.) The answer is <answer and comment> 
        At the end of the level, you'll find your progress is blocked by a huge lake. How are you going to get past it? <solution> 
        (Done)At the end of the level, you'll face the first real challenge of the game: <description> Gorge. This is a platform-jumping sequence, and the last few platforms move, so watch out! The trick for clearing that first real tricky jump is to jump when <solution>. 
        (Done)At the end of the level, you'll unfortunately encounter the dumbest puzzle ever: there's three locked doors, and one key. My advice to you is to choose the <solution> door. Just trust me on this. 
        (Done)At the end of the level, you'll find an old study or library in the tunnels beneath <Dungeon Level>. It looks like a dead-end, but don't get confused -- you didn't miss anything! (Not yet at least!) Naturally, there's a secret passage here for you to find. <solution>! 
	*/
	if (ChoiceNumber==570)
	{
		var walkthroughstr=document.body.innerHTML;
		var walkthroughSection=GetSectionFromWalkthroughHTML(walkthroughstr);
		var walkthroughname=GetNameFromWalkthroughHTML(walkthroughstr);

		//I could maybe only keep track of the required parts, but where is the fun in that? Blast that prefs.js file WIDE open bwahahaha. Sorry.
		SetWalthroughText(walkthroughstr);
		var wt=GetWalthroughText();
		var wt1="";
		var wt2="";
		var wt3="";
		wt1=GetASectionFromWalkthroughHTML(wt,SECTION_MAZE);
		wt2=GetASectionFromWalkthroughHTML(wt,SECTION_CHOICE);
		wt3=GetASectionFromWalkthroughHTML(wt,SECTION_NAME);
		
		//maybe consider making it a "collapsed" section?
		var wts=wt3+"<br/>\r\n"+wt2+"<br/>\r\n"+wt1+"<br/>\r\n";
		CreateChoiceExpl([wts]);
	}
	else 
	{
		var wt=GetWalthroughText();
		var wt1="";
		var wt2="";
		var wt3="";
		if (ChoiceNumber==659)//How Does a Floating Platform Even Work?
		{
			wt1=GetASectionFromWalkthroughHTML(wt,SECTION_CHOICE);
			
			wt1=wt1.replace("jump when the platform you're jumping to is moving away from you, and the one you're on is right at its maximum elevation","[Jump when the first platform is high and the second is moving away]");
			wt1=wt1.replace("jump when the platform you're jumping toward is at the same height as the one you're on","[Jump when the first platform is at the same height as the second]");
			wt1=wt1.replace("go when the platform you're jumping to is coming toward you, and the one you're on is starting to drop below it.","[Jump when the first platform is low and the second is approaching]");
			
			//Look at the three pickable choices and try to highlight them if they exist
			var aryChoiceNames=GetChoiceNames();		for(var i=0;i<aryChoiceNames.length;i++)		{			wt1=wt1.replace(aryChoiceNames[i],"<b><font color=\"blue\">"+aryChoiceNames[i]+"</font></b>");		}
			if(wt1.indexOf(aryChoiceNames[0])!=-1){}//all set
			if(wt1.indexOf(aryChoiceNames[1])!=-1){wt2=wt1;wt1="";}
			if(wt1.indexOf(aryChoiceNames[2])!=-1){wt3=wt1;wt1="";}
			
			CreateChoiceExpl([wt1,wt2,wt3]);
		}
		else if (ChoiceNumber==660)//It's a Place Where Books Are Free
		{
			wt1=GetASectionFromWalkthroughHTML(wt,SECTION_CHOICE);
			
			wt1=wt1.replace("Naturally, it's behind the bookcase, so check the books thoroughly!","Naturally, it's behind the bookcase, so [Check the bookshelves] thoroughly!");//if it is the books: Naturally, it's behind the bookcase, so check the books thoroughly!
			wt1=wt1.replace("If you \"use\" the candlesticks","If you [Move the candlesticks]");//if its the candlesticks: Naturally, there's a secret passage here for you to find. If you "use" the candlesticks
			wt1=wt1.replace("Naturally, it's in the fireplace, as secret passages usually are. Check all the bricks carefully!","Naturally, it's in the fireplace, as secret passages usually are. [Search the fireplace] carefully!");//if its the fireplace: Naturally, it's in the fireplace, as secret passages usually are. Check all the bricks carefully!
			
			//Look at the three pickable choices and try to highlight them if they exist
			var aryChoiceNames=GetChoiceNames();		for(var i=0;i<aryChoiceNames.length;i++)		{			wt1=wt1.replace(aryChoiceNames[i],"<b><font color=\"blue\">"+aryChoiceNames[i]+"</font></b>");		}
			if(wt1.indexOf(aryChoiceNames[0])!=-1){}//all set
			if(wt1.indexOf(aryChoiceNames[1])!=-1){wt2=wt1;wt1="";}
			if(wt1.indexOf(aryChoiceNames[2])!=-1){wt3=wt1;wt1="";}
			
			CreateChoiceExpl([wt1,wt2,wt3]);
		}
		else if (ChoiceNumber==661)//Sphinx For the Memories
		{
			wt1=GetASectionFromWalkthroughHTML(wt,SECTION_CHOICE);
			
			wt1=wt1.replace("The answer is \"time\".","The answer is [\"Time?\"].");
			wt1=wt1.replace("The answer is \"a mirror\".","The answer is [\"A mirror?\"].");
			wt1=wt1.replace("The answer is \"hope\".","The answer is [\"Hope?\"].");
			
			//Look at the three pickable choices and try to highlight them if they exist
			var aryChoiceNames=GetChoiceNames();		for(var i=0;i<aryChoiceNames.length;i++)		{			wt1=wt1.replace(aryChoiceNames[i],"<b><font color=\"blue\">"+aryChoiceNames[i]+"</font></b>");		}
			if(wt1.indexOf(aryChoiceNames[0])!=-1){}//all set
			if(wt1.indexOf(aryChoiceNames[1])!=-1){wt2=wt1;wt1="";}
			if(wt1.indexOf(aryChoiceNames[2])!=-1){wt3=wt1;wt1="";}
			
			CreateChoiceExpl([wt1,wt2,wt3]);
		}
		else if (ChoiceNumber==662 )//Think or Thwim
		{
			wt1=GetASectionFromWalkthroughHTML(wt,SECTION_CHOICE);
			
			
			wt1=wt1.replace("so just swim across!","so just [Swim across]!");
			wt1=wt1.replace( new RegExp( 'throw your (.+) into the water', 'gi' ), "[Throw your $1 into the water]" );
			wt1=wt1.replace("Fortunately, there's enough debris laying around that you can make a raft.","Fortunately, there's enough debris laying around that you can [Make a raft].");
			
			//Look at the three pickable choices and try to highlight them if they exist
			var aryChoiceNames=GetChoiceNames();		for(var i=0;i<aryChoiceNames.length;i++)		{			wt1=wt1.replace(aryChoiceNames[i],"<b><font color=\"blue\">"+aryChoiceNames[i]+"</font></b>");		}
			if(wt1.indexOf(aryChoiceNames[0])!=-1){}//all set
			if(wt1.indexOf(aryChoiceNames[1])!=-1){wt2=wt1;wt1="";}
			if(wt1.indexOf(aryChoiceNames[2])!=-1){wt3=wt1;wt1="";}
			
			CreateChoiceExpl([wt1,wt2,wt3]);
		}
		else if (ChoiceNumber==663)//When You're a Stranger
		{
			wt1=GetASectionFromWalkthroughHTML(wt,SECTION_CHOICE);
			
			wt1=wt1.replace("My advice to you is to choose the second door.", "My advice to you is to [Unlock the second door].");
			wt1=wt1.replace("My advice to you is to choose the first door.",  "My advice to you is to [Unlock the first door].");
			wt1=wt1.replace("My advice to you is to choose the third door.",  "My advice to you is to [Unlock the third door].");
	
			//Look at the three pickable choices and try to highlight them if they exist
			var aryChoiceNames=GetChoiceNames();		for(var i=0;i<aryChoiceNames.length;i++)		{			wt1=wt1.replace(aryChoiceNames[i],"<b><font color=\"blue\">"+aryChoiceNames[i]+"</font></b>");		}
			if(wt1.indexOf(aryChoiceNames[0])!=-1){}//all set
			if(wt1.indexOf(aryChoiceNames[1])!=-1){wt2=wt1;wt1="";}
			if(wt1.indexOf(aryChoiceNames[2])!=-1){wt3=wt1;wt1="";}
			
			CreateChoiceExpl([wt1,wt2,wt3]);
		}
		else if (ChoiceNumber==665)//A Gracious Maze
		{
			wt1=GetASectionFromWalkthroughHTML(wt,SECTION_MAZE);//walkthrough text
			wt3=DoMaze(wt1);//translated to directions
	
			CreateChoiceExpl([wt1,wt2,wt3]);
		}
	}
	
}

function GetASectionFromWalkthroughHTML(walkthroughHTML,WhichSECTION)
{
	var retval="";
	switch(WhichSECTION)
	{
		case 0://SECTION_NAME:
		//this wont work until it saves the whole thing!
			var startstr="\n</pre></center><p>";
			var endstr="<p>A walkthru by ";
			var wt=walkthroughHTML;//SetWalthroughText();
			var Try2=ReturnPiece(wt,startstr,endstr,false);
			var startidx=wt.indexOf(startstr);
			var endidx=wt.indexOf(endstr);
			if(startidx!=-1 && endidx!=-1)		
			{		
				startidx=startidx+startstr.length;	
				retval=wt.substring(startidx,endidx)+"";
				retval=retval.replaceAll("<p>","",false);//retval=ReplaceAll(retval,"<p>",);
				retval=retval.replaceAll("/<p>","",false);//retval=ReplaceAll(retval,"</p>","");
				retval=retval.replaceAll("<br>","",false);//retval=ReplaceAll(retval,"<br>","");
			}
			else{retval="FAIL! Could not find string";}
		break;
		case 1://SECTION_MAZE:
			//always starts with  "You will start out facing"
			//always ends with		"assuming you haven't messed up somewhere, you'll be out of the maze"
			retval=ReturnPiece(walkthroughHTML,"You will start out facing","assuming you haven't messed up somewhere, you'll be out of the maze",true);
		break;
		case 2://SECTION_CHOICE:
			//always starts with  "At the end of the level, you'll" or maybe just "At the end of the level"
			//always ends with		"Now you're on your way"
			retval=ReturnPiece(walkthroughHTML,"At the end of the level","Now you're on your way",true);
		break;
		default:
		retval="FAIL: Don't understand ["+WhichSECTION+"]";
		break;
	}
	return retval;
}
function ReturnPiece(largeString,startPiece,endPiece, IncludePieces)
{
	var retval="";
	var sidx=largeString.indexOf(startPiece);
	var eidx=largeString.indexOf(endPiece);
	if(sidx!=-1 && eidx!=-1)
	{//If i chose not to include the piece i can adjust the split points
		var startsplit=sidx;
		var endsplit=(eidx+endPiece.length);
		if(!IncludePieces)
		{
			startsplit=(sidx+startPiece.length);
			endsplit=eidx;
		}
		retval=largeString.substring(startsplit,endsplit);
	}	
	else {retval="FAIL! "+sidx+" to "+eidx+"";}
	return retval;
}
function GetSectionFromWalkthroughHTML(walkthroughHTML)
{
	var retval="(?)";
	var startstr="<b>Section V: WALKTHRU</b>";
	var endstr="<b>Section VI: FINAL BOSS:</b>";
	
	var wt=walkthroughHTML;//SetWalthroughText();
	var startidx=wt.indexOf(startstr);
	var endidx=wt.indexOf(endstr);
	if(startidx!=-1 && endidx!=-1)		
	{		
		startidx=startidx+startstr.length;	
		retval=wt.substring(startidx,endidx)+"";
		//retval=retval.replace("At the end of the level","<b><font color=\"red\">At the end of the level</font></b>");
		//retval=retval.replace("You will start out facing","<b><font color=\"red\">You will start out facing</font></b>");
	}
	return retval;
}
function GetNameFromWalkthroughHTML(walkthroughHTML)
{
	var retval="(?)";
	var startstr="\n</pre></center><p>";
	var endstr="<p>A walkthru by ";
	
	var wt=walkthroughHTML;//SetWalthroughText();
	var startidx=wt.indexOf(startstr);
	var endidx=wt.indexOf(endstr);
	if(startidx!=-1 && endidx!=-1)		
	{		
		startidx=startidx+startstr.length;	
		retval=wt.substring(startidx,endidx)+"";
		retval=retval.replaceAll("<p>","",false);//retval=ReplaceAll(retval,"<p>","");
		retval=retval.replaceAll("</p>","",false);//retval=ReplaceAll(retval,"</p>","");
		retval=retval.replaceAll("<br>","",false);//retval=ReplaceAll(retval,"<br>","");
	}
	return retval;
}


function SetWalthroughText(val)
{	GM_setValue(prekeyname+"WalkThrough", val);	}
function GetWalthroughText()
{	return GM_getValue(prekeyname+"WalkThrough","(No data saved)");	}

function GetChoiceNames()
{
	var aryChoiceNames=new Array();
	var i=1;
	var thechoice=document.getElementsByName("choiceform"+i)[0];
	while(thechoice!=undefined)
	{		//now i have the form, cycle through child elements
		for(var cidx=0;cidx<thechoice.elements.length;cidx++)
		{
			if(thechoice.elements[cidx]["type"]=="submit")	{				aryChoiceNames.push(thechoice.elements[cidx].value);			}
		}
		i++;
		thechoice=document.getElementsByName("choiceform"+i)[0];
	}
	return aryChoiceNames;
}

function CreateChoiceExplanation(t1,t2,t3,t4)
{
	var choice1=document.getElementsByName("choiceform1");
	var choice2=document.getElementsByName("choiceform2");
	var choice3=document.getElementsByName("choiceform3");
	var choice4=document.getElementsByName("choiceform4");
	var text1=CreateTinyDivWithHTMLContents(t1);
	var text2=CreateTinyDivWithHTMLContents(t2);
	var text3=CreateTinyDivWithHTMLContents(t3);
	var text4=CreateTinyDivWithHTMLContents(t4);
	if(choice1.length>0&t1!=undefined)choice1[0].appendChild(text1);
	if(choice2.length>0&t2!=undefined)choice2[0].appendChild(text2);
	if(choice3.length>0&t3!=undefined)choice3[0].appendChild(text3);
	if(choice4.length>0&t4!=undefined)choice4[0].appendChild(text4);
}
function CreateChoiceExpl(textarray)
{
	for(var i=1;i<=textarray.length;i++)
	{
		var t=textarray[i-1];
		var thechoice=document.getElementsByName("choiceform"+i);
		var thetext=CreateTinyDivWithHTMLContents(t);
		if(thechoice.length>0&t!=undefined)thechoice[0].appendChild(thetext);
	}
}
function CreateTinyDivWithHTMLContents(htmlcontents)
{
	var text1=document.createElement("div");
	if(text1!=undefined)
	{		text1.style.fontSize="8pt";		text1.innerHTML=(htmlcontents);	}
	return text1;
}

