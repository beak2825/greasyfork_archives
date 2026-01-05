// ==UserScript==
// @name         Redacted :: Hide Page Sections
// @author       newstarshipsmell
// @namespace    https://greasyfork.org/en/scripts/28437-redacted-hide-page-sections
// @description  Hides various sections on the artist, torrent group and collage pages.
// @version      1.1
// @include      /https://redacted\.ch/(artist|torrents|collages?)\.php(\?|\?page=\d+&)id=\d+/
// @require      https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28437/Redacted%20%3A%3A%20Hide%20Page%20Sections.user.js
// @updateURL https://update.greasyfork.org/scripts/28437/Redacted%20%3A%3A%20Hide%20Page%20Sections.meta.js
// ==/UserScript==

var pageType = window.location.href.replace(/.+\/(artist|torrents|collages?)\.php.*/, '$1');

var settingsFieldsArtist = {
  'artist_hide_requests': {
    'type': 'checkbox', 'label': 'Hide the <b>Requests</b> section?', 'default': false
  },
  'artist_hide_similar_artist_map': {
    'type': 'checkbox', 'label': 'Hide the <b>Similar Artist Map</b> section?', 'default': false
  },
  'artist_hide_artist_information': {
    'type': 'checkbox', 'label': 'Hide the <b>Artist Information</b> section?', 'default': false
  },
  'artist_hide_upcoming_concerts': {
    'type': 'checkbox', 'label': 'Hide the <b>Upcoming concerts</b> section?', 'default': false
  },
  'artist_hide_artist_comments': {
    'type': 'checkbox', 'label': 'Hide the <b>Artist Comments</b> section?', 'default': false
  },
  'artist_hide_artist_image': {
    'type': 'checkbox', 'label': 'Hide the <b>Artist Image</b> section?', 'default': false
  },
  'artist_hide_filelists_search': {
    'type': 'checkbox', 'label': 'Hide the <b>File Lists Search</b> section?', 'default': false
  },
  'artist_hide_collector': {
    'type': 'checkbox', 'label': 'Hide the <b>Collector</b> section?', 'default': false
  },
  'artist_hide_tags': {
    'type': 'checkbox', 'label': 'Hide the <b>Tags</b> section?', 'default': false
  },
  'artist_hide_statistics': {
    'type': 'checkbox', 'label': 'Hide the <b>Statistics</b> section?', 'default': false
  },
  'artist_hide_similar_artists': {
    'type': 'checkbox', 'label': 'Hide the <b>Similar Artists</b> section?', 'default': false
  },
  'artist_hide_add_similar_artist': {
    'type': 'checkbox', 'label': 'Hide the <b>Add similar artist</b> section?', 'default': false
  }
};

GM_config.init({
  'id': 'HideArtistPageSectionsSettingsMenu', 'title': 'Redacted :: Hide Artist Page Sections', 'fields': settingsFieldsArtist,
  'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
  'events':
  {
    'save': function() { location.reload(); }
  }
});

var settingsFieldsTorrent = {
  'torrent_hide_collages': {
    'type': 'checkbox', 'label': 'Hide the <b>This album is in <i>n</i> collages</b> section?', 'default': false
  },
  'torrent_hide_personal_collages': {
    'type': 'checkbox', 'label': 'Hide the <b>This album is in <i>n</i> personal collages</b> section?', 'default': false
  },
  'torrent_hide_likes': {
    'type': 'checkbox', 'label': 'Hide the <b>People who like this album also liked...</b> section?', 'default': false
  },
  'torrent_hide_album_info': {
    'type': 'checkbox', 'label': 'Hide the <b>Album info</b> section?', 'default': false
  },
  'torrent_hide_comments': {
    'type': 'checkbox', 'label': 'Hide the <b>Comments</b> section?', 'default': false
  },
  'torrent_hide_cover': {
    'type': 'checkbox', 'label': 'Hide the <b>Cover[s (<i>n</i>)]</b> section?', 'default': false
  },
  'torrent_hide_artists': {
    'type': 'checkbox', 'label': 'Hide the <b>Artists</b> section?', 'default': false
  },
  'torrent_hide_add_artist': {
    'type': 'checkbox', 'label': 'Hide the <b>Add artist</b> section?', 'default': false
  },
  'torrent_hide_favorites': {
    'type': 'checkbox', 'label': 'Hide the <b>Redacted Favorites</b> section?', 'default': false
  },
  'torrent_hide_album_votes': {
    'type': 'checkbox', 'label': 'Hide the <b>Album Votes</b> section?', 'default': false
  },
  'torrent_hide_tags': {
    'type': 'checkbox', 'label': 'Hide the <b>Tags</b> section?', 'default': false
  },
  'torrent_hide_add_tag': {
    'type': 'checkbox', 'label': 'Hide the <b>Add tag</b> section?', 'default': false
  }
};

var gmc_hpstor = new GM_configStruct(
  {
    'id': 'HideTorrentPageSectionsSettingsMenu', 'title': 'Redacted :: Hide Torrent Page Sections', 'fields': settingsFieldsTorrent,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'save': function() { location.reload(); }
    }
  }
);
gmc_hpstor.init();

var settingsFieldsCollage = {
  'collage_hide_cover_art': {
    'type': 'checkbox', 'label': 'Hide the <b>Cover Art</b> section?', 'default': false
  },
  'collage_hide_torrents': {
    'type': 'checkbox', 'label': 'Hide the <b>Torrents</b> section?', 'default': false
  },
  'collage_hide_category': {
    'type': 'checkbox', 'label': 'Hide the <b>Category</b> section?', 'default': false
  },
  'collage_hide_description': {
    'type': 'checkbox', 'label': 'Hide the <b>Description</b> section?', 'default': false
  },
  'collage_hide_collector': {
    'type': 'checkbox', 'label': 'Hide the <b>Collector</b> section?', 'default': false
  },
  'collage_hide_statistics': {
    'type': 'checkbox', 'label': 'Hide the <b>Statistics</b> section?', 'default': false
  },
  'collage_hide_top_tags': {
    'type': 'checkbox', 'label': 'Hide the <b>Top Tags</b> section?', 'default': false
  },
  'collage_hide_top_artists': {
    'type': 'checkbox', 'label': 'Hide the <b>Top Artists</b> section?', 'default': false
  },
  'collage_hide_top_contributors': {
    'type': 'checkbox', 'label': 'Hide the <b>Top Contributors</b> section?', 'default': false
  },
  'collage_hide_add_torrent_group': {
    'type': 'checkbox', 'label': 'Hide the <b>Add torrent group</b> section?', 'default': false
  },
  'collage_hide_comments': {
    'type': 'checkbox', 'label': 'Hide the <b>Comments/Add comment</b> section?', 'default': false
  }
};

var gmc_hpscol = new GM_configStruct(
  {
    'id': 'HideCollagePageSectionsSettingsMenu', 'title': 'Redacted :: Hide Collage Page Sections', 'fields': settingsFieldsCollage,
    'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
    'events':
    {
      'save': function() { location.reload(); }
    }
  }
);
gmc_hpscol.init();

var settingsLink = '<a href="#" id="settings_linkbox" class="brackets">Hide sections</a> ';
document.getElementsByClassName("linkbox")[0].insertAdjacentHTML('beforeend', settingsLink);

document.getElementById('settings_linkbox').addEventListener('click', function(e){
  e.preventDefault();
  switch (pageType) {
    case 'artist':
      GM_config.open();
      break;
    case 'torrents':
      gmc_hpstor.open();
      break;
    case 'collage':
    case 'collages':
      gmc_hpscol.open();
      break;
    default:
  }
});

switch (pageType) {
  case 'artist':
    if (GM_config.get('artist_hide_requests')) {
      var requests = document.querySelector('#requests');
      if (requests !== null) requests.parentNode.removeChild(requests);
    }

    if (GM_config.get('artist_hide_similar_artist_map')) {
      var similarArtistMap = document.querySelector('#similar_artist_map');
      if (similarArtistMap !== null) similarArtistMap.parentNode.removeChild(similarArtistMap);
    }

    if (GM_config.get('artist_hide_artist_information')) {
      var informationHeader = document.querySelector('#info');
      informationHeader.parentNode.removeChild(informationHeader);
      var informationBody = document.querySelector('#body');
      informationBody.parentNode.removeChild(informationBody);
    }

    if (GM_config.get('artist_hide_upcoming_concerts')) {
      var upcomingConcerts = document.querySelector('#concerts').parentNode;
      upcomingConcerts.parentNode.removeChild(upcomingConcerts);
    }

    if (GM_config.get('artist_hide_artist_comments')) {
      var artistComments = document.querySelector('.forum_post').parentNode;
      artistComments.parentNode.removeChild(artistComments);
    }

    if (GM_config.get('artist_hide_artist_image')) {
      var artistImage = document.querySelector('.box_image');
      if (artistImage !== null) artistImage.parentNode.removeChild(artistImage);
    }

    if (GM_config.get('artist_hide_filelists_search')) {
      var fileListsSearch = document.querySelector('.box_search');
      fileListsSearch.parentNode.removeChild(fileListsSearch);
    }

    if (GM_config.get('artist_hide_collector')) {
      var collector = document.querySelector('.box_zipdownload');
      collector.parentNode.removeChild(collector);
    }

    if (GM_config.get('artist_hide_tags')) {
      var tags = document.querySelector('.box_tags');
      tags.parentNode.removeChild(tags);
    }

    if (GM_config.get('artist_hide_statistics')) {
      var statistics = document.querySelector('.box_info');
      statistics.parentNode.removeChild(statistics);
    }

    if (GM_config.get('artist_hide_similar_artists')) {
      var similarArtists = document.querySelector('.box_artists');
      similarArtists.parentNode.removeChild(similarArtists);
    }

    if (GM_config.get('artist_hide_add_similar_artist')) {
      var addSimilarArtist = document.querySelector('.box_addartists_similar');
      addSimilarArtist.parentNode.removeChild(addSimilarArtist);
    }
    break;
  case 'torrents':
    if (gmc_hpstor.get('torrent_hide_collages')) {
      var collages = document.querySelector('#collages');
      if (collages !== null) collages.parentNode.removeChild(collages);
    }

    if (gmc_hpstor.get('torrent_hide_personal_collages')) {
      var personalCollages = document.querySelector('#personal_collages');
      if (personalCollages !== null) personalCollages.parentNode.removeChild(personalCollages);
    }

    if (gmc_hpstor.get('torrent_hide_likes')) {
      var likes = document.querySelector('#vote_matches');
      if (likes !== null) likes.parentNode.removeChild(likes);
    }

    if (gmc_hpstor.get('torrent_hide_album_info')) {
      var albumInfo = document.querySelector('.torrent_description');
      albumInfo.parentNode.removeChild(albumInfo);
    }

    if (gmc_hpstor.get('torrent_hide_comments')) {
      var comments = document.querySelector('#torrent_comments');
      comments.parentNode.removeChild(comments);
    }

    if (gmc_hpstor.get('torrent_hide_cover')) {
      var cover = document.querySelector('.box_image');
      cover.parentNode.removeChild(cover);
    }

    if (gmc_hpstor.get('torrent_hide_artists')) {
      var artists = document.querySelector('.box_artists');
      artists.parentNode.removeChild(artists);
    }

    if (gmc_hpstor.get('torrent_hide_add_artist')) {
      var addArtist = document.querySelector('.box_addartists');
      addArtist.parentNode.removeChild(addArtist);
    }

    if (gmc_hpstor.get('torrent_hide_favorites')) {
      var favorites = document.querySelector('#votes_ranks');
      if (favorites !== null) favorites.parentNode.removeChild(favorites);
    }

    if (gmc_hpstor.get('torrent_hide_album_votes')) {
      var albumVotes = document.querySelector('#votes');
      albumVotes.parentNode.removeChild(albumVotes);
    }

    if (gmc_hpstor.get('torrent_hide_tags')) {
      var tags = document.querySelector('.box_tags');
      tags.parentNode.removeChild(tags);
    }

    if (gmc_hpstor.get('torrent_hide_add_tag')) {
      var addTags = document.querySelector('.box_addtag');
      addTags.parentNode.removeChild(addTags);
    }
    break;
  case 'collage':
  case 'collages':
    if (gmc_hpscol.get('collage_hide_cover_art')) {
      var coverArt = document.querySelector('#coverart');
      coverArt.parentNode.removeChild(coverArt);
    }

    if (gmc_hpscol.get('collage_hide_torrents')) {
      var torrents = document.querySelector('#discog_table');
      torrents.parentNode.removeChild(torrents);
    }

    if (gmc_hpscol.get('collage_hide_category')) {
      var category = document.querySelector('.box_category');
      category.parentNode.removeChild(category);
    }

    if (gmc_hpscol.get('collage_hide_description')) {
      var description = document.querySelector('.box_description');
      description.parentNode.removeChild(description);
    }

    if (gmc_hpscol.get('collage_hide_collector')) {
      var collector = document.querySelector('.box_zipdownload');
      collector.parentNode.removeChild(collector);
    }

    if (gmc_hpscol.get('collage_hide_statistics')) {
      var statistics = document.querySelector('.box_statistics_collage_torrents');
      statistics.parentNode.removeChild(statistics);
    }

    if (gmc_hpscol.get('collage_hide_top_tags')) {
      var topTags = document.querySelector('.box_tags');
      topTags.parentNode.removeChild(topTags);
    }

    if (gmc_hpscol.get('collage_hide_top_artists')) {
      var topArtists = document.querySelector('.box_artists');
      topArtists.parentNode.removeChild(topArtists);
    }

    if (gmc_hpscol.get('collage_hide_top_contributors')) {
      var topContributors = document.querySelector('.box_contributors');
      topContributors.parentNode.removeChild(topContributors);
    }

    if (gmc_hpscol.get('collage_hide_add_torrent_group')) {
      var addTorrentGroup = document.querySelector('.box_addtorrent');
      addTorrentGroup.parentNode.removeChild(addTorrentGroup);
    }

    if (gmc_hpscol.get('collage_hide_comments')) {
      var commentHeader = document.querySelector('h3');
      commentHeader.innerHTML = '';
      var comments = document.querySelectorAll('.comment');
      for (var i = 0, len = comments.length; i < len; i++) {
        comments[i].innerHTML = '';
      }
      var viewAllComments = document.querySelector('a[href*="action=comments"]');
      viewAllComments.parentNode.removeChild(viewAllComments);
      var addComment = document.querySelector('.box_addcomment');
      addComment.parentNode.removeChild(addComment);
    }
    break;
  default:
}