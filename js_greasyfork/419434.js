// ==UserScript==
// @name         NexusPHPSync
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Bring torrents from one NexusPHP instance to another
// @author       joey
// @include         http*://lemonhd.org/details_doc.php*
// @include         http*://lemonhd.org/details_movie.php*
// @include         http*://lemonhd.org/details_tv.php*
// @include         http*://lemonhd.org/details_animate.php*
// @include         http*://chdbits.co/details.php*
// @include         http*://www.haidan.video/details.php*
// @include         http*://pt.keepfrds.com/details.php*
// @include         http*://www.beitai.pt/details.php*
// @include         http*://hdsky.me/details.php*
// @include         http*://pt.hd4fans.org/details.php*
// @include         http*://pthome.net/details.php*
// @include         http*://springsunday.net/details.php*
// @include         http*://pterclub.com/details.php*
// @include         http*://pt.m-team.cc/details.php*
// @include         http*://tjupt.org/details.php*

// @include         http*://www.hd.ai/Torrents.upload*
// @include         http*://chdbits.co/upload.php*
// @include         http*://www.haidan.video/upload.php*
// @include         http*://pthome.net/upload.php*
// @include         http*://pterclub.com/upload.php*
// @include         http*://pt.m-team.cc/upload.php*
// @include         http*://springsunday.net/upload.new.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419434/NexusPHPSync.user.js
// @updateURL https://update.greasyfork.org/scripts/419434/NexusPHPSync.meta.js
// ==/UserScript==
const SiteName = {
    CHD: "chdbits.co",
    TTG: "totheglory.im",
    HAIDAN: "www.haidan.video",
    FRDS: "pt.keepfrds.com",
    BEITAI: "www.beitai.pt",
    HDSKY: "hdsky.me",
    HD4FUN: "pt.hd4fans.org",
    OURBITS: "ourbits.club",
    PTHOME: "pthome.net",
    SSD: "springsunday.net",
    PTERCLUB: "pterclub.com",
    MTEAM: "pt.m-team.cc",
    TJUPT: "tjupt.org",
    LEMONHD: "lemonhd.org",
    HDAI: "www.hd.ai"
}

const SupportForwardedSite = [
    SiteName.CHD, SiteName.FRDS, SiteName.BEITAI, SiteName.HDSKY, SiteName.HD4FUN, SiteName.OURBITS, SiteName.PTHOME, SiteName.SSD, SiteName.PTERCLUB, SiteName.MTEAM, SiteName.TJUPT, SiteName.LEMONHD,
]
const SupportUploadSite = [
    SiteName.CHD, SiteName.HAIDAN, SiteName.PTHOME, SiteName.SSD, SiteName.PTERCLUB, SiteName.MTEAM, SiteName.HDAI,
]

const Type = { Movie: "movie", TVSeries: "series", TVShow: "show", Doc: "doc", Anim: "anim", Other: "other" }
const Source = { Remux: "remux", Encode: "encode", Bluray: "bluray", UHDBluray: "uhdbluray", WebDL: "webdl", HDTV: "hdtv", DVD: "dvd" }
const Codec = { H264: "h.264", H265: "h.265", MPEG2: "mpeg-2", MPEG4: "mpeg-4", VC1: "vc1" }
const AudioCodec = { DTS: "dts", AC3: "ac3", AAC: "aac", LPCM: "lpcm", DTSHDMA: "dts-hdma", TrueHD: "true-hd", Other: "other" }
const Standard = { SD: '540p', FHD: '1080p', UHD: '4k', I1080: '1080', P720: '720p' }

function get_upload_page(site_name) {
    switch (site_name) {
        case SiteName.SSD:
            return "upload.new.php"
        case SiteName.HDAI:
            return "Torrents.upload"
        default:
            return "upload.php"
    }
}


class Torrent {
    constructor(title, sub_title, type, descr, source, codec, audio_codec, standard, team, douban_url, imdb_url, nfo, src_site, preview_img) {
        this.title = title;
        this.sub_title = sub_title;
        this.type = type;
        this.descr = descr;
        this.source = source;
        this.codec = codec;
        this.audio_codec = audio_codec;
        this.standard = standard;
        this.team = team;
        this.douban_url = douban_url;
        this.imdb_url = imdb_url;
        this.nfo = nfo;
        this.src_site = src_site;
        this.preview_img = preview_img;
    }
}

class NexusPHPSite {
    constructor(site_name) {
        this.site_name = site_name;
        this.path = decodeURI(location.href);
    }
    get_site_name() {
        return this.site_name;
    }

    is_detail_page() {
        return this.path.match(/http(s*):\/\/.*\/details*/i);
    }

    process_detail_page() {
        var title = this.parse_title();
        var sub_title = this.parse_sub_title();
        try {
            var descr = this.parse_descr();
        } catch (err) {

        }
        var type = this.parse_type();
        var source = this.parse_source();
        var codec = this.parse_codec();
        var audiocodec = this.parse_audio_codec();
        var standard = this.parse_standard();
        var team = this.parse_team();
        var douban_url = this.parse_douban_url();
        var imdb_url = this.parse_imdb_url();
        var nfo = this.parse_nfo();
        var src_site = this.site_name;
        var preview_img = this.parse_preview_img();
        var torrent = new Torrent(title, sub_title, type, descr, source, codec, audiocodec, standard, team, douban_url, imdb_url, nfo, src_site, preview_img);
        return torrent
    }

    parse_preview_img() {
        var descr = this.parse_descr();
        var imgs = descr.match(/\[img\](\S*)\[\/img\]/gi);
        if (imgs.length <= 1) {
            return
        }
        var value = "";
        for (var i = 1; i < imgs.length; i++) {
            value += imgs[i] + '\n';
        }
        return value
    }
    parse_imdb_url() {
        var elem = document.getElementById('kimdb')
        if (elem) {
            return elem.children[0].href;
        } else {
            var elem = Array.from(document.getElementById('kdescr').children).find((e) => { return e.href && e.href.indexOf("imdb") != -1 })
            if (elem) {
                return elem.href
            }
        }
    }
    parse_team() {
        var title = this.parse_title();
        var team_suffix = title.split('-')[title.split('-').length - 1].split(' ')[0];
        return team_suffix
    }
    _parse_descr_elem() {
        return document.getElementById("kdescr");
    }
    _parse_title_elem() {
        return document.getElementById("top")
    }
    parse_nfo() {
        var elems = document.getElementById('kdescr').getElementsByTagName('fieldset')
        var f = null;
        for (var i = 0; i < elems.length; i++) {
            var e = Array.from(elems[i].childNodes).find((e) => { return e.textContent && e.textContent.toUpperCase().indexOf("VIDEO") != -1 })
            if (e) {
                f = e.parentElement;
                break
            }
        }
        if (f) {
            return walkDOM(f).split('[quote]')[1].split('[/quote]')[0]
        }
    }
    parse_title() {
        var title = ""
        var elems = this._parse_title_elem().childNodes
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].nodeName != "#text") {
                break
            }
            title += elems[i].textContent
        }
        return title.trim();
    }
    process_upload_page(data) {
        this.fill_type(data);
        this.fill_title(data)
        this.fill_sub_title(data);
        this.fill_source(data);
        this.fill_codec(data);
        this.fill_audio_codec(data);
        this.fill_standard(data);
        this.fill_descr(data);
        this.fill_annoymous(data);
        this.fill_douban_url(data);
        this.fill_imdb_url(data);
        this.fill_nfo(data);
        this.fill_team(data);
        this.fill_preview_img(data);
    }
    fill_team(torrent) {
    }
    fill_preview_img(torrent) {
    }
    fill_nfo(torrent) {
    }
    fill_title(torrent) {
        var data = torrent.title;
        var elems = document.getElementsByTagName('input')
        var title = Array.from(elems).find((e) => { return e.id == this._get_title_fill_tag() && e.type == 'text' })
        title.value = data
    }
    fill_douban_url(torrent) {

    }
    fill_imdb_url(torrent) {
        var data = torrent.imdb_url;
        if (!data) {
            return
        }
        var elems = document.getElementsByTagName('input')
        var durl = Array.from(elems).find((e) => { return e.name == 'url' && e.type == 'text' })
        durl.value = data
    }

    fill_sub_title(torrent) {
        var data = torrent.sub_title;
        var elems = document.getElementsByTagName('input')
        var sub_title = Array.from(elems).find((e) => { return e.name == this._get_sub_title_fill_tag() && e.type == 'text' })
        sub_title.value = data
    }
    fill_type(torrent) {
        var data = torrent.type;
        var type = document.getElementById(this._get_type_fill_tag())
        var sel = Array.from(type.options).find((e) => { return this._get_type_meta()[e.text] == data })
        sel.selected = true
    }
    fill_source(torrent) {
        var data = torrent.source;
        var elems = document.getElementsByTagName('select')
        var source_elem = Array.from(elems).find((e) => { return e.name == this._get_source_fill_tag() })
        var sel = Array.from(source_elem.options).find((e) => { return this._get_source_meta()[e.text] == data })
        sel.selected = true
    }
    fill_codec(torrent) {
        var data = torrent.codec;
        var elems = document.getElementsByTagName('select')
        var source_elem = Array.from(elems).find((e) => { return e.name == this._get_codec_fill_tag() })
        var sel = Array.from(source_elem.options).find((e) => { return this._get_codec_meta()[e.text] == data })
        sel.selected = true
    }
    fill_audio_codec(torrent) {
        var data = torrent.audio_codec
        var elems = document.getElementsByTagName('select')
        var source_elem = Array.from(elems).find((e) => { return e.name == this._get_audio_codec_fill_tag() })
        var sel = Array.from(source_elem.options).find((e) => { return this._get_audio_codec_meta()[e.text] == data })
        sel.selected = true
    }
    fill_standard(torrent) {
        var data = torrent.standard
        var elems = document.getElementsByTagName('select')
        var source_elem = Array.from(elems).find((e) => { return e.name == this._get_standard_fill_tag() })
        var sel = Array.from(source_elem.options).find((e) => { return this._get_standard_meta()[e.text] == data })
        sel.selected = true

    }
    fill_descr(torrent) {
        var data = torrent.descr
        data = "[quote]转载自" + torrent.src_site + "，感谢原发布者！[/quote]\n" + data;
        var descr = document.getElementById(this._get_descr_fill_tag())
        descr.value = data;
    }
    fill_annoymous() {
        var elems = document.getElementsByTagName('input')
        var annoymous = Array.from(elems).find((e) => { return e.name == this._get_annoymous_fill_tag() })
        annoymous.checked = true;
    }

    parse_descr() {
        return walkDOM(this._parse_descr_elem().cloneNode(true));
    }
    _get_detail_tag() {
        return "outer";
    }
    parse_sub_title() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var subtitle_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_subtitle_tag()) != -1 })
        return subtitle_elem.parentNode.lastChild.textContent;
    }
    parse_type() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        var type_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_type_tag()) != -1 })
        if (type_elem) {
            var type = type_elem.nextSibling.textContent.trim();
            return this._get_type_meta()[type]
        }
    }
    parse_douban_url() {
        var elem = Array.from(document.getElementById('kdescr').children).find((e) => { return e.href && e.href.indexOf("douban") != -1 })
        if (elem) {
            return elem.href;
        }
    }

    parse_source() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        var source_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_source_tag()) != -1 })
        if (source_elem) {
            var source = source_elem.nextSibling.textContent.trim();
            return this._get_source_meta()[source]
        }
    }
    parse_codec() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        var codec_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_codec_tag()) != -1 })
        if (codec_elem) {
            var codec = codec_elem.nextSibling.textContent.trim();
            return this._get_codec_meta()[codec]
        }
    }
    parse_audio_codec() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        var audio_codec_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_audio_codec_tag()) != -1 })
        if (audio_codec_elem) {
            var audiocodec = audio_codec_elem.nextSibling.textContent.trim();
            return this._get_audio_codec_meta()[audiocodec]
        }
    }
    parse_standard() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        var standard_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_standard_tag()) != -1 })
        if (standard_elem) {
            var standard = standard_elem.nextSibling.textContent.trim();
            return this._get_standard_meta()[standard]
        }
    }

    _get_insert_pos() {
        return document.getElementById('outer').getElementsByTagName('table')[0];
    }
    insert_detail_page(src_data) {
        console.log(src_data);
        var data = encodeURIComponent(JSON.stringify(src_data));
        var detail_elem = this._get_insert_pos();
        var row = detail_elem.insertRow(0);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
        c1.innerHTML = "转载";
        c1.valign = "top";
        c1.align = "right";
        c2.innerHTML = "";
        c2.valign = "top"
        c2.align = "left"
        for (var name in SupportUploadSite) {
            var content = document.createElement("a");
            c2.appendChild(content);
            content.target = "_blank"
            content.innerHTML = findKey(SiteName, SupportUploadSite[name]);
            content.href = "https://" + SupportUploadSite[name] + "/" + get_upload_page(SupportUploadSite[name]) + "#" + data;
            content.style.cssText = "cursor: pointer; border-collapse: collapse;font-size: 9pt;color: #fff;text-align: center;float: center;margin: 2px;padding: 2px;height: 17px;background: #06c;";
        }
        return c1, c2;
    }

    _get_type_tag() {
        return "类型";
    }
    _get_subtitle_tag() {
        return '副标题';
    }
    _get_basic_info_tag() {
        return "基本信息"
    }
    _get_source_tag() {
        return "媒介"
    }
    _get_codec_tag() {
        return "编码"
    }
    _get_standard_tag() {
        return "分辨率"
    }
    _get_audio_codec_tag() {
        return "音频编码"
    }
    _get_team_tag() {
        return "制作组"
    }

    _get_type_meta() {
        return { "纪录片": Type.Doc, "综艺": Type.TVShow, "动漫": Type.Anim, "电视剧": Type.TVSeries, "TV-Pack": Type.TVSeries, "TV-Show": Type.TVShow, "TV-Episode": Type.TVSeries, "Movies": Type.Movie, "TV Series": Type.TVSeries, "电影": Type.Movie, "Animations": Type.Anim, "TV Shows": Type.TVShow, "Documentaries": Type.Doc }
    }
    _get_source_meta() {
        return { "UltraHD(4K)": Source.UHDBluray, "DVD(原盘)": Source.DVD, "Blu-ray(原盘)": Source.Bluray, "UHD Blu-ray/DIY": Source.UHDBluray, "Blu-ray/DIY": Source.Bluray, "WEB-DL": Source.WebDL, "HDTV": Source.HDTV, "Remux": Source.Remux, "HD DVD": Source.DVD, "Encode": Source.Encode, "Blu-ray": Source.Bluray, "UHD Blu-ray": Source.UHDBluray }
    }
    _get_codec_meta() {
        return { "H.264/AVC": Codec.H264, "H.265/HEVC": Codec.H265, "H.265(HEVC)": Codec.H265, "H.264(AVC)": Codec.H264, "HEVC": Codec.H265, "MPEG-4": Codec.MPEG4, "MPEG-2": Codec.MPEG2, "VC-1": Codec.VC1, "H.264": Codec.H264, "H.264/AVC": Codec.H264, "H.265": Codec.H265, "HEVC 10bit": Codec.H265, "HEVC HDR10": Codec.H265 }
    }
    _get_audio_codec_meta() {
        return { "AC-3": AudioCodec.AC3, "DD/AC3": AudioCodec.AC3, "DTS-HD MA": AudioCodec.DTSHDMA, "Atmos": AudioCodec.TrueHD, "DTS": AudioCodec.DTS, "AAC": AudioCodec.AAC, "LPCM": AudioCodec.LPCM, "DTS-HD": AudioCodec.DTSHDMA, "DTS-HDMA": AudioCodec.DTSHDMA, "True-HD": AudioCodec.TrueHD, "Other": AudioCodec.Other }
    }
    _get_standard_meta() {
        return { "SD": Standard.SD, "1080i": Standard.I1080, "720p": Standard.P720, "2K/1080p": Standard.FHD, "1080p": Standard.FHD, "4K/2160p": Standard.UHD, "2160p/4K": Standard.UHD, "4K": Standard.UHD, "2160p(4k)": Standard.UHD, "2160p": Standard.UHD, }
    }
    _get_title_fill_tag() {
        return "name"
    }
    _get_sub_title_fill_tag() {
        return "small_descr"
    }
    _get_type_fill_tag() {
        return "browsecat"
    }
    _get_source_fill_tag() {
        return "medium_sel"
    }
    _get_codec_fill_tag() {
        return "codec_sel"
    }
    _get_audio_codec_fill_tag() {
        return "audiocodec_sel"
    }
    _get_standard_fill_tag() {
        return "standard_sel"
    }
    _get_descr_fill_tag() {
        return "descr"
    }
    _get_annoymous_fill_tag() {
        return "uplver"
    }
}

class TTGSite extends NexusPHPSite {
    is_detail_page() {
        return this.path.match(/http(s*):\/\/totheglory.im\/t\/.*/i);
    }
    _parse_title_elem() {
        return document.getElementsByTagName("h1")[0]
    }
    _parse_descr_elem() {
        return document.getElementById("kt_d");
    }
    _get_type_meta() {
        return { "UHD原盘": Type.Movie, "高清日剧": Type.TVSeries }
    }
}

class HDSKySite extends NexusPHPSite {
    _get_type_meta() {
        var ret = { "TV Shows/综艺": Type.TVShow, "TV Series/剧集(合集)": Type.TVSeries, "TV Series/剧集(分集）": Type.TVSeries, "Documentaries/纪录片": Type.Doc, "Movies/电影": Type.Movie, "iPad/iPad影视": Type.Movie, "Animations/动漫": Type.Anim }
        return { ...super._get_type_meta(), ...ret }
    }

    _get_source_meta() {
        var ret = { "UHD Blu-ray/DIY": Source.UHDBluray, "Blu-ray/DIY": Source.Bluray }
        return { ...super._get_source_meta(), ...ret }
    }
    _get_codec_meta() {
        var ret = { 'H.264/AVC': Codec.H264, "x265": Codec.H265, "x264": Codec.H264, "HEVC": Codec.H265 }
        return { ...super._get_codec_meta(), ...ret }
    }
    _get_audio_codec_meta() {
        var ret = { "DTS-HDMA:X 7.1": AudioCodec.DTSHDMA, "TrueHD Atmos": AudioCodec.TrueHD }
        return { ...super._get_audio_codec_meta(), ...ret }
    }
}

class CHDSite extends NexusPHPSite {
    _get_detail_tag() {
        return "details";
    }
    _get_insert_pos() {
        return document.getElementsByClassName(this._get_detail_tag())[0];
    }
    _get_descr_fill_tag() {
        return "bbcode"
    }
}

class PterClubSite extends NexusPHPSite {
    _get_type_meta() {
        return { "电影 (Movie)": Type.Movie, "电视剧 (TV Play)": Type.TVSeries, "动漫 (Anime)": Type.Anim, "综艺 (TV Show)": Type.TVShow, "纪录片 (Documentary)": Type.Doc }
    }
    _get_insert_pos() {
        return document.getElementById('outer').getElementsByTagName('table')[5];
    }
    _get_source_tag() {
        return "质量"
    }
}

class LemonHDSite extends NexusPHPSite {
    _get_type_meta() {
        return { "Movies UHD-4K": Type.Movie, "Movies 2160p": Type.Movie, "Movies 2160p REMUX": Type.Movie, "Movies Blu-ray": Type.Movie, "Movies 1080p": Type.Movie, "Movies 1080p REMUX": Type.Movie, "Movies 3D": Type.Movie, "Movies 720p": Type.Movie, "Movies WEB-DL": Type.Movie, "Movies HDTV": Type.Movie, "Movies iPad": Type.Movie, "Movies DVD": Type.Movie, "TV Series(电视剧)": Type.TVSeries, "TV Shows(综艺)": Type.TVShow, "Documentaries(纪录片)": Type.Doc, "Animations(动画片)": Type.Anim }
    }
    _get_basic_info_tag() {
        return "详细信息"
    }
    parse_source() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        return this._get_source_meta()[basic_elem.childNodes[0].textContent.split(" ")[1]]
    }
    parse_type() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf('基本信息') != -1 }).nextSibling
        var type_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_type_tag()) != -1 })
        if (type_elem) {
            var type = type_elem.nextSibling.textContent.trim();
            return this._get_type_meta()[type]
        }
    }
}

class HaiDanSite extends NexusPHPSite {
    _get_type_meta() {
        return { "TV Series(电视剧)": Type.TVSeries, "Documentaries(纪录片)": Type.Doc, "Movies(电影)": Type.Movie, "Animations(动画片)": Type.Anim, "TV Shows(综艺)": Type.TVShow }
    }
    _get_codec_meta() {
        var ret = { "H.264/AVC/X264": Codec.H264, "H.265/HEVC/X265": Codec.H265, "MPEG-4/XviD/DivX": Codec.MPEG4, }
        return { ...super._get_codec_meta(), ...ret }
    }
    process_upload_page(data) {
        super.process_upload_page(data);
        return data
    }
    fill_team(torrent) {
        var data = torrent.team;
        document.getElementById('team_suffix').value = data
    }
    fill_douban_url(torrent) {
        var data = torrent.douban_url
        if (!data) {
            return
        }
        var elems = document.getElementsByTagName('input')
        var durl = Array.from(elems).find((e) => { return e.name == 'durl' && e.type == 'text' })
        durl.value = data
    }
    fill_nfo(torrent) {
        var data = torrent.nfo
        if (!data) {
            return
        }
        var elems = document.getElementsByTagName('textarea')
        var title = Array.from(elems).find((e) => { return e.name == 'nfo-string' })
        title.value = data
    }
    fill_descr(torrent) {
        var descr = document.getElementById(this._get_descr_fill_tag())
        descr.value = "转载自" + torrent.src_site + "，感谢原发布者！"
    }
    fill_preview_img(torrent) {
        var data = torrent.preview_img;
        var elems = document.getElementsByTagName('textarea')
        var preview = Array.from(elems).find((e) => { return e.name == 'preview-pics' })
        preview.value = data;
    }
}


class FRDSSite extends NexusPHPSite {
    parse_title() {
        return super.parse_sub_title();
    }
    parse_sub_title() {
        return super.parse_title();
    }
    parse_source() {
        return Source.Encode
    }
    parse_audio_codec() {
        return AudioCodec.Other
    }

    _get_type_meta() {
        var ret = { '电影(合集)': Type.Movie, '纪录片(合集)': Type.Doc, '动漫(合集)': Type.Anim, '剧集(合集)': Type.TVSeries, '综艺(合集)': Type.TVShow }
        return { ...ret, ...super._get_type_meta() }
    }
    parse_douban_url() {
        return document.getElementsByClassName('imdbwp__link')[0].href;
    }
    parse_imdb_url() {
        return document.getElementsByClassName('imdbwp__link')[1].href;
    }
    _get_team_tag() {
        return "制作组"
    }
    parse_team() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        var team_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_team_tag()) != -1 })
        if (team_elem) {
            var team = team_elem.nextSibling.textContent.trim();
            return team
        }
        return "";
    }
    parse_nfo() {
        var nfo = document.getElementById('knfo')
        if (nfo) {
            return nfo.children[0].innerHTML;
        }
    }
    _get_codec_meta() {
        var ret = super._get_codec_meta()
        ret["HEVC Dolby Vision"] = Codec.H265
        ret["HEVC HDR10+"] = Codec.H265
        ret["HEVC HDR10"] = Codec.H265
        ret["HEVC 10bit"] = Codec.H265
        return ret;
    }
}

class OurBitsSite extends NexusPHPSite {
    _get_insert_pos() {
        return document.getElementById('outer').getElementsByTagName('table')[1];
    }
}

class TJUPTSite extends NexusPHPSite {
    parse_imdb_url() {
        var elem = Array.from(document.getElementById('kdescr').children).find((e) => { return e.href && e.href.indexOf("imdb") != -1 })
        if (elem) {
            return elem.href
        }
    }
    parse_title() {
        var elems = this._parse_title_elem().textContent.match(/\[(.*?)\]/gi);
        return elems[2].split('[')[1].split(']')[0]
    }

    parse_sub_title() {
        var elems = this._parse_title_elem().textContent.match(/\[(.*?)\]/gi)
        return elems[1].split('[')[1].split(']')[0]
    }
}

class HDaiSite extends NexusPHPSite {
    fill_type(torrent) {
        var data = torrent.type;
        var type = document.getElementsByTagName('select')[0]
        var sel = Array.from(type.options).find((e) => { return this._get_type_meta()[e.text] == data })
        sel.selected = true
    }
    _get_type_meta() {
        return { "电影Movies": Type.Movie, "电视剧TV Series": Type.TVSeries, "综艺TV Shows": Type.TVShow, "纪录片Documentaries": Type.Doc, "动漫Animations": Type.Anim}
    }
}

class MTeamSite extends NexusPHPSite {
    _get_type_tag() {
        return "類別";
    }
    _get_subtitle_tag() {
        return '副標題';
    }
    _get_basic_info_tag() {
        return "基本資訊"
    }
    _get_codec_tag() {
        return "編碼"
    }
    _get_standard_tag() {
        return "解析度"
    }
    _get_team_tag() {
        return "製作組"
    }
    _get_type_meta() {
        return { "Movie(電影)": Type.Movie, "TV Series(影劇/綜藝)": Type.TVSeries, "紀錄教育": Type.Doc }
    }
    parse_type() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        var type_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_type_tag()) != -1 })
        if (type_elem) {
            var mix_type = type_elem.nextSibling.textContent.trim().split('/');
            return this._get_type_meta()[mix_type.slice(0, mix_type.length - 1).join('/')]
        }
    }
    parse_source() {
        var detail_elem = document.getElementsByClassName(this._get_detail_tag())[0].getElementsByTagName('td');
        var basic_elem = Array.from(detail_elem).find((e) => { return e.innerHTML.indexOf(this._get_basic_info_tag()) != -1 }).nextSibling
        var source_elem = Array.from(basic_elem.children).find((e) => { return e.innerHTML.indexOf(this._get_source_tag()) != -1 })
        if (source_elem) {
            var mix_source = source_elem.nextSibling.textContent.trim().split('/');
            return this._get_source_meta()[mix_source[mix_source.length - 1]]
        }
    }
    fill_type() {

    }
    fill_source() {

    }
}

class SSDSite extends NexusPHPSite {
    parse_douban_url() {
        return document.getElementsByClassName('doubanlink')[1].href
    }

    parse_imdb_url() {
        return document.getElementsByClassName('doubanlink')[0].href
    }
    parse_nfo() {
        var elem = document.getElementsByClassName('mediainfo-raw')[0].children[1]
        return walkDOM(elem);
    }
    _get_type_meta() {
        return { "TV Series(电视剧)": Type.TVSeries, "Documentaries(纪录片)": Type.Doc, "Movies(电影)": Type.Movie, "Animations(动画)": Type.Anim, "TV Shows(综艺)": Type.TVShow }
    }
    _get_source_tag() {
        return "格式"
    }
    parse_preview_img() {
        var ret = ""
        var elems = document.getElementsByClassName('screenshot');
        for (var i = 0; i < elems.length; i++) {
            ret += elems[i].children[0].src + '\n'
        }
        return ret
    }
    _parse_descr_elem() {
        return document.getElementsByClassName("extra-text")[0];
    }

    fill_nfo(torrent) {
        document.getElementById('Media_BDInfo').value = torrent.nfo
    }
    fill_preview_img(torrent) {
        document.getElementById('url_vimages').value = torrent.preview_img
    }

}


function get_site() {
    var site_name = findKey(SiteName, document.domain);
    if (!site_name) {
        return null
    }
    switch (SiteName[site_name]) {
        case SiteName.TTG:
            return new TTGSite(site_name);
        case SiteName.HAIDAN:
            return new HaiDanSite(site_name);
        case SiteName.FRDS:
            return new FRDSSite(site_name);
        case SiteName.CHD:
            return new CHDSite(site_name);
        case SiteName.HDSKY:
            return new HDSKySite(site_name)
        case SiteName.OURBITS:
            return new OurBitsSite(site_name);
        case SiteName.SSD:
            return new SSDSite(site_name);
        case SiteName.PTERCLUB:
            return new PterClubSite(site_name);
        case SiteName.MTEAM:
            return new MTeamSite(site_name);
        case SiteName.LEMONHD:
            return new LemonHDSite(site_name);
        case SiteName.TJUPT:
            return new TJUPTSite(site_name);
        case SiteName.HDAI:
            return new HDaiSite(site_name)
        default:
            return new NexusPHPSite(site_name);
    }
}

// convert html to bbcode
function walkDOM(n) {
    var str_seed_descr = "";
    do {
        if (n.nodeName == 'FONT') {
            if (n.size != '') {
                n.innerHTML = '[size=' + n.size + ']' + n.innerHTML + '[/size]'
            }
            if (n.face != '') {
                n.innerHTML = '[font=' + n.face + ']' + n.innerHTML + '[/font]'
            }
        }
        if (n.nodeName == 'SPAN') {
            if (n.style.color != '') {
                n.innerHTML = '[color=' + n.style.color + ']' + n.innerHTML + '[/color]'
            }
        }
        if (n.nodeName == 'A') {
            n.innerHTML = '[URL=' + n.href + ']' + n.innerHTML + '[/URL]'
        }
        if (n.nodeName == 'FIELDSET') {
            n.innerHTML = '[quote]' + n.innerHTML + '[/quote]'
        }
        if (n.nodeName == 'DIV' && n.innerHTML == '代码') {
            n.innerHTML = ''
            n.nextSibling.innerHTML = '[code]' + n.nextSibling.innerHTML + '[/code]'
        }
        if (n.nodeName == 'LEGEND') {
            n.innerHTML = ''
        }
        if (n.nodeName == 'FIELDSET' && n.textContent.match(/(温馨提示|郑重声明|您的保种)/g)) {

        } else {
            if (n.hasChildNodes()) {
                str_seed_descr += walkDOM(n.firstChild);
            } else {
                if (n.nodeType == 1) {
                    if (n.nodeName == 'IMG') {
                        str_seed_descr = str_seed_descr + '[IMG]' + n.src + '[/IMG]'
                    }
                } else {
                    if (n.nodeType == 3) {
                        str_seed_descr = str_seed_descr + n.textContent
                    }
                }
            }
        }

    } while (n = n.nextSibling)
    return str_seed_descr;
}


function findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value))
}


/*** script begin ***/
t = get_site();
if (!t) {
    return;
}
if (t.is_detail_page()) {
    if (SupportForwardedSite.includes(SiteName[t.site_name])) {
        var data = t.process_detail_page();
        t.insert_detail_page(data);
    }
} else {
    var data = JSON.parse(decodeURIComponent(window.location.href.split("#")[1])); t
    console.log(data);
    t.process_upload_page(data);
}
/*** script end ***/

