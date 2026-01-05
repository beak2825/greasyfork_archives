// ==UserScript==
// @name        putlocker.is TvShow switcher
// @match       http://putlocker.is/*
// @description switch to the next and to the previous episode of a TvShow
// @version     0.32
// @grant       none

// @namespace https://greasyfork.org/users/14795
// @downloadURL https://update.greasyfork.org/scripts/12095/putlockeris%20TvShow%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/12095/putlockeris%20TvShow%20switcher.meta.js
// ==/UserScript==

function includingStr(str,strpartleft,strpartright)
{
	return str.slice(str.search(strpartleft)+strpartleft.length,str.search(strpartright));  
}

function deleteLatestEntry(tvShowID)
{
	var TvShows = JSON.parse(localStorage.getItem("TvShows"));	
	TvShows[tvShowID].LastSeasonID = "";
	localStorage.removeItem("TvShow");
	localStorage.setItem("TvShows",JSON.stringify(TvShows));
}

var div = document.createElement('div');
var tr = document.createElement('tr');
var url = window.location.href;

function T_Season(SeasonNr,CntEpisodes)
{
	this.SeasonNumber = SeasonNr;
	this.countEpisodes = CntEpisodes;
	this.LastEpisodeNr = "";
}

function T_TvShow(TvShowName,SeasonCount)
{
	this.name = TvShowName;
	this.countSeasons = SeasonCount;
	this.LastSeasonID = "";
	this.Seasons = [];
}

var TvShows = [];
if (localStorage.getItem("TvShows") != null && localStorage.getItem("TvShows") !== undefined)
{
	TvShows = JSON.parse(localStorage.getItem("TvShows"));
}
console.log(TvShows);

function findTvShow(TvShowName)
{
	var i = 0;
	while (i < TvShows.length && TvShows[i].name != TvShowName)
	{i++;}
	return (i == TvShows.length ? -1 : i);
}

if (url.search("episode") != -1)
{
	var season = includingStr(url,"season-","-episode");
	var episode = includingStr(url,"episode-","-online");
	var showname = includingStr(url,"watch-","-tvshow");

	var ShowID = findTvShow(showname); 
	
	if (ShowID != -1)
	{
		var nexturl = "";
		var prevurl = "";
		
		TvShows[ShowID].LastSeasonID = season;
		TvShows[ShowID].Seasons[parseInt(season)-1].LastEpisodeNr = episode;
		
		if ( parseInt(episode) == TvShows[ShowID].Seasons[parseInt(season)-1].countEpisodes)
		{
			if (parseInt(season) != TvShows[ShowID].countSeasons)
			{
				nexturl = url.replace("season-"+season,"season-"+(parseInt(season)+1).toString()).replace(episode,"1");
			}
			
			prevurl = url.replace("episode-"+episode,"episode-"+(parseInt(episode)-1).toString());
		}else if (parseInt(episode) == 1)
		{
			nexturl = url.replace("episode-"+episode,"episode-"+(parseInt(episode)+1).toString());
			if (parseInt(season) != 1)
			{
				prevurl = url.replace("season-"+season,"season-"+(parseInt(season)-1).toString()).replace(episode,TvShows[ShowID].Seasons[parseInt(season)-2].countSeasons.toString());
			}

		} else
		{
			nexturl = url.replace("episode-"+episode,"episode-"+(parseInt(episode)+1).toString());
			prevurl = url.replace("episode-"+episode,"episode-"+(parseInt(episode)-1).toString());
		}
		tr.innerHTML = '<td colspan="2" ><center><a href="'+ prevurl +'"><button style="width: 45%;">Prev</button></a>    <a href="'+nexturl+'" ><button style="width: 45%;" >Next</button></a></center></td>';
	}else
	{
		tr.innerHTML = '<td colspan="2" > Pleas open <a href="http://putlocker.is/watch-'+showname+'-tvshow-online-free-putlocker.html">TvShow page</a> once.</td>';	
	}
	
}else if(url.search("season") != -1)
{

}else if(url.search("tvshow") != -1)
{
	var SeasonCount = document.getElementsByClassName("selector_name").length;
	var tmpTvShow = new T_TvShow(includingStr(url,"watch-","-tvshow"),SeasonCount);
	for (var i = 0; i < SeasonCount;i++)
	{
		var tmpSeason = new T_Season(i+1,document.getElementsByClassName("table")[i].getElementsByClassName("entry").length /2);
		tmpTvShow.Seasons.push(tmpSeason);
	}
	TvShows.push(tmpTvShow);

	tr.innerHTML = '<td colspan="2" >TvShow is saved.</td>';
	

}
if (url == "http://putlocker.is/")
{
	for (var i = 0; i < TvShows.length; i++)
	{
		if (TvShows[i].LastSeasonID !== "")
		{
			var my_tr = document.createElement('tr');
			my_tr.innerHTML = '<td colspan="2" >Last seen Episode: <a href="http://putlocker.is/watch-'+TvShows[i].name+'-tvshow-season-'+TvShows[i].LastSeasonID+'-episode-'+TvShows[i].Seasons[parseInt(TvShows[i].LastSeasonID)-1].LastEpisodeNr+'-online-free-putlocker.html">'+ TvShows[i].name +' - season '+ TvShows[i].LastSeasonID +' episode '+TvShows[i].Seasons[parseInt(TvShows[i].LastSeasonID)-1].LastEpisodeNr+'</a><!-- <button onclick="deleteLatestEntry('+i+')" > delete entry </button>--></td>';
			
			document.getElementsByTagName("form")[1].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].appendChild(my_tr);
			
		}
	}

}else
{

	document.getElementsByClassName("table2")[0].getElementsByTagName("tbody")[0].appendChild(tr);
}

localStorage.removeItem("TvShow");
localStorage.setItem("TvShows",JSON.stringify(TvShows));
