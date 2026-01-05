// ==UserScript==
// @name        reddit image info
// @namespace   https://absurdlyobfuscated.com/reddit/
// @description Shows and highlights media/author information from imgur, gfycat, giphy, sli.mg, and more, adds an improved image/video expando, and detects reposted imgur comments.
// @include     https://*.reddit.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require     https://greasyfork.org/libraries/jscolor/1.4.2/jscolor.js
// @version     2.0.1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/23006/reddit%20image%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/23006/reddit%20image%20info.meta.js
// ==/UserScript==

function main()
{
  GM_addStyle(
    ".imageInfoSprite { background-image: url('https://www.redditstatic.com/sprite-reddit.6Om8v6KMv28.png'); }\n" +
    ".imageInfoLink {cursor: pointer;}\n" +
    ".imageInfoButton { display: inline-block; border: 1px solid #666; padding: 1px 6px; border-radius: 3px; font-size: x-small; line-height: 12px; }\n" +
    ".imageInfoNotification { position: fixed; z-index: 100; top: 44px; right: 47px; padding: 20px; font-size: small; background-color: #eff7ff; }\n" +
    ".imageInfoNotificationClose, .imageInfoSettingsClose { float: right; }\n" +
    ".imageInfoNotificationClose:hover, .imageInfoSettingsClose:hover { background-color: red; color: white; }\n" +
    ".imageInfoNotificationText, .imageInfoSettingsContent { margin: 10px 0; }\n" +
    ".imageInfoSettings { position: absolute; z-index: 100; top: 44px; right: 47px; padding: 10px; font-size: small; background-color: #eff7ff; }\n" +
    ".imageInfoSettingArrayItem { border: 1px solid #cee3f8; margin: 0 0 5px 5px; border-radius: 3px; }\n" +
    ".imageInfoSettingArrayItem > .imageInfoSettingValue > .imageInfoSetting { margin-top: 14px; }\n" +
    ".imageInfoSettingArrayRemove { float: right; position: relative; left: -4px; top: 4px; width: 10px; height: 10px; background-position: -128px -1638px; }\n" +
    ".imageInfoSettingArrayAdd { width: 16px; height: 16px; background-position: 0 -1464px; }\n" +
    ".imageInfoSettingGroup { border: 1px solid #369; border-radius: 3px; margin: 10px 0; }\n" +
    ".imageInfoSettingGroupCollapsed > .imageInfoSettingItem { display: none; }\n" +
    ".imageInfoSettingCollapse { float: right; width: 16px; height: 18px; background-position: -118px -1267px; transform: rotate(90deg); opacity: 0.6; position: relative; top: -2px; }\n" +
    ".imageInfoSettingGroupCollapsed .imageInfoSettingCollapse { background-position: -118px -1211px; }\n" +
    ".imageInfoSettingGroupTitle { background-color: #cee3f8; padding: 5px; width: 432px; }\n" +
    ".imageInfoSettingItem { padding: 3px; }\n" +
    ".imageInfoSettingTitle, .imageInfoSettingArrayTitle { display: inline-block; padding-bottom: 5px; }\n" +
    ".imageInfoSettingTitle { width: 260px; }\n" +
    ".imageInfoSettingItem .imageInfoSettingItem .imageInfoSettingTitle { width: 250px; }\n" +
    ".imageInfoSettingItem .imageInfoSettingItem .imageInfoSettingItem .imageInfoSettingTitle { width: 240px; }\n" +
    ".imageInfoSettingValue { display: inline; }\n" +
    ".imageInfoSettingValueNonDefault { box-shadow: 0 0 6px yellow; }\n" +
    ".imageInfoSettingDesc { margin-bottom: 5px; font-size: x-small; background-color: #cee3f8; width: 423px; padding: 5px; }\n" +
    ".imageInfoSettingsButton { display: inline; background-color: #cee3f8; color: #369; font-weight: bold; margin-left: 5px; }\n" +
    ".imageInfoSettingReset, .imageInfoSettingCache, .imageInfoSettingCacheCurrent { float: right; }\n" +
    ".imageInfoSettingsTagDataInfo { display: inline-block; }\n" +
    ".imageInfoSettingsTagDataUpdate { float: right; margin-left: 4px; }\n" +
    ".imageInfoSettingsTagDataInfo div, .imageInfoSettingsTagDataUpdate { font-size: xx-small; color: grey; display: inline; }\n" +
    ".imageInfoFeedback { float: right; }\n" +
    ".imageInfo, .imageInfo div { font-size: x-small; display: inline; }\n" +
    ".imageInfoExpando { float: left; width: 24px; height: 24px; margin: 2px 5px 2px 0px; background-position: -116px -1406px; }\n" +
    ".imageInfoExpando:hover { background-position: -87px -1406px; }\n" +
    ".imageInfoExpandoExpanded { background-position: -29px -1435px; }\n" +
    ".imageInfoExpandoExpanded:hover { background-position: 0 -1435px; }\n" +
    ".imageInfoExpandoContent { display: none; max-width: 100%; min-height: 30px; margin: 0 4px 2px 0; }\n" +
    ".imageInfoExpandoMsg { position: absolute; width: 100%; }\n" +
    ".imageInfoExpandoError { position: absolute; }\n" +
    ".imageInfoAlbumHeader {  }\n" +
    ".imageInfoAlbumControls, .imageInfoAlbumTitle { display: inline; }\n" +
    ".imageInfoAlbumTitle, .imageInfoAlbumImageCount { font-weight: bold; }\n" +
    ".imageInfoAlbumTitle { margin-left: 8px; }\n" +
    ".imageInfoAlbumLeft, .imageInfoAlbumRight { display: inline; background-color: white; padding-right: 8px; }\n" +
    ".imageInfoAlbumLeft { margin-right: 3px; }\n" +
    ".imageInfoAlbumRight { margin-left: 3px; }\n" +
    ".imageInfoAlbumCurrentImage { text-align: right; }\n" +
    ".imageInfoAlbumCurrentImage, .imageInfoAlbumTotalImages { display: inline-block; width: 10px; }\n" +
    ".imageInfoAlbumCountDigits2 { width: 16px; }\n" +
    ".imageInfoAlbumCountDigits3 { width: 22px; }\n" +
    ".imageInfoAlbumContent { min-width: 200px; min-height: 200px; }\n" +
    ".imageInfoExpandoContent .imageInfo, .imageInfoAlbumTitle, .imageInfoAlbumControls { line-height: 16px; margin-bottom: 2px; font-size: x-small; }\n" +
    ".imageInfoExpandoImage, .imageInfoExpandoVideo { display: none; max-width: 100%; }\n" +
    ".imageInfoTitleDuration { display: inline; margin-right: 3px; }\n" +
    ".imageInfoShowAllHide { display: none; }\n" +
    ".imageInfoGfyLink { margin-right: 2px; background-color: #d1eac0; }\n" +
    ".imageInfoRedButton { background-color: red; color: white; }\n" +
    ".imageInfoOrangeButton { background-color: orange; color: white; }\n" +
    ".imageInfoGreyButton { background-color: grey; color: white; }\n" +
    ".imageInfoComment { display: inline-block; width: 24px; height: 15px; }\n" +
    ".imageInfoCommentInline { display: inline; }\n" +
    ".imageInfoComment .imageInfo { display: none; position: absolute; margin-left: 26px; }\n" +
    ".imageInfoComment .imageInfo, .imageInfoCommentInline .imageInfo { background: white; border: 1px solid #eee; border-radius: 3px; padding: 3px; line-height: 16px; }\n" +
    ".imageInfoComment .imageInfoExpando, .imageInfoCommentInline .imageInfoExpando { position: absolute; margin: 0 2px; }\n" +
    ".imageInfoCommentInline .imageInfoExpando, .imageInfoComment:hover, .imageInfoComment:hover .imageInfo, .imageInfoCommentInline .imageInfo { display: inline-block; }\n"
  );

  var settingMetaData = {
    version: 2.1,
    type: "object",
    children: {
      groupTags: { name: "Tags", type: "group", children: {
        authorTags: { name: "Media author tags", type: "array", tooltip: "Tags for imgur/gfycat/etc. media authors.", arrayItemName: "media author tag", arrayItem: {
          type: "object", children: {
            authorRegex: { name: "Author regex", type: "string", defaultValue: "", tooltip: "Regular expression used to match media author." },
            tag: { name: "Tag", type: "string", defaultValue: "" },
            tagDetails: { name: "Tag details", type: "string", defaultValue: "", tooltip: "Extra info shown in tag tooltip." },
            tagColor: { name: "Tag highlight color", type: "color", defaultValue: "ff0000" },
            tagTextColor: { name: "Tag text color", type: "color", defaultValue: "ffffff" }
          }
        } },
        mediaTags: { name: "Media tags", type: "array", tooltip: "Tags for media matching the given width/height/size. Note that this is not very reliable and only matches specific versions of an image/video (and might have false positives).", arrayItemName: "media tag", arrayItem: {
          type: "object", children: {
            width: { name: "Width", type: "number", defaultValue: 0 },
            height: { name: "Height", type: "number", defaultValue: 0 },
            size: { name: "Size (bytes)", type: "number", defaultValue: 0 },
            tag: { name: "Tag", type: "string", defaultValue: "" },
            tagDetails: { name: "Tag details", type: "string", defaultValue: "", tooltip: "Extra info shown in tag tooltip." },
            tagColor: { name: "Tag highlight color", type: "color", defaultValue: "ff0000" },
            tagTextColor: { name: "Tag text color", type: "color", defaultValue: "ffffff" }
          }
        } }
      }},
      groupDescText: { name: "Media Text", type: "group", children: {
        descriptionHighlight: { name: "Highlight text in media titles/descriptions", type: "array", defaultValue: [{ textRegex: "(instagram|facebook|twitter|twimg|pinterest|tumblr)\\.com", highlightDetails: "social media link", highlightColor: "7744bb", highlightTextColor: "ffffff" }], arrayItemName: "highlight text item", arrayItem: {
          type: "object", children: {
            textRegex: { name: "Text regex", type: "string", defaultValue: "", tooltip: "Regular expression used to match title/description text." },
            highlightDetails: { name: "Details", type: "string", defaultValue: "", tooltip: "Extra info shown in tooltip." },
            highlightColor: { name: "Highlight color", type: "color", defaultValue: "" },
            highlightTextColor: { name: "Text color", type: "color", defaultValue: "" }
          }
        } },
        highlightDescriptionLinks: { name: "Highlight links in titles/descriptions?", type: "boolean", defaultValue: true },
        descriptionLinkColor: { name: "Link highlight color", type: "color", defaultValue: "ffff6e" },
        descriptionLinkTextColor: { name: "Link text color", type: "color", defaultValue: "0079d3" }
      }},
      groupExpando: { name: "Expandos &amp; Media Info", type: "group", children: {
        addExpandos: { name: "Add single media item expandos/media info?", type: "boolean", defaultValue: true },
        addAlbumExpandos: { name: "Add album expandos/media info?", type: "boolean", defaultValue: true },
        addCommentExpandos: { name: "Add comment expandos/media info?", type: "boolean", defaultValue: true },
        commentMediaInfoInline: { name: "Show comment media info inline?", type: "boolean", defaultValue: false, tooltip: "If not enabled, comment media info is shown when hovering over the expando." },
        removeNativeExpandos: { name: "Remove native expandos?", type: "boolean", defaultValue: false, tooltip: "Remove reddit's (slow, low quality) native expandos that load media from redditmedia or embed.ly whenever a replacement expando and media info is available for a link." },
        forceHttps: { name: "Always use HTTPS?", type: "boolean", defaultValue: false, tooltip: "Replace insecure expando links with secure HTTPS links. This will cause problems for sites that don't support secure connections." },
        muteVideo: { name: "Mute expando videos by default?", type: "boolean", defaultValue: true },
        loadReducedImgur: { name: "Load reduced size version of imgur images?", type: "boolean", defaultValue: true, tooltip: "Subsitute a max 1024x1024 image when original image is higher resolution. Makes images load faster at the expense of a potential resolution loss for some images." },
        //expandOnHover: { name: "Expand on hover?", type: "boolean", defaultValue: false, tooltip: "Expand when hovering mouse over expandos. Clicking the expando will keep it open." },
        expandoRememberPlace: { name: "Resume after re-opening expando?", type: "boolean", defaultValue: true, tooltip: "After closing and re-opening a video or album expando, go to the previous time or album image." },
        expandoMaxHeight: { name: "Max expando image/video height (pixels)", type: "number", defaultValue: 1000, tooltip: "Images and videos taller than this will be resized to fit. Zero for no maximum. Note that very wide images/videos are still resized to fit the page/comment width." },
        expandoClickExpandHeight: { name: "Expand image/video full height on click?", type: "boolean", defaultValue: true, tooltip: "When an image or video is taller than the max expando height, clicking it toggles from resized to full height. Note that very wide images/videos are still resized to fit the page/comment width, and reduced size imgur images will still be limited to a 1024 pixel height." },
        expandoResizeVideoNoPause: { name: "Don't pause videos when clicking to resize?", type: "boolean", defaultValue: true, tooltip: "Only affects browsers that play/pause videos when clicked (Firefox). Prevents pausing when clicking on a video taller than the max expando height in order to toggle the full height. Small videos are unaffected." }
      }},
      groupAnimated: { name: "Animated", type: "group", children: {
        highlightAnimated: { name: "Highlight animated media?", type: "boolean", defaultValue: true, tooltip: "Highlights the thumbnail for webm/mp4/GIF/etc. media links." },
        albumColor: { name: "Album color", type: "color", defaultValue: "d8bfd8", tooltip: "Color for albums containing animated media." },
        galleryColor: { name: "Gallery color", type: "color", defaultValue: "ee82ee", tooltip: "Color for gallery and image pages containing animated media." },
        gifvColor: { name: "Gifv color", type: "color", defaultValue: "8a2be2", tooltip: "Color for webm/mp4 compatibility pages." },
        gfyColor: { name: "Gfy color type", type: "color", defaultValue: "800080", tooltip: "Color for gfycat pages." },
        webmColor: { name: "Webm color", type: "color", defaultValue: "008080", tooltip: "Color for direct webm/mp4 links." },
        gifColor: { name: "GIF color", type: "color", defaultValue: "ff7000", tooltip: "Color for direct GIF links." }
      }},
      groupDuration: { name: "Duration", type: "group", children: {
        addDurationToTitle: { name: "Add duration to post titles?", type: "boolean", defaultValue: true },
        highlightLongDuration: { name: "Highlight long animated media?", type: "boolean", defaultValue: true },
        longDuration: { name: "Long duration (seconds)", type: "number", defaultValue: 15.1 },
        longDurationColor: { name: "Long duration highlight color", type: "color", defaultValue: "ff8880" },
        longDurationTextColor: { name: "Long duration text color", type: "color", defaultValue: "ffffff" },
        useGradient: { name: "Use color gradient?", type: "boolean", defaultValue: true, tooltip: "Yellow to red gradient for long durations, from start to end durations." },
        gradientDurationMin: { name: "Gradient start duration (seconds)", type: "number", defaultValue: 15.1, tooltip: "Durations closer to this will be yellow." },
        gradientDurationMax: { name: "Gradient end duration (seconds)", type: "number", defaultValue: 20, tooltip: "Durations closer to this will be red." }
      }},
      groupFrameRates: { name: "Frame Rates", type: "group", children: {
        accurateFrameRate: { name: "Show accurate frame rates?", type: "boolean", defaultValue: false, tooltip: "Determine the exact frame rate using the non-standard HTMLMediaElement.seekToNextFrame(). Currently only supported in Firefox, and requires you to enable media.seekToNextFrame.enabled in about:config. Note that this may add a slight delay before videos begin their first playback. If not enabled or supported by your browser or if this setting is off, frame rates are estimated based on browser playback timings when not given by the respective media API." },
        highlightLowFrameRate: { name: "Highlight low frame rates?", type: "boolean", defaultValue: true },
        lowFrameRate: { name: "Low frame rate", type: "number", defaultValue: 20 },
        lowFrameRateColor: { name: "Low frame rate highlight color", type: "color", defaultValue: "ff9955" },
        lowFrameRateTextColor: { name: "Low frame rate text color", type: "color", defaultValue: "ffffff" },
        highlightHighFrameRate: { name: "Highlight high frame rates?", type: "boolean", defaultValue: true },
        highFrameRate: { name: "High frame rate", type: "number", defaultValue: 40 },
        highFrameRateColor: { name: "High frame rate highlight color", type: "color", defaultValue: "5599ff" },
        highFrameRateTextColor: { name: "High frame rate text color", type: "color", defaultValue: "ffffff" }
      }},
      groupResolution: { name: "Resolution", type: "group", children: {
        highlightLowResolution: { name: "Highlight low resolution media?", type: "boolean", defaultValue: true },
        lowResolution: { name: "Low resolution (pixels)", type: "number", defaultValue: 400, tooltip: "The smaller of width and height considered to be low resolution." },
        lowResolutionColor: { name: "Low resolution color", type: "color", defaultValue: "ff7755" },
        lowResolutionTextColor: { name: "Low resolution text color", type: "color", defaultValue: "ffffff" },
        highlightHighResolution: { name: "Highlight high resolution media?", type: "boolean", defaultValue: true },
        highResolution: { name: "High resolution (pixels)", type: "number", defaultValue: 2000, tooltip: "The larger of width and height considered to be high resolution." },
        highResolutionColor: { name: "High resolution highlight color", type: "color", defaultValue: "66ddff" },
        highResolutionTextColor: { name: "High resolution text color", type: "color", defaultValue: "ffffff" }
      }},
      groupFileSize: { name: "Files Size", type: "group", children: {
        highlightLargeSize: { name: "Highlight large media?", type: "boolean", defaultValue: true },
        largeSize: { name: "Large size (bytes)", type: "number", defaultValue: 15728640 },
        largeSizeColor: { name: "Large size highlight color", type: "color", defaultValue: "ff5555" },
        largeSizeTextColor: { name: "Large size text color", type: "color", defaultValue: "ffffff" }
      }},
      groupSameTitle: { name: "Same Titles", type: "group", children: {
        highlightSameTitle: { name: "Highlight similar titles?", type: "boolean", defaultValue: true, tooltip: "Highlight when the reddit title is similar to the imgur/gfycat/etc. media title." },
        minimumTitleSimilarity: { name: "Minimum title similarity (percent)", type: "number", defaultValue: 75, tooltip: "Percent of matching characters between reddit and media title, non-letter/number characters excluded." },
        sameTitleColor: { name: "Same title highlight color", type: "color", defaultValue: "ffff88" },
        sameTitleTextColor: { name: "Same title text color", type: "color", defaultValue: "000000" }
      }},
      groupSameAuthors: { name: "Same Authors", type: "group", children: {
        highlightSameAuthor: { name: "Highlight same author?", type: "boolean", defaultValue: true, tooltip: "Highlight when the reddit author matches the imgur/gfycat/etc. media author." },
        sameAuthorColor: { name: "Same author highlight color", type: "color", defaultValue: "00e800" },
        sameAuthorTextColor: { name: "Same author text color", type: "color", defaultValue: "ffffff" }
      }},
      groupGallery: { name: "Imgur Gallery", type: "group", children: {
        highlightGalleryReposts: { name: "Highlight gallery reposts?", type: "boolean", defaultValue: true, tooltip: "Highlight when a reddit post is a repost of an imgur gallery post automatically created by a different reddit post." },
        galleryRepostTimeDiff: { name: "Gallery repost time difference (minutes)", type: "number", defaultValue: 20, tooltip: "Difference between reddit post time and the time an automatic imgur gallery post was created. Gallery creation time does not necessarily reflect image upload or album creation time." },
        galleryRepostColor: { name: "Gallery repost highlight color", type: "color", defaultValue: "ffa500" },
        galleryRepostTextColor: { name: "Gallery repost text color", type: "color", defaultValue: "ffffff" },
        highlightNonGalleryWithTitle: { name: "Highlight non-gallery posts with title/description?", type: "boolean", defaultValue: true, tooltip: "Highlight when imgur content is not in the gallery, but has a title or description. This could mean that it was previously an imgur gallery post but was removed from the public gallery listing, by the user or by imgur due to spam or a rule violation, or this might indicate spam or account farming behavior." },
        galleryRemovedColor: { name: "Gallery removed highlight color", type: "color", defaultValue: "ff4400" },
        galleryRemovedTextColor: { name: "Gallery removed text color", type: "color", defaultValue: "ffffff" }
      }},
      groupThumbnails: { name: "Thumbnails", type: "group", children: {
        highlightThumbnailVersion: { name: "Highlight thumbnail versions?", type: "boolean", defaultValue: true, tooltip: "Highlight when a post links to a smaller or non-standard version of the original." },
        thumbnailVersionColor: { name: "Thumbnail versions highlight color", type: "color", defaultValue: "ff7777" },
        thumbnailVersionTextColor: { name: "Thumbnail versions text color", type: "color", defaultValue: "ffffff" }
      }},
      groupOldMedia: { name: "Old Media", type: "group", children: {
        highlightOld: { name: "Highlight old media items?", type: "boolean", defaultValue: true },
        oldTimeDiff: { name: "Old time (minutes)", type: "number", defaultValue: 24 * 60 },
        oldColor: { name: "Old media item highlight color", type: "color", defaultValue: "ffe0bb" },
        oldTextColor: { name: "Old media item text color", type: "color", defaultValue: "000000" }
      }},
      groupImgurCommentReposts: { name: "Imgur Comment Reposts", type: "group", children: {
        highlightImgurCommentReposts: { name: "Highlight imgur comment reposts?", type: "boolean", defaultValue: true, tooltip: "Highlight when a reddit comment is copied from a comment in the corresponding imgur gallery post for the current reddit post." },
        loadImgurCommentsAutomatically: { name: "Load comments automatically?", type: "boolean", defaultValue: true, tooltip: "Automatically retrieve imgur comments on page load and check for comment reposts. If not enabled, a button will allow you to check manually." },
        checkTopLevelCommentsOnly: { name: "Check top level imgur comments only?", type: "boolean", defaultValue: false, tooltip: "Speeds up check time for posts with large numbers of comments, but won't show some comment reposts." },
        minimumCommentLength: { name: "Minimum comment length", type: "number", defaultValue: 10, tooltip: "Minimum number of number/letter/space characters in a comment for it to be considered a comment repost." },
        reportReasonText: { name: "Report reason text", type: "string", defaultValue: "copied imgur comment - ", tooltip: "Default text inserted in report reason when clicking the Report link on a reposted comment. The imgur comment URL is appended to this text." },
        allowEditingOfReportReason: { name: "Allow editing of report reason?", type: "boolean", defaultValue: false, tooltip: "When clicking the Report link on a reposted comment, don't immediately submit the report after filling in the reason." }
      }},
      groupGifToGfy: { name: "GIF to Gfy", type: "group", children: {
        showGfyConvertButton: { name: "Add gfy convert button?", type: "boolean", defaultValue: true, tooltip: "Adds a button next to GIF media links that converts them to gfycats and replaces the expando and media info with the gfy and gfy info. If an existing gfy transcode exists for a GIF, that gfy will load immediately." },
        autoConvertGfy: { name: "Automatically convert GIFs to gfycats?", type: "boolean", defaultValue: false, tooltip: "Automatically convert GIFs on page load, or retrieve info for an existing gfy transcode if one exists. If not enabled, the gfy button will allow you to convert to gfy manually." }
      }},
      groupAdvanced: { name: "Advanced", type: "group", collapsedByDefault: true, children: {
        imgurClientId: { name: "Imgur API client ID", type: "string", defaultValue: "2eb3b0a17b566b2", desc: "Client ID used to retrieve imgur info. Get one by registering an imgur app here: <a href=\"https://api.imgur.com/oauth2/addclient\">https://api.imgur.com/oauth2/addclient</a>." },
        slimgClientId: { name: "Sli.mg API client ID", type: "string", defaultValue: "", desc: "Client ID used to retrieve sli.mg info. See <a href=\"https://sli.mg/public/api\">https://sli.mg/public/api</a>." },
        // gfycatClientId: { name: "Gfycat API client ID", type: "string", defaultValue: "", desc: "Client ID used with gfycat client secret to convert GIFs to gfycats. See <a href=\"https://developers.gfycat.com/api/#authentication\">https://developers.gfycat.com/api/#authentication</a>." },
        // gfycatClientSecret: { name: "Gfycat API client secret", type: "string", defaultValue: "" },
        simultaneousLinks: { name: "Simultaneous links", type: "number", defaultValue: 10, tooltip: "Number of links processed in parallel. After media info is processed for a link, the next one in sequence begins, with the total number running at the same time limited by this setting. Depending on the speed of your network and various media APIs, a lower number will cause media info to appear slower, and a higher number may cause browser lag, timeouts, or hit API limits." },
        simultaneousExpandos: { name: "Simultaneous expandos", type: "number", defaultValue: 2, tooltip: "Number of expandos that load at the same time when the &quot;show all&quot; button is clicked. After an expando loads (or reaches an error), the next expando in sequence will load." },
        imgurPostCacheTime: { name: "Imgur post cache time (minutes)", type: "number", defaultValue: 1 * 60, tooltip: "Time to keep imgur post data (author/description/dimensions/etc.) saved in this script's local cache. Longer times reduce network overhead but media info shown may be out of date. Shorter times increase network overhead (and hit API limits faster) but info will be more up to date." },
        imgurAlbumCacheTime: { name: "Imgur album cache time (minutes)", type: "number", defaultValue: 2 * 60, tooltip: "Time to keep imgur album data (author/description/list of pictures and their data) cached." },
        imgurCommentsCacheTime: { name: "Imgur comments cache time (minutes)", type: "number", defaultValue: 2 * 60, tooltip: "Time to keep imgur gallery comments cached." },
        gfycatPostCacheTime: { name: "Gfycat cache time (minutes)", type: "number", defaultValue: 12 * 60, tooltip: "Time to keep gfycat post data cached." },
        slimgPostCacheTime: { name: "Slimg post cache time (minutes)", type: "number", defaultValue: 6 * 60, tooltip: "Time to keep slimg post data cached." },
        slimgAlbumCacheTime: { name: "Slimg album cache time (minutes)", type: "number", defaultValue: 6 * 60, tooltip: "Time to keep slimg album data cached." },
        otherCacheTime: { name: "Other items cache time (minutes)", type: "number", defaultValue: 12 * 60, tooltip: "Time to keep all other media data cached." }
      }}
    }
  };
  var settings;
  var isCommentPage = /\/comments\//i.test(window.location.href);
  var currentMediaTag;
  var tagData;
  var tagDataUpdateTime;
  var currentExpandoList;
  var currentLinkList;
  var descriptionHighlight;
  var selfPostInterval = {};
  var frameRateInterval = {};
  // https://gist.github.com/dperini/729294#file-regex-weburl-js
  var urlRegex = "(?:(?:https?|ftp):\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\s*\\.\\s*\\d{1,3}){3})(?!(?:169\\s*\\.\\s*254|192\\s*\\.\\s*168)(?:\\s*\\.\\s*\\d{1,3}){2})(?!172\\s*\\.\\s*(?:1[6-9]|2\\d|3[0-1])(?:\\s*\\.\\s*\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\s*\\.\\s*(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\s*\\.\\s*(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\s*\\.\\s*(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\s*\\.\\s*(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?";
  var imgurIdRegex = /imgur\.com\/+(?:(gallery|a|r\/\w+|t(?:opic)?\/\w+|share\/i)\/)?([\d\w]{5}|[\d\w]{7})([sbtmlh])?(\.(?=.+)|[^\d\w]|$)/i;

  function cacheData(cacheId, dataObject, cacheTimeMinutes)
  {
    GM_setValue(cacheId, JSON.stringify({ exp: cacheTimeMinutes ? Date.now() + cacheTimeMinutes * 60000 : 0, data: dataObject}));
  }

  function getCachedData(cacheId, forceExpire)
  {
    var cacheString = GM_getValue(cacheId);
    if (cacheString)
    {
      var cacheItem = JSON.parse(cacheString);
      if (cacheItem)
      {
        if (!cacheItem.exp || (!forceExpire && Date.now() < cacheItem.exp))
          return cacheItem.data;
        GM_deleteValue(cacheId);
      }
    }
    return null;
  }

  function cleanCache(forceExpire)
  {
    var removed = 0;
    var startTime = Date.now();
    var keys = GM_listValues();
    for (var i = 0; i < keys.length; i++)
    {
      if (!getCachedData(keys[i], forceExpire))
        removed++;
    }
    console.log("reddit image info cache cleanup: " + removed + " removed, " + (keys.length - removed) + " remaining (" + (Date.now() - startTime) + "ms)");
  }

  function showNotification(notificationHtml, autoCloseTime, closeEvent)
  {
    $(".imageInfoNotification").remove();
    $("body").append($("<div class=\"imageInfoNotification imageInfoButton\"><b>reddit image info</b><div class=\"imageInfoNotificationClose imageInfoLink imageInfoButton\">X</div><div class=\"imageInfoNotificationText\">" + notificationHtml + "</div></div>"));
    $(".imageInfoNotificationClose").click(function() {
      $(".imageInfoNotification").remove();
      if (closeEvent)
        closeEvent();
    });
    if (autoCloseTime)
    {
      var closeTimeout = window.setTimeout(function() {
        $(".imageInfoNotification").fadeTo(500, 0, function() {
          if (closeTimeout)
            $(".imageInfoNotificationClose").click();
        });
      }, autoCloseTime);
      $(".imageInfoNotification").on("mouseover", function() {
        window.clearTimeout(closeTimeout);
        closeTimeout = null;
        $(this).stop().fadeTo(50, 1);
      });
    }
  }

  function handleError(error)
  {
    console.log("reddit image info error: " + error.message);
    var errorText = "    " + error.message;
    if (error.stack)
      errorText += "\n    " + error.stack.replace(/\n(?=.+)/g, "\n    ").replace(/file:\/.+\//g, "");
    var lastError = { errorTime: Date.now(), errorText: errorText };
    cacheData("rii_lasterror", lastError);
    showNotification("An error occurred.<br/><a class=\"imageInfoErrorReport\" target=\"_blank\" href=\"/message/compose/?to=absurdlyobfuscated&subject=" + encodeURIComponent("Reddit image info script error") + "&message=" + encodeURIComponent("Your script bugged out on me! https://www.youtube.com/watch?v=8ZCysBT5Kec\n\n" + errorText) + "\">Report this error.</a>", 5000);
  }

  function getDefaultSettings(metaData, currentSetting)
  {
    var defaultValue = typeof currentSetting == "undefined" ? metaData.defaultValue : currentSetting;
    var hasDefaultValue = typeof defaultValue != "undefined";
    if (metaData.type == "array")
    {
      var newSettingArray = [];
      for (var i = 0; i < (hasDefaultValue ? defaultValue.length : 0); i++)
        newSettingArray.push(getDefaultSettings(metaData.arrayItem, defaultValue[i]));
      return newSettingArray;
    }
    else if (metaData.type == "object")
    {
      var newSettingObject = {};
      for (var childSetting in metaData.children)
      {
        var childMetaData = metaData.children[childSetting];
        if (childMetaData.type == "group")
        {
          for (var groupChildSetting in childMetaData.children)
            newSettingObject[groupChildSetting] = getDefaultSettings(childMetaData.children[groupChildSetting], hasDefaultValue ? defaultValue[groupChildSetting] : undefined);
        }
        else
          newSettingObject[childSetting] = getDefaultSettings(childMetaData, hasDefaultValue ? defaultValue[childSetting] : undefined);
      }
      if (metaData.version)
        newSettingObject.version = metaData.version;
      return newSettingObject;
    }
    return defaultValue;
  }

  function attachEvents(events)
  {
    for (var i = 0; i < events.length; i++)
      $(events[i].selector).each(events[i].event);
  }

  function arrayItemHtml(setting, metaData, settingValue, parentSetting, events, arrayItemName)
  {
    return "<div class=\"imageInfoSettingArrayItem\"><div class=\"imageInfoSettingArrayRemove imageInfoSprite imageInfoLink\" title=\"Remove this " + arrayItemName + "\" onclick=\"$(this).parent().remove();\"></div>" + settingHtml(metaData.type, setting, metaData, settingValue, parentSetting, events) + "</div>";
  }

  function settingHtml(type, setting, metaData, settingValue, parentSetting, events)
  {
    var settingsHtml = "";
    if (type != "object")
    {
      settingsHtml += "<div class=\"imageInfoSettingItem\">";
      if (metaData.name)
      {
        settingsHtml += "<div class=\"" + (type == "array" ? "imageInfoSettingArrayTitle" : "imageInfoSettingTitle");
        if (metaData.tooltip)
          settingsHtml += "\" title=\"" + metaData.tooltip;
        settingsHtml += "\">" + metaData.name + "</div>";
      }
    }
    settingsHtml += "<div class=\"imageInfoSettingValue";
    if (type != "array" && type != "object" && typeof metaData.defaultValue != "undefined" && metaData.defaultValue !== "" && metaData.defaultValue !== 0 && settingValue != metaData.defaultValue)
    {
      settingsHtml += " imageInfoSettingValueNonDefault\" title=\"default value: ";
      if (type == "string")
        settingsHtml += "&quot;" + metaData.defaultValue + "&quot;";
      else if (type == "boolean")
        settingsHtml += metaData.defaultValue ? "checked" : "unchecked";
      else
        settingsHtml += metaData.defaultValue;
    }
    settingsHtml += "\">";
    switch (type)
    {
      case "color":
        settingsHtml += "<input type=\"text\" class=\"imageInfoSetting jscolor\" id=\"" + setting + "\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting + "\" />";
        events.push({
          selector: "#" + setting,
          event: function() {
            var picker = new jscolor(this, { uppercase: false });
            picker.fromString(settingValue);
          }
        });
        break;
      case "string":
      case "number":
        settingsHtml += "<input type=\"text\" class=\"imageInfoSetting\" id=\"" + setting + "\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting + "\"";
        settingsHtml += " value=\"" + settingValue + "\" />";
        break;
      case "boolean":
        settingsHtml += "<input type=\"checkbox\" class=\"imageInfoSetting\" id=\"" + setting + "\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting + "\"";
        settingsHtml += (settingValue ? "checked=\"checked\"" : "") + " />";
        break;
      case "array":
        settingsHtml += "<div class=\"imageInfoSetting\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting;
        settingsHtml += "\" id=\"" + setting + "\">";
        for (var i = 0; i < settingValue.length; i++)
          settingsHtml += arrayItemHtml(setting + "_" + i, metaData.arrayItem, settingValue[i], setting, events, metaData.arrayItemName);
        settingsHtml += "</div><div class=\"imageInfoSettingArrayAdd imageInfoSprite imageInfoLink\" id=\"imageInfoSettingArrayAdd" + setting + "\" title=\"Add new " + metaData.arrayItemName + "\" />";
        var nextIndex = settingValue.length;
        events.push({
          selector: "#imageInfoSettingArrayAdd" + setting,
          event: function() {
            $(this).click(function() {
              var newEvents = [];
              $("#" + setting).append($(arrayItemHtml(setting + "_" + (nextIndex++), metaData.arrayItem, metaData.arrayItem.defaultValue, setting, newEvents, metaData.arrayItemName)));
              attachEvents(newEvents);
            });
          }
        });
        break;
      case "object":
        settingsHtml += "<div class=\"imageInfoSetting\"";
        if (parentSetting)
          settingsHtml += " data-parent=\"" + parentSetting + "\"";
        settingsHtml += " id=\"" + setting + "\">";
        for (var childSetting in metaData.children)
        {
          var childMetaData = metaData.children[childSetting];
          if (childMetaData.type == "group")
          {
            settingsHtml += "<div class=\"imageInfoSettingGroup";
            if (settingValue && settingValue[childSetting] ? settingValue[childSetting].collapsed : childMetaData.collapsedByDefault)
              settingsHtml += " imageInfoSettingGroupCollapsed";
            settingsHtml += "\" id=\"" + setting + "_" + childSetting + "\"><div class=\"imageInfoSettingGroupTitle\">" + childMetaData.name + "<div class=\"imageInfoSettingCollapse imageInfoSprite imageInfoLink\"></div></div>";
            for (var groupChildSetting in childMetaData.children)
            {
              var groupChildMetaData = childMetaData.children[groupChildSetting];
              settingsHtml += settingHtml(groupChildMetaData.type, setting + "_" + groupChildSetting, groupChildMetaData, settingValue ? settingValue[groupChildSetting] : groupChildMetaData.defaultValue, setting, events);
            }
            settingsHtml += "</div>";
          }
          else
            settingsHtml += settingHtml(childMetaData.type, setting + "_" + childSetting, childMetaData, settingValue ? settingValue[childSetting] : childMetaData.defaultValue, setting, events);
        }
        settingsHtml += "</div>";
        break;
    }
    settingsHtml += "</div>";
    if (metaData && metaData.desc)
      settingsHtml += "<div class=\"imageInfoSettingDesc\">" + metaData.desc + "</div>";
    if (type != "object")
      settingsHtml += "</div>";
    return settingsHtml;
  }

  function readSetting(type, setting, metaData, settingInput, parentSetting)
  {
    var valid = true;
    var settingValue;
    switch (type)
    {
      case "color":
      case "string":
        settingValue = settingInput.val();
        break;
      case "number":
        var value = +settingInput.val();
        if (isNaN(value))
        {
          showNotification("Invalid numeric value for setting " + metaData.name + ": " + settingInput.val(), null, function() {
            settingInput.focus();
          });
          valid = false;
          break;
        }
        settingValue = value;
        break;
      case "boolean":
        settingValue = settingInput.prop("checked");
        break;
      case "array":
          var settingArray = [];
          $(".imageInfoSetting[data-parent=" + setting + "]").each(function() {
            settingArray.push(readSetting(metaData.arrayItem.type, $(this).attr("id"), metaData.arrayItem, $(this), setting));
          });
          settingValue = settingArray;
        break;
      case "object":
        var settingObj = {};
        for (var childSetting in metaData.children)
        {
          var childMetaData = metaData.children[childSetting];
          if (childMetaData.type == "group")
          {
            settingObj[childSetting] = { collapsed: $("#" + setting + "_" + childSetting).hasClass("imageInfoSettingGroupCollapsed") };
            for (var groupChildSetting in childMetaData.children)
            {
              var groupChildMetaData = childMetaData.children[groupChildSetting];
              settingObj[groupChildSetting] = readSetting(groupChildMetaData.type, setting + "_" + groupChildSetting, groupChildMetaData, $("#" + setting + "_" + groupChildSetting), setting);
            }
          }
          else
            settingObj[childSetting] = readSetting(childMetaData.type, setting + "_" + childSetting, childMetaData, $("#" + setting + "_" + childSetting), setting);
        }
        if (metaData.version)
          settingObj.version = metaData.version;
        settingValue = settingObj;
        break;
    }
    if (!valid)
      throw new Error("invalid");
    return settingValue;
  }

  function settingDiffText(settingName, metaData, settingValue, arrayDefaultValue)
  {
    var diffText = "";
    var defaultValue = typeof arrayDefaultValue == "undefined" ? metaData.defaultValue : arrayDefaultValue;
    if (metaData.type == "array")
    {
      if (!settingValue)
        diffText += settingName + "\n";
      else
      {
        for (var i = 0; i < settingValue.length; i++)
          diffText += settingDiffText(settingName + " > Item " + i, metaData.arrayItem, settingValue[i], metaData.defaultValue && i < metaData.defaultValue.length ? metaData.defaultValue[i] : undefined);
      }
    }
    else if (metaData.type == "object")
    {
      if (!settingValue)
        diffText += settingName + "\n";
      else
      {
        for (var childSetting in metaData.children)
        {
          var childMetaData = metaData.children[childSetting];
          if (childMetaData.type == "group")
          {
            for (var groupChildSetting in childMetaData.children)
            {
              var groupChildMetaData = childMetaData.children[groupChildSetting];
              diffText += settingDiffText(childMetaData.name + " > " + (groupChildMetaData.name || groupChildSetting), groupChildMetaData, settingValue[groupChildSetting], arrayDefaultValue ? arrayDefaultValue[groupChildSetting] : undefined);
            }
          }
          else
            diffText += settingDiffText((settingName ? settingName + " > " : "") + (childMetaData.name || childSetting), childMetaData, settingValue[childSetting], arrayDefaultValue ? arrayDefaultValue[childSetting] : undefined);
        }
      }
    }
    else if (settingValue != defaultValue)
      diffText += settingName + ": " + defaultValue + " => " + settingValue + "\n";
    return diffText;
  }

  function filterEmpty(value)
  {
    return !!value;
  }

  function getTextHighlightHtml(text)
  {
    if (text)
    {
      for (var i = 0; i < descriptionHighlight.length; i++)
      {
        var desc = descriptionHighlight[i];
        var match = text.match(new RegExp(desc.textRegex, "i"));
        if (match)
        {
          var matchStart = text.indexOf(match[0]);
          var textHtml = text.substring(0, matchStart) + "<div style=\"background-color: #" + desc.highlightColor + "; color: #" + desc.highlightTextColor + ";\"";
          if (desc.highlightDetails)
            textHtml += " title=\"" + desc.highlightDetails + "\"";
          textHtml += ">" + match[0] + "</div>" + getTextHighlightHtml(text.substring(matchStart + match[0].length));
          return textHtml;
        }
      }
    }
    return text;
  }

  function linkify(text)
  {
    var match = text.match(/(<[a-z]+[^>]+>)(.*)(<\/[a-z]+>)/i);
    if (match)
    {
      var tagStart = text.indexOf(match[0]);
      return linkify(text.substring(0, tagStart)) + match[1] + getTextHighlightHtml(match[2]) + match[3] + linkify(text.substring(tagStart + match[0].length));
    }
    match = text.match(new RegExp(urlRegex, "i"));
    if (match)
    {
      var urlStart = text.indexOf(match[0]);
      var linkHtml = "<a class=\"imageInfoDescLink";
      if (settings.highlightDescriptionLinks)
        linkHtml += " imageInfoButton\" style=\"background-color: #" + settings.descriptionLinkColor + "; color: #" + settings.descriptionLinkTextColor;
      linkHtml += "\" href=\"" + match[0].replace(/\s+/g, "") + "\">" + getTextHighlightHtml(match[0]) + "</a>";
      return getTextHighlightHtml(text.substring(0, urlStart)) + linkHtml + linkify(text.substring(urlStart + match[0].length));
    }
    else
      return getTextHighlightHtml(text);
  }

  function dateUnit(diff, unitDiv, unitMod, unitLabel, padDigits, optional)
  {
    var unitNum = Math.floor(diff / unitDiv);
    if (optional && unitNum < 1)
      return "";
    if (unitMod)
      unitNum %= unitMod;
    if (padDigits)
      return (Array(padDigits).join("0") + unitNum).slice(-padDigits) + unitLabel;
    else
      return unitNum + unitLabel;
  }

  function dateDiff(diff)
  {
    var diffText = diff < 0 ? "+" : "-";
    diff = Math.abs(diff);
    diffText += dateUnit(diff, 365 * 24 * 60 * 60 * 1000, 0, "Y ", 0, true);
    diffText += dateUnit(diff, 24 * 60 * 60 * 1000, 365, "D ", 0, true);
    diffText += dateUnit(diff, 60 * 60 * 1000, 24, ":", 2, false);
    diffText += dateUnit(diff, 60 * 1000, 60, ":", 2, false);
    diffText += dateUnit(diff, 1000, 60, "", 2, false);
    return diffText;
  }

  function linkColor(href)
  {
    if (/\/a\/[\d\w]+/i.test(href))
      return settings.albumColor;
    if (/\.gifv$/i.test(href))
      return settings.gifvColor;
    if (/\.(webm|mp4)$/i.test(href))
      return settings.webmColor;
    if (/\.\w+((\?|#).+)?$/i.test(href))
      return settings.gifColor;
    return settings.galleryColor;
  }

  function durationColor(duration)
  {
    if (settings.useGradient)
      return "ff" + ("0" + Math.floor(255 - Math.min(duration - settings.gradientDurationMin, settings.gradientDurationMax - settings.gradientDurationMin) * 255 / (settings.gradientDurationMax - settings.gradientDurationMin)).toString(16)).slice(-2) + "00";
    return settings.longDurationColor;
  }

  function durationTextColor(duration)
  {
    if (settings.useGradient)
      return Math.min(duration - settings.gradientDurationMin, settings.gradientDurationMax - settings.gradientDurationMin) / (settings.gradientDurationMax - settings.gradientDurationMin) > 0.2 ? "fff" : "000";
    return settings.longDurationTextColor;
  }

  function highlightLink(entry, color)
  {
    if (!color)
      color = "f00";
    entry.parents("div.link").find("a.thumbnail").first().attr("style", "border: 3px solid #" + color + " !important");
  }

  function getAuthorTagHtml(authorTags, authorName)
  {
    var tagHtml = "";
    for (i = 0; i < authorTags.length; i++)
    {
      var authorTag = authorTags[i];
      if (authorTag.tag && new RegExp(authorTag.authorRegex, "i").test(authorName))
        tagHtml += " <div class=\"imageInfoButton\" style=\"background-color: #" + authorTag.tagColor + "; color: #" + authorTag.tagTextColor + ";\"" + (authorTag.tagDetails ? " title=\"" + authorTag.tagDetails + "\"" : "") + ">" + authorTag.tag + "</div>";
    }
    return tagHtml;
  }

  function getDurationHtml(duration, minDuration, maxDuration)
  {
    var checkDuration = duration || maxDuration && minDuration;
    if (!checkDuration)
      return "";
    var durationHtml = "<div";
    if (settings.highlightLongDuration && (checkDuration >= settings.gradientDurationMin || checkDuration >= settings.longDuration))
      durationHtml += " class=\"imageInfoButton\" style=\"background-color: #" + durationColor(checkDuration) + "; color: #" + durationTextColor(checkDuration) + ";\"";
    if (duration)
      durationHtml += ">" + (+duration).toFixed(2);
    else
      durationHtml += " title=\"approximate duration reported by API, expand for exact duration\">" + (+minDuration).toFixed(2) + "s - " + (+maxDuration).toFixed(2);
    durationHtml += "s</div>, ";
    return durationHtml;
  }

  function getFrameRateHtml(estFrameRate, exactFrameRate, apiframeRate, videoFrames, gifFrames, duration)
  {
    var frameRate = exactFrameRate;
    var approximate = false;
    var precision = 2;
    if (!exactFrameRate)
    {
      if (duration && videoFrames)
        frameRate = videoFrames / duration;
      else if (duration && gifFrames)
        frameRate = gifFrames / duration;
      else
      {
        precision = 0;
        if (estFrameRate)
        {
          frameRate = estFrameRate;
          approximate = true;
        }
        else
          frameRate = apiframeRate;
      }
    }
    var frameRateHtml = "<div";
    if (frameRate)
    {
      if (settings.highlightLowFrameRate && frameRate < settings.lowFrameRate)
        frameRateHtml += " class=\"imageInfoButton\" style=\"background-color: #" + settings.lowFrameRateColor + "; color: #" + settings.lowFrameRateTextColor + ";\"";
      else if (settings.highlightHighFrameRate && frameRate > settings.highFrameRate)
        frameRateHtml += " class=\"imageInfoButton\" style=\"background-color: #" + settings.highFrameRateColor + "; color: #" + settings.highFrameRateTextColor + ";\"";
      var titleText = [];
      if (approximate)
        titleText.push("approximate frame rate as reported by your browser");
      if (duration && videoFrames)
        titleText.push("frame rate based on " + duration.toFixed(3) + "s duration and " + videoFrames + " video frames" + (approximate ? ": " + (videoFrames / duration).toFixed(2) : ""));
      else if (duration && gifFrames)
        titleText.push("frame rate based on " + duration.toFixed(3) + "s duration and " + gifFrames + " GIF frames" + (approximate ? ": " + (gifFrames / duration).toFixed(2) : ""));
      if (apiframeRate)
        titleText.push("frame rate reported by API" + (exactFrameRate || estFrameRate || duration ? ": " + apiframeRate : ""));
      if (titleText.length > 0)
        frameRateHtml += " title=\"" + titleText.join(", ") + "\"";
    }
    frameRateHtml += ">";
    if (frameRate)
      frameRateHtml += (approximate ? "~" : "") + (+frameRate).toFixed(precision) + " FPS</div>, ";
    else if (videoFrames || gifFrames)
      frameRateHtml += (videoFrames ? "video" : "GIF") + " frames: " + (videoFrames || gifFrames) + "</div>, ";
    else
      frameRateHtml += "</div>";
    return frameRateHtml;
  }

  function getDimensionsHtml(width, height)
  {
    var dimensionHtml = "<div";
    if (settings.highlightLowResolution && Math.min(width, height) < settings.lowResolution)
      dimensionHtml += " class=\"imageInfoButton\" style=\"background-color: #" + settings.lowResolutionColor + "; color: #" + settings.lowResolutionTextColor + ";\"";
    else if (settings.highlightHighResolution && Math.max(width, height) > settings.highResolution)
      dimensionHtml += " class=\"imageInfoButton\" style=\"background-color: #" + settings.highResolutionColor + "; color: #" + settings.highResolutionTextColor + ";\"";
    dimensionHtml += ">" + width + "x" + height + "</div>";
    return dimensionHtml;
  }

  function getSizeHtml(size, highlightLarge, label)
  {
    var sizeHtml = "<div ";
    if (highlightLarge && settings.highlightLargeSize && size > settings.largeSize)
      sizeHtml += " class=\"imageInfoButton\" style=\"background-color: #" + settings.largeSizeColor + "; color: #" + settings.largeSizeTextColor + ";\"";
    sizeHtml += "title=\"" + label + " size: " + size + " bytes\">" + (size / 1024).toFixed(2) + " KB</div>";
    return sizeHtml;
  }

  // https://en.wikipedia.org/wiki/Levenshtein_distance
  function levenshteinDistance(stringA, stringB)
  {
    if (!stringA)
    {
      if (!stringB)
        return 0;
      return stringB.length;
    }
    if (!stringB)
      return stringA.length;
    var distance = [];
    var i, j;
    for (i = 0; i <= stringA.length; i++)
    {
      var distanceRow = new Array(stringB.length + 1);
      distanceRow[0] = i;
      for (j = 0; j <= (i > 0 ? 0 : stringB.length); distanceRow[j] = j++);
      distance.push(distanceRow);
    }
    for (i = 1; i <= stringA.length; i++)
    {
      for (j = 1; j <= stringB.length; j++)
      {
        var cost = stringB[j - 1] == stringA[i - 1] ? 0 : 1;
        var min1 = distance[i - 1][j] + 1;
        var min2 = distance[i][j - 1] + 1;
        var min3 = distance[i - 1][j - 1] + cost;
        distance[i][j] = Math.min(Math.min(min1, min2), min3);
      }
    }
    return distance[stringA.length][stringB.length];
  }

  function showMediaInfo(entry, positionElement, mediaInfo)
  {
    var timestamp = new Date(mediaInfo.datetime);
    var diff = new Date(entry.find("time").attr("datetime")).getTime() - mediaInfo.datetime;
    var infoHtmlItems = [];
    var headerHtml = "";
    if (mediaInfo.albumImageCount)
      headerHtml += "<div class=\"imageInfoAlbumImageCount\">" + mediaInfo.albumImageCount + " image" + (mediaInfo.albumImageCount == 1 ? "" : "s") + "</div>";
    if (mediaInfo.authorName)
    {
      if (mediaInfo.albumImageCount)
        headerHtml += " ";
      if (mediaInfo.authorLink)
        headerHtml += "<a href=\"" + mediaInfo.authorLink + "\">" + mediaInfo.authorName + "</a>";
      else
        headerHtml += mediaInfo.authorName;
      if (settings.highlightSameAuthor && mediaInfo.authorName.toLowerCase() == entry.find("p.tagline a.author").text().toLowerCase().replace(/[\-_]/g, ""))
        headerHtml += " <div class=\"imageInfoButton\" style=\"background-color: #" + settings.sameAuthorColor + "; color: #" + settings.sameAuthorTextColor + ";\" title=\"reddit author matches " + mediaInfo.mediaName + " author\">=</div>";
      if (tagData && tagData.authorTags)
        headerHtml += getAuthorTagHtml(tagData.authorTags, mediaInfo.authorName);
      if (settings.authorTags)
        headerHtml += getAuthorTagHtml(settings.authorTags, mediaInfo.authorName);
      if (mediaInfo.authorAltLink)
        headerHtml += " (<a href=\"" + mediaInfo.authorAltLink + "\">" + mediaInfo.authorAltLinkName + "</a>)";
    }
    if (headerHtml)
      infoHtmlItems.push(headerHtml);
    if (mediaInfo.pageLink)
      infoHtmlItems.push("<a href=\"" + mediaInfo.pageLink + "\">" + mediaInfo.pageLinkText + "</a>");
    var tagItems = [];
    if (mediaInfo.mediaTagHtml)
      tagItems.push(mediaInfo.mediaTagHtml);
    if (mediaInfo.rating)
      tagItems.push("<div class=\"" + (["R", "NSFW", "Adult", "Possibly Offensive"].indexOf(mediaInfo.rating) > -1 ? "nsfw-stamp " : "") + "stamp\">" + mediaInfo.rating + "</div>");
    if (mediaInfo.source)
      tagItems.push("<a href=\"" + mediaInfo.source + "\">source</a>");
    if (tagItems.length > 0)
      infoHtmlItems.push(tagItems.join(" "));
    var mediaInfoHtml = "";
    if (mediaInfo.animated)
      mediaInfoHtml += "<div class=\"imageInfoDuration\">" + getDurationHtml(mediaInfo.duration, mediaInfo.minDuration, mediaInfo.maxDuration) + "</div>";
    if (mediaInfo.frameRate || mediaInfo.gifFrames || mediaInfo.videoFrames || mediaInfo.animated)
    {
      mediaInfoHtml += "<div class=\"imageInfoFrameRate\"";
      if (mediaInfo.frameRate)
        mediaInfoHtml += "data-frame-rate=\"" + mediaInfo.frameRate + "\"";
      if (mediaInfo.gifFrames)
        mediaInfoHtml += "data-gif-frames=\"" + mediaInfo.gifFrames + "\"";
      if (mediaInfo.videoFrames)
        mediaInfoHtml += "data-video-frames=\"" + mediaInfo.videoFrames + "\"";
      mediaInfoHtml += ">" + getFrameRateHtml(null, null, mediaInfo.frameRate, mediaInfo.videoFrames, mediaInfo.gifFrames, mediaInfo.duration) + "</div>";
    }
    if (mediaInfo.width && mediaInfo.height)
      mediaInfoHtml += getDimensionsHtml(mediaInfo.width, mediaInfo.height);
    else if (!mediaInfo.albumImageCount)
      mediaInfoHtml += "<div class=\"imageInfoDimensions\"></div>";
    if (mediaInfoHtml)
      infoHtmlItems.push(mediaInfoHtml);
    var sizeHtml = "";
    if (mediaInfo.videoSize)
    {
      sizeHtml += getSizeHtml(mediaInfo.videoSize, true, "video");
      if (mediaInfo.imageSize)
        sizeHtml +=  " / ";
    }
    if (mediaInfo.imageSize)
      sizeHtml += getSizeHtml(mediaInfo.imageSize, !mediaInfo.isVideoLink || !mediaInfo.videoSize, mediaInfo.animated ? "GIF" : "image");
    if (sizeHtml)
      infoHtmlItems.push(sizeHtml);
    if (mediaInfo.datetime)
    {
      var dateHtml = "<div ";
      if (settings.highlightOld && diff > settings.oldTimeDiff * 60000)
        dateHtml += "class=\"imageInfoButton\" style=\"background-color: #" + settings.oldColor + "; color: #" + settings.oldTextColor + ";\" ";
      dateHtml += "title=\"" + mediaInfo.mediaName + " time: " + timestamp.toGMTString() + "\">T" + dateDiff(diff) + "</div>";
      infoHtmlItems.push(dateHtml);
    }
    var titleHtml = "";
    if (mediaInfo.tags)
      titleHtml += "[" + mediaInfo.tags + "] ";
    if (mediaInfo.title)
    {
      var similarity = 0;
      if (settings.highlightSameTitle)
      {
        var redditTitle = positionElement.parent().find("a").first().text().trim().toLowerCase();
        var mediaTitle = mediaInfo.title.replace(/[\u00a0\s]+/g, " ").trim().toLowerCase();
        var mediaTitleAlt = mediaTitle.replace(/imgur/gi, "reddit");
        if (redditTitle == mediaTitle || redditTitle == mediaTitleAlt || redditTitle == mediaTitleAlt.replace(/\b(i|me|my|mine|myself|we|us|our|ours|ourselves|meet|itap)\b/gi, ""))
          titleHtml += "<div class=\"imageInfoButton\" style=\"background-color: #" + settings.sameTitleColor + "; color: #" + settings.sameTitleTextColor + ";\" title=\"reddit title matches " + mediaInfo.mediaName + " title\">same title</div> ";
        else
        {
          var titleLength = Math.max(redditTitle.length, mediaTitle.length);
          redditTitle = redditTitle.replace(/[^\w\s]/g, "");
          mediaTitle = mediaTitle.replace(/[^\w\s]/g, "");
          var fuzziness = redditTitle.length > mediaTitle.length ? levenshteinDistance(mediaTitle, redditTitle) : levenshteinDistance(redditTitle, mediaTitle);
          similarity = Math.round(100 - fuzziness / titleLength * 100);
          if (similarity >= settings.minimumTitleSimilarity)
            titleHtml += "<div class=\"imageInfoButton\" style=\"background-color: #" + settings.sameTitleColor + "; color: #" + settings.sameTitleTextColor + ";\" title=\"reddit title is similar to " + mediaInfo.mediaName + " title (non-symbol character difference: " + fuzziness + ")\">similar title " + similarity + "%</div> ";
        }
        if (mediaInfo.description && mediaInfo.title == mediaInfo.description)
          titleHtml += "<div class=\"imageInfoButton\" style=\"background-color: #" + settings.sameTitleColor + "; color: #" + settings.sameTitleTextColor + ";\" title=\"" + mediaInfo.mediaName + " title matches " + mediaInfo.mediaName + " description, this is common with account farmers\">title/description match</div> ";
      }
      titleHtml += "\"";
      if (similarity)
        titleHtml += "<div title=\"similarity: " + similarity + "%\">" + linkify(mediaInfo.title) + "</div>";
      else
        titleHtml += linkify(mediaInfo.title);
      titleHtml += (mediaInfo.description ? " /// " + linkify(mediaInfo.description).replace(/\n/g, " // ") : "") + "\"";
    }
    else if (mediaInfo.description)
      titleHtml += "\"" + linkify(mediaInfo.description).replace(/\n/g, " // ") + "\"";
    if (titleHtml)
      infoHtmlItems.push(titleHtml);
    var infoHtml = "<div class=\"imageInfo\">" + infoHtmlItems.join(", ") + "</div>";
    if (positionElement.attr("href"))
      infoHtml = "<div class=\"" + (settings.commentMediaInfoInline ? "imageInfoCommentInline" : "imageInfoComment") + "\">" + infoHtml  + "</div>";
    positionElement.parent().find(".imageInfoRetry").remove();
    return $(infoHtml).insertAfter(positionElement);
  }

  function addRetryButton(link, positionElement, request, error)
  {
    positionElement.parent().find(".imageInfoRetry").remove();
    var resp = request.responseJSON;
    if (resp)
      error = resp.error || (resp.data && resp.data.error) || error;
    if (error == "Daily client requests exceeded")
      showNotification("API rate limit exceeded. You may need to set a new API client ID in the reddit image info options.", 5000);
    $("<div class=\"imageInfoRetry imageInfoButton imageInfoGreyButton imageInfoLink\" title=\"click to retry\">" + error + "</div>").insertAfter(positionElement).click(function() {
      $(this).text("Retrying...");
      checkLink(link);
    });
  }

  function getMediaTagHtml(mediaTags, width, height, imgSize, videoSize)
  {
    var tagHtmlItems = [];
    for (i = 0; i < mediaTags.length; i++)
    {
      var imgTag = mediaTags[i];
      if (imgTag.tag && imgTag.width == width && imgTag.height == height && (imgTag.size == imgSize || imgTag.size == videoSize))
        tagHtmlItems.push("<div class=\"imageInfoButton\" style=\"background-color: #" + imgTag.tagColor + "; color: #" + imgTag.tagTextColor + ";\"" + (imgTag.tagDetails ? " title=\"" + imgTag.tagDetails + "\"" : "") + ">" + imgTag.tag + "</div>");
    }
    return tagHtmlItems.join(" ");
  }

  function updateAlbumExpando(expandoContent, currentImage, imgurImages, slimgImages)
  {
    var mediaInfo = {};
    var imgSrc;
    var videoSrc;
    if (imgurImages)
    {
      var imgurImage = imgurImages[currentImage];
      mediaInfo = {
        mediaName: "imgur",
        pageLink: "https://imgur.com/" + imgurImage.id,
        pageLinkText: "image page",
        datetime: imgurImage.datetime * 1000,
        title: imgurImage.title,
        description: imgurImage.description,
        width: imgurImage.width,
        height: imgurImage.height,
        videoSize: imgurImage.mp4_size,
        imageSize: imgurImage.size,
        animated: imgurImage.mp4 && imgurImage.animated
      };
      if (mediaInfo.animated)
        videoSrc = imgurImage.mp4.replace("http:", "https:");
      else
      {
        imgSrc = imgurImage.link.replace("http:", "https:");
        if (settings.loadReducedImgur)
          imgSrc = imgSrc.replace(/\.(\w+)$/, "h.$1");
      }
    }
    else
    {
      var slimgImage = slimgImages[currentImage];
      imgSrc = slimgImage.url_direct;
      videoSrc = slimgImage.mp4;
      var mediaTagHtmlItems = [];
      if (tagData && tagData.mediaTags)
        mediaTagHtmlItems.push(getMediaTagHtml(tagData.mediaTags, slimgImage.width, slimgImage.height, slimgImage.size));
      if (settings.mediaTags)
        mediaTagHtmlItems.push(getMediaTagHtml(settings.mediaTags, slimgImage.width, slimgImage.height, slimgImage.size));
      mediaInfo = {
        mediaName: "slimg",
        pageLink: "https://sli.mg/" + slimgImage.media_key,
        pageLinkText: "image page",
        mediaTagHtml: mediaTagHtmlItems.filter(filterEmpty).join(" "),
        datetime: slimgImage.created * 1000,
        title: slimgImage.description,
        width: slimgImage.width,
        height: slimgImage.height,
        imageSize: slimgImage.size,
        animated: slimgImage.mp4 && slimgImage.animated
      };
    }
    expandoContent.find(".imageInfo").remove();
    var msg = expandoContent.find(".imageInfoExpandoMsg").hide().html("");
    var image = expandoContent.find(".imageInfoExpandoImage").stop();
    var video = expandoContent.find(".imageInfoExpandoVideo").stop();
    if (image.is(":visible"))
      image.fadeTo(1000, 0.4);
    if (!mediaInfo.animated && video.is(':visible'))
      video.fadeTo(200, 0.2);
    if (mediaInfo.animated)
    {
      video.attr("src", videoSrc)[0].load();
      msg.html("Loading...").show();
    }
    else
      image.attr("src", imgSrc);
    expandoContent.find(".imageInfoAlbumCurrentImage").text(currentImage + 1);
    showMediaInfo(expandoContent.parents(".entry"), expandoContent.find(".imageInfoAlbumHeader"), mediaInfo);
  }

  function showNextExpando()
  {
    if (currentExpandoList && currentExpandoList.length > 0)
      currentExpandoList.first().click();
  }

  function dequeueExpando(expando)
  {
    if (currentExpandoList)
      currentExpandoList = currentExpandoList.not(expando);
  }

  function attachExpandoEvents(entry, expando, expandoContent, isAlbum, imgSrc)
  {
    var parentElement = (isAlbum ? expandoContent : expando.parent());
    var videoElement = expandoContent.find(".imageInfoExpandoVideo");
    videoElement.on("error", function(eventObject) {
      expandoContent.find(".imageInfoExpandoMsg").html("<div class=\"imageInfoExpandoError\">Error loading video</div>").show();
      if (!isAlbum)
        showNextExpando();
      if (imgSrc)
        expandoContent.find(".imageInfoExpandoImage").attr("src", imgSrc);
    }).on("loadeddata", function() {
      var frameRateElement = parentElement.find(".imageInfo .imageInfoFrameRate");
      var durationElement = parentElement.find(".imageInfo .imageInfoDuration");
      var video = this;
      var previousExpandoTime = expandoContent.attr("data-expando-video-time");
      var waitForFrameCheck = false;
      var initTime = video.currentTime;
      var prevTime = initTime;
      var initFrame = video.mozPresentedFrames || video.webkitDecodedFrameCount || 0;
      if (frameRateElement.length > 0 && !frameRateElement.hasClass("imageInfoFrameRateAdded"))
      {
        var apiframeRate = frameRateElement.attr("data-frame-rate");
        var videoFrames = frameRateElement.attr("data-video-frames");
        var gifFrames = frameRateElement.attr("data-gif-frames");
        if (durationElement.length > 0 && (videoFrames || gifFrames))
          frameRateElement.html(getFrameRateHtml(null, null, apiframeRate, videoFrames, gifFrames, video.duration)).addClass("imageInfoFrameRateAdded");
        if (!videoFrames)
        {
          var checkCount = 0;
          if (video.seekToNextFrame && settings.accurateFrameRate)
          {
            video.pause();
            waitForFrameCheck = true;
            var prevTimeDiff = 0;
            // Advance frames until two sequential differences in video time are the same. The first differences might not be accurate due to loading/playback variability. Check at most 5 frames.
            $(video).css("opacity", 0).show().on("seeked", function() {
              if (waitForFrameCheck)
              {
                var timeDiff = (video.currentTime - prevTime).toFixed(6);
                var rateFound = timeDiff > 0 && timeDiff == prevTimeDiff;
                if (++checkCount > 5 || rateFound)
                {
                  waitForFrameCheck = false;
                  video.currentTime = settings.expandoRememberPlace && previousExpandoTime || 0;
                  if (rateFound)
                    frameRateElement.html(getFrameRateHtml(null, 1 / timeDiff, apiframeRate, videoFrames, gifFrames, video.duration)).addClass("imageInfoFrameRateAdded");
                }
                else
                {
                  prevTime = video.currentTime;
                  prevTimeDiff = timeDiff;
                  video.seekToNextFrame();
                }
              }
              else
              {
                video.play();
                $(video).off("seeked").fadeTo(10, 1);
              }
            });
            video.seekToNextFrame();
          }
          else
          {
            var prevFrame = initFrame;
            window.clearInterval(frameRateInterval[entry.id]);
            frameRateInterval[entry.id] = window.setInterval(function() {
              var framesPlayed = video.mozPresentedFrames || video.webkitDecodedFrameCount || 0;
              var currentTime = video.currentTime;
              if (++checkCount > 50 || currentTime < prevTime)
                window.clearInterval(frameRateInterval[entry.id]);
              else if (framesPlayed - prevFrame > 0)
              {
                prevFrame = framesPlayed;
                prevTime = currentTime;
                if (checkCount > 1)
                  frameRateElement.html(getFrameRateHtml((framesPlayed - initFrame) / (currentTime - initTime), null, apiframeRate, videoFrames, gifFrames, video.duration));
              }
            }, 200);
          }
        }
      }
      if (durationElement.length > 0)
        durationElement.html(getDurationHtml(video.duration));
      expandoContent.find(".imageInfoExpandoImage").hide();
      expandoContent.find(".imageInfoExpandoMsg").hide();
      if (!waitForFrameCheck)
      {
        if (settings.expandoRememberPlace && previousExpandoTime)
        {
          video.pause();
          $(video).stop().css("opacity", 0).show().on("seeked", function() {
            video.play();
            initTime = video.currentTime;
            prevTime = initTime;
            initFrame = video.mozPresentedFrames || video.webkitDecodedFrameCount || 0;
            $(video).off("seeked").fadeTo(10, 1);
          });
          video.currentTime = previousExpandoTime;
        }
        else
          $(video).stop().fadeTo(10, 1);
      }
      if (!isAlbum)
      {
        if (settings.addDurationToTitle)
        {
          var titleElement = entry.find("a.title");
          if (titleElement.length > 0 && !titleElement.hasClass("imageInfoDurationAdded") && !isNaN(video.duration))
          {
            var durationHtml = "<div class=\"imageInfoTitleDuration\"";
            if (settings.highlightLongDuration && (video.duration >= settings.gradientDurationMin || video.duration >= settings.longDuration))
              durationHtml += " style=\"background-color: #" + durationColor(video.duration) + "\"";
            durationHtml += ">[" + video.duration.toFixed(2) + "]</div>";
            titleElement.html(durationHtml + titleElement.html()).addClass("imageInfoDurationAdded");
          }
        }
        showNextExpando();
      }
    });
    if (settings.expandoClickExpandHeight)
      videoElement.on("click", function(eventObject) {
        if (!eventObject.originalEvent.originalTarget || eventObject.originalEvent.originalTarget.className == "controlsSpacer")
        {
          var maxHeight;
          if (this.clientHeight < this.videoHeight && $(this).css("max-height") != "none")
            maxHeight = "none";
          else if (this.videoHeight > settings.expandoMaxHeight)
            maxHeight = settings.expandoMaxHeight;
          if (maxHeight)
          {
            $(this).css("max-height", maxHeight);
            if (settings.expandoResizeVideoNoPause)
              eventObject.preventDefault();
          }
        }
      });
    var imageElement = expandoContent.find(".imageInfoExpandoImage");
    imageElement.on("error", function(eventObject) {
      expandoContent.find(".imageInfoExpandoMsg").html("<div class=\"imageInfoExpandoError\">Error loading image</div>").show();
      if (!isAlbum)
        showNextExpando();
    }).on("load", function() {
      expandoContent.find(".imageInfoExpandoVideo").hide();
      expandoContent.find(".imageInfoExpandoMsg").hide();
      $(this).stop().fadeTo(10, 1);
      parentElement.find(".imageInfo .imageInfoDimensions").html(getDimensionsHtml(this.naturalWidth, this.naturalHeight));
      if (!isAlbum)
        showNextExpando();
    });
    if (settings.expandoClickExpandHeight)
      imageElement.on("click", function() {
        if (this.clientHeight < this.naturalHeight && $(this).css("max-height") != "none")
          $(this).css("max-height", "none");
        else if (this.naturalHeight > settings.expandoMaxHeight)
          $(this).css("max-height", settings.expandoMaxHeight);
      });
  }

  function addAlbumExpando(entry, expando, expandoContent, imgurImages, slimgImages, title, description)
  {
    var length = imgurImages ? imgurImages.length : slimgImages.length;
    if (length > 0)
    {
      var mediaTagHtmlItems = [];
      if (slimgImages)
      {
        for (var i = 0; i < slimgImages.length; i++)
        {
          if (tagData && tagData.mediaTags)
            mediaTagHtmlItems.push(getMediaTagHtml(tagData.mediaTags, slimgImages[i].width, slimgImages[i].height, slimgImages[i].size));
          if (settings.mediaTags)
            mediaTagHtmlItems.push(getMediaTagHtml(settings.mediaTags, slimgImages[i].width, slimgImages[i].height, slimgImages[i].size));
          if (settings.highlightAnimated && slimgImages[i].animated)
            highlightLink(expandoContent, settings.albumColor);
        }
      }
      var albumCountClass = length > 99 ? " imageInfoAlbumCountDigits3" : (length > 9 ? " imageInfoAlbumCountDigits2" : "");
      var expandoHtml = mediaTagHtmlItems.filter(filterEmpty).join(" ") + "<div class=\"imageInfoAlbumHeader\"><div class=\"imageInfoAlbumControls\"><div class=\"imageInfoAlbumLeft imageInfoButton imageInfoLink\">&lt;</div><div class=\"imageInfoAlbumCurrentImage" + albumCountClass + "\">0</div> of <div class=\"imageInfoAlbumTotalImages" + albumCountClass + "\">" + length + "</div><div class=\"imageInfoAlbumRight imageInfoButton imageInfoLink\">&gt;</div></div><div class=\"imageInfoAlbumTitle\">" + (title ? linkify(title) : "(no title)");
      if (description)
        expandoHtml += "<br/>" + linkify(description);
      expandoHtml += "</div></div><div class=\"imageInfoExpandoMsg\">...</div><div class=\"imageInfoAlbumContent\"><img class=\"imageInfoExpandoImage\"";
      if (settings.expandoMaxHeight)
        expandoHtml += " style=\"max-height: " + settings.expandoMaxHeight + "px;\"";
      expandoHtml += " /><video class=\"imageInfoExpandoVideo\" autoplay=\"\" loop=\"\" ";
      if (settings.muteVideo)
        expandoHtml += "muted=\"\" ";
      expandoHtml += "controls=\"\"";
      if (settings.expandoMaxHeight)
        expandoHtml += " style=\"max-height: " + settings.expandoMaxHeight + "px;\"";
      expandoHtml += "></video></div>";
      expandoContent.html(expandoHtml);
      var previousExpandoPlace = expandoContent.attr("data-expando-album-place");
      var currentImage = settings.expandoRememberPlace && previousExpandoPlace ? previousExpandoPlace - 1 : 0;
      expandoContent.find(".imageInfoAlbumLeft").click(function() {
        currentImage--;
        if (currentImage < 0)
          currentImage = length - 1;
        expandoContent.attr("data-expando-video-time", 0);
        updateAlbumExpando(expandoContent, currentImage, imgurImages, slimgImages);
      }).on("selectstart", function() {
        return false;
      }).on("mousedown", function(eventObject) {
        eventObject.preventDefault();
        return false;
      });
      expandoContent.find(".imageInfoAlbumRight").click(function() {
        currentImage++;
        if (currentImage >= length)
          currentImage = 0;
        expandoContent.attr("data-expando-video-time", 0);
        updateAlbumExpando(expandoContent, currentImage, imgurImages, slimgImages);
      }).on("selectstart", function() {
        return false;
      }).on("mousedown", function(eventObject) {
        eventObject.preventDefault();
        return false;
      });
      attachExpandoEvents(entry, expando, expandoContent, true);
      updateAlbumExpando(expandoContent, currentImage, imgurImages, slimgImages);
    }
    else
      expandoContent.html("No images found");
    showNextExpando();
  }

  function addExpando(entry, positionElement, album, iframe, imgurAlbumItem, slimgItem, imgSrc, videoSrc, iframeSrc)
  {
    if (!album && !settings.addExpandos || album && !settings.addAlbumExpandos)
      return;
    var commentImageInfoElement = positionElement.hasClass("imageInfoComment") || positionElement.hasClass("imageInfoCommentInline") ? positionElement.find(".imageInfo") : null;
    var expando = $("<a class=\"imageInfoExpando imageInfoExpandoCollapsed imageInfoSprite imageInfoLink\"></a>");
    var expandoContent = $("<div class=\"imageInfoExpandoContent\"><div class=\"imageInfoExpandoMsg\">...</div></div>");
    if (commentImageInfoElement)
    {
      expando.insertBefore(commentImageInfoElement);
      expandoContent.insertAfter(positionElement);
    }
    else
    {
      expando.insertBefore(positionElement);
      expandoContent.insertAfter(entry.find("ul.flat-list"));
    }
    if (settings.forceHttps)
    {
      if (imgSrc)
        imgSrc = imgSrc.replace("http:", "https:");
      if (videoSrc)
        videoSrc = videoSrc.replace("http:", "https:");
    }
    if (videoSrc)
      expando.click(function() {
        if ($(this).hasClass("imageInfoExpandoCollapsed"))
        {
          dequeueExpando(expando);
          var expandoStyle = settings.expandoMaxHeight ? " style=\"max-height: " + settings.expandoMaxHeight + "px;\"" : "";
          expandoContent.append($("<video class=\"imageInfoExpandoVideo\" src=\"" + videoSrc + "\" autoplay=\"\" loop=\"\" " + (settings.muteVideo ? "muted=\"\" " : "") + "controls=\"\"" + expandoStyle + ">" + (imgSrc ? "<img class=\"imageInfoExpandoImage\"" + expandoStyle + " />" : "") + "</video>")).show();
          $(this).addClass("imageInfoExpandoExpanded").removeClass("imageInfoExpandoCollapsed");
          attachExpandoEvents(entry, expando, expandoContent, false, imgSrc);
        }
        else if ($(this).hasClass("imageInfoExpandoHoverExpanded"))
          $(this).removeClass("imageInfoExpandoHoverExpanded");
        else
        {
          expandoContent.attr("data-expando-video-time", expandoContent.find(".imageInfoExpandoVideo").prop("currentTime"));
          expandoContent.hide().html("");
          $(this).addClass("imageInfoExpandoCollapsed").removeClass("imageInfoExpandoExpanded");
        }
      });
    else if (iframe)
      expando.click(function() {
        if ($(this).hasClass("imageInfoExpandoCollapsed"))
        {
          dequeueExpando(expando);
          expandoContent.append($("<iframe src=\"" + iframeSrc + "\"></iframe>")).show();
          $(this).addClass("imageInfoExpandoExpanded").removeClass("imageInfoExpandoCollapsed");
        }
        else if ($(this).hasClass("imageInfoExpandoHoverExpanded"))
          $(this).removeClass("imageInfoExpandoHoverExpanded");
        else
        {
          expandoContent.hide().html("");
          $(this).addClass("imageInfoExpandoCollapsed").removeClass("imageInfoExpandoExpanded");
        }
      });
    else
    {
      expando.click(function() {
        if ($(this).hasClass("imageInfoExpandoCollapsed"))
        {
          dequeueExpando(expando);
          if (album)
          {
            if (imgurAlbumItem)
              addAlbumExpando(entry, expando, expandoContent, imgurAlbumItem.images, null, imgurAlbumItem.title, imgurAlbumItem.description);
            else if (slimgItem)
            {
              var slimgAlbumData = getCachedData(slimgItem.album_key + "-a");
              if (slimgAlbumData)
                addAlbumExpando(entry, expando, expandoContent, null, slimgAlbumData.media, slimgItem.description, null);
              else
              {
                if (!settings.slimgClientId)
                {
                  showNotification("Slimg client ID required. Set one in the reddit image info options, under Advanced.", 5000);
                  showNextExpando();
                }
                else
                {
                  $.ajax({
                    url: "https://api.sli.mg/album/" + slimgItem.album_key + "/media",
                    headers: { Authorization: "Client-ID " + settings.slimgClientId },
                    success: function(slimgData) {
                      var albumData = slimgData.data;
                      addAlbumExpando(entry, expando, expandoContent, null, albumData.media, slimgItem.description, null);
                      cacheData(slimgItem.album_key + "-a", albumData, settings.slimgAlbumCacheTime);
                    },
                    error: function(request, status, error) {
                      addRetryButton(entry, positionElement, request, error);
                      showNextExpando();
                    }
                  });
                }
              }
            }
            expandoContent.show();
          }
          else
          {
            expandoContent.append($("<img class=\"imageInfoExpandoImage\"" + (settings.expandoMaxHeight ? " style=\"max-height: " + settings.expandoMaxHeight + "px;\"" : "") + " src=\"" + imgSrc + "\" />")).show();
            attachExpandoEvents(entry, expando, expandoContent, false);
          }
          $(this).addClass("imageInfoExpandoExpanded").removeClass("imageInfoExpandoCollapsed");
        }
        else if ($(this).hasClass("imageInfoExpandoHoverExpanded"))
          $(this).removeClass("imageInfoExpandoHoverExpanded");
        else
        {
          expandoContent.attr("data-expando-album-place", expandoContent.find(".imageInfoAlbumCurrentImage").text());
          expandoContent.attr("data-expando-video-time", expandoContent.find(".imageInfoExpandoVideo").prop("currentTime"));
          expandoContent.hide().html("");
          $(this).addClass("imageInfoExpandoCollapsed").removeClass("imageInfoExpandoExpanded");
        }
      });
    }
    if (!album && settings.expandOnHover)
      expando.on("mouseover", function() {
        if ($(this).hasClass("imageInfoExpandoCollapsed"))
        {
          this.click();
          $(this).addClass("imageInfoExpandoHoverExpanded");
        }
      }).on("mouseout", function() {
        if ($(this).hasClass("imageInfoExpandoHoverExpanded"))
        {
          $(this).removeClass("imageInfoExpandoHoverExpanded");
          this.click();
        }
      });
    if (settings.removeNativeExpandos)
      positionElement.parent().find(".expando-button").hide().addClass("imageInfoRemoved");
    $(".imageInfoShowAll").first().text("rii show all (" + $(".imageInfoExpando").length + ")");
  }

  function processNextLink()
  {
    if (currentLinkList && currentLinkList.length > 0)
      checkLink(currentLinkList.first());
  }

  function dequeueLink(link)
  {
    if (currentLinkList)
      currentLinkList = currentLinkList.not(link);
  }

  function processLinks()
  {
    for (var i = 0; i < settings.simultaneousLinks; i++)
      processNextLink();
  }

  function showImgurInfo(entry, positionElement, href, imgurItem, isThumbnail)
  {
    if (imgurItem.error)
    {
      $("<div class=\"imageInfoButton imageInfoGreyButton\">" + imgurItem.error + "</div>").insertAfter(positionElement);
      return;
    }
    var author = imgurItem.account_url;
    var autoGallery = imgurItem.in_gallery && !author;
    var diff = new Date(entry.find("time").attr("datetime")).getTime() - imgurItem.datetime * 1000;
    var mediaTagHtmlItems = [];
    if (!positionElement.attr("href") && settings.highlightGalleryReposts && autoGallery && Math.abs(diff) > settings.galleryRepostTimeDiff * 60000)
      mediaTagHtmlItems.push("<div class=\"imageInfoButton\" style=\"background-color: #" + settings.galleryRepostColor + "; color: #" + settings.galleryRepostTextColor + ";\" title=\"it appears that this is a repost of an imgur gallery post automatically created by a different reddit post\">reposted auto gallery post</div>");
    if (settings.highlightNonGalleryWithTitle && !imgurItem.in_gallery && (imgurItem.title || imgurItem.description))
      mediaTagHtmlItems.push("<div class=\"imageInfoButton\" style=\"background-color: #" + settings.galleryRemovedColor + "; color: #" + settings.galleryRemovedTextColor + ";\" title=\"this imgur content has a title/description but is not in the imgur gallery, possibly meaning that a previous gallery post was removed from the gallery (by the user or by imgur due to spam or a rule violation), that this user is using imgur to spam, or that this is a link to an image in an album gallery post\">non-gallery post with title/desc</div>");
    if (isThumbnail && settings.highlightThumbnailVersion)
      mediaTagHtmlItems.push("<div class=\"imageInfoButton\" style=\"background-color: #" + settings.thumbnailVersionColor + "; color: #" + settings.thumbnailVersionTextColor + ";\" title=\"link uses an imgur suffix that loads a smaller version and will break animated images - see https://api.imgur.com/models/image\">thumbnail format</div>");
    if (imgurItem.images)
    {
      var images = imgurItem.images;
      for (var i = 0; i < images.length; i++)
      {
        if (tagData && tagData.mediaTags)
          mediaTagHtmlItems.push(getMediaTagHtml(tagData.mediaTags, images[i].width, images[i].height, images[i].size, images[i].mp4_size));
        if (settings.mediaTags)
          mediaTagHtmlItems.push(getMediaTagHtml(settings.mediaTags, images[i].width, images[i].height, images[i].size, images[i].mp4_size));
        if (settings.highlightAnimated && images[i].animated)
          highlightLink(entry, settings.albumColor);
      }
      positionElement = showMediaInfo(entry, positionElement, {
        mediaName: imgurItem.in_gallery ? "imgur gallery" : "imgur",
        isVideoLink: true,
        authorName: autoGallery ? "(auto)" : author,
        authorLink: author ? "https://imgur.com/user/" + author + "/submitted" : null,
        authorAltLinkName: "comments",
        authorAltLink: author ? "https://imgur.com/user/" + author : null,
        pageLink: "https://imgur.com/" + (imgurItem.in_gallery ? "gallery/" : "a/") + imgurItem.id,
        pageLinkText: "imgur " + (imgurItem.in_gallery ? "gallery" : "album") + " page",
        mediaTagHtml: mediaTagHtmlItems.filter(filterEmpty).join(" "),
        albumImageCount: images.length,
        datetime: imgurItem.datetime * 1000,
        title: imgurItem.title,
        description: imgurItem.description,
        tags: imgurItem.topic || imgurItem.section,
        rating: imgurItem.nsfw ? "NSFW" : null
      });
      addExpando(entry, positionElement, true, false, imgurItem);
    }
    else
    {
      if (tagData && tagData.mediaTags)
        mediaTagHtmlItems.push(getMediaTagHtml(tagData.mediaTags, imgurItem.width, imgurItem.height, imgurItem.size, imgurItem.mp4_size));
      if (settings.mediaTags)
        mediaTagHtmlItems.push(getMediaTagHtml(settings.mediaTags, imgurItem.width, imgurItem.height, imgurItem.size, imgurItem.mp4_size));
      if (settings.highlightAnimated && imgurItem.animated)
        highlightLink(entry, linkColor(href));
      positionElement = showMediaInfo(entry, positionElement, {
        mediaName: imgurItem.in_gallery ? "imgur gallery" : "imgur",
        isVideoLink: /\/[\d\w]{5,8}\.(mp4|webm|gifv)((#|\?).+)?$/i.test(href),
        authorName: autoGallery ? "(auto)" : author,
        authorLink: author ? "https://imgur.com/user/" + author + "/submitted" : null,
        authorAltLinkName: "comments",
        authorAltLink: author ? "https://imgur.com/user/" + author : null,
        pageLink: "https://imgur.com/" + (imgurItem.in_gallery ? "gallery/" : "") + imgurItem.id,
        pageLinkText: "imgur " + (imgurItem.in_gallery ? "gallery" : "image") + " page",
        mediaTagHtml: mediaTagHtmlItems.filter(filterEmpty).join(" "),
        width: imgurItem.width,
        height: imgurItem.height,
        videoSize: imgurItem.mp4_size,
        imageSize: imgurItem.size,
        animated: imgurItem.mp4 && imgurItem.animated,
        datetime: imgurItem.datetime * 1000,
        title: imgurItem.title,
        description: imgurItem.description,
        tags: imgurItem.topic || imgurItem.section,
        rating: imgurItem.nsfw ? "NSFW" : null
      });
      addExpando(entry, positionElement, false, false, null, null, "https://i.imgur.com/" + imgurItem.id + (settings.loadReducedImgur ? "h" : "") + ".jpg", imgurItem.animated ? "https://i.imgur.com/" + imgurItem.id + ".mp4" : null);
    }
  }

  function getImgur(imgurId, link, entry, positionElement, href, galleryFailed, isThumbnail, isAlbum)
  {
    $.ajax({
      url: "https://api.imgur.com/3/" + (isAlbum ? "album" : "image") + "/" + imgurId,
      headers: { Authorization: "Client-ID " + settings.imgurClientId },
      success: function(imgurData) {
        imgurData = imgurData.data;
        if (imgurData.in_gallery && !galleryFailed)
          getImgurGallery(imgurId, link, entry, positionElement, href, imgurData, isThumbnail, isAlbum);
        else
        {
          showImgurInfo(entry, positionElement, href, imgurData, isThumbnail);
          cacheData(imgurId, imgurData, settings.imgurPostCacheTime);
        }
        if (!galleryFailed)
          processNextLink();
      },
      error: function(request, status, error) {
        var errorData = request.responseJSON;
        if (errorData && errorData.error && errorData.error.indexOf("Unable to find an image with the id") >= 0)
        {
          showImgurInfo(entry, positionElement, href, errorData, isThumbnail);
          cacheData(imgurId, errorData, settings.imgurPostCacheTime);
        }
        else
          addRetryButton(link, positionElement, request, error);
        processNextLink();
      }
    });
  }

  function getImgurGallery(imgurId, link, entry, positionElement, href, nonGalleryImgurData, isThumbnail, isAlbum)
  {
    $.ajax({
      url: "https://api.imgur.com/3/gallery/" + imgurId,
      headers: { Authorization: "Client-ID " + settings.imgurClientId },
      success: function(imgurData) {
        imgurData = imgurData.data;
        showImgurInfo(entry, positionElement, href, imgurData, isThumbnail);
        cacheData(imgurId, imgurData, settings.imgurPostCacheTime);
        if (!nonGalleryImgurData)
          processNextLink();
      },
      error: function(request, status, error) {
        addRetryButton(link, positionElement, request, error);
        if (nonGalleryImgurData)
        {
          showImgurInfo(entry, positionElement, href, nonGalleryImgurData, isThumbnail);
          cacheData(imgurId, nonGalleryImgurData, settings.imgurPostCacheTime);
        }
        else
        {
          getImgur(imgurId, link, entry, positionElement, href, true, isThumbnail, isAlbum);
          processNextLink();
        }
      }
    });
  }

  function showGfyInfo(entry, positionElement, href, gfyItem, mediaTag)
  {
    if (gfyItem.error)
    {
      $("<div class=\"imageInfoButton imageInfoGreyButton\">" + gfyItem.error + "</div>").insertAfter(positionElement);
      return;
    }
    var minDuration = (gfyItem.numFrames / (+gfyItem.frameRate + 1)).toFixed(2);
    var maxDuration = (gfyItem.numFrames / gfyItem.frameRate).toFixed(2);
    var mediaTagHtml = "";
    if (settings.highlightThumbnailVersion && /.com\/\w+\-[\w_]+(\.\w+)?(#.*)?$/i.test(href))
      mediaTagHtml += "<div class=\"imageInfoButton\" style=\"background-color: #" + settings.thumbnailVersionColor + "; color: #" + settings.thumbnailVersionTextColor + ";\" title=\"link to a smaller size-restricted version of this gfy, or to a static thumbnail\">small/thumb version</div>";
    positionElement = showMediaInfo(entry, positionElement, {
      mediaName: "gfycat",
      isVideoLink: /.com\/\w+(\.(mp4|webm))?(#.*)?$/i.test(href),
      authorName: mediaTag ? "(GIF transcode)" : gfyItem.userName,
      authorLink: mediaTag ? "" : "https://gfycat.com/@" + gfyItem.userName,
      pageLink: "https://gfycat.com/" + gfyItem.gfyName,
      pageLinkText: "gfy page",
      mediaTagHtml: mediaTagHtml,
      source: gfyItem.url,
      minDuration: minDuration,
      maxDuration: maxDuration,
      frameRate: gfyItem.frameRate,
      videoFrames: gfyItem.numFrames,
      width: gfyItem.width,
      height: gfyItem.height,
      videoSize: gfyItem.mp4Size,
      imageSize: gfyItem.gifSize,
      animated: true,
      datetime: gfyItem.createDate * 1000,
      title: gfyItem.title,
      tags: gfyItem.tags ? gfyItem.tags.join() : null,
      rating: gfyItem.nsfw == "0" ? "Clean" : (gfyItem.nsfw == "1" ? "Adult" : (gfyItem.nsfw == "3" ? "Possibly Offensive" : null))
    });
    addExpando(entry, positionElement, false, false, null, null, null, gfyItem.mp4Url);
  }

  function gfycatAuthenticatedRequest(reqSettings)
  {
    if (reqSettings.gfycatAuthToken)
    {
      if (!reqSettings.headers)
        reqSettings.headers = {};
      reqSettings.headers.Authorization = "Bearer " + reqSettings.gfycatAuthToken;
      $.ajax({
        url: reqSettings.url,
        method: reqSettings.method,
        headers: reqSettings.headers,
        contentType: reqSettings.contentType,
        data: reqSettings.data,
        success: function(data, status, request) {
          if (reqSettings.success)
            reqSettings.success(data, status, request);
        },
        error: function(request, status, error) {
          if (reqSettings.error)
            reqSettings.error(request, status, error);
        }
      });
    }
    else
    {
      reqSettings.gfycatAuthToken = getCachedData("rii_gfycatauthtoken");
      if (reqSettings.gfycatAuthToken)
        gfycatAuthenticatedRequest(reqSettings);
      else if (!settings.gfycatClientId || !settings.gfycatClientSecret)
      {
        showNotification("Gfycat client ID and client secret required. Set them in the reddit image info options, under Advanced.", 5000);
        if (reqSettings.error)
          reqSettings.error(null, 401, "gfycat client ID/secret missing");
      }
      else
        $.ajax({
          url: "https://api.gfycat.com/v1/oauth/token",
          method: "POST",
          data: JSON.stringify({ grant_type: "client_credentials", client_id: settings.gfycatClientId, client_secret: settings.gfycatClientSecret}),
          success: function(authData) {
            reqSettings.gfycatAuthToken = authData.access_token;
            cacheData("rii_gfycatauthtoken", reqSettings.gfycatAuthToken, authData.expires_in / 60);
            gfycatAuthenticatedRequest(reqSettings);
          },
          error: function(request, status, error) {
            if (status == 401)
              showNotification("Invalid gfycat credentials.", 5000);
            if (reqSettings.error)
              reqSettings.error(request, status, error);
          }
        });
    }
  }

  function getGfycat(gfyName, link, entry, positionElement, href, mediaTag, button)
  {
    var cachedData = getCachedData(gfyName);
    if (cachedData)
    {
      showGfyInfo(entry, positionElement, href, cachedData, mediaTag);
      if (mediaTag)
      {
        button.remove();
        cacheData(mediaTag, cachedData, settings.gfycatPostCacheTime);
      }
      processNextLink();
    }
    else
      $.ajax({
        url: "https://gfycat.com/cajax/get/" + gfyName,
        success: function(gfyData) {
          if (!gfyData.error)
            gfyData = gfyData.gfyItem;
          showGfyInfo(entry, positionElement, href, gfyData, mediaTag);
          cacheData(gfyName, gfyData, settings.gfycatPostCacheTime);
          if (mediaTag)
          {
            button.remove();
            cacheData(mediaTag, gfyData, settings.gfycatPostCacheTime);
          }
          processNextLink();
        },
        error: function(request, status, error) {
          addRetryButton(link, positionElement, request, error);
          processNextLink();
        }
      });
    if (settings.highlightAnimated)
      highlightLink(entry, /gfycat\.com\/\w+((\?|#).+)?$/i.test(href) ? settings.gfyColor : linkColor(href));
  }

  function gfyFetch(link, button, entry, positionElement, href, mediaTag)
  {
    button.text("gfying...").attr("title", "").attr("style", "").off("click");
    $.ajax({
      url: "https://upload.gfycat.com/transcode?fetchUrl=" + encodeURIComponent(link.attr("href")),
      success: function(gfyData, status, request) {
        if (gfyData.gfyname)
        {
          if (link.hasClass("title"))
          {
            button.prevAll(".imageInfo").last().remove();
            button.prevAll(".imageInfoExpando").last().remove();
            entry.find(".imageInfoExpandoContent").remove();
            button.remove();
          }
          else
          {
            button.prevAll(".imageInfoComment").last().remove();
            button.prevAll(".imageInfoCommentInline").last().remove();
            button.prevAll(".imageInfoExpandoContent").last().remove();
            button.text("gfy found!").fadeOut(500);
          }
          if (gfyData.gfyId)
          {
            showGfyInfo(entry, positionElement, href, gfyData, mediaTag);
            cacheData(mediaTag, gfyData, settings.otherCacheTime);
          }
          else
          {
            button.text("loading...");
            getGfycat(gfyData.gfyname, link, entry, positionElement, href, mediaTag, button);
          }
        }
        else
        {
          if (gfyData.task == "error" && gfyData.description)
            button.text(gfyData.description).removeClass("imageInfoLink").addClass("imageInfoGreyButton");
          else
            button.text("unable to gfy").attr("title", "¯\\_(ツ)_/¯").removeClass("imageInfoLink").addClass("imageInfoGreyButton");
        }
        // else
          // gfycatAuthenticatedRequest({
            // url: "https://api.gfycat.com/v1/gfycats",
            // method: "POST",
            // contentType: "application/json",
            // data: JSON.stringify({ fetchUrl: link.attr("href") }),
            // success: function() {
            // },
            // error: function() {
            // }
          // });
      },
      error: function(request, status, error) {
        button.text(error).attr("title", "click to retry").css("background-color", "grey").click(function() {
          gfyFetch(link, button, entry, positionElement, href, mediaTag);
        });
      }
    });
  }

  function showGiphyInfo(entry, positionElement, href, giphyItem)
  {
    var img = giphyItem.images.original;
    positionElement = showMediaInfo(entry, positionElement, {
      mediaName: "giphy",
      authorName: giphyItem.userName,
      authorLink: giphyItem.user ? giphyItem.user.profile_url : null,
      authorAltLinkName: giphyItem.user && giphyItem.user.display_name || giphyItem.userName,
      authorAltLink: giphyItem.user && giphyItem.user.twitter ? "https://twitter.com/" + giphyItem.user.twitter.replace("@", "") : null,
      pageLink: giphyItem.url,
      pageLinkText: "giphy page",
      source: giphyItem.source,
      gifFrames: img.frames,
      width: img.width,
      height: img.height,
      videoSize: img.mp4_size,
      imageSize: img.size,
      animated: true,
      datetime: Date.parse(giphyItem.import_datetime + "+00:00"),
      rating: giphyItem.rating.toUpperCase()
    });
    addExpando(entry, positionElement, false, false, null, null, img.url, img.mp4.substr(-5) == "giphy" ? img.mp4 + ".mp4" : img.mp4);
  }

  function showGifsDotComInfo(entry, positionElement, href, gifytItem, gifId)
  {
    positionElement = showMediaInfo(entry, positionElement, {
      mediaName: "gifs.com",
      pageLink: "https://gifs.com/gif/" + gifId,
      pageLinkText: "gifs.com page",
      animated: true,
      source: gifytItem.sauce,
    });
    addExpando(entry, positionElement, false, false, null, null, null, gifytItem.mp4Url);
  }

  function showSlimgInfo(entry, positionElement, href, slimgItem)
  {
    if (slimgItem.album_key)
    {
      positionElement = showMediaInfo(entry, positionElement, {
        mediaName: "slimg",
        isVideoLink: true,
        authorName: slimgItem.username,
        pageLink: slimgItem.url,
        pageLinkText: "slimg album page",
        albumImageCount: slimgItem.media_count,
        datetime: slimgItem.created * 1000,
        title: slimgItem.description
      });
      addExpando(entry, positionElement, true, false, null, slimgItem);
    }
    else
    {
      if (settings.highlightAnimated && slimgItem.animated)
        highlightLink(entry, linkColor(href));
      positionElement = showMediaInfo(entry, positionElement, {
        mediaName: "slimg",
        isVideoLink: /\/[\d\w]{6}\.(mp4|webm|gifv)((#|\?).+)?$/i.test(href),
        authorName: slimgItem.username,
        pageLink: slimgItem.url,
        pageLinkText: "slimg image page",
        width: slimgItem.width,
        height: slimgItem.height,
        imageSize: slimgItem.size,
        animated: slimgItem.mp4 && slimgItem.animated,
        datetime: slimgItem.created * 1000,
        title: slimgItem.description
      });
      addExpando(entry, positionElement, false, false, null, null, slimgItem.url_direct, slimgItem.animated ? slimgItem.url_mp4 : null);
    }
  }

  function checkLink(link)
  {
    try
    {
      dequeueLink(link);
      var entry = link.parents(".entry");
      var href = link.attr("href");
      var positionElement = link.hasClass("title") ? entry.find("p.title") : link;
      var cachedData;
      var mediaTag;
      var match = href.match(/\/\/(?:(?:zippy|fat|giant|thumbs)\.)?gfycat\.com\/(?:\w+\/)?(\w+)/i);
      if (match)
        getGfycat(match[1], link, entry, positionElement, href, null, null);
      else
      {
        match = href.match(/(?:giphy\.com|gph\.is)\/(?:gifs\/|media\/)?(?:\w+\-)*(\w{12,20})/i);
        if (match)
        {
          mediaTag = match[1];
          cachedData = getCachedData(mediaTag);
          if (cachedData)
          {
            showGiphyInfo(entry, positionElement, href, cachedData, mediaTag);
            processNextLink();
          }
          else
            $.ajax({
              url: "https://api.giphy.com/v1/gifs/" + mediaTag + "?api_key=dc6zaTOxFJmzC",
              success: function(giphyData) {
                giphyData = giphyData.data;
                if (!giphyData || !giphyData.images || !giphyData.images.original)
                  $("<div class=\"imageInfoButton imageInfoGreyButton\">Error loading giphy data</div>").insertAfter(positionElement);
                else
                {
                  showGiphyInfo(entry, positionElement, href, giphyData);
                  cacheData(mediaTag, giphyData, settings.otherCacheTime);
                }
                processNextLink();
              },
              error: function(request, status, error) {
                addRetryButton(link, positionElement, request, error);
                processNextLink();
              }
            });
          if (settings.highlightAnimated)
            highlightLink(entry, linkColor(href));
        }
        else
        {
          match = href.match(/\/\/(?:j\.)?gif(?:youtube|s)\.com\/(?:(?:gif|embed)\/(?:\w+\-)*)?(\w+)/i);
          if (match)
          {
            mediaTag = match[1];
            cachedData = getCachedData(mediaTag);
            if (cachedData)
            {
              showGifsDotComInfo(entry, positionElement, href, cachedData, mediaTag);
              processNextLink();
            }
            else
              $.ajax({
                url: "https://gifs.com/api/" + mediaTag,
                success: function(gifsData) {
                  showGifsDotComInfo(entry, positionElement, href, gifsData, mediaTag);
                  cacheData(mediaTag, gifsData, settings.otherCacheTime);
                  processNextLink();
                },
                error: function(request, status, error) {
                  addRetryButton(link, positionElement, request, error);
                  processNextLink();
                }
              });
            if (settings.highlightAnimated)
              highlightLink(entry, linkColor(href));
          }
          else
          {
            match = href.match(/\/\/(?:i\.)?sli\.mg\/(a\/)?([\d\w]{6})(\.ss|\.ms)?(?=[^\d\w]|$)/i);
            if (match)
            {
              mediaTag = match[2];
              cachedData = getCachedData(mediaTag);
              if (cachedData)
              {
                showSlimgInfo(entry, positionElement, href, cachedData);
                processNextLink();
              }
              else
              {
                if (!settings.slimgClientId)
                  showNotification("Slimg client ID required. Set one in the reddit image info options, under Advanced.", 5000);
                else
                  $.ajax({
                    url: "https://api.sli.mg/" + (match[1] == "a/" ? "album/" : "media/") + mediaTag,
                    headers: { Authorization: "Client-ID " + settings.slimgClientId },
                    success: function(slimgData) {
                      slimgData = slimgData.data;
                      showSlimgInfo(entry, positionElement, href, slimgData);
                      cacheData(mediaTag, slimgData, settings.slimgPostCacheTime);
                      processNextLink();
                    },
                    error: function(request, status, error) {
                      addRetryButton(link, positionElement, request, error);
                      processNextLink();
                    }
                  });
              }
            }
            else
            {
              match = href.match(imgurIdRegex);
              if (match)
              {
                mediaTag = match[2];
                cachedData = getCachedData(mediaTag);
                if (cachedData)
                {
                  showImgurInfo(entry, positionElement, href, cachedData, match[3]);
                  processNextLink();
                }
                else
                {
                  if (!settings.imgurClientId)
                  {
                    showNotification("Imgur client ID required. Set one in the reddit image info options, under Advanced.", 5000);
                    processNextLink();
                  }
                  else
                  {
                    var isAlbum = match[1] == "a" || (mediaTag.length == 5 && match[4] != "." && match[1]);
                    if (match[1] == "gallery")
                      getImgurGallery(mediaTag, link, entry, positionElement, href, null, match[3], isAlbum);
                    else
                      getImgur(mediaTag, link, entry, positionElement, href, false, match[3], isAlbum);
                  }
                }
              }
              else
              {
                match = href.match(/(i\.reddituploads\.com\/.+|\.(webm|mp4|ogg|jpe?g|png|gif)((\?|#).+)?$)/i);
                if (match)
                {
                  if (settings.showGfyConvertButton && match[2] && match[2].toLowerCase() == "gif")
                  {
                    mediaTag = href.replace(/[^\w\d]/g, "");
                    cachedData = getCachedData(mediaTag);
                    if (cachedData)
                      showGfyInfo(entry, positionElement, href, cachedData, mediaTag);
                    else
                    {
                      var gfyButton = $("<div class=\"imageInfoGfyLink imageInfoButton imageInfoLink\" title=\"convert this GIF to a gfycat\">gfy</div>").insertAfter(positionElement).click(function() {
                        gfyFetch(link, $(this), entry, positionElement, href, mediaTag);
                      });
                      if (settings.autoConvertGfy)
                        gfyButton.click();
                    }
                  }
                  if (!cachedData)
                  {
                    var expandoPositionElement = showMediaInfo(entry, positionElement, {
                      authorName: "(no info)"
                    });
                    addExpando(entry, expandoPositionElement, false, false, null, null, !match[2] || match[2].match(/(jpe?g|png|gif)/i) ? href : null, match[2] && match[2].match(/(webm|mp4|ogg)/i) ? href : null);
                  }
                  if (settings.highlightAnimated && link.hasClass("title") && match[2] && match[2].match(/(gif|webm|mp4|ogg)/i))
                    highlightLink(entry, linkColor(href));
                }
                processNextLink();
              }
            }
          }
        }
      }
      if (isCommentPage && !currentMediaTag)
        currentMediaTag = mediaTag;
    }
    catch (error)
    {
      handleError(error);
      processNextLink();
    }
  }

  function checkComment(comment, imgurComments, depth)
  {
    var commentReposts = 0;
    var commentText = comment.text().trim();
    var commentTextStripped = commentText.replace(/[^\w\s]/g, "");
    if (commentTextStripped.length > settings.minimumCommentLength && commentText != "[deleted]")
    {
      for (var i = 0; i < imgurComments.length; i++)
      {
        var imgurComment = imgurComments[i].comment.replace(/[\u00a0\s]+/g, " ").trim();
        var imgurCommentStripped = imgurComment.replace(/[^\w\s]/g, "");
        if (commentTextStripped == imgurCommentStripped || commentTextStripped == imgurCommentStripped.replace(/imgur/g, "reddit"))
        {
          var diff = new Date(comment.parents(".entry").find("time").attr("datetime")).getTime() - imgurComments[i].datetime * 1000;
          if (diff > 0)
          {
            var id = "imageInfoCommentReport_" + comment.parent().attr("id");
            var imgurUrl = "https://imgur.com/gallery/" + imgurComments[i].image_id + "/comment/" + imgurComments[i].id + (depth > 0 ? "/" + depth : "");
            $("<a class=\"imageInfoCommentRepost imageInfoButton imageInfoRedButton\" href=\"" + imgurUrl + "\" title=\"T" + dateDiff(diff) + "\">imgur comment repost (" + (commentText == imgurComment ? "exact" : "fuzzy") + ") </a><a id=\"" + id + "\" class=\"imageInfoCommentReport imageInfoButton imageInfoGreyButton imageInfoLink\">Report</a>").insertAfter(comment);
            $("#" + id).click(function() {
              var entry = $(this).parents(".entry");
              var reportButton = entry.find("a.reportbtn");
              if (reportButton.length > 0)
              {
                reportButton[0].click();
                window.setTimeout(function() {
                  entry.find("input[value=other]").click();
                  entry.find("input[name=other_reason]").val(settings.reportReasonText + imgurUrl);
                  if (!settings.allowEditingOfReportReason)
                    entry.find(".submit-action-thing").click();
                }, 100);
              }
              else
                showNotification("Unable to report, no report button.", 2000);
            });
            commentReposts++;
          }
        }
        if (!settings.checkTopLevelCommentsOnly)
          commentReposts += checkComment(comment, imgurComments[i].children, depth + 1);
      }
    }
    return commentReposts;
  }

  function checkAllComments(imgurComments, mediaTag)
  {
    $(".imgurCommentCheck").remove();
    $("div.menuarea").append($("<a class=\"imgurCommentCheck imageInfoGreyButton imageInfoButton imageInfoLink\">checking for imgur comment reposts...</a>"));
    var commentReposts = 0;
    $(".entry .usertext-body").each(function() {
      commentReposts += checkComment($(this), imgurComments, 0);
    });
    $(".imgurCommentCheck").hide(100).remove();
    $("div.menuarea").append($("<a class=\"imgurCommentCheckResults imageInfoButton" + (commentReposts > 0 ? " imageInfoRedButton" : " imageInfoGreyButton") + " imageInfoLink\" title=\"Click to recheck\">imgur comment reposts: " + commentReposts + "</a>"));
    $(".imgurCommentCheckResults").click(function() {
      $(".imgurCommentCheckResults").remove();
      $(".imageInfoCommentRepost").remove();
      $(".imageInfoCommentReport").remove();
      var cachedData = getCachedData(mediaTag + "-c");
      if (cachedData)
        checkAllComments(cachedData, mediaTag);
      else
        loadComments(mediaTag);
    });
  }

  function loadComments(mediaTag)
  {
    try
    {
      if (!settings.imgurClientId)
        showNotification("Imgur client ID required. Set one in the reddit image info options.", 5000);
      else
      {
        $("div.menuarea").append($("<a class=\"imgurCommentCheck imageInfoButton imageInfoGreyButton imageInfoLink\">loading imgur comments...</a>"));
        $.ajax({
          url: "https://api.imgur.com/3/gallery/" + mediaTag + "/comments/",
          headers: { Authorization: "Client-ID " + settings.imgurClientId },
          success: function(imgurData) {
            var imgurComments = imgurData.data;
            checkAllComments(imgurComments, mediaTag);
            cacheData(mediaTag + "-c", imgurComments, settings.imgurCommentsCacheTime);
            $(".imgurCommentCheck").remove();
          },
          error: function(request, status, error) {
            $(".imgurCommentCheck").remove();
            $("div.menuarea").append($("<a class=\"imgurCommentCheckResults imageInfoButton imageInfoOrangeButton imageInfoLink\" title=\"Click to recheck\">" + (error == "Bad Request" ? "not in imgur gallery" : "error loading imgur comments: " + error) + "</a>"));
            $(".imgurCommentCheckResults").click(function() {
              $(".imgurCommentCheckResults").remove();
              $(".imageInfoCommentRepost").remove();
              var cachedData = getCachedData(mediaTag + "-c");
              if (cachedData)
                checkAllComments(cachedData, mediaTag);
              else
                loadComments(mediaTag);
            });
          }
        });
      }
    }
    catch (error)
    {
      handleError(error);
    }
  }

  function getTagDataHtml()
  {
    return "tag data v" + (tagData ? tagData.tagVersion : "<none>") + " updated " + (tagDataUpdateTime ? "<div title=\"" + new Date(tagDataUpdateTime).toString() + "\">T" + dateDiff(Date.now() - tagDataUpdateTime) + "</div>" : "never");
  }

  function setTagData(cacheTagData)
  {
    if (cacheTagData)
    {
      tagData = cacheTagData.tagData;
      tagDataUpdateTime = cacheTagData.updateTime;
      descriptionHighlight = tagData.descriptionHighlight || [];
    }
    else
      descriptionHighlight = [];
    if (settings.descriptionHighlight)
      descriptionHighlight = descriptionHighlight.concat(settings.descriptionHighlight);
  }

  function updateTagData(forceUpdate)
  {
    var cacheTagData = getCachedData("rii_tagdata");
    setTagData(cacheTagData);
    if (forceUpdate || !cacheTagData || Date.now() - cacheTagData.updateTime > 2 * 24 * 60 * 60 * 1000)
    {
      $(".imageInfoSettingsTagDataInfoVersion").fadeTo(400, 0.4);
      $.ajax({
        url: "https://absurdlyobfuscated.com/reddit/reddit_image_info.2.tags.json",
        cache: false,
        success: function(data, status, request) {
          // TODO: cache Last-Modified
          cacheTagData = { updateTime: Date.now(), tagData: data };
          cacheData("rii_tagdata", cacheTagData);
          setTagData(cacheTagData);
          $(".imageInfoSettingsTagDataInfoVersion").stop().html(getTagDataHtml()).fadeTo(200, 1);
          $(".imageInfoSettingsTagDataUpdate").fadeOut(200);
        }
      });
    }
  }

  function reset()
  {
    var intervalId;
    for (intervalId in selfPostInterval)
      window.clearInterval(selfPostInterval[intervalId]);
    selfPostInterval = {};
    for (intervalId in frameRateInterval)
      window.clearInterval(frameRateInterval[intervalId]);
    frameRateInterval = {};
    $(".expando-button.selftext.collapsed").off("click");
    $(".imgurCommentCheck").remove();
    $(".imgurCommentCheckResults").remove();
    $(".imageInfoSettingsButton").parent().remove();
    $(".imageInfoSettings").remove();
    $(".imageInfoShowAll").parent().remove();
    $(".imageInfo").remove();
    $(".imageInfoExpando").remove();
    $(".imageInfoExpandoContent").remove();
    $(".imageInfoTitleDuration").remove();
    $(".imageInfoCommentRepost").remove();
    $(".imageInfoCommentReport").remove();
    $(".imageInfoGfyLink").remove();
    $("a.title").removeClass("imageInfoDurationAdded");
    $(".expando-button.imageInfoRemoved").show().removeClass("imageInfoRemoved");
  }

  function init()
  {
    // Settings
    settings = getCachedData("rii_settings");
    if (!settings || !settings.version || settings.version < settingMetaData.version)
    {
      settings = getDefaultSettings(settingMetaData, settings);
      GM_deleteValue("rii_tagdata");
      cleanCache(true);
      cacheData("rii_settings", settings);
    }

    // Tag data
    updateTagData(false);

    // Settings menu
    $("#header-bottom-right").find("ul").append($("<li><a class=\"imageInfoSettingsButton imageInfoLink imageInfoButton\" title=\"reddit image info settings\">rii</a></li>"));
    $(".imageInfoSettingsButton").click(function() {
      $(".imageInfoSettings").remove();
      var events = [];
      var settingsHtml = "<div class=\"imageInfoSettings imageInfoButton\"><b>reddit image info settings</b><div class=\"imageInfoSettingsClose imageInfoButton imageInfoLink\">X</div><div class=\"imageInfoSettingsContent\"><div class=\"imageInfoSettingsTagDataInfo\"><div class=\"imageInfoSettingsTagDataInfoVersion\">" + getTagDataHtml() + "</div><div class=\"imageInfoSettingsTagDataUpdate imageInfoLink imageInfoButton\">update now</div></div><a class=\"imageInfoFeedback imageInfoButton\" target=\"_blank\" href=\"/message/compose/?to=absurdlyobfuscated&subject=" + encodeURIComponent("Reddit image info feedback") + "&message=" + encodeURIComponent("Here's what I think about your reddit image info script (v" + settingMetaData.version + "): \n\nThings you should fix or improve: \n\nIdeas for new features: ") + "\">send feedback</a>";
      settingsHtml += settingHtml("object", "imageInfoSetting", settingMetaData, settings, null, events);
      settingsHtml += "</div><input type=\"button\" class=\"imageInfoSettingSave\" value=\"Save\" /><input type=\"button\" class=\"imageInfoSettingReset\" value=\"Reset\" /><input type=\"button\" class=\"imageInfoSettingCache\" value=\"Clear Cache\" />";
      if (currentMediaTag)
        settingsHtml += "<input type=\"button\" class=\"imageInfoSettingCacheCurrent\" value=\"Clear Current Page Cache\" />";
      settingsHtml += "</div>";
      $("body").append($(settingsHtml));
      $("#imageInfoSetting .imageInfoSettingGroupTitle").click(function() {
        $(this).parent().toggleClass("imageInfoSettingGroupCollapsed");
      });
      attachEvents(events);
      $(".imageInfoSettingSave").click(function() {
        try
        {
          settings = readSetting("object", "imageInfoSetting", settingMetaData, null, null);
          cacheData("rii_settings", settings);
          $(".imageInfoSettings").remove();
          showNotification("Settings saved, page updated.", 2000);
          reset();
          init();
        }
        catch (error)
        {
          if (error.message != "invalid")
            handleError(error);
        }
      });
      $(".imageInfoSettingsClose").click(function() {
        $(".imageInfoSettings").remove();
      });
      $(".imageInfoSettingReset").click(function() {
        var diffText = settingDiffText("", settingMetaData, settings);
        if (!diffText)
          showNotification("All settings have their default values.", 2000);
        else if (confirm("Reset all reddit image info settings?\n\nYou have modified these settings:\n\n" + diffText))
        {
          settings = getDefaultSettings(settingMetaData);
          cacheData("rii_settings", settings);
          $(".imageInfoSettings").remove();
          showNotification("Settings reset, page updated.", 2000);
          reset();
          init();
        }
      });
      $(".imageInfoSettingCache").click(function() {
        cleanCache(true);
        showNotification("Cache cleared", 2000);
      });
      $(".imageInfoSettingCacheCurrent").click(function() {
        GM_deleteValue(currentMediaTag);
        GM_deleteValue(currentMediaTag + "-a");
        GM_deleteValue(currentMediaTag + "-c");
        showNotification("Cache for current page cleared", 2000);
      });
      $(".imageInfoSettingsTagDataUpdate").click(function() {
        $(this).text("updating...").off("click");
        updateTagData(true);
      });
    });

    // Cache cleanup
    window.setTimeout(function() {
      cleanCache(false);
    }, 30000);

    // Show all button
    $("<li><a class=\"choice imageInfoShowAll imageInfoLink\">rii show all (0)</a></li><li><a class=\"choice imageInfoShowAll imageInfoShowAllHide imageInfoLink\">rii hide all</a></li>").insertAfter($("#header ul.tabmenu li").last());
    $(".imageInfoShowAll").click(function() {
      if ($(".imageInfoShowAllHide").is(":visible"))
      {
        currentExpandoList = null;
        $(".imageInfoExpandoExpanded").each(function() {
          this.click();
        });
      }
      else
      {
        currentExpandoList = $(".imageInfoExpandoCollapsed");
        for (var i = 0; i < settings.simultaneousExpandos; i++)
          showNextExpando();
      }
      $(".imageInfoShowAll").toggle();
    });

    // Post & comment image info
    currentLinkList = $(".thing.link:not(.self) a.title");
    if (settings.addCommentExpandos)
    {
      currentLinkList = currentLinkList.add($(".entry .usertext-body a"));
      $(".expando-button.selftext.collapsed").click(function() {
        if ($(this).hasClass("collapsed"))
        {
          var entry = $(this).parents(".entry");
          window.clearInterval(selfPostInterval[entry.id]);
          selfPostInterval[entry.id] = window.setInterval(function(entry) {
            if (!entry.find(".expando").hasClass("expando-uninitialized"))
            {
              window.clearInterval(selfPostInterval[entry.id]);
              currentLinkList = currentLinkList.add(entry.find(".usertext-body a"));
              processLinks();
            }
          }, 10, entry);
        }
      });
    }
    processLinks();

    // Comment reposts
    if (settings.highlightImgurCommentReposts && isCommentPage)
    {
      var match = $(".entry a.title").attr("href").match(imgurIdRegex);
      if (match)
      {
        var mediaTag = match[2];
        cachedData = getCachedData(mediaTag + "-c");
        if (cachedData)
          checkAllComments(cachedData, mediaTag);
        else
        {
          if (settings.loadImgurCommentsAutomatically)
            window.setTimeout(function() {
              loadComments(mediaTag);
            }, 100);
          else
          {
            $("div.menuarea").append($("<a class=\"imgurCommentCheck imageInfoButton imageInfoGreyButton imageInfoLink\">check for imgur comment reposts</a>"));
            $(".imgurCommentCheck").click(function() {
              $(".imgurCommentCheck").remove();
              loadComments(mediaTag);
            });
          }
        }
      }
    }
  }

  init();
}

window.setTimeout(main, 10);
