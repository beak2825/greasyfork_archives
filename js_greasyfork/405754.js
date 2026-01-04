// ==UserScript==
// @name        Better pornolab.net posts
// @namespace   Violentmonkey Scripts
// @match       *://pornolab.net/forum/viewtopic.php
// @grant       none
// @version     2.4.1
// @author      -
// @description Make download link easier to find and click, add a textarea with the torrent title to easily edit a copy, torrent title gets cleaned up (removal of redundant websites, useless tags, characters not allowed in file names, sort performers), add a link you can tab into from the textarea to quickly download the torrent. 2022-02-05 05:39:47
// @run-at document-idle
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/405754/Better%20pornolabnet%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/405754/Better%20pornolabnet%20posts.meta.js
// ==/UserScript==


// this.$ = this.jQuery = jQuery.noConflict(true) // disabled because it prevented uncollapsing collapsed posts
$("div#tor-reged").ready(function () {
  
  // make download link easier to find and click
  $("div#tor-reged a.dl-stub.dl-link").prepend("Download | ")
  $("div#tor-reged p").has("a.dl-stub").has("img").css("width", "100%").css("display", "block")
  $("div#tor-reged a.dl-stub").has("img").css("width", "100%").css("display", "block")
  $("div#tor-reged a.dl-stub img").css("width", "10em").css("height", "10em").css("image-rendering", "-moz-crisp-edges").css("border", "0.5em solid black").css("border-radius", "1em")
  
  // uncollapse spoilers - shows all the images
  $("div.sp-open-all.sp-open-collapsed")[0].click()
  
  // Try the following to stop smoothing in your browser:
  // image-rendering: optimizeSpeed;             /* STOP SMOOTHING, GIVE ME SPEED  */
  // image-rendering: -moz-crisp-edges;          /* Firefox                        */
  // image-rendering: -o-crisp-edges;            /* Opera                          */
  // image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
  // image-rendering: pixelated;                 /* Chrome */
  // image-rendering: optimize-contrast;         /* CSS3 Proposed                  */
  // -ms-interpolation-mode: nearest-neighbor;   /* IE8+                           */
  
  var title = $("h1.maintitle a").text()
  // $("h1.maintitle a").remove()
  
  function s(text, regex, replacement) {
    return text.replace(regex, replacement)
  }
  
  title = s(title, / \/ /g, ' ') // Remove slashes, not allowed in file names. Replace with spaces
  title = s(title, /\/ /g, ' ') // Remove slashes, not allowed in file names. Replace with spaces
  title = s(title, / \//g, ' ') // Remove slashes, not allowed in file names. Replace with spaces
  title = s(title, / \| /g, ' ') // Remove pipes. Replace with spaces
  title = s(title, / г\./g, '') // Russian cyrillic shorthand for the word "year"
  title = s(title, /(19[7-9][0-9])\./g, '$1') // Dot put in Russian after the year. We don't cate about scenes from before 1970...
  title = s(title, /(20[0-9][0-9])\./g, '$1') // Dot put in Russian after the year
  title = s(title, /´|`|‘|’/g, "'") // Replace unicode apostrophes with ascii apostrophe
  title = s(title, /\?/g, "？") // Replace questionmark (illegal in file names) with Unicode full-width question mark (legal in file names)
  title = s(title, /,([^ ])/g, ", $1") // Make sure there's a space after every comma
  title = s(title, /\)\[/g, ") [") // Add spaces between brackets and parentheses
  title = s(title, /\]\(/g, "] (") // Add spaces between brackets and parentheses (note the backslash before the right square bracket ] is unnecessary)
  title = s(title, /\]\[/g, "] [") // Add spaces between brackets and parentheses (note the backslash before the right square bracket ] is unnecessary)
  title = s(title, /\)\(/g, ") (") // Add spaces between brackets and parentheses
  title = s(title, /\] +\[/g, ", ") // Merge contiguous brackets separated by any amount of spaces
  
  // check for split scenes tag
  split_scenes = false
  matches_split_scenes = title.match(/\(Split Scenes\)/i)
  if (matches_split_scenes !== null) {
    split_scenes = true
    title = s(title, /\(Split Scenes\)/i, " ")
  }
  title = s(title, /\) \(/g, ", ") // Merge contiguous parentheses separated by any amount of spaces
  title = s(title, / +/g, " ") // Merge contiguous spaces
  
  
  
  
  
  // Fix dates
  
  // Fix dates: dashes to periods
  title = s(title, /(\d\d)-(\d\d)-(\d\d)/, function fix_dashes(all, one, two, three) {
    return one + "." + two + "." + three
  })

  // Find a four-digit year
  year = null
  year_short = null
  matches = title.match(/[^\d\.](20(\d\d))[^\d\.]/)
  if (matches !== null) {
    year = matches[1]
    year_short = matches[2]
  }
  
  function make_year_regex(year_str, surroundings) {
    if (surroundings === undefined) {
      surroundings = true
    }
    year_regex_year_at_end   = "(\\d\\d)\\.(\\d\\d)\\." + year_str
    if (surroundings == true) {
      year_regex_year_at_end = "(^|[^\\d])" + year_regex_year_at_end + "($|[^\\d])"
    } else {
      year_regex_year_at_end = "()" + year_regex_year_at_end + "()" // keep the same amount of groups to make using the matches array easier
    }
    year_regex_year_at_start = year_str + "\\.(\\d\\d)\\.(\\d\\d)"
    if (surroundings == true) {
      year_regex_year_at_start = "(^|[^\\d])" + year_regex_year_at_start + "($|[^\\d])"
    } else {
      year_regex_year_at_start = "()" + year_regex_year_at_start + "()" // keep the same amount of groups to make using the matches array easier
    }
    // we want to prefer matches where the year is at the end, because that's the more common format
    year_regex = new RegExp(year_regex_year_at_end + "|" + year_regex_year_at_start)
    return year_regex
  }
  
  date_full = null
  if ((year !== null ) && (year_short !== null)) {
    // Keep old title value to check if anything changed when we lengthened the year
    old_title = (' ' + title).slice(1) // create copy
    
    // Upgrade two-digit years to four-digit years
    year_regex_short = make_year_regex(year_short)
    // note that either the first or second capture group will be == undefined
    title = s(title, year_regex_short, function upgrade_short_year(match_all, match_year_at_end_prefix, match_year_at_end_1, match_year_at_end_2, match_year_at_end_suffix, match_year_at_start_prefix, match_year_at_start_1, match_year_at_start_2, match_year_at_start_suffix) {
      if(match_year_at_end_1 && match_year_at_end_2) {
        return (match_year_at_end_prefix + match_year_at_end_1 + "." + match_year_at_end_2 + "." + year + match_year_at_end_suffix)
      }
      if(match_year_at_start_1 && match_year_at_start_2) {
        return (match_year_at_start_prefix + year + "." + match_year_at_start_1 + "." + match_year_at_start_2 + match_year_at_start_suffix)
      }
      return match_all
    })
    
    year_regex = make_year_regex(year)
    matches = title.match(year_regex)
    if (matches !== null) {
      date_with_surroundings = matches[0]
      matches2 = date_with_surroundings.match(make_year_regex(year, false))
      if(matches2 !== null) {
        date_full = matches2[0]
      }
      // Get rid of the year-only tag
      year_tag_regex = new RegExp("([^\\d])" + year + ", ")
      title = s(title, year_tag_regex, function get_rid_of_long_year_tag(match_all, match_prefix) {
        return match_prefix
      })
    }
  }
  
  if(date_full !== null) {
    // check for RD tag
    title = s(title, new RegExp("RD(:|) +" + date_full, 'g'), '')
    // check for the date alone
    // title = s(title, new RegExp(date_full, 'g'), '')
  }
  
  date_in_title = false
  // Fix stuff of the form [Foo.com] Performer - Title [Date, tag1, tag2, ...]
  // to look like [Foo.com] Performer (Title Date) [tag1, tag2, ...]
  matches = title.match(/(\[[^\]]+\] [^\[]+) - ([^\[]+) \[(\d\d\d\d\.\d\d\.\d\d|\d\d\.\d\d\.\d\d\d\d|\d\d\.\d\d\.\d\d), (.*)/)
  if (matches !== null) {
    title = matches[1] + " (" + matches[2] + " " + matches[3] + ") [" + matches[4]
    date_in_title = true
  }
  
  // Fix stuff of the form [Foo.com] Performer - Title (Date) [tag1, tag2, ...]
  // to look like [Foo.com] Performer (Title Date) [tag1, tag2, ...]
  matches = title.match(/(\[[^\]]+\] [^\[]+) - ([^\[]+) \((\d\d\d\d\.\d\d\.\d\d|\d\d\.\d\d\.\d\d\d\d|\d\d\.\d\d\.\d\d)\) \[(.*)/)
  if (matches !== null) {
    title = matches[1] + " (" + matches[2] + " " + matches[3] + ") [" + matches[4]
    date_in_title = true
  }
  
  // Parse out parts of torrent's title
  matches = title.match(/(?:\[([^\]]+)\] |)([^\[]+) \[(.*)\](.*)/)
  if (matches !== null) {
    match_websites = matches[1]
    if (match_websites === undefined) { // this happens when the torrent doesn't start with [Foo.com, Bar.com]
      match_websites = ""
    }
    match_tags = matches[3]
    match_rest = matches[4]
    
    matches2 = match_rest.match(/\(([^)]*,[^)]*)\)/) // match performers: parentheses () inside which there is at least one performer, then a comma, then at least one performer.
    match_performers = null
    match_performer_scene = null
    match_title_multiple_performers = null
    multiscene = false
    if (matches2 !== null) {
      match_performers_str = matches2[1]
      match_title_multiple_performers = matches[2]
      multiscene = true
    } else {
      match_performer_scene = matches[2]
    }
    
    if(match_websites !== "") {
      websites = match_websites.split(" ")
    } else {
      websites = []
    }


    // Canonicize websites (eg add .com)
    website_full_domains = {
      "SisLovesMe": "SisLovesMe.com",
      "TeamSkeet": "TeamSkeet.com",
      "IKnowThatGirl": "IKnowThatGirl.com",
    }

    function l(str) {
      return str.toLocaleLowerCase()
    }

    websites = websites.map(function canonicize_websites_1(website) {
      Object.keys(website_full_domains).map(function canonicize_websites_2(key) {
        if (l(key) == l(website)) {
          website = website_full_domains[key]
        }
      })
      return website
    })

    // Capitalize websites. capitalize() is used on a single name that might be intercalated with spaces, like "foo bar" => "Foo Bar". You have to map() to use this on an Array of names.

    // note: capitalize() is used for websites and also used later in tag processing
    function capitalize(s) {
      const arr = s.split(" ")
      const arr2 = arr.map(function capitalize1(word) {
        if(((word.toLocaleUpperCase() === word) && (word.length > 4)) || (word.toLocaleLowerCase() === word)) {
          // word is all caps and long, or all lower case, fix it
          return word.substring(0, 1).toLocaleUpperCase() + l(word.substring(1))
        }
        return word
      })
      return arr2.join(" ")
    }

    website_special_capitalization = [
      "SisLovesMe.com",
      "TeamSkeet.com",
      "IKnowThatGirl.com",
    ]

    websites = websites.map(function capitalize_websites(website) {
      chunks = website.split(".")
      main = capitalize(chunks[0])
      chunks[0] = main
      website = chunks.join(".")
      website_special_capitalization.map(function capitalize_websites_special(special) {
        if (l(special) == l(website)) {
          website = special
        }
      })
      return website
    })

    websites_redundant = websites.slice(0) // Don't change this, used by tags code later

    // Remove redundant websites
    website_redundancies = {
      "SisLovesMe.com": ["TeamSkeet.com"],
      "IKnowThatGirl.com": ["Mofos.com"],
    }

    website_redundancies_found = []
    websites.map(function remove_redundant_websites_1(website) {
      Object.keys(website_redundancies).map(function remove_redundant_websites_2(key) {
        if (l(key) == l(website)) {
          website_redundancies_found = website_redundancies_found.concat(website_redundancies[key])
        }
      })
    })

    website_redundancies_found = website_redundancies_found.map(x => l(x))
    websites = websites.filter(function remove_found_website_redundancies(website) {
      return ! website_redundancies_found.includes(l(website))
    })

    // Remove duplicate websites

    // note: deduplicate_list() is also used for tags, below.
    function deduplicate_list(list) {
      list2 = []
      list.map(function deduplicate_list_inner(element) {
        if (! list2.includes(element)) {
          list2.push(element)
        }
      })
      return list2
    }
    websites = deduplicate_list(websites)

    // Get rid of shitty tags
    const shitty_tags = [
      "1 On 1",
      "69",
      "All Sex",
      "Amateur",
      "Barefoot",
      "Bare Foot",
      "BBW",
      "Bedroom",
      "Bikini",
      "Blowjob",
      "Blow Job",
      "Boy Girl",
      "Bralette",
      "Camel Toe",
      "Casual Wear",
      "Caucasian",
      "Cinematic - Story",
      "Couch",
      "Cowgirl",
      "Crop Top",
      "Cum In Hair",
      "Cum In Mouth",
      "Cum on Ass",
      "Cum on Asshole",
      "Cum on Back",
      "Cum on Face",
      "Cum on Pussy",
      "Cum on Stomach",
      "Cum on Tits",
      "Cum Shot",
      "Cumshot Facial",
      "Cumshot",
      "Curvy",
      "Cute Little Butts",
      "Deep Throat",
      "Deepthroat",
      "Dick Play",
      "Dildo",
      "Disgusted Parenting",
      "Doggy",
      "Doggystyle",
      "Dress",
      "Facial",
      "Fetish",
      "Fingering",
      "Fingering (ass)",
      "Fingering (asshole)",
      "Fingering (pussy)",
      "Hand Job",
      "HandJob",
      "Hardcore",
      "Indoor",
      "Innie",
      "Innie Pussy",
      "Interracial",
      "Jeans",
      "Lingerie",
      "Living Room",
      "Masturbation",
      "Mature",
      "Medium Ass",
      "Medium Tits",
      "Mini Skirt",
      "Missionary",
      "Natural Tits",
      "Outie",
      "Outie Pussy",
      "Panties",
      "Piercings",
      "Pussy Licking",
      "Reality",
      "Reverse Cowgirl",
      "Roleplay",
      "Shaved Pussy",
      "Step Brother",
      "Step Bro",
      "Step Dad",
      "Step Father",
      "Swallow Cum",
      "Squirt",
      "Tank Top",
      "Tattoo",
      "Thick Top",
      "Thong",
      "Tit Play",
      "Trimmed Pussy",
      "Underwear",
      "Vibrator",
      "Wild",
      "White",
    ].map(s => l(s))

    match_tags = s(match_tags, /,([^\ \]])/g, function fix_tag_commas(all, suffix) {
      return ", " + suffix
    })

    tags = match_tags.split(", ")
    tags = tags.filter(function remove_shitty_tags(tag) {
      return ! shitty_tags.includes(l(tag))
    })

    // Make lower-case tags capitalized
    tags = tags.map(t => capitalize(t)) // yes, I capitalize later when desynonymizing, so what.

    // Desynonymize tags  
    const tag_synonyms = {
      "18+ Teens": "Teens",
      "18+Teens": "Teens",
      "Analingus": "Rimjob",
      "Ass Fuck": "Anal",
      "Ass Fucking": "Anal",
      "Ass Lick": "Rimjob",
      "Ass Licking": "Rimjob",
      "Asslicking": "Rimjob",
      "Family Roleplay": "Family",
      "HD Rip": "HDRip",
      "HD-Rip": "HDRip",
      "Legal Teen": "Teen",
      "Legal Teens": "Teens",
      "Rim Job": "Rimjob",
      "Rimming": "Rimjob",
      "Rimjobs": "Rimjob",
      "Red Head": "Redhead",
      "Stepsis": "Sister",
      "Stepsister": "Sister",
      "Step Sis": "Sister",
      "Step Sister": "Sister",
      "Stepmom": "Mom",
      "Stepmother": "Mom",
      "Step Mom": "Mom",
      "Step Mother": "Mom",
      "WEB DL": "Web-DL",
      "WEB-DL": "Web-DL",
    }
    tags = tags.map(function desynonymize_tags(tag) {
      cap_tag = capitalize(tag)
      if (tag_synonyms.hasOwnProperty(cap_tag)) {
        return tag_synonyms[cap_tag]
      }
      return cap_tag
    })

    // Fix capitalization of some tags
    tag_special_cap = [
      "4K",
      "5K",
      "6K",
      "7K",
      "8K",
      "9K",
      "10K",
      "CFNM",
      "DAP",
      "DP",
      "DVDA",
      "FFM",
      "FMM",
      "FFMM",
      "FFFM",
      "FFFFM",
      "FFFFFM",
      "FFFFFFM",
      "HDRip",
      "MILF",
      "MILFs",
      "POV",
      "VR",
      "Web-DL",
    ]

    tags = tags.map(function special_tag_capitalization(tag) {
      for (var i = 0; i < tag_special_cap.length; i++) {
        if (l(tag_special_cap[i]) == l(tag)) {
          return tag_special_cap[i]
        }
      }
      return tag
    })

    // Add tags based on other tags
    const tag_additions = {
      "Sister": ["Incest", "Family", "Taboo"],
      "Mom": ["Incest", "Family", "Taboo"],
      "Mother": ["Incest", "Family", "Taboo"],
      "Family": ["Incest", "Family", "Taboo"],
      "Incest": ["Incest", "Family", "Taboo"],
      "4K": ["2160p"],
      "2160p": ["4K"],
      "FFM": ["Threesome"],
      "FMM": ["Threesome"],
      "Stockings": ["Lingerie"],
    }
    tags_temp = tags.slice(0) // Shallow copy

    tags_temp.map(function add_tags_1(tag) {
      if (tag_additions.hasOwnProperty(tag)) {
        tag_additions[tag].map(function add_tags_2(addition) {
          if (!tags.includes(addition)) {
            tags.push(addition)
          }
        })
      }
    })

    // Add tags based on websites
    const tag_website_additions = {
      "SisLovesMe.com": ["Sister", "Incest", "Family", "Taboo", "POV"],
    }
    websites_redundant.map(function add_tags_website_1(website) {
      if (tag_website_additions.hasOwnProperty(website)) {
        tag_website_additions[website].map(function add_tags_website_2(addition) {
          if (!tags.includes(addition)) {
            tags.push(addition)
          }
        })
      }
    })
    
    // Sort preferred performers first based on order of preference
    
    const performer_preference = ["Jennifer White", "Karlee Grey", "Alexa Nova"]
    
    if (multiscene == true) {
      new_performers_preferred = []
      new_performers_other = []
      match_performers_split = match_performers_str.split(", ")
      // find all preferred performers in the performer list
      performer_preference.map(function sort_performers_preferred(performer) {
        if(match_performers_split.includes(performer)) {
          new_performers_preferred.push(performer)
        }
      })
      // add all performers that are not preferred to the "other" list
      match_performers_split.map(function sort_performers_other(performer) {
        if(! performer_preference.includes(performer)) {
          new_performers_other.push(performer)
        }
      })
      match_performers = [].concat(new_performers_preferred, new_performers_other)
      match_performers = match_performers.map(p => capitalize(p)) // capitalize performer names
    }
    
    
    
    // Add tags based on performers
    const tag_performer_additions = {
      "Alexa Nova": ["Redhead", "Brunette", "Skinny", "Teen", "Tiny Tits", "Lookalike"],
      "Karlee Grey": ["Black Hair", "Latina", "Big Naturals", "Hairy"],
    }
    Object.keys(tag_performer_additions).map(function add_tags_performer_1(performer) {
      if (((multiscene == false) && match_performer_scene.includes(performer)) || ((multiscene == true) && match_performers.includes(performer))) {
        tag_performer_additions[performer].map(function add_tags_performer_2(addition) {
          if (!tags.includes(addition)) {
            tags.push(addition)
          }
        })
      }
    })

    // Deduplicate tags
    tags = deduplicate_list(tags)
    
    // Check tags for a year if no other year was found
    if (date_full == null) {
      tags = tags.filter(function extract_year_from_tags(tag) {
        if(/^(20\d\d|19[7-9]\d)$/.test(tag)) {
          date_full = tag
          return false
        }
        return true
      })
    }

    tag_order_start = [
      "Blonde",
      "Redhead",
      "Black Hair",
      "Brunette",
      "Latina",
      "Asian",
      "Black",
      "Ebony",
      "Skinny",
      "Petite",
      "Tiny",
      "Abs",
      "Tiny Tits",
      "Big Naturals",
      "Natural Tits",
      "Big Tits",
      "Fake Tits",
      "Big Ass",
      "Nice Ass",
      "Teen",
      "Teens",
      "Babe",
      "MILF",
      "MILFs",
      "Sister",
      "Mother",
      "Incest",
      "Family",
      "Taboo",
      "Rimjob",
      "Lookalike",
    ]
    tags_start = []
    tags_rest_1 = []
    tag_order_start.map(function split_tags_to_start_and_rest_1(start_tag) {
      if (tags.includes(start_tag)) {
        tags_start.push(start_tag)
      }
      return start_tag
    })
    tags.map(function split_tags_to_start_and_rest_2(tag) {
      if (!tags_start.includes(tag)) {
        tags_rest_1.push(tag)
      }
      return tag
    })

    tag_order_end = [
      "Throatpie",
      "Creampie",
      "POV",
      "HDRip",
      "Web-DL",
      "4K",
      "5K",
      "6K",
      "7K",
      "8K",
      "9K",
      "10K",
      "480p",
      "540p",
      "720p",
      "1080p",
      "2160p",
      "VR",
    ]
    tags_end = []
    tags_rest_2 = []
    tag_order_end.map(function split_tags_to_end_and_rest_1(end_tag) {
      if (tags_rest_1.includes(end_tag)) {
        tags_end.push(end_tag)
      }
      return end_tag
    })
    tags_rest_1.map(function split_tags_to_end_and_rest_2(tag) {
      if (!tags_end.includes(tag)) {
        tags_rest_2.push(tag)
      }
      return tag
    })

    tags = [].concat(tags_start, tags_rest_2, tags_end)

    // Reconstruct title from parts
    need_date = (date_full !== null) && (date_in_title == false)
    date_full_part = ""
    if (need_date)  {
      date_full_part = " " + date_full
    }
    if (multiscene == false) {
      if (need_date) {
        matches = match_performer_scene.match(/\)/)
        if(matches !== null) {
          match_performer_scene = s(match_performer_scene, /\)/, date_full_part + ")")
        } else {
          match_performer_scene = match_performer_scene + " (" + date_full + ")"
        }
      }
      title = match_performer_scene + " [" + tags.join(", ") + "]"
    } else {
      match_performers_str = match_performers.join(", ")
      title = match_performers_str + " (" + match_title_multiple_performers + date_full_part + ") [" + tags.join(", ") + "]"
      if (split_scenes) {
        title = title + " (Split Scenes)"
      }
    }
    if (websites.length > 0) {
      title = "[" + websites.join(" ") + "] " + title
    }
  }
  
  // Get download link
  var dl = $("div#tor-reged a.dl-stub.dl-link").attr("href")
  
  // Add title near download link to edit and copy conveniently, and a download link to tab into
  $("div#tor-reged").prepend("<div id='better-plab-dl'><p><form><textarea style='font-size: 130%; width: calc(100% - 1em); padding: 0.5em' autocorrect='off' autocomplete='off' autocapitalize='off' spellcheck='false'>" + title + "</textarea></form></p><br/><br/><br/><br/><p><a href='" + dl + "' class='dl-stub dl-link' style='width: 100%; text-align: center; font-size: 7em'>Download Torrent File</a></p><br/><br/><br/><br/></div>")
})