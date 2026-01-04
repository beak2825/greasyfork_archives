;(function () {
  'use strict'
  window.getApi = getApi
  function getApi() {
    var r = protobuf,
      o = r.Reader,
      a = r.Writer,
      i = r.util,
      s = r.roots.default || (r.roots.default = {}),
      c =
        ((s.v0 = (function () {
          var e = {}
          return (
            (e.Request = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.secret = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.secret &&
                      Object.hasOwnProperty.call(e, 'secret') &&
                      t.uint32(10).string(e.secret),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v0.Request();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.secret = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PackedResponse = (function () {
              function e(e) {
                if (
                  ((this.firstBanners = []),
                  (this.secondBanners = []),
                  (this.updatedMangas = []),
                  (this.mangas = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.firstBanners = i.emptyArray),
                (e.prototype.secondBanners = i.emptyArray),
                (e.prototype.updatedMangas = i.emptyArray),
                (e.prototype.mangas = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v0.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.firstBanners && e.firstBanners.length)
                  )
                    for (var n = 0; n < e.firstBanners.length; ++n)
                      s.v0.Banner.encode(
                        e.firstBanners[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (null != e.secondBanners && e.secondBanners.length)
                    for (var r = 0; r < e.secondBanners.length; ++r)
                      s.v0.Banner.encode(
                        e.secondBanners[r],
                        t.uint32(26).fork()
                      ).ldelim()
                  if (null != e.updatedMangas && e.updatedMangas.length)
                    for (var o = 0; o < e.updatedMangas.length; ++o)
                      s.v0.Manga.encode(
                        e.updatedMangas[o],
                        t.uint32(34).fork()
                      ).ldelim()
                  if (null != e.mangas && e.mangas.length)
                    for (var i = 0; i < e.mangas.length; ++i)
                      s.v0.Manga.encode(
                        e.mangas[i],
                        t.uint32(42).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v0.PackedResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v0.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        ;(r.firstBanners && r.firstBanners.length) ||
                          (r.firstBanners = []),
                          r.firstBanners.push(s.v0.Banner.decode(e, e.uint32()))
                        break
                      case 3:
                        ;(r.secondBanners && r.secondBanners.length) ||
                          (r.secondBanners = []),
                          r.secondBanners.push(
                            s.v0.Banner.decode(e, e.uint32())
                          )
                        break
                      case 4:
                        ;(r.updatedMangas && r.updatedMangas.length) ||
                          (r.updatedMangas = []),
                          r.updatedMangas.push(s.v0.Manga.decode(e, e.uint32()))
                        break
                      case 5:
                        ;(r.mangas && r.mangas.length) || (r.mangas = []),
                          r.mangas.push(s.v0.Manga.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.StreamedResponseHeader = (function () {
              function e(e) {
                if (((this.updatedMangas = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.updatedMangas = i.emptyArray),
                (e.prototype.numFirstBanners = 0),
                (e.prototype.numSecondBanners = 0),
                (e.prototype.numMangas = 0),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v0.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.updatedMangas && e.updatedMangas.length)
                  )
                    for (var n = 0; n < e.updatedMangas.length; ++n)
                      s.v0.Manga.encode(
                        e.updatedMangas[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  return (
                    null != e.numFirstBanners &&
                      Object.hasOwnProperty.call(e, 'numFirstBanners') &&
                      t.uint32(24).uint32(e.numFirstBanners),
                    null != e.numSecondBanners &&
                      Object.hasOwnProperty.call(e, 'numSecondBanners') &&
                      t.uint32(32).uint32(e.numSecondBanners),
                    null != e.numMangas &&
                      Object.hasOwnProperty.call(e, 'numMangas') &&
                      t.uint32(40).uint32(e.numMangas),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v0.StreamedResponseHeader();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v0.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        ;(r.updatedMangas && r.updatedMangas.length) ||
                          (r.updatedMangas = []),
                          r.updatedMangas.push(s.v0.Manga.decode(e, e.uint32()))
                        break
                      case 3:
                        r.numFirstBanners = e.uint32()
                        break
                      case 4:
                        r.numSecondBanners = e.uint32()
                        break
                      case 5:
                        r.numMangas = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.UserPoint = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.free = 0),
                (e.prototype.paid = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.free &&
                      Object.hasOwnProperty.call(e, 'free') &&
                      t.uint32(8).uint32(e.free),
                    null != e.paid &&
                      Object.hasOwnProperty.call(e, 'paid') &&
                      t.uint32(16).uint32(e.paid),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v0.UserPoint();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.free = e.uint32()
                        break
                      case 2:
                        r.paid = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Banner = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.id = 0),
                (e.prototype.imageUrl = ''),
                (e.prototype.urlScheme = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.id &&
                      Object.hasOwnProperty.call(e, 'id') &&
                      t.uint32(8).uint32(e.id),
                    null != e.imageUrl &&
                      Object.hasOwnProperty.call(e, 'imageUrl') &&
                      t.uint32(18).string(e.imageUrl),
                    null != e.urlScheme &&
                      Object.hasOwnProperty.call(e, 'urlScheme') &&
                      t.uint32(26).string(e.urlScheme),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v0.Banner();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.id = e.uint32()
                        break
                      case 2:
                        r.imageUrl = e.string()
                        break
                      case 3:
                        r.urlScheme = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Author = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.id = 0),
                (e.prototype.name = ''),
                (e.prototype.nameKana = ''),
                (e.prototype.role = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.id &&
                      Object.hasOwnProperty.call(e, 'id') &&
                      t.uint32(8).uint32(e.id),
                    null != e.name &&
                      Object.hasOwnProperty.call(e, 'name') &&
                      t.uint32(18).string(e.name),
                    null != e.nameKana &&
                      Object.hasOwnProperty.call(e, 'nameKana') &&
                      t.uint32(26).string(e.nameKana),
                    null != e.role &&
                      Object.hasOwnProperty.call(e, 'role') &&
                      t.uint32(34).string(e.role),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v0.Author();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.id = e.uint32()
                        break
                      case 2:
                        r.name = e.string()
                        break
                      case 3:
                        r.nameKana = e.string()
                        break
                      case 4:
                        r.role = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Manga = (function () {
              function e(e) {
                if (((this.authors = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.id = 0),
                (e.prototype.title = ''),
                (e.prototype.titleKana = ''),
                (e.prototype.authors = i.emptyArray),
                (e.prototype.singleListThumbnailUrl = ''),
                (e.prototype.spreadListThumbnailUrl = ''),
                (e.prototype.shortDescription = ''),
                (e.prototype.campaign = ''),
                (e.prototype.numberOfLikes = 0),
                (e.prototype.lastUpdated = ''),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.id &&
                      Object.hasOwnProperty.call(e, 'id') &&
                      t.uint32(8).uint32(e.id),
                    null != e.title &&
                      Object.hasOwnProperty.call(e, 'title') &&
                      t.uint32(18).string(e.title),
                    null != e.titleKana &&
                      Object.hasOwnProperty.call(e, 'titleKana') &&
                      t.uint32(26).string(e.titleKana),
                    null != e.authors && e.authors.length)
                  )
                    for (var n = 0; n < e.authors.length; ++n)
                      s.v0.Author.encode(
                        e.authors[n],
                        t.uint32(34).fork()
                      ).ldelim()
                  return (
                    null != e.singleListThumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'singleListThumbnailUrl') &&
                      t.uint32(42).string(e.singleListThumbnailUrl),
                    null != e.spreadListThumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'spreadListThumbnailUrl') &&
                      t.uint32(50).string(e.spreadListThumbnailUrl),
                    null != e.shortDescription &&
                      Object.hasOwnProperty.call(e, 'shortDescription') &&
                      t.uint32(58).string(e.shortDescription),
                    null != e.campaign &&
                      Object.hasOwnProperty.call(e, 'campaign') &&
                      t.uint32(66).string(e.campaign),
                    null != e.numberOfLikes &&
                      Object.hasOwnProperty.call(e, 'numberOfLikes') &&
                      t.uint32(72).uint32(e.numberOfLikes),
                    null != e.lastUpdated &&
                      Object.hasOwnProperty.call(e, 'lastUpdated') &&
                      t.uint32(82).string(e.lastUpdated),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v0.Manga();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.id = e.uint32()
                        break
                      case 2:
                        r.title = e.string()
                        break
                      case 3:
                        r.titleKana = e.string()
                        break
                      case 4:
                        ;(r.authors && r.authors.length) || (r.authors = []),
                          r.authors.push(s.v0.Author.decode(e, e.uint32()))
                        break
                      case 5:
                        r.singleListThumbnailUrl = e.string()
                        break
                      case 6:
                        r.spreadListThumbnailUrl = e.string()
                        break
                      case 7:
                        r.shortDescription = e.string()
                        break
                      case 8:
                        r.campaign = e.string()
                        break
                      case 9:
                        r.numberOfLikes = e.uint32()
                        break
                      case 10:
                        r.lastUpdated = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Magazine = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.id = 0),
                (e.prototype.name = ''),
                (e.prototype.nameKana = ''),
                (e.prototype.issue = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.id &&
                      Object.hasOwnProperty.call(e, 'id') &&
                      t.uint32(8).uint32(e.id),
                    null != e.name &&
                      Object.hasOwnProperty.call(e, 'name') &&
                      t.uint32(18).string(e.name),
                    null != e.nameKana &&
                      Object.hasOwnProperty.call(e, 'nameKana') &&
                      t.uint32(26).string(e.nameKana),
                    null != e.issue &&
                      Object.hasOwnProperty.call(e, 'issue') &&
                      t.uint32(34).string(e.issue),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v0.Magazine();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.id = e.uint32()
                        break
                      case 2:
                        r.name = e.string()
                        break
                      case 3:
                        r.nameKana = e.string()
                        break
                      case 4:
                        r.issue = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            e
          )
        })()),
        (s.v1 = (function () {
          var e = {}
          return (
            (e.DeviceInfo = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.secret = ''),
                (e.prototype.appVer = ''),
                (e.prototype.deviceType = 0),
                (e.prototype.osVer = ''),
                (e.prototype.isTablet = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.secret &&
                      Object.hasOwnProperty.call(e, 'secret') &&
                      t.uint32(10).string(e.secret),
                    null != e.appVer &&
                      Object.hasOwnProperty.call(e, 'appVer') &&
                      t.uint32(18).string(e.appVer),
                    null != e.deviceType &&
                      Object.hasOwnProperty.call(e, 'deviceType') &&
                      t.uint32(24).int32(e.deviceType),
                    null != e.osVer &&
                      Object.hasOwnProperty.call(e, 'osVer') &&
                      t.uint32(34).string(e.osVer),
                    null != e.isTablet &&
                      Object.hasOwnProperty.call(e, 'isTablet') &&
                      t.uint32(40).bool(e.isTablet),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeviceInfo();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.secret = e.string()
                        break
                      case 2:
                        r.appVer = e.string()
                        break
                      case 3:
                        r.deviceType = e.int32()
                        break
                      case 4:
                        r.osVer = e.string()
                        break
                      case 5:
                        r.isTablet = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.DeviceType = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'IOS')] = 0),
                    (t[(e[1] = 'ANDROID')] = 1),
                    (t[(e[2] = 'BROWSER')] = 2),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.Author = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.authorId = 0),
                (e.prototype.authorName = ''),
                (e.prototype.authorNameKana = ''),
                (e.prototype.imageUrl = ''),
                (e.prototype.isYellEnabled = !1),
                (e.prototype.isYellBonusOffered = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.authorId &&
                      Object.hasOwnProperty.call(e, 'authorId') &&
                      t.uint32(8).uint32(e.authorId),
                    null != e.authorName &&
                      Object.hasOwnProperty.call(e, 'authorName') &&
                      t.uint32(18).string(e.authorName),
                    null != e.authorNameKana &&
                      Object.hasOwnProperty.call(e, 'authorNameKana') &&
                      t.uint32(26).string(e.authorNameKana),
                    null != e.imageUrl &&
                      Object.hasOwnProperty.call(e, 'imageUrl') &&
                      t.uint32(34).string(e.imageUrl),
                    null != e.isYellEnabled &&
                      Object.hasOwnProperty.call(e, 'isYellEnabled') &&
                      t.uint32(40).bool(e.isYellEnabled),
                    null != e.isYellBonusOffered &&
                      Object.hasOwnProperty.call(e, 'isYellBonusOffered') &&
                      t.uint32(48).bool(e.isYellBonusOffered),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Author();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.authorId = e.uint32()
                        break
                      case 2:
                        r.authorName = e.string()
                        break
                      case 3:
                        r.authorNameKana = e.string()
                        break
                      case 4:
                        r.imageUrl = e.string()
                        break
                      case 5:
                        r.isYellEnabled = e.bool()
                        break
                      case 6:
                        r.isYellBonusOffered = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Authorship = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.author = null),
                (e.prototype.role = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.author &&
                      Object.hasOwnProperty.call(e, 'author') &&
                      s.v1.Author.encode(
                        e.author,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.role &&
                      Object.hasOwnProperty.call(e, 'role') &&
                      t.uint32(18).string(e.role),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Authorship();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.author = s.v1.Author.decode(e, e.uint32())
                        break
                      case 2:
                        r.role = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Banner = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.bannerId = 0),
                (e.prototype.imageUrl = ''),
                (e.prototype.urlScheme = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.bannerId &&
                      Object.hasOwnProperty.call(e, 'bannerId') &&
                      t.uint32(8).uint32(e.bannerId),
                    null != e.imageUrl &&
                      Object.hasOwnProperty.call(e, 'imageUrl') &&
                      t.uint32(18).string(e.imageUrl),
                    null != e.urlScheme &&
                      Object.hasOwnProperty.call(e, 'urlScheme') &&
                      t.uint32(26).string(e.urlScheme),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Banner();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.bannerId = e.uint32()
                        break
                      case 2:
                        r.imageUrl = e.string()
                        break
                      case 3:
                        r.urlScheme = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BillingItem = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.productId = ''),
                (e.prototype.item = null),
                (e.prototype.label = ''),
                (e.prototype.price = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.productId &&
                      Object.hasOwnProperty.call(e, 'productId') &&
                      t.uint32(10).string(e.productId),
                    null != e.item &&
                      Object.hasOwnProperty.call(e, 'item') &&
                      s.v1.UserPoint.encode(
                        e.item,
                        t.uint32(18).fork()
                      ).ldelim(),
                    null != e.label &&
                      Object.hasOwnProperty.call(e, 'label') &&
                      t.uint32(26).string(e.label),
                    null != e.price &&
                      Object.hasOwnProperty.call(e, 'price') &&
                      t.uint32(32).uint32(e.price),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BillingItem();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.productId = e.string()
                        break
                      case 2:
                        r.item = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 3:
                        r.label = e.string()
                        break
                      case 4:
                        r.price = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Manga = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.mangaId = 0),
                (e.prototype.mangaName = ''),
                (e.prototype.mangaNameKana = ''),
                (e.prototype.mainThumbnailUrl = ''),
                (e.prototype.singleListThumbnailUrl = ''),
                (e.prototype.shortDescription = ''),
                (e.prototype.campaign = ''),
                (e.prototype.numberOfTotalChapterLikes = 0),
                (e.prototype.numberOfFavorites = 0),
                (e.prototype.badge = 0),
                (e.prototype.isTicketAvailable = !1),
                (e.prototype.isChargeNeeded = !1),
                (e.prototype.longDescription = ''),
                (e.prototype.latestUpdatedDate = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.mangaId &&
                      Object.hasOwnProperty.call(e, 'mangaId') &&
                      t.uint32(8).uint32(e.mangaId),
                    null != e.mangaName &&
                      Object.hasOwnProperty.call(e, 'mangaName') &&
                      t.uint32(18).string(e.mangaName),
                    null != e.mangaNameKana &&
                      Object.hasOwnProperty.call(e, 'mangaNameKana') &&
                      t.uint32(26).string(e.mangaNameKana),
                    null != e.mainThumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'mainThumbnailUrl') &&
                      t.uint32(34).string(e.mainThumbnailUrl),
                    null != e.singleListThumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'singleListThumbnailUrl') &&
                      t.uint32(42).string(e.singleListThumbnailUrl),
                    null != e.shortDescription &&
                      Object.hasOwnProperty.call(e, 'shortDescription') &&
                      t.uint32(50).string(e.shortDescription),
                    null != e.campaign &&
                      Object.hasOwnProperty.call(e, 'campaign') &&
                      t.uint32(58).string(e.campaign),
                    null != e.numberOfTotalChapterLikes &&
                      Object.hasOwnProperty.call(
                        e,
                        'numberOfTotalChapterLikes'
                      ) &&
                      t.uint32(64).uint32(e.numberOfTotalChapterLikes),
                    null != e.numberOfFavorites &&
                      Object.hasOwnProperty.call(e, 'numberOfFavorites') &&
                      t.uint32(72).uint32(e.numberOfFavorites),
                    null != e.badge &&
                      Object.hasOwnProperty.call(e, 'badge') &&
                      t.uint32(80).int32(e.badge),
                    null != e.isTicketAvailable &&
                      Object.hasOwnProperty.call(e, 'isTicketAvailable') &&
                      t.uint32(96).bool(e.isTicketAvailable),
                    null != e.isChargeNeeded &&
                      Object.hasOwnProperty.call(e, 'isChargeNeeded') &&
                      t.uint32(104).bool(e.isChargeNeeded),
                    null != e.longDescription &&
                      Object.hasOwnProperty.call(e, 'longDescription') &&
                      t.uint32(114).string(e.longDescription),
                    null != e.latestUpdatedDate &&
                      Object.hasOwnProperty.call(e, 'latestUpdatedDate') &&
                      t.uint32(122).string(e.latestUpdatedDate),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Manga();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.mangaId = e.uint32()
                        break
                      case 2:
                        r.mangaName = e.string()
                        break
                      case 3:
                        r.mangaNameKana = e.string()
                        break
                      case 4:
                        r.mainThumbnailUrl = e.string()
                        break
                      case 5:
                        r.singleListThumbnailUrl = e.string()
                        break
                      case 6:
                        r.shortDescription = e.string()
                        break
                      case 7:
                        r.campaign = e.string()
                        break
                      case 8:
                        r.numberOfTotalChapterLikes = e.uint32()
                        break
                      case 9:
                        r.numberOfFavorites = e.uint32()
                        break
                      case 10:
                        r.badge = e.int32()
                        break
                      case 12:
                        r.isTicketAvailable = e.bool()
                        break
                      case 13:
                        r.isChargeNeeded = e.bool()
                        break
                      case 14:
                        r.longDescription = e.string()
                        break
                      case 15:
                        r.latestUpdatedDate = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Badge = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'NONE')] = 0),
                    (t[(e[1] = 'NEW')] = 1),
                    (t[(e[2] = 'UPDATE')] = 2),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.Chapter = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.chapterId = 0),
                (e.prototype.chapterMainName = ''),
                (e.prototype.chapterSubName = ''),
                (e.prototype.thumbnailUrl = ''),
                (e.prototype.pointConsumption = null),
                (e.prototype.numberOfComments = 0),
                (e.prototype.numberOfLikes = 0),
                (e.prototype.updatedDate = ''),
                (e.prototype.isRead = !1),
                (e.prototype.endOfRentalPeriod = ''),
                (e.prototype.firstPageImageUrl = ''),
                (e.prototype.badge = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.chapterId &&
                      Object.hasOwnProperty.call(e, 'chapterId') &&
                      t.uint32(8).uint32(e.chapterId),
                    null != e.chapterMainName &&
                      Object.hasOwnProperty.call(e, 'chapterMainName') &&
                      t.uint32(18).string(e.chapterMainName),
                    null != e.chapterSubName &&
                      Object.hasOwnProperty.call(e, 'chapterSubName') &&
                      t.uint32(26).string(e.chapterSubName),
                    null != e.thumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                      t.uint32(34).string(e.thumbnailUrl),
                    null != e.pointConsumption &&
                      Object.hasOwnProperty.call(e, 'pointConsumption') &&
                      s.v1.Chapter.PointConsumption.encode(
                        e.pointConsumption,
                        t.uint32(42).fork()
                      ).ldelim(),
                    null != e.numberOfComments &&
                      Object.hasOwnProperty.call(e, 'numberOfComments') &&
                      t.uint32(48).uint32(e.numberOfComments),
                    null != e.numberOfLikes &&
                      Object.hasOwnProperty.call(e, 'numberOfLikes') &&
                      t.uint32(56).uint32(e.numberOfLikes),
                    null != e.updatedDate &&
                      Object.hasOwnProperty.call(e, 'updatedDate') &&
                      t.uint32(66).string(e.updatedDate),
                    null != e.isRead &&
                      Object.hasOwnProperty.call(e, 'isRead') &&
                      t.uint32(72).bool(e.isRead),
                    null != e.endOfRentalPeriod &&
                      Object.hasOwnProperty.call(e, 'endOfRentalPeriod') &&
                      t.uint32(82).string(e.endOfRentalPeriod),
                    null != e.firstPageImageUrl &&
                      Object.hasOwnProperty.call(e, 'firstPageImageUrl') &&
                      t.uint32(90).string(e.firstPageImageUrl),
                    null != e.badge &&
                      Object.hasOwnProperty.call(e, 'badge') &&
                      t.uint32(96).int32(e.badge),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Chapter();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.chapterId = e.uint32()
                        break
                      case 2:
                        r.chapterMainName = e.string()
                        break
                      case 3:
                        r.chapterSubName = e.string()
                        break
                      case 4:
                        r.thumbnailUrl = e.string()
                        break
                      case 5:
                        r.pointConsumption =
                          s.v1.Chapter.PointConsumption.decode(e, e.uint32())
                        break
                      case 6:
                        r.numberOfComments = e.uint32()
                        break
                      case 7:
                        r.numberOfLikes = e.uint32()
                        break
                      case 8:
                        r.updatedDate = e.string()
                        break
                      case 9:
                        r.isRead = e.bool()
                        break
                      case 10:
                        r.endOfRentalPeriod = e.string()
                        break
                      case 11:
                        r.firstPageImageUrl = e.string()
                        break
                      case 12:
                        r.badge = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Badge = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'NONE')] = 0),
                    (t[(e[1] = 'UPDATE')] = 1),
                    (t[(e[2] = 'ADVANCE')] = 2),
                    (t[(e[3] = 'SPECIAL')] = 3),
                    t
                  )
                })()),
                (e.PointConsumption = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.type = 0),
                    (e.prototype.amount = 0),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.type &&
                          Object.hasOwnProperty.call(e, 'type') &&
                          t.uint32(8).int32(e.type),
                        null != e.amount &&
                          Object.hasOwnProperty.call(e, 'amount') &&
                          t.uint32(16).uint32(e.amount),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.Chapter.PointConsumption();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.type = e.int32()
                            break
                          case 2:
                            r.amount = e.uint32()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    (e.Type = (function () {
                      var e = {},
                        t = Object.create(e)
                      return (
                        (t[(e[0] = 'ANY_ITEMS')] = 0),
                        (t[(e[1] = 'EVENT_OR_PAID')] = 1),
                        (t[(e[2] = 'PAID_ONLY')] = 2),
                        t
                      )
                    })()),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.Book = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.bookName = ''),
                (e.prototype.latestBookIssueId = 0),
                (e.prototype.thumbnailUrl = ''),
                (e.prototype.campaign = ''),
                (e.prototype.shelfBadge = 0),
                (e.prototype.bookNameKana = ''),
                (e.prototype.publishedDate = ''),
                (e.prototype.latestBookIssueName = ''),
                (e.prototype.longDescription = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.bookName &&
                      Object.hasOwnProperty.call(e, 'bookName') &&
                      t.uint32(10).string(e.bookName),
                    null != e.latestBookIssueId &&
                      Object.hasOwnProperty.call(e, 'latestBookIssueId') &&
                      t.uint32(16).uint32(e.latestBookIssueId),
                    null != e.thumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                      t.uint32(26).string(e.thumbnailUrl),
                    null != e.campaign &&
                      Object.hasOwnProperty.call(e, 'campaign') &&
                      t.uint32(34).string(e.campaign),
                    null != e.shelfBadge &&
                      Object.hasOwnProperty.call(e, 'shelfBadge') &&
                      t.uint32(40).int32(e.shelfBadge),
                    null != e.bookNameKana &&
                      Object.hasOwnProperty.call(e, 'bookNameKana') &&
                      t.uint32(50).string(e.bookNameKana),
                    null != e.publishedDate &&
                      Object.hasOwnProperty.call(e, 'publishedDate') &&
                      t.uint32(66).string(e.publishedDate),
                    null != e.latestBookIssueName &&
                      Object.hasOwnProperty.call(e, 'latestBookIssueName') &&
                      t.uint32(74).string(e.latestBookIssueName),
                    null != e.longDescription &&
                      Object.hasOwnProperty.call(e, 'longDescription') &&
                      t.uint32(82).string(e.longDescription),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Book();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.bookName = e.string()
                        break
                      case 2:
                        r.latestBookIssueId = e.uint32()
                        break
                      case 3:
                        r.thumbnailUrl = e.string()
                        break
                      case 4:
                        r.campaign = e.string()
                        break
                      case 5:
                        r.shelfBadge = e.int32()
                        break
                      case 6:
                        r.bookNameKana = e.string()
                        break
                      case 8:
                        r.publishedDate = e.string()
                        break
                      case 9:
                        r.latestBookIssueName = e.string()
                        break
                      case 10:
                        r.longDescription = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.ShelfBadge = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'NONE')] = 0),
                    (t[(e[1] = 'LIMITED')] = 1),
                    (t[(e[2] = 'ENDED')] = 2),
                    (t[(e[3] = 'NOT_PURCHASED_ALL')] = 3),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.BookIssue = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.bookIssueId = 0),
                (e.prototype.bookIssueName = ''),
                (e.prototype.thumbnailUrl = ''),
                (e.prototype.paidPoint = 0),
                (e.prototype.campaignPaidPoint = 0),
                (e.prototype.isDiscountCampaign = !1),
                (e.prototype.isFreeCampaign = !1),
                (e.prototype.numberOfSamplePages = 0),
                (e.prototype.numberOfComments = 0),
                (e.prototype.updatedDate = ''),
                (e.prototype.purchaseStatus = 0),
                (e.prototype.expirationDateOfFreeCampaign = ''),
                (e.prototype.firstPageImageUrl = ''),
                (e.prototype.campaign = ''),
                (e.prototype.longDescription = ''),
                (e.prototype.bookName = ''),
                (e.prototype.cashBack = null),
                (e.prototype.isRead = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(8).uint32(e.bookIssueId),
                    null != e.bookIssueName &&
                      Object.hasOwnProperty.call(e, 'bookIssueName') &&
                      t.uint32(18).string(e.bookIssueName),
                    null != e.thumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                      t.uint32(26).string(e.thumbnailUrl),
                    null != e.paidPoint &&
                      Object.hasOwnProperty.call(e, 'paidPoint') &&
                      t.uint32(32).uint32(e.paidPoint),
                    null != e.campaignPaidPoint &&
                      Object.hasOwnProperty.call(e, 'campaignPaidPoint') &&
                      t.uint32(40).uint32(e.campaignPaidPoint),
                    null != e.isDiscountCampaign &&
                      Object.hasOwnProperty.call(e, 'isDiscountCampaign') &&
                      t.uint32(48).bool(e.isDiscountCampaign),
                    null != e.isFreeCampaign &&
                      Object.hasOwnProperty.call(e, 'isFreeCampaign') &&
                      t.uint32(56).bool(e.isFreeCampaign),
                    null != e.numberOfSamplePages &&
                      Object.hasOwnProperty.call(e, 'numberOfSamplePages') &&
                      t.uint32(64).uint32(e.numberOfSamplePages),
                    null != e.numberOfComments &&
                      Object.hasOwnProperty.call(e, 'numberOfComments') &&
                      t.uint32(72).uint32(e.numberOfComments),
                    null != e.updatedDate &&
                      Object.hasOwnProperty.call(e, 'updatedDate') &&
                      t.uint32(82).string(e.updatedDate),
                    null != e.purchaseStatus &&
                      Object.hasOwnProperty.call(e, 'purchaseStatus') &&
                      t.uint32(88).int32(e.purchaseStatus),
                    null != e.expirationDateOfFreeCampaign &&
                      Object.hasOwnProperty.call(
                        e,
                        'expirationDateOfFreeCampaign'
                      ) &&
                      t.uint32(98).string(e.expirationDateOfFreeCampaign),
                    null != e.firstPageImageUrl &&
                      Object.hasOwnProperty.call(e, 'firstPageImageUrl') &&
                      t.uint32(106).string(e.firstPageImageUrl),
                    null != e.campaign &&
                      Object.hasOwnProperty.call(e, 'campaign') &&
                      t.uint32(114).string(e.campaign),
                    null != e.longDescription &&
                      Object.hasOwnProperty.call(e, 'longDescription') &&
                      t.uint32(122).string(e.longDescription),
                    null != e.bookName &&
                      Object.hasOwnProperty.call(e, 'bookName') &&
                      t.uint32(130).string(e.bookName),
                    null != e.cashBack &&
                      Object.hasOwnProperty.call(e, 'cashBack') &&
                      s.v1.UserPoint.encode(
                        e.cashBack,
                        t.uint32(138).fork()
                      ).ldelim(),
                    null != e.isRead &&
                      Object.hasOwnProperty.call(e, 'isRead') &&
                      t.uint32(144).bool(e.isRead),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssue();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.bookIssueId = e.uint32()
                        break
                      case 2:
                        r.bookIssueName = e.string()
                        break
                      case 3:
                        r.thumbnailUrl = e.string()
                        break
                      case 4:
                        r.paidPoint = e.uint32()
                        break
                      case 5:
                        r.campaignPaidPoint = e.uint32()
                        break
                      case 6:
                        r.isDiscountCampaign = e.bool()
                        break
                      case 7:
                        r.isFreeCampaign = e.bool()
                        break
                      case 8:
                        r.numberOfSamplePages = e.uint32()
                        break
                      case 9:
                        r.numberOfComments = e.uint32()
                        break
                      case 10:
                        r.updatedDate = e.string()
                        break
                      case 11:
                        r.purchaseStatus = e.int32()
                        break
                      case 12:
                        r.expirationDateOfFreeCampaign = e.string()
                        break
                      case 13:
                        r.firstPageImageUrl = e.string()
                        break
                      case 14:
                        r.campaign = e.string()
                        break
                      case 15:
                        r.longDescription = e.string()
                        break
                      case 16:
                        r.bookName = e.string()
                        break
                      case 17:
                        r.cashBack = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 18:
                        r.isRead = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.PurchaseStatus = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'NONE')] = 0),
                    (t[(e[1] = 'WISHED')] = 1),
                    (t[(e[2] = 'PURCHASED')] = 2),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.ChapterGroup = (function () {
              function e(e) {
                if (((this.chapters = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.bookIssueHeader = null),
                (e.prototype.chapters = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.bookIssueHeader &&
                      Object.hasOwnProperty.call(e, 'bookIssueHeader') &&
                      s.v1.ChapterGroup.BookIssueHeader.encode(
                        e.bookIssueHeader,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.chapters && e.chapters.length)
                  )
                    for (var n = 0; n < e.chapters.length; ++n)
                      s.v1.Chapter.encode(
                        e.chapters[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ChapterGroup();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.bookIssueHeader =
                          s.v1.ChapterGroup.BookIssueHeader.decode(
                            e,
                            e.uint32()
                          )
                        break
                      case 2:
                        ;(r.chapters && r.chapters.length) || (r.chapters = []),
                          r.chapters.push(s.v1.Chapter.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.BookIssueHeader = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.bookIssueId = ''),
                    (e.prototype.headerImageUrl = ''),
                    (e.prototype.text = ''),
                    (e.prototype.publishedDate = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.bookIssueId &&
                          Object.hasOwnProperty.call(e, 'bookIssueId') &&
                          t.uint32(10).string(e.bookIssueId),
                        null != e.headerImageUrl &&
                          Object.hasOwnProperty.call(e, 'headerImageUrl') &&
                          t.uint32(18).string(e.headerImageUrl),
                        null != e.text &&
                          Object.hasOwnProperty.call(e, 'text') &&
                          t.uint32(26).string(e.text),
                        null != e.publishedDate &&
                          Object.hasOwnProperty.call(e, 'publishedDate') &&
                          t.uint32(34).string(e.publishedDate),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.ChapterGroup.BookIssueHeader();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.bookIssueId = e.string()
                            break
                          case 2:
                            r.headerImageUrl = e.string()
                            break
                          case 3:
                            r.text = e.string()
                            break
                          case 4:
                            r.publishedDate = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.Magazine = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.magazineId = 0),
                (e.prototype.magazineName = ''),
                (e.prototype.magazineNameKana = ''),
                (e.prototype.thumbnailUrl = ''),
                (e.prototype.shortDescription = ''),
                (e.prototype.campaign = ''),
                (e.prototype.lastUpdatedDate = ''),
                (e.prototype.productId = ''),
                (e.prototype.lastUpdatedIssueName = ''),
                (e.prototype.shelfBadge = 0),
                (e.prototype.latestMagazineIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.magazineId &&
                      Object.hasOwnProperty.call(e, 'magazineId') &&
                      t.uint32(8).uint32(e.magazineId),
                    null != e.magazineName &&
                      Object.hasOwnProperty.call(e, 'magazineName') &&
                      t.uint32(18).string(e.magazineName),
                    null != e.magazineNameKana &&
                      Object.hasOwnProperty.call(e, 'magazineNameKana') &&
                      t.uint32(26).string(e.magazineNameKana),
                    null != e.thumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                      t.uint32(34).string(e.thumbnailUrl),
                    null != e.shortDescription &&
                      Object.hasOwnProperty.call(e, 'shortDescription') &&
                      t.uint32(42).string(e.shortDescription),
                    null != e.campaign &&
                      Object.hasOwnProperty.call(e, 'campaign') &&
                      t.uint32(50).string(e.campaign),
                    null != e.lastUpdatedDate &&
                      Object.hasOwnProperty.call(e, 'lastUpdatedDate') &&
                      t.uint32(58).string(e.lastUpdatedDate),
                    null != e.productId &&
                      Object.hasOwnProperty.call(e, 'productId') &&
                      t.uint32(66).string(e.productId),
                    null != e.lastUpdatedIssueName &&
                      Object.hasOwnProperty.call(e, 'lastUpdatedIssueName') &&
                      t.uint32(74).string(e.lastUpdatedIssueName),
                    null != e.shelfBadge &&
                      Object.hasOwnProperty.call(e, 'shelfBadge') &&
                      t.uint32(80).int32(e.shelfBadge),
                    null != e.latestMagazineIssueId &&
                      Object.hasOwnProperty.call(e, 'latestMagazineIssueId') &&
                      t.uint32(88).uint32(e.latestMagazineIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Magazine();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.magazineId = e.uint32()
                        break
                      case 2:
                        r.magazineName = e.string()
                        break
                      case 3:
                        r.magazineNameKana = e.string()
                        break
                      case 4:
                        r.thumbnailUrl = e.string()
                        break
                      case 5:
                        r.shortDescription = e.string()
                        break
                      case 6:
                        r.campaign = e.string()
                        break
                      case 7:
                        r.lastUpdatedDate = e.string()
                        break
                      case 8:
                        r.productId = e.string()
                        break
                      case 9:
                        r.lastUpdatedIssueName = e.string()
                        break
                      case 10:
                        r.shelfBadge = e.int32()
                        break
                      case 11:
                        r.latestMagazineIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.ShelfBadge = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'NONE')] = 0),
                    (t[(e[1] = 'LIMITED')] = 1),
                    (t[(e[2] = 'ENDED')] = 2),
                    (t[(e[3] = 'NOT_PURCHASED_ALL')] = 3),
                    (t[(e[4] = 'SUBSCRIBED')] = 4),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.MagazineIssue = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.magazineIssueId = 0),
                (e.prototype.magazineIssueName = ''),
                (e.prototype.thumbnailUrl = ''),
                (e.prototype.paidPoint = 0),
                (e.prototype.campaignPaidPoint = 0),
                (e.prototype.isDiscountCampaign = !1),
                (e.prototype.isFreeCampaign = !1),
                (e.prototype.numberOfSamplePages = 0),
                (e.prototype.numberOfComments = 0),
                (e.prototype.updatedDate = ''),
                (e.prototype.endDate = ''),
                (e.prototype.isPurchased = !1),
                (e.prototype.isSubscribed = !1),
                (e.prototype.firstPageImageUrl = ''),
                (e.prototype.campaign = ''),
                (e.prototype.longDescription = ''),
                (e.prototype.magazineName = ''),
                (e.prototype.cashBack = null),
                (e.prototype.isRead = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(8).uint32(e.magazineIssueId),
                    null != e.magazineIssueName &&
                      Object.hasOwnProperty.call(e, 'magazineIssueName') &&
                      t.uint32(18).string(e.magazineIssueName),
                    null != e.thumbnailUrl &&
                      Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                      t.uint32(26).string(e.thumbnailUrl),
                    null != e.paidPoint &&
                      Object.hasOwnProperty.call(e, 'paidPoint') &&
                      t.uint32(32).uint32(e.paidPoint),
                    null != e.campaignPaidPoint &&
                      Object.hasOwnProperty.call(e, 'campaignPaidPoint') &&
                      t.uint32(40).uint32(e.campaignPaidPoint),
                    null != e.isDiscountCampaign &&
                      Object.hasOwnProperty.call(e, 'isDiscountCampaign') &&
                      t.uint32(48).bool(e.isDiscountCampaign),
                    null != e.isFreeCampaign &&
                      Object.hasOwnProperty.call(e, 'isFreeCampaign') &&
                      t.uint32(56).bool(e.isFreeCampaign),
                    null != e.numberOfSamplePages &&
                      Object.hasOwnProperty.call(e, 'numberOfSamplePages') &&
                      t.uint32(64).uint32(e.numberOfSamplePages),
                    null != e.numberOfComments &&
                      Object.hasOwnProperty.call(e, 'numberOfComments') &&
                      t.uint32(72).uint32(e.numberOfComments),
                    null != e.updatedDate &&
                      Object.hasOwnProperty.call(e, 'updatedDate') &&
                      t.uint32(82).string(e.updatedDate),
                    null != e.endDate &&
                      Object.hasOwnProperty.call(e, 'endDate') &&
                      t.uint32(90).string(e.endDate),
                    null != e.isPurchased &&
                      Object.hasOwnProperty.call(e, 'isPurchased') &&
                      t.uint32(96).bool(e.isPurchased),
                    null != e.isSubscribed &&
                      Object.hasOwnProperty.call(e, 'isSubscribed') &&
                      t.uint32(104).bool(e.isSubscribed),
                    null != e.firstPageImageUrl &&
                      Object.hasOwnProperty.call(e, 'firstPageImageUrl') &&
                      t.uint32(114).string(e.firstPageImageUrl),
                    null != e.campaign &&
                      Object.hasOwnProperty.call(e, 'campaign') &&
                      t.uint32(122).string(e.campaign),
                    null != e.longDescription &&
                      Object.hasOwnProperty.call(e, 'longDescription') &&
                      t.uint32(130).string(e.longDescription),
                    null != e.magazineName &&
                      Object.hasOwnProperty.call(e, 'magazineName') &&
                      t.uint32(138).string(e.magazineName),
                    null != e.cashBack &&
                      Object.hasOwnProperty.call(e, 'cashBack') &&
                      s.v1.UserPoint.encode(
                        e.cashBack,
                        t.uint32(146).fork()
                      ).ldelim(),
                    null != e.isRead &&
                      Object.hasOwnProperty.call(e, 'isRead') &&
                      t.uint32(152).bool(e.isRead),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineIssue();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.magazineIssueId = e.uint32()
                        break
                      case 2:
                        r.magazineIssueName = e.string()
                        break
                      case 3:
                        r.thumbnailUrl = e.string()
                        break
                      case 4:
                        r.paidPoint = e.uint32()
                        break
                      case 5:
                        r.campaignPaidPoint = e.uint32()
                        break
                      case 6:
                        r.isDiscountCampaign = e.bool()
                        break
                      case 7:
                        r.isFreeCampaign = e.bool()
                        break
                      case 8:
                        r.numberOfSamplePages = e.uint32()
                        break
                      case 9:
                        r.numberOfComments = e.uint32()
                        break
                      case 10:
                        r.updatedDate = e.string()
                        break
                      case 11:
                        r.endDate = e.string()
                        break
                      case 12:
                        r.isPurchased = e.bool()
                        break
                      case 13:
                        r.isSubscribed = e.bool()
                        break
                      case 14:
                        r.firstPageImageUrl = e.string()
                        break
                      case 15:
                        r.campaign = e.string()
                        break
                      case 16:
                        r.longDescription = e.string()
                        break
                      case 17:
                        r.magazineName = e.string()
                        break
                      case 18:
                        r.cashBack = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 19:
                        r.isRead = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Comment = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.commentId = 0),
                (e.prototype.index = 0),
                (e.prototype.isMyComment = !1),
                (e.prototype.alreadyLiked = !1),
                (e.prototype.numberOfLikes = 0),
                (e.prototype.body = ''),
                (e.prototype.created = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(8).uint32(e.commentId),
                    null != e.index &&
                      Object.hasOwnProperty.call(e, 'index') &&
                      t.uint32(16).uint32(e.index),
                    null != e.isMyComment &&
                      Object.hasOwnProperty.call(e, 'isMyComment') &&
                      t.uint32(24).bool(e.isMyComment),
                    null != e.alreadyLiked &&
                      Object.hasOwnProperty.call(e, 'alreadyLiked') &&
                      t.uint32(32).bool(e.alreadyLiked),
                    null != e.numberOfLikes &&
                      Object.hasOwnProperty.call(e, 'numberOfLikes') &&
                      t.uint32(40).uint32(e.numberOfLikes),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(50).string(e.body),
                    null != e.created &&
                      Object.hasOwnProperty.call(e, 'created') &&
                      t.uint32(58).string(e.created),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Comment();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.commentId = e.uint32()
                        break
                      case 2:
                        r.index = e.uint32()
                        break
                      case 3:
                        r.isMyComment = e.bool()
                        break
                      case 4:
                        r.alreadyLiked = e.bool()
                        break
                      case 5:
                        r.numberOfLikes = e.uint32()
                        break
                      case 6:
                        r.body = e.string()
                        break
                      case 7:
                        r.created = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ViewerPage = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              var t
              return (
                (e.prototype.image = null),
                (e.prototype.webview = null),
                (e.prototype.lastPage = null),
                Object.defineProperty(e.prototype, 'content', {
                  get: i.oneOfGetter((t = ['image', 'webview', 'lastPage'])),
                  set: i.oneOfSetter(t),
                }),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.image &&
                      Object.hasOwnProperty.call(e, 'image') &&
                      s.v1.ViewerPage.Image.encode(
                        e.image,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.webview &&
                      Object.hasOwnProperty.call(e, 'webview') &&
                      s.v1.ViewerPage.WebView.encode(
                        e.webview,
                        t.uint32(18).fork()
                      ).ldelim(),
                    null != e.lastPage &&
                      Object.hasOwnProperty.call(e, 'lastPage') &&
                      s.v1.ViewerPage.LastPage.encode(
                        e.lastPage,
                        t.uint32(26).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ViewerPage();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.image = s.v1.ViewerPage.Image.decode(e, e.uint32())
                        break
                      case 2:
                        r.webview = s.v1.ViewerPage.WebView.decode(
                          e,
                          e.uint32()
                        )
                        break
                      case 3:
                        r.lastPage = s.v1.ViewerPage.LastPage.decode(
                          e,
                          e.uint32()
                        )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Image = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.imageUrl = ''),
                    (e.prototype.urlScheme = ''),
                    (e.prototype.iv = ''),
                    (e.prototype.encryptionKey = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.imageUrl &&
                          Object.hasOwnProperty.call(e, 'imageUrl') &&
                          t.uint32(10).string(e.imageUrl),
                        null != e.urlScheme &&
                          Object.hasOwnProperty.call(e, 'urlScheme') &&
                          t.uint32(18).string(e.urlScheme),
                        null != e.iv &&
                          Object.hasOwnProperty.call(e, 'iv') &&
                          t.uint32(26).string(e.iv),
                        null != e.encryptionKey &&
                          Object.hasOwnProperty.call(e, 'encryptionKey') &&
                          t.uint32(34).string(e.encryptionKey),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.ViewerPage.Image();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.imageUrl = e.string()
                            break
                          case 2:
                            r.urlScheme = e.string()
                            break
                          case 3:
                            r.iv = e.string()
                            break
                          case 4:
                            r.encryptionKey = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                (e.WebView = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.url = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.url &&
                          Object.hasOwnProperty.call(e, 'url') &&
                          t.uint32(10).string(e.url),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.ViewerPage.WebView();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.url = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                (e.LastPage = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.encode = function (e, t) {
                      return t || (t = a.create()), t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.ViewerPage.LastPage();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        e.skipType(7 & a)
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.PointHistory = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.detail = ''),
                (e.prototype.item = null),
                (e.prototype.acquiredTime = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.detail &&
                      Object.hasOwnProperty.call(e, 'detail') &&
                      t.uint32(10).string(e.detail),
                    null != e.item &&
                      Object.hasOwnProperty.call(e, 'item') &&
                      s.v1.UserPoint.encode(
                        e.item,
                        t.uint32(18).fork()
                      ).ldelim(),
                    null != e.acquiredTime &&
                      Object.hasOwnProperty.call(e, 'acquiredTime') &&
                      t.uint32(26).string(e.acquiredTime),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PointHistory();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.detail = e.string()
                        break
                      case 2:
                        r.item = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 3:
                        r.acquiredTime = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Popup = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              var t
              return (
                (e.prototype.appDefault = null),
                (e.prototype.reviewPopup = null),
                Object.defineProperty(e.prototype, 'popup', {
                  get: i.oneOfGetter((t = ['appDefault', 'reviewPopup'])),
                  set: i.oneOfSetter(t),
                }),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.appDefault &&
                      Object.hasOwnProperty.call(e, 'appDefault') &&
                      s.v1.Popup.AppDefaultPopup.encode(
                        e.appDefault,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.reviewPopup &&
                      Object.hasOwnProperty.call(e, 'reviewPopup') &&
                      s.v1.Popup.ReviewPopup.encode(
                        e.reviewPopup,
                        t.uint32(18).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Popup();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.appDefault = s.v1.Popup.AppDefaultPopup.decode(
                          e,
                          e.uint32()
                        )
                        break
                      case 2:
                        r.reviewPopup = s.v1.Popup.ReviewPopup.decode(
                          e,
                          e.uint32()
                        )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.AppDefaultPopup = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.id = 0),
                    (e.prototype.personalPopupId = 0),
                    (e.prototype.subject = ''),
                    (e.prototype.body = ''),
                    (e.prototype.imageUrl = ''),
                    (e.prototype.urlScheme = ''),
                    (e.prototype.okButton = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.id &&
                          Object.hasOwnProperty.call(e, 'id') &&
                          t.uint32(8).uint32(e.id),
                        null != e.personalPopupId &&
                          Object.hasOwnProperty.call(e, 'personalPopupId') &&
                          t.uint32(16).uint32(e.personalPopupId),
                        null != e.subject &&
                          Object.hasOwnProperty.call(e, 'subject') &&
                          t.uint32(26).string(e.subject),
                        null != e.body &&
                          Object.hasOwnProperty.call(e, 'body') &&
                          t.uint32(34).string(e.body),
                        null != e.imageUrl &&
                          Object.hasOwnProperty.call(e, 'imageUrl') &&
                          t.uint32(42).string(e.imageUrl),
                        null != e.urlScheme &&
                          Object.hasOwnProperty.call(e, 'urlScheme') &&
                          t.uint32(50).string(e.urlScheme),
                        null != e.okButton &&
                          Object.hasOwnProperty.call(e, 'okButton') &&
                          t.uint32(58).string(e.okButton),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.Popup.AppDefaultPopup();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.id = e.uint32()
                            break
                          case 2:
                            r.personalPopupId = e.uint32()
                            break
                          case 3:
                            r.subject = e.string()
                            break
                          case 4:
                            r.body = e.string()
                            break
                          case 5:
                            r.imageUrl = e.string()
                            break
                          case 6:
                            r.urlScheme = e.string()
                            break
                          case 7:
                            r.okButton = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                (e.ReviewPopup = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.encode = function (e, t) {
                      return t || (t = a.create()), t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.Popup.ReviewPopup();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        e.skipType(7 & a)
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.Sns = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.body = ''),
                (e.prototype.url = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(10).string(e.body),
                    null != e.url &&
                      Object.hasOwnProperty.call(e, 'url') &&
                      t.uint32(18).string(e.url),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Sns();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.body = e.string()
                        break
                      case 2:
                        r.url = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SpecialImage = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.id = 0),
                (e.prototype.imageWidth = 0),
                (e.prototype.imageHeight = 0),
                (e.prototype.imageUrl = ''),
                (e.prototype.urlScheme = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.id &&
                      Object.hasOwnProperty.call(e, 'id') &&
                      t.uint32(8).uint32(e.id),
                    null != e.imageWidth &&
                      Object.hasOwnProperty.call(e, 'imageWidth') &&
                      t.uint32(16).uint32(e.imageWidth),
                    null != e.imageHeight &&
                      Object.hasOwnProperty.call(e, 'imageHeight') &&
                      t.uint32(24).uint32(e.imageHeight),
                    null != e.imageUrl &&
                      Object.hasOwnProperty.call(e, 'imageUrl') &&
                      t.uint32(34).string(e.imageUrl),
                    null != e.urlScheme &&
                      Object.hasOwnProperty.call(e, 'urlScheme') &&
                      t.uint32(42).string(e.urlScheme),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SpecialImage();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.id = e.uint32()
                        break
                      case 2:
                        r.imageWidth = e.uint32()
                        break
                      case 3:
                        r.imageHeight = e.uint32()
                        break
                      case 4:
                        r.imageUrl = e.string()
                        break
                      case 5:
                        r.urlScheme = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SubscriptionItem = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.productId = ''),
                (e.prototype.name = ''),
                (e.prototype.item = null),
                (e.prototype.label = ''),
                (e.prototype.imageUrl = ''),
                (e.prototype.status = 0),
                (e.prototype.monthlyPrice = 0),
                (e.prototype.nextUpdateTiming = ''),
                (e.prototype.buttonText = ''),
                (e.prototype.cancelButtonState = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.productId &&
                      Object.hasOwnProperty.call(e, 'productId') &&
                      t.uint32(10).string(e.productId),
                    null != e.name &&
                      Object.hasOwnProperty.call(e, 'name') &&
                      t.uint32(18).string(e.name),
                    null != e.item &&
                      Object.hasOwnProperty.call(e, 'item') &&
                      s.v1.UserPoint.encode(
                        e.item,
                        t.uint32(26).fork()
                      ).ldelim(),
                    null != e.label &&
                      Object.hasOwnProperty.call(e, 'label') &&
                      t.uint32(34).string(e.label),
                    null != e.imageUrl &&
                      Object.hasOwnProperty.call(e, 'imageUrl') &&
                      t.uint32(42).string(e.imageUrl),
                    null != e.status &&
                      Object.hasOwnProperty.call(e, 'status') &&
                      t.uint32(48).int32(e.status),
                    null != e.monthlyPrice &&
                      Object.hasOwnProperty.call(e, 'monthlyPrice') &&
                      t.uint32(56).uint32(e.monthlyPrice),
                    null != e.nextUpdateTiming &&
                      Object.hasOwnProperty.call(e, 'nextUpdateTiming') &&
                      t.uint32(66).string(e.nextUpdateTiming),
                    null != e.buttonText &&
                      Object.hasOwnProperty.call(e, 'buttonText') &&
                      t.uint32(74).string(e.buttonText),
                    null != e.cancelButtonState &&
                      Object.hasOwnProperty.call(e, 'cancelButtonState') &&
                      t.uint32(80).int32(e.cancelButtonState),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SubscriptionItem();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.productId = e.string()
                        break
                      case 2:
                        r.name = e.string()
                        break
                      case 3:
                        r.item = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 4:
                        r.label = e.string()
                        break
                      case 5:
                        r.imageUrl = e.string()
                        break
                      case 6:
                        r.status = e.int32()
                        break
                      case 7:
                        r.monthlyPrice = e.uint32()
                        break
                      case 8:
                        r.nextUpdateTiming = e.string()
                        break
                      case 9:
                        r.buttonText = e.string()
                        break
                      case 10:
                        r.cancelButtonState = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Status = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'UNSUBSCRIBED')] = 0),
                    (t[(e[1] = 'SUBSCRIBED')] = 1),
                    (t[(e[2] = 'NOT_AVAILABLE')] = 2),
                    (t[(e[3] = 'OTHER_PLATFORM')] = 3),
                    t
                  )
                })()),
                (e.CancelButtonState = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'HIDDEN')] = 0),
                    (t[(e[1] = 'CANCELLABLE')] = 1),
                    (t[(e[2] = 'RESUBSCRIBABLE')] = 2),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.SubscriptionCourse = (function () {
              function e(e) {
                if (((this.items = []), (this.magazines = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.headerText = ''),
                (e.prototype.items = i.emptyArray),
                (e.prototype.magazines = i.emptyArray),
                (e.prototype.courseDescription = ''),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.headerText &&
                      Object.hasOwnProperty.call(e, 'headerText') &&
                      t.uint32(10).string(e.headerText),
                    null != e.items && e.items.length)
                  )
                    for (var n = 0; n < e.items.length; ++n)
                      s.v1.SubscriptionItem.encode(
                        e.items[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (null != e.magazines && e.magazines.length)
                    for (var r = 0; r < e.magazines.length; ++r)
                      s.v1.Magazine.encode(
                        e.magazines[r],
                        t.uint32(26).fork()
                      ).ldelim()
                  return (
                    null != e.courseDescription &&
                      Object.hasOwnProperty.call(e, 'courseDescription') &&
                      t.uint32(34).string(e.courseDescription),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SubscriptionCourse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.headerText = e.string()
                        break
                      case 2:
                        ;(r.items && r.items.length) || (r.items = []),
                          r.items.push(
                            s.v1.SubscriptionItem.decode(e, e.uint32())
                          )
                        break
                      case 3:
                        ;(r.magazines && r.magazines.length) ||
                          (r.magazines = []),
                          r.magazines.push(s.v1.Magazine.decode(e, e.uint32()))
                        break
                      case 4:
                        r.courseDescription = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Tag = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.id = 0),
                (e.prototype.name = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.id &&
                      Object.hasOwnProperty.call(e, 'id') &&
                      t.uint32(8).uint32(e.id),
                    null != e.name &&
                      Object.hasOwnProperty.call(e, 'name') &&
                      t.uint32(18).string(e.name),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Tag();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.id = e.uint32()
                        break
                      case 2:
                        r.name = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.UserPoint = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.event = 0),
                (e.prototype.paid = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.event &&
                      Object.hasOwnProperty.call(e, 'event') &&
                      t.uint32(8).uint32(e.event),
                    null != e.paid &&
                      Object.hasOwnProperty.call(e, 'paid') &&
                      t.uint32(16).uint32(e.paid),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.UserPoint();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.event = e.uint32()
                        break
                      case 2:
                        r.paid = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Koma = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.komaId = 0),
                (e.prototype.mangaId = 0),
                (e.prototype.mangaName = ''),
                (e.prototype.imageUrl = ''),
                (e.prototype.shortDescription = ''),
                (e.prototype.longDescription = ''),
                (e.prototype.campaign = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.komaId &&
                      Object.hasOwnProperty.call(e, 'komaId') &&
                      t.uint32(8).uint32(e.komaId),
                    null != e.mangaId &&
                      Object.hasOwnProperty.call(e, 'mangaId') &&
                      t.uint32(16).uint32(e.mangaId),
                    null != e.mangaName &&
                      Object.hasOwnProperty.call(e, 'mangaName') &&
                      t.uint32(26).string(e.mangaName),
                    null != e.imageUrl &&
                      Object.hasOwnProperty.call(e, 'imageUrl') &&
                      t.uint32(34).string(e.imageUrl),
                    null != e.shortDescription &&
                      Object.hasOwnProperty.call(e, 'shortDescription') &&
                      t.uint32(42).string(e.shortDescription),
                    null != e.longDescription &&
                      Object.hasOwnProperty.call(e, 'longDescription') &&
                      t.uint32(50).string(e.longDescription),
                    null != e.campaign &&
                      Object.hasOwnProperty.call(e, 'campaign') &&
                      t.uint32(58).string(e.campaign),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Koma();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.komaId = e.uint32()
                        break
                      case 2:
                        r.mangaId = e.uint32()
                        break
                      case 3:
                        r.mangaName = e.string()
                        break
                      case 4:
                        r.imageUrl = e.string()
                        break
                      case 5:
                        r.shortDescription = e.string()
                        break
                      case 6:
                        r.longDescription = e.string()
                        break
                      case 7:
                        r.campaign = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.News = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.newsId = 0),
                (e.prototype.subject = ''),
                (e.prototype.body = ''),
                (e.prototype.published = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.newsId &&
                      Object.hasOwnProperty.call(e, 'newsId') &&
                      t.uint32(8).uint32(e.newsId),
                    null != e.subject &&
                      Object.hasOwnProperty.call(e, 'subject') &&
                      t.uint32(18).string(e.subject),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(26).string(e.body),
                    null != e.published &&
                      Object.hasOwnProperty.call(e, 'published') &&
                      t.uint32(34).string(e.published),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.News();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.newsId = e.uint32()
                        break
                      case 2:
                        r.subject = e.string()
                        break
                      case 3:
                        r.body = e.string()
                        break
                      case 4:
                        r.published = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.Contact = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.id = 0),
                (e.prototype.body = ''),
                (e.prototype.contactType = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.id &&
                      Object.hasOwnProperty.call(e, 'id') &&
                      t.uint32(8).uint32(e.id),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(18).string(e.body),
                    null != e.contactType &&
                      Object.hasOwnProperty.call(e, 'contactType') &&
                      t.uint32(24).int32(e.contactType),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Contact();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.id = e.uint32()
                        break
                      case 2:
                        r.body = e.string()
                        break
                      case 3:
                        r.contactType = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.ContactType = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'FROM_USER')] = 0),
                    (t[(e[1] = 'TO_USER')] = 1),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.Yell = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.id = 0),
                (e.prototype.handleName = ''),
                (e.prototype.message = ''),
                (e.prototype.paidPoint = 0),
                (e.prototype.isMyYell = !1),
                (e.prototype.createdDate = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.id &&
                      Object.hasOwnProperty.call(e, 'id') &&
                      t.uint32(8).uint32(e.id),
                    null != e.handleName &&
                      Object.hasOwnProperty.call(e, 'handleName') &&
                      t.uint32(18).string(e.handleName),
                    null != e.message &&
                      Object.hasOwnProperty.call(e, 'message') &&
                      t.uint32(26).string(e.message),
                    null != e.paidPoint &&
                      Object.hasOwnProperty.call(e, 'paidPoint') &&
                      t.uint32(32).uint32(e.paidPoint),
                    null != e.isMyYell &&
                      Object.hasOwnProperty.call(e, 'isMyYell') &&
                      t.uint32(40).bool(e.isMyYell),
                    null != e.createdDate &&
                      Object.hasOwnProperty.call(e, 'createdDate') &&
                      t.uint32(50).string(e.createdDate),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Yell();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.id = e.uint32()
                        break
                      case 2:
                        r.handleName = e.string()
                        break
                      case 3:
                        r.message = e.string()
                        break
                      case 4:
                        r.paidPoint = e.uint32()
                        break
                      case 5:
                        r.isMyYell = e.bool()
                        break
                      case 6:
                        r.createdDate = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseResult = (function () {
              var e = {},
                t = Object.create(e)
              return (t[(e[0] = 'VALID')] = 0), (t[(e[1] = 'INVALID')] = 1), t
            })()),
            (e.Error = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.subject = ''),
                (e.prototype.body = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.subject &&
                      Object.hasOwnProperty.call(e, 'subject') &&
                      t.uint32(10).string(e.subject),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(18).string(e.body),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.Error();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.subject = e.string()
                        break
                      case 2:
                        r.body = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MainService = (function () {
              function e(e, t, n) {
                r.rpc.Service.call(this, e, t, n)
              }
              return (
                ((e.prototype = Object.create(
                  r.rpc.Service.prototype
                )).constructor = e),
                Object.defineProperty(
                  (e.prototype.purchaseOnAppStore = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PurchaseOnAppStoreRequest,
                      s.v1.PurchaseOnAppStoreResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PurchaseOnAppStore',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.restoreSubscriptionOnAppStore = function e(
                    t,
                    n
                  ) {
                    return this.rpcCall(
                      e,
                      s.v1.RestoreSubscriptionOnAppStoreRequest,
                      s.v1.RestoreSubscriptionOnAppStoreResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'RestoreSubscriptionOnAppStore',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.bookIssuesToPurchaseInBulk = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.BookIssuesToPurchaseInBulkRequest,
                      s.v1.BookIssuesToPurchaseInBulkResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'BookIssuesToPurchaseInBulk',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.home = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.HomeRequest,
                      s.v1.HomeResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'Home',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.mangaList = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.MangaListRequest,
                      s.v1.MangaListResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'MangaList',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.pointHistory = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PointHistoryRequest,
                      s.v1.PointHistoryResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PointHistory',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.authorDetail = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.AuthorDetailRequest,
                      s.v1.AuthorDetailResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'AuthorDetail',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.mangaViewer = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.MangaViewerRequest,
                      s.v1.MangaViewerResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'MangaViewer',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.backgroundDownload = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.BackgroundDownloadRequest,
                      s.v1.BackgroundDownloadResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'BackgroundDownload',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.bookViewer = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.BookViewerRequest,
                      s.v1.BookViewerResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'BookViewer',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.magazineIssueDetail = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.MagazineIssueDetailRequest,
                      s.v1.MagazineIssueDetailResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'MagazineIssueDetail',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.mangasByDayOfWeek = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.MangasByDayOfWeekRequest,
                      s.v1.MangasByDayOfWeekResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'MangasByDayOfWeek',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.register = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.RegisterRequest,
                      s.v1.RegisterResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'Register',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.billingItemList = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.BillingItemListRequest,
                      s.v1.BillingItemListResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'BillingItemList',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.chapterLastPage = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.ChapterLastPageRequest,
                      s.v1.ChapterLastPageResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'ChapterLastPage',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.magazineIssueLastPage = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.MagazineIssueLastPageRequest,
                      s.v1.MagazineIssueLastPageResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'MagazineIssueLastPage',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.search = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.SearchRequest,
                      s.v1.SearchResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'Search',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.bookIssueDetail = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.BookIssueDetailRequest,
                      s.v1.BookIssueDetailResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'BookIssueDetail',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.getChapterComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.GetChapterCommentRequest,
                      s.v1.GetChapterCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'GetChapterComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.postChapterComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PostChapterCommentRequest,
                      s.v1.PostChapterCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PostChapterComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.deleteChapterComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.DeleteChapterCommentRequest,
                      s.v1.DeleteChapterCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'DeleteChapterComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.getBookIssueComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.GetBookIssueCommentRequest,
                      s.v1.GetBookIssueCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'GetBookIssueComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.postBookIssueComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PostBookIssueCommentRequest,
                      s.v1.PostBookIssueCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PostBookIssueComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.deleteBookIssueComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.DeleteBookIssueCommentRequest,
                      s.v1.DeleteBookIssueCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'DeleteBookIssueComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.getMagazineIssueComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.GetMagazineIssueCommentRequest,
                      s.v1.GetMagazineIssueCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'GetMagazineIssueComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.postMagazineIssueComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PostMagazineIssueCommentRequest,
                      s.v1.PostMagazineIssueCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PostMagazineIssueComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.deleteMagazineIssueComment = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.DeleteMagazineIssueCommentRequest,
                      s.v1.DeleteMagazineIssueCommentResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'DeleteMagazineIssueComment',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.news = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.NewsRequest,
                      s.v1.NewsResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'News',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.shelf = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.ShelfRequest,
                      s.v1.ShelfResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'Shelf',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.bookIssueLastPage = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.BookIssueLastPageRequest,
                      s.v1.BookIssueLastPageResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'BookIssueLastPage',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.putChapterCommentLike = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PutChapterCommentLikeRequest,
                      s.v1.PutChapterCommentLikeResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PutChapterCommentLike',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.deleteChapterCommentLike = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.DeleteChapterCommentLikeRequest,
                      s.v1.DeleteChapterCommentLikeResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'DeleteChapterCommentLike',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.putBookIssueCommentLike = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PutBookIssueCommentLikeRequest,
                      s.v1.PutBookIssueCommentLikeResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PutBookIssueCommentLike',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.deleteBookIssueCommentLike = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.DeleteBookIssueCommentLikeRequest,
                      s.v1.DeleteBookIssueCommentLikeResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'DeleteBookIssueCommentLike',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.putMagazineIssueCommentLike = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PutMagazineIssueCommentLikeRequest,
                      s.v1.PutMagazineIssueCommentLikeResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PutMagazineIssueCommentLike',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.deleteMagazineIssueCommentLike = function e(
                    t,
                    n
                  ) {
                    return this.rpcCall(
                      e,
                      s.v1.DeleteMagazineIssueCommentLikeRequest,
                      s.v1.DeleteMagazineIssueCommentLikeResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'DeleteMagazineIssueCommentLike',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.magazineViewer = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.MagazineViewerRequest,
                      s.v1.MagazineViewerResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'MagazineViewer',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.purchaseOnPlayStore = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PurchaseOnPlayStoreRequest,
                      s.v1.PurchaseOnPlayStoreResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PurchaseOnPlayStore',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.restoreSubscriptionOnPlayStore = function e(
                    t,
                    n
                  ) {
                    return this.rpcCall(
                      e,
                      s.v1.RestoreSubscriptionOnPlayStoreRequest,
                      s.v1.RestoreSubscriptionOnPlayStoreResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'RestoreSubscriptionOnPlayStore',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.special = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.SpecialRequest,
                      s.v1.SpecialResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'Special',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.bookIssueRanking = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.BookIssueRankingRequest,
                      s.v1.BookIssueRankingResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'BookIssueRanking',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.contactUs = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.ContactUsRequest,
                      s.v1.ContactUsResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'ContactUs',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.mangaDetail = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.MangaDetailRequest,
                      s.v1.MangaDetailResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'MangaDetail',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.point = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PointRequest,
                      s.v1.PointResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'Point',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.store = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.StoreRequest,
                      s.v1.StoreResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'Store',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.getYellList = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.YellListRequest,
                      s.v1.YellListResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'GetYellList',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.reportYell = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.ReportYellRequest,
                      s.v1.ReportYellResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'ReportYell',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.yell = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.YellRequest,
                      s.v1.YellResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'Yell',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.purchaseMagazineIssue = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PurchaseMagazineIssueRequest,
                      s.v1.PurchaseMagazineIssueResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PurchaseMagazineIssue',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.purchaseBookIssue = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.PurchaseBookIssueRequest,
                      s.v1.PurchaseBookIssueResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'PurchaseBookIssue',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.subscriptionItemList = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.SubscriptionItemListRequest,
                      s.v1.SubscriptionItemListResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'SubscriptionItemList',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.setChapterLike = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.ChapterLikeRequest,
                      s.v1.ChapterLikeResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'SetChapterLike',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.setMangaFavorite = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.MangaFavoriteRequest,
                      s.v1.MangaFavoriteResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'SetMangaFavorite',
                  }
                ),
                Object.defineProperty(
                  (e.prototype.setBookIssueWith = function e(t, n) {
                    return this.rpcCall(
                      e,
                      s.v1.BookIssueWishRequest,
                      s.v1.BookIssueWishResponse,
                      t,
                      n
                    )
                  }),
                  'name',
                  {
                    value: 'SetBookIssueWith',
                  }
                ),
                e
              )
            })()),
            (e.BannerClickRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.location = 0),
                (e.prototype.bannerId = 0),
                (e.prototype.index = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.location &&
                      Object.hasOwnProperty.call(e, 'location') &&
                      t.uint32(16).int32(e.location),
                    null != e.bannerId &&
                      Object.hasOwnProperty.call(e, 'bannerId') &&
                      t.uint32(24).uint32(e.bannerId),
                    null != e.index &&
                      Object.hasOwnProperty.call(e, 'index') &&
                      t.uint32(32).uint32(e.index),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BannerClickRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.location = e.int32()
                        break
                      case 3:
                        r.bannerId = e.uint32()
                        break
                      case 4:
                        r.index = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Location = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'TOP')] = 0),
                    (t[(e[1] = 'TOP_SUB')] = 1),
                    (t[(e[2] = 'STORE_TOP')] = 2),
                    (t[(e[3] = 'STORE_NEW_MAGAZINE')] = 3),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.PurchaseOnAppStoreRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.receipt = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.receipt &&
                      Object.hasOwnProperty.call(e, 'receipt') &&
                      t.uint32(18).string(e.receipt),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseOnAppStoreRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.receipt = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseOnAppStoreResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.result = 0),
                (e.prototype.alert = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.result &&
                      Object.hasOwnProperty.call(e, 'result') &&
                      t.uint32(8).int32(e.result),
                    null != e.alert &&
                      Object.hasOwnProperty.call(e, 'alert') &&
                      s.v1.PurchaseOnAppStoreResponse.Alert.encode(
                        e.alert,
                        t.uint32(18).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseOnAppStoreResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.result = e.int32()
                        break
                      case 2:
                        r.alert = s.v1.PurchaseOnAppStoreResponse.Alert.decode(
                          e,
                          e.uint32()
                        )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Alert = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.subject = ''),
                    (e.prototype.body = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.subject &&
                          Object.hasOwnProperty.call(e, 'subject') &&
                          t.uint32(10).string(e.subject),
                        null != e.body &&
                          Object.hasOwnProperty.call(e, 'body') &&
                          t.uint32(18).string(e.body),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.PurchaseOnAppStoreResponse.Alert();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.subject = e.string()
                            break
                          case 2:
                            r.body = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.RestoreSubscriptionOnAppStoreRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.receipt = ''),
                (e.prototype.signature = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.receipt &&
                      Object.hasOwnProperty.call(e, 'receipt') &&
                      t.uint32(18).string(e.receipt),
                    null != e.signature &&
                      Object.hasOwnProperty.call(e, 'signature') &&
                      t.uint32(26).string(e.signature),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.RestoreSubscriptionOnAppStoreRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.receipt = e.string()
                        break
                      case 3:
                        r.signature = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.RestoreSubscriptionOnAppStoreResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.result = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.result &&
                      Object.hasOwnProperty.call(e, 'result') &&
                      t.uint32(8).int32(e.result),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.RestoreSubscriptionOnAppStoreResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.result = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.RestoreResult = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'VALID')] = 0),
                    (t[(e[1] = 'INVALID')] = 1),
                    (t[(e[2] = 'NO_TARGE')] = 2),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.AuthorDetailRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.authorId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.authorId &&
                      Object.hasOwnProperty.call(e, 'authorId') &&
                      t.uint32(16).uint32(e.authorId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.AuthorDetailRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.authorId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.AuthorDetailResponse = (function () {
              function e(e) {
                if (((this.mangas = []), (this.books = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.author = null),
                (e.prototype.mangas = i.emptyArray),
                (e.prototype.books = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.author &&
                      Object.hasOwnProperty.call(e, 'author') &&
                      s.v1.Author.encode(
                        e.author,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.mangas && e.mangas.length)
                  )
                    for (var n = 0; n < e.mangas.length; ++n)
                      s.v1.Manga.encode(
                        e.mangas[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (null != e.books && e.books.length)
                    for (var r = 0; r < e.books.length; ++r)
                      s.v1.Book.encode(e.books[r], t.uint32(26).fork()).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.AuthorDetailResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.author = s.v1.Author.decode(e, e.uint32())
                        break
                      case 2:
                        ;(r.mangas && r.mangas.length) || (r.mangas = []),
                          r.mangas.push(s.v1.Manga.decode(e, e.uint32()))
                        break
                      case 3:
                        ;(r.books && r.books.length) || (r.books = []),
                          r.books.push(s.v1.Book.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BackgroundDownloadRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BackgroundDownloadRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BackgroundDownloadResponse = (function () {
              function e(e) {
                if (((this.imageUrls = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.imageUrls = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.imageUrls && e.imageUrls.length)
                  )
                    for (var n = 0; n < e.imageUrls.length; ++n)
                      t.uint32(10).string(e.imageUrls[n])
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BackgroundDownloadResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.imageUrls && r.imageUrls.length) ||
                          (r.imageUrls = []),
                          r.imageUrls.push(e.string())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BillingItemListRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BillingItemListRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BillingItemListResponse = (function () {
              function e(e) {
                if (((this.billingItems = []), (this.courses = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.billingItems = i.emptyArray),
                (e.prototype.courses = i.emptyArray),
                (e.prototype.rewardUrl = ''),
                (e.prototype.isProfileRegistered = !1),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.billingItems && e.billingItems.length)
                  )
                    for (var n = 0; n < e.billingItems.length; ++n)
                      s.v1.BillingItem.encode(
                        e.billingItems[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (null != e.courses && e.courses.length)
                    for (var r = 0; r < e.courses.length; ++r)
                      s.v1.SubscriptionCourse.encode(
                        e.courses[r],
                        t.uint32(26).fork()
                      ).ldelim()
                  return (
                    null != e.rewardUrl &&
                      Object.hasOwnProperty.call(e, 'rewardUrl') &&
                      t.uint32(34).string(e.rewardUrl),
                    null != e.isProfileRegistered &&
                      Object.hasOwnProperty.call(e, 'isProfileRegistered') &&
                      t.uint32(40).bool(e.isProfileRegistered),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BillingItemListResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        ;(r.billingItems && r.billingItems.length) ||
                          (r.billingItems = []),
                          r.billingItems.push(
                            s.v1.BillingItem.decode(e, e.uint32())
                          )
                        break
                      case 3:
                        ;(r.courses && r.courses.length) || (r.courses = []),
                          r.courses.push(
                            s.v1.SubscriptionCourse.decode(e, e.uint32())
                          )
                        break
                      case 4:
                        r.rewardUrl = e.string()
                        break
                      case 5:
                        r.isProfileRegistered = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssueDetailRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(16).uint32(e.bookIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueDetailRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssueDetailResponse = (function () {
              function e(e) {
                if (
                  ((this.bookIssues = []),
                  (this.authorships = []),
                  (this.tags = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.bookName = ''),
                (e.prototype.pickupBookIssue = null),
                (e.prototype.bookIssues = i.emptyArray),
                (e.prototype.authorships = i.emptyArray),
                (e.prototype.tags = i.emptyArray),
                (e.prototype.isHideBulkPurchaseButton = !1),
                (e.prototype.isCommentEnabled = !1),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookName &&
                      Object.hasOwnProperty.call(e, 'bookName') &&
                      t.uint32(18).string(e.bookName),
                    null != e.pickupBookIssue &&
                      Object.hasOwnProperty.call(e, 'pickupBookIssue') &&
                      s.v1.BookIssue.encode(
                        e.pickupBookIssue,
                        t.uint32(26).fork()
                      ).ldelim(),
                    null != e.bookIssues && e.bookIssues.length)
                  )
                    for (var n = 0; n < e.bookIssues.length; ++n)
                      s.v1.BookIssue.encode(
                        e.bookIssues[n],
                        t.uint32(34).fork()
                      ).ldelim()
                  if (null != e.authorships && e.authorships.length)
                    for (var r = 0; r < e.authorships.length; ++r)
                      s.v1.Authorship.encode(
                        e.authorships[r],
                        t.uint32(42).fork()
                      ).ldelim()
                  if (null != e.tags && e.tags.length)
                    for (var o = 0; o < e.tags.length; ++o)
                      s.v1.Tag.encode(e.tags[o], t.uint32(50).fork()).ldelim()
                  return (
                    null != e.isHideBulkPurchaseButton &&
                      Object.hasOwnProperty.call(
                        e,
                        'isHideBulkPurchaseButton'
                      ) &&
                      t.uint32(56).bool(e.isHideBulkPurchaseButton),
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(64).bool(e.isCommentEnabled),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueDetailResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookName = e.string()
                        break
                      case 3:
                        r.pickupBookIssue = s.v1.BookIssue.decode(e, e.uint32())
                        break
                      case 4:
                        ;(r.bookIssues && r.bookIssues.length) ||
                          (r.bookIssues = []),
                          r.bookIssues.push(
                            s.v1.BookIssue.decode(e, e.uint32())
                          )
                        break
                      case 5:
                        ;(r.authorships && r.authorships.length) ||
                          (r.authorships = []),
                          r.authorships.push(
                            s.v1.Authorship.decode(e, e.uint32())
                          )
                        break
                      case 6:
                        ;(r.tags && r.tags.length) || (r.tags = []),
                          r.tags.push(s.v1.Tag.decode(e, e.uint32()))
                        break
                      case 7:
                        r.isHideBulkPurchaseButton = e.bool()
                        break
                      case 8:
                        r.isCommentEnabled = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssueLastPageRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(16).uint32(e.bookIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueLastPageRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssueLastPageResponse = (function () {
              function e(e) {
                if (((this.authorships = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              var t
              return (
                (e.prototype.userPoint = null),
                (e.prototype.authorships = i.emptyArray),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.numberOfComments = 0),
                (e.prototype.nextBookIssue = null),
                (e.prototype.latestMagazineIssue = null),
                (e.prototype.recommendedMangas = null),
                Object.defineProperty(e.prototype, 'lastPageContent', {
                  get: i.oneOfGetter(
                    (t = [
                      'nextBookIssue',
                      'latestMagazineIssue',
                      'recommendedMangas',
                    ])
                  ),
                  set: i.oneOfSetter(t),
                }),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.authorships && e.authorships.length)
                  )
                    for (var n = 0; n < e.authorships.length; ++n)
                      s.v1.Authorship.encode(
                        e.authorships[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  return (
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(24).bool(e.isCommentEnabled),
                    null != e.numberOfComments &&
                      Object.hasOwnProperty.call(e, 'numberOfComments') &&
                      t.uint32(32).uint32(e.numberOfComments),
                    null != e.nextBookIssue &&
                      Object.hasOwnProperty.call(e, 'nextBookIssue') &&
                      s.v1.BookIssue.encode(
                        e.nextBookIssue,
                        t.uint32(42).fork()
                      ).ldelim(),
                    null != e.latestMagazineIssue &&
                      Object.hasOwnProperty.call(e, 'latestMagazineIssue') &&
                      s.v1.MagazineIssue.encode(
                        e.latestMagazineIssue,
                        t.uint32(50).fork()
                      ).ldelim(),
                    null != e.recommendedMangas &&
                      Object.hasOwnProperty.call(e, 'recommendedMangas') &&
                      s.v1.BookIssueLastPageResponse.RecommendedMangas.encode(
                        e.recommendedMangas,
                        t.uint32(58).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueLastPageResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        ;(r.authorships && r.authorships.length) ||
                          (r.authorships = []),
                          r.authorships.push(
                            s.v1.Authorship.decode(e, e.uint32())
                          )
                        break
                      case 3:
                        r.isCommentEnabled = e.bool()
                        break
                      case 4:
                        r.numberOfComments = e.uint32()
                        break
                      case 5:
                        r.nextBookIssue = s.v1.BookIssue.decode(e, e.uint32())
                        break
                      case 6:
                        r.latestMagazineIssue = s.v1.MagazineIssue.decode(
                          e,
                          e.uint32()
                        )
                        break
                      case 7:
                        r.recommendedMangas =
                          s.v1.BookIssueLastPageResponse.RecommendedMangas.decode(
                            e,
                            e.uint32()
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.RecommendedMangas = (function () {
                  function e(e) {
                    if (((this.recommendedMangas = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.recommendedMangas = i.emptyArray),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.recommendedMangas &&
                          e.recommendedMangas.length)
                      )
                        for (var n = 0; n < e.recommendedMangas.length; ++n)
                          s.v1.Manga.encode(
                            e.recommendedMangas[n],
                            t.uint32(10).fork()
                          ).ldelim()
                      return t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r =
                            new s.v1.BookIssueLastPageResponse.RecommendedMangas();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            ;(r.recommendedMangas &&
                              r.recommendedMangas.length) ||
                              (r.recommendedMangas = []),
                              r.recommendedMangas.push(
                                s.v1.Manga.decode(e, e.uint32())
                              )
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.BookIssueRankingRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueRankingRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssueRankingResponse = (function () {
              function e(e) {
                if (((this.rankings = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.rankings = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.rankings && e.rankings.length)
                  )
                    for (var n = 0; n < e.rankings.length; ++n)
                      s.v1.BookIssueRankingResponse.Ranking.encode(
                        e.rankings[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueRankingResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.rankings && r.rankings.length) || (r.rankings = []),
                          r.rankings.push(
                            s.v1.BookIssueRankingResponse.Ranking.decode(
                              e,
                              e.uint32()
                            )
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Ranking = (function () {
                  function e(e) {
                    if (((this.bookIssues = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.name = ''),
                    (e.prototype.bookIssues = i.emptyArray),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.name &&
                          Object.hasOwnProperty.call(e, 'name') &&
                          t.uint32(10).string(e.name),
                        null != e.bookIssues && e.bookIssues.length)
                      )
                        for (var n = 0; n < e.bookIssues.length; ++n)
                          s.v1.BookIssue.encode(
                            e.bookIssues[n],
                            t.uint32(18).fork()
                          ).ldelim()
                      return t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.BookIssueRankingResponse.Ranking();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.name = e.string()
                            break
                          case 2:
                            ;(r.bookIssues && r.bookIssues.length) ||
                              (r.bookIssues = []),
                              r.bookIssues.push(
                                s.v1.BookIssue.decode(e, e.uint32())
                              )
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.BookIssueShioriRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueId = 0),
                (e.prototype.shioriPage = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(16).uint32(e.bookIssueId),
                    null != e.shioriPage &&
                      Object.hasOwnProperty.call(e, 'shioriPage') &&
                      t.uint32(24).uint32(e.shioriPage),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueShioriRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookIssueId = e.uint32()
                        break
                      case 3:
                        r.shioriPage = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssueShioriResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueShioriResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssueWishRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueId = 0),
                (e.prototype.wished = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(16).uint32(e.bookIssueId),
                    null != e.wished &&
                      Object.hasOwnProperty.call(e, 'wished') &&
                      t.uint32(24).bool(e.wished),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueWishRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookIssueId = e.uint32()
                        break
                      case 3:
                        r.wished = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssueWishResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssueWishResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssuesToPurchaseInBulkRequest = (function () {
              function e(e) {
                if (((this.bookIssueIds = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueIds = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueIds && e.bookIssueIds.length)
                  ) {
                    t.uint32(18).fork()
                    for (var n = 0; n < e.bookIssueIds.length; ++n)
                      t.uint32(e.bookIssueIds[n])
                    t.ldelim()
                  }
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssuesToPurchaseInBulkRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        if (
                          ((r.bookIssueIds && r.bookIssueIds.length) ||
                            (r.bookIssueIds = []),
                          2 === (7 & a))
                        )
                          for (var i = e.uint32() + e.pos; e.pos < i; )
                            r.bookIssueIds.push(e.uint32())
                        else r.bookIssueIds.push(e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookIssuesToPurchaseInBulkResponse = (function () {
              function e(e) {
                if (((this.bookIssues = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.bookIssues = i.emptyArray),
                (e.prototype.userPoint = null),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.bookIssues && e.bookIssues.length)
                  )
                    for (var n = 0; n < e.bookIssues.length; ++n)
                      s.v1.BookIssue.encode(
                        e.bookIssues[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return (
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(18).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookIssuesToPurchaseInBulkResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.bookIssues && r.bookIssues.length) ||
                          (r.bookIssues = []),
                          r.bookIssues.push(
                            s.v1.BookIssue.decode(e, e.uint32())
                          )
                        break
                      case 2:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookViewerRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(16).uint32(e.bookIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookViewerRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookViewerResponse = (function () {
              function e(e) {
                if (((this.pages = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.viewerTitle = ''),
                (e.prototype.pages = i.emptyArray),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.sns = null),
                (e.prototype.shioriPage = 0),
                (e.prototype.scroll = 0),
                (e.prototype.userPoint = null),
                (e.prototype.isFirstPageBlank = !1),
                (e.prototype.shownBookIssue = null),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.viewerTitle &&
                      Object.hasOwnProperty.call(e, 'viewerTitle') &&
                      t.uint32(10).string(e.viewerTitle),
                    null != e.pages && e.pages.length)
                  )
                    for (var n = 0; n < e.pages.length; ++n)
                      s.v1.ViewerPage.encode(
                        e.pages[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  return (
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(24).bool(e.isCommentEnabled),
                    null != e.sns &&
                      Object.hasOwnProperty.call(e, 'sns') &&
                      s.v1.Sns.encode(e.sns, t.uint32(34).fork()).ldelim(),
                    null != e.shioriPage &&
                      Object.hasOwnProperty.call(e, 'shioriPage') &&
                      t.uint32(40).uint32(e.shioriPage),
                    null != e.scroll &&
                      Object.hasOwnProperty.call(e, 'scroll') &&
                      t.uint32(48).int32(e.scroll),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(58).fork()
                      ).ldelim(),
                    null != e.isFirstPageBlank &&
                      Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
                      t.uint32(64).bool(e.isFirstPageBlank),
                    null != e.shownBookIssue &&
                      Object.hasOwnProperty.call(e, 'shownBookIssue') &&
                      s.v1.BookIssue.encode(
                        e.shownBookIssue,
                        t.uint32(74).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookViewerResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.viewerTitle = e.string()
                        break
                      case 2:
                        ;(r.pages && r.pages.length) || (r.pages = []),
                          r.pages.push(s.v1.ViewerPage.decode(e, e.uint32()))
                        break
                      case 3:
                        r.isCommentEnabled = e.bool()
                        break
                      case 4:
                        r.sns = s.v1.Sns.decode(e, e.uint32())
                        break
                      case 5:
                        r.shioriPage = e.uint32()
                        break
                      case 6:
                        r.scroll = e.int32()
                        break
                      case 7:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 8:
                        r.isFirstPageBlank = e.bool()
                        break
                      case 9:
                        r.shownBookIssue = s.v1.BookIssue.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.ScrollDirection = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (t[(e[0] = 'LEFT')] = 0), (t[(e[1] = 'RIGHT')] = 1), t
                })()),
                e
              )
            })()),
            (e.BookViewer2Request = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueId = 0),
                (e.prototype.purchaseRequest = !1),
                (e.prototype.consumePaidPoint = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(16).uint32(e.bookIssueId),
                    null != e.purchaseRequest &&
                      Object.hasOwnProperty.call(e, 'purchaseRequest') &&
                      t.uint32(24).bool(e.purchaseRequest),
                    null != e.consumePaidPoint &&
                      Object.hasOwnProperty.call(e, 'consumePaidPoint') &&
                      t.uint32(32).uint32(e.consumePaidPoint),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookViewer2Request();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookIssueId = e.uint32()
                        break
                      case 3:
                        r.purchaseRequest = e.bool()
                        break
                      case 4:
                        r.consumePaidPoint = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.BookViewer2Response = (function () {
              function e(e) {
                if (((this.pages = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.pages = i.emptyArray),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.sns = null),
                (e.prototype.shioriPage = 0),
                (e.prototype.scroll = 0),
                (e.prototype.userPoint = null),
                (e.prototype.isFirstPageBlank = !1),
                (e.prototype.bookIssue = null),
                (e.prototype.cashBack = null),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()), null != e.pages && e.pages.length)
                  )
                    for (var n = 0; n < e.pages.length; ++n)
                      s.v1.ViewerPage.encode(
                        e.pages[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return (
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(16).bool(e.isCommentEnabled),
                    null != e.sns &&
                      Object.hasOwnProperty.call(e, 'sns') &&
                      s.v1.Sns.encode(e.sns, t.uint32(26).fork()).ldelim(),
                    null != e.shioriPage &&
                      Object.hasOwnProperty.call(e, 'shioriPage') &&
                      t.uint32(32).uint32(e.shioriPage),
                    null != e.scroll &&
                      Object.hasOwnProperty.call(e, 'scroll') &&
                      t.uint32(40).int32(e.scroll),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(50).fork()
                      ).ldelim(),
                    null != e.isFirstPageBlank &&
                      Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
                      t.uint32(56).bool(e.isFirstPageBlank),
                    null != e.bookIssue &&
                      Object.hasOwnProperty.call(e, 'bookIssue') &&
                      s.v1.BookIssue.encode(
                        e.bookIssue,
                        t.uint32(66).fork()
                      ).ldelim(),
                    null != e.cashBack &&
                      Object.hasOwnProperty.call(e, 'cashBack') &&
                      s.v1.UserPoint.encode(
                        e.cashBack,
                        t.uint32(74).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.BookViewer2Response();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.pages && r.pages.length) || (r.pages = []),
                          r.pages.push(s.v1.ViewerPage.decode(e, e.uint32()))
                        break
                      case 2:
                        r.isCommentEnabled = e.bool()
                        break
                      case 3:
                        r.sns = s.v1.Sns.decode(e, e.uint32())
                        break
                      case 4:
                        r.shioriPage = e.uint32()
                        break
                      case 5:
                        r.scroll = e.int32()
                        break
                      case 6:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 7:
                        r.isFirstPageBlank = e.bool()
                        break
                      case 8:
                        r.bookIssue = s.v1.BookIssue.decode(e, e.uint32())
                        break
                      case 9:
                        r.cashBack = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.ScrollDirection = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (t[(e[0] = 'LEFT')] = 0), (t[(e[1] = 'RIGHT')] = 1), t
                })()),
                e
              )
            })()),
            (e.ChapterLastPageRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.chapterId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.chapterId &&
                      Object.hasOwnProperty.call(e, 'chapterId') &&
                      t.uint32(16).uint32(e.chapterId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ChapterLastPageRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.chapterId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ChapterLastPageResponse = (function () {
              function e(e) {
                if (((this.authorships = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              var t
              return (
                (e.prototype.userPoint = null),
                (e.prototype.isTicketAvailable = !1),
                (e.prototype.authorships = i.emptyArray),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.numberOfComments = 0),
                (e.prototype.isFavorite = !1),
                (e.prototype.numberOfFavorites = 0),
                (e.prototype.isLiked = !1),
                (e.prototype.numberOfLike = 0),
                (e.prototype.mangaId = 0),
                (e.prototype.rewardUrl = ''),
                (e.prototype.nextChapter = null),
                (e.prototype.recommendedMangas = null),
                Object.defineProperty(e.prototype, 'lastPageContent', {
                  get: i.oneOfGetter(
                    (t = ['nextChapter', 'recommendedMangas'])
                  ),
                  set: i.oneOfSetter(t),
                }),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.isTicketAvailable &&
                      Object.hasOwnProperty.call(e, 'isTicketAvailable') &&
                      t.uint32(16).bool(e.isTicketAvailable),
                    null != e.authorships && e.authorships.length)
                  )
                    for (var n = 0; n < e.authorships.length; ++n)
                      s.v1.Authorship.encode(
                        e.authorships[n],
                        t.uint32(26).fork()
                      ).ldelim()
                  return (
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(32).bool(e.isCommentEnabled),
                    null != e.numberOfComments &&
                      Object.hasOwnProperty.call(e, 'numberOfComments') &&
                      t.uint32(40).uint32(e.numberOfComments),
                    null != e.isFavorite &&
                      Object.hasOwnProperty.call(e, 'isFavorite') &&
                      t.uint32(48).bool(e.isFavorite),
                    null != e.numberOfFavorites &&
                      Object.hasOwnProperty.call(e, 'numberOfFavorites') &&
                      t.uint32(56).uint32(e.numberOfFavorites),
                    null != e.isLiked &&
                      Object.hasOwnProperty.call(e, 'isLiked') &&
                      t.uint32(64).bool(e.isLiked),
                    null != e.numberOfLike &&
                      Object.hasOwnProperty.call(e, 'numberOfLike') &&
                      t.uint32(72).uint32(e.numberOfLike),
                    null != e.mangaId &&
                      Object.hasOwnProperty.call(e, 'mangaId') &&
                      t.uint32(80).uint32(e.mangaId),
                    null != e.nextChapter &&
                      Object.hasOwnProperty.call(e, 'nextChapter') &&
                      s.v1.Chapter.encode(
                        e.nextChapter,
                        t.uint32(90).fork()
                      ).ldelim(),
                    null != e.recommendedMangas &&
                      Object.hasOwnProperty.call(e, 'recommendedMangas') &&
                      s.v1.ChapterLastPageResponse.RecommendedMangas.encode(
                        e.recommendedMangas,
                        t.uint32(106).fork()
                      ).ldelim(),
                    null != e.rewardUrl &&
                      Object.hasOwnProperty.call(e, 'rewardUrl') &&
                      t.uint32(114).string(e.rewardUrl),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ChapterLastPageResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        r.isTicketAvailable = e.bool()
                        break
                      case 3:
                        ;(r.authorships && r.authorships.length) ||
                          (r.authorships = []),
                          r.authorships.push(
                            s.v1.Authorship.decode(e, e.uint32())
                          )
                        break
                      case 4:
                        r.isCommentEnabled = e.bool()
                        break
                      case 5:
                        r.numberOfComments = e.uint32()
                        break
                      case 6:
                        r.isFavorite = e.bool()
                        break
                      case 7:
                        r.numberOfFavorites = e.uint32()
                        break
                      case 8:
                        r.isLiked = e.bool()
                        break
                      case 9:
                        r.numberOfLike = e.uint32()
                        break
                      case 10:
                        r.mangaId = e.uint32()
                        break
                      case 14:
                        r.rewardUrl = e.string()
                        break
                      case 11:
                        r.nextChapter = s.v1.Chapter.decode(e, e.uint32())
                        break
                      case 13:
                        r.recommendedMangas =
                          s.v1.ChapterLastPageResponse.RecommendedMangas.decode(
                            e,
                            e.uint32()
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.RecommendedMangas = (function () {
                  function e(e) {
                    if (((this.recommendedMangas = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.updateInfo = ''),
                    (e.prototype.recommendedMangas = i.emptyArray),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.updateInfo &&
                          Object.hasOwnProperty.call(e, 'updateInfo') &&
                          t.uint32(10).string(e.updateInfo),
                        null != e.recommendedMangas &&
                          e.recommendedMangas.length)
                      )
                        for (var n = 0; n < e.recommendedMangas.length; ++n)
                          s.v1.Manga.encode(
                            e.recommendedMangas[n],
                            t.uint32(18).fork()
                          ).ldelim()
                      return t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r =
                            new s.v1.ChapterLastPageResponse.RecommendedMangas();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.updateInfo = e.string()
                            break
                          case 2:
                            ;(r.recommendedMangas &&
                              r.recommendedMangas.length) ||
                              (r.recommendedMangas = []),
                              r.recommendedMangas.push(
                                s.v1.Manga.decode(e, e.uint32())
                              )
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.ChapterLikeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.chapterId = 0),
                (e.prototype.like = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.chapterId &&
                      Object.hasOwnProperty.call(e, 'chapterId') &&
                      t.uint32(16).uint32(e.chapterId),
                    null != e.like &&
                      Object.hasOwnProperty.call(e, 'like') &&
                      t.uint32(24).bool(e.like),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ChapterLikeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.chapterId = e.uint32()
                        break
                      case 3:
                        r.like = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ChapterLikeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ChapterLikeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.GetChapterCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.chapterId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.chapterId &&
                      Object.hasOwnProperty.call(e, 'chapterId') &&
                      t.uint32(16).uint32(e.chapterId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.GetChapterCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.chapterId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.GetChapterCommentResponse = (function () {
              function e(e) {
                if (((this.comments = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.comments = i.emptyArray),
                (e.prototype.canPost = !1),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.comments && e.comments.length)
                  )
                    for (var n = 0; n < e.comments.length; ++n)
                      s.v1.Comment.encode(
                        e.comments[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return (
                    null != e.canPost &&
                      Object.hasOwnProperty.call(e, 'canPost') &&
                      t.uint32(16).bool(e.canPost),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.GetChapterCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.comments && r.comments.length) || (r.comments = []),
                          r.comments.push(s.v1.Comment.decode(e, e.uint32()))
                        break
                      case 2:
                        r.canPost = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PostChapterCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.chapterId = 0),
                (e.prototype.body = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.chapterId &&
                      Object.hasOwnProperty.call(e, 'chapterId') &&
                      t.uint32(16).uint32(e.chapterId),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(26).string(e.body),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PostChapterCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.chapterId = e.uint32()
                        break
                      case 3:
                        r.body = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PostChapterCommentResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PostChapterCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteChapterCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteChapterCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteChapterCommentResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteChapterCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.GetBookIssueCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(16).uint32(e.bookIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.GetBookIssueCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.GetBookIssueCommentResponse = (function () {
              function e(e) {
                if (((this.comments = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.comments = i.emptyArray),
                (e.prototype.canPost = !1),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.comments && e.comments.length)
                  )
                    for (var n = 0; n < e.comments.length; ++n)
                      s.v1.Comment.encode(
                        e.comments[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return (
                    null != e.canPost &&
                      Object.hasOwnProperty.call(e, 'canPost') &&
                      t.uint32(16).bool(e.canPost),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.GetBookIssueCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.comments && r.comments.length) || (r.comments = []),
                          r.comments.push(s.v1.Comment.decode(e, e.uint32()))
                        break
                      case 2:
                        r.canPost = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PostBookIssueCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueId = 0),
                (e.prototype.body = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueId &&
                      Object.hasOwnProperty.call(e, 'bookIssueId') &&
                      t.uint32(16).uint32(e.bookIssueId),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(26).string(e.body),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PostBookIssueCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.bookIssueId = e.uint32()
                        break
                      case 3:
                        r.body = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PostBookIssueCommentResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PostBookIssueCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteBookIssueCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteBookIssueCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteBookIssueCommentResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteBookIssueCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.GetMagazineIssueCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.magazineIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(16).uint32(e.magazineIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.GetMagazineIssueCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.GetMagazineIssueCommentResponse = (function () {
              function e(e) {
                if (((this.comments = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.comments = i.emptyArray),
                (e.prototype.canPost = !1),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.comments && e.comments.length)
                  )
                    for (var n = 0; n < e.comments.length; ++n)
                      s.v1.Comment.encode(
                        e.comments[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return (
                    null != e.canPost &&
                      Object.hasOwnProperty.call(e, 'canPost') &&
                      t.uint32(16).bool(e.canPost),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.GetMagazineIssueCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.comments && r.comments.length) || (r.comments = []),
                          r.comments.push(s.v1.Comment.decode(e, e.uint32()))
                        break
                      case 2:
                        r.canPost = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PostMagazineIssueCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.magazineIssueId = 0),
                (e.prototype.body = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(16).uint32(e.magazineIssueId),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(26).string(e.body),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PostMagazineIssueCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineIssueId = e.uint32()
                        break
                      case 3:
                        r.body = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PostMagazineIssueCommentResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PostMagazineIssueCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteMagazineIssueCommentRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteMagazineIssueCommentRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteMagazineIssueCommentResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteMagazineIssueCommentResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PutChapterCommentLikeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PutChapterCommentLikeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PutChapterCommentLikeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PutChapterCommentLikeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteChapterCommentLikeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteChapterCommentLikeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteChapterCommentLikeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteChapterCommentLikeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PutBookIssueCommentLikeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PutBookIssueCommentLikeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PutBookIssueCommentLikeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PutBookIssueCommentLikeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteBookIssueCommentLikeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteBookIssueCommentLikeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteBookIssueCommentLikeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteBookIssueCommentLikeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PutMagazineIssueCommentLikeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PutMagazineIssueCommentLikeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PutMagazineIssueCommentLikeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PutMagazineIssueCommentLikeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteMagazineIssueCommentLikeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.commentId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.commentId &&
                      Object.hasOwnProperty.call(e, 'commentId') &&
                      t.uint32(16).uint32(e.commentId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteMagazineIssueCommentLikeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.commentId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.DeleteMagazineIssueCommentLikeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.DeleteMagazineIssueCommentLikeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ContactRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ContactRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ContactResponse = (function () {
              function e(e) {
                if (((this.contacts = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.contacts = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.contacts && e.contacts.length)
                  )
                    for (var n = 0; n < e.contacts.length; ++n)
                      s.v1.Contact.encode(
                        e.contacts[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ContactResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.contacts && r.contacts.length) || (r.contacts = []),
                          r.contacts.push(s.v1.Contact.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PostContactRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.body = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.body &&
                      Object.hasOwnProperty.call(e, 'body') &&
                      t.uint32(18).string(e.body),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PostContactRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.body = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PostContactResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PostContactResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ContactUsRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ContactUsRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ContactUsResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.url = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.url &&
                      Object.hasOwnProperty.call(e, 'url') &&
                      t.uint32(10).string(e.url),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ContactUsResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.url = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.EmailChangeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.newEmail = ''),
                (e.prototype.password = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.newEmail &&
                      Object.hasOwnProperty.call(e, 'newEmail') &&
                      t.uint32(18).string(e.newEmail),
                    null != e.password &&
                      Object.hasOwnProperty.call(e, 'password') &&
                      t.uint32(26).string(e.password),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.EmailChangeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.newEmail = e.string()
                        break
                      case 3:
                        r.password = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.EmailChangeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.success = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.success &&
                      Object.hasOwnProperty.call(e, 'success') &&
                      t.uint32(8).bool(e.success),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.EmailChangeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.success = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.HomeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.HomeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.HomeResponse = (function () {
              function e(e) {
                if (
                  ((this.topBanners = []),
                  (this.topSubBanners = []),
                  (this.updatedMangas = []),
                  (this.rankings = []),
                  (this.newBookIssues = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.topBanners = i.emptyArray),
                (e.prototype.topSubBanners = i.emptyArray),
                (e.prototype.updatedMangas = i.emptyArray),
                (e.prototype.pickupKoma = null),
                (e.prototype.rankings = i.emptyArray),
                (e.prototype.newBookIssues = i.emptyArray),
                (e.prototype.popup = null),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.topBanners && e.topBanners.length)
                  )
                    for (var n = 0; n < e.topBanners.length; ++n)
                      s.v1.Banner.encode(
                        e.topBanners[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  if (null != e.topSubBanners && e.topSubBanners.length)
                    for (var r = 0; r < e.topSubBanners.length; ++r)
                      s.v1.Banner.encode(
                        e.topSubBanners[r],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (null != e.updatedMangas && e.updatedMangas.length)
                    for (var o = 0; o < e.updatedMangas.length; ++o)
                      s.v1.Manga.encode(
                        e.updatedMangas[o],
                        t.uint32(26).fork()
                      ).ldelim()
                  if (
                    (null != e.pickupKoma &&
                      Object.hasOwnProperty.call(e, 'pickupKoma') &&
                      s.v1.Koma.encode(
                        e.pickupKoma,
                        t.uint32(34).fork()
                      ).ldelim(),
                    null != e.rankings && e.rankings.length)
                  )
                    for (var i = 0; i < e.rankings.length; ++i)
                      s.v1.HomeResponse.Ranking.encode(
                        e.rankings[i],
                        t.uint32(42).fork()
                      ).ldelim()
                  if (null != e.newBookIssues && e.newBookIssues.length)
                    for (var c = 0; c < e.newBookIssues.length; ++c)
                      s.v1.BookIssue.encode(
                        e.newBookIssues[c],
                        t.uint32(50).fork()
                      ).ldelim()
                  return (
                    null != e.popup &&
                      Object.hasOwnProperty.call(e, 'popup') &&
                      s.v1.Popup.encode(e.popup, t.uint32(58).fork()).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.HomeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.topBanners && r.topBanners.length) ||
                          (r.topBanners = []),
                          r.topBanners.push(s.v1.Banner.decode(e, e.uint32()))
                        break
                      case 2:
                        ;(r.topSubBanners && r.topSubBanners.length) ||
                          (r.topSubBanners = []),
                          r.topSubBanners.push(
                            s.v1.Banner.decode(e, e.uint32())
                          )
                        break
                      case 3:
                        ;(r.updatedMangas && r.updatedMangas.length) ||
                          (r.updatedMangas = []),
                          r.updatedMangas.push(s.v1.Manga.decode(e, e.uint32()))
                        break
                      case 4:
                        r.pickupKoma = s.v1.Koma.decode(e, e.uint32())
                        break
                      case 5:
                        ;(r.rankings && r.rankings.length) || (r.rankings = []),
                          r.rankings.push(
                            s.v1.HomeResponse.Ranking.decode(e, e.uint32())
                          )
                        break
                      case 6:
                        ;(r.newBookIssues && r.newBookIssues.length) ||
                          (r.newBookIssues = []),
                          r.newBookIssues.push(
                            s.v1.BookIssue.decode(e, e.uint32())
                          )
                        break
                      case 7:
                        r.popup = s.v1.Popup.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Ranking = (function () {
                  function e(e) {
                    if (((this.mangas = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.name = ''),
                    (e.prototype.mangas = i.emptyArray),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.name &&
                          Object.hasOwnProperty.call(e, 'name') &&
                          t.uint32(10).string(e.name),
                        null != e.mangas && e.mangas.length)
                      )
                        for (var n = 0; n < e.mangas.length; ++n)
                          s.v1.Manga.encode(
                            e.mangas[n],
                            t.uint32(18).fork()
                          ).ldelim()
                      return t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.HomeResponse.Ranking();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.name = e.string()
                            break
                          case 2:
                            ;(r.mangas && r.mangas.length) || (r.mangas = []),
                              r.mangas.push(s.v1.Manga.decode(e, e.uint32()))
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.MagazineIssueDetailRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.magazineIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(16).uint32(e.magazineIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineIssueDetailRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineIssueDetailResponse = (function () {
              function e(e) {
                if (
                  ((this.magazineIssues = []),
                  (this.endedOfSaleMagazineIssues = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.magazineName = ''),
                (e.prototype.pickupMagazineIssue = null),
                (e.prototype.magazineIssues = i.emptyArray),
                (e.prototype.endedOfSaleMagazineIssues = i.emptyArray),
                (e.prototype.isCommentEnabled = !1),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineName &&
                      Object.hasOwnProperty.call(e, 'magazineName') &&
                      t.uint32(18).string(e.magazineName),
                    null != e.pickupMagazineIssue &&
                      Object.hasOwnProperty.call(e, 'pickupMagazineIssue') &&
                      s.v1.MagazineIssue.encode(
                        e.pickupMagazineIssue,
                        t.uint32(26).fork()
                      ).ldelim(),
                    null != e.magazineIssues && e.magazineIssues.length)
                  )
                    for (var n = 0; n < e.magazineIssues.length; ++n)
                      s.v1.MagazineIssue.encode(
                        e.magazineIssues[n],
                        t.uint32(34).fork()
                      ).ldelim()
                  if (
                    null != e.endedOfSaleMagazineIssues &&
                    e.endedOfSaleMagazineIssues.length
                  )
                    for (var r = 0; r < e.endedOfSaleMagazineIssues.length; ++r)
                      s.v1.MagazineIssue.encode(
                        e.endedOfSaleMagazineIssues[r],
                        t.uint32(42).fork()
                      ).ldelim()
                  return (
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(48).bool(e.isCommentEnabled),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineIssueDetailResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineName = e.string()
                        break
                      case 3:
                        r.pickupMagazineIssue = s.v1.MagazineIssue.decode(
                          e,
                          e.uint32()
                        )
                        break
                      case 4:
                        ;(r.magazineIssues && r.magazineIssues.length) ||
                          (r.magazineIssues = []),
                          r.magazineIssues.push(
                            s.v1.MagazineIssue.decode(e, e.uint32())
                          )
                        break
                      case 5:
                        ;(r.endedOfSaleMagazineIssues &&
                          r.endedOfSaleMagazineIssues.length) ||
                          (r.endedOfSaleMagazineIssues = []),
                          r.endedOfSaleMagazineIssues.push(
                            s.v1.MagazineIssue.decode(e, e.uint32())
                          )
                        break
                      case 6:
                        r.isCommentEnabled = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineIssueLastPageRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.magazineIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(16).uint32(e.magazineIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineIssueLastPageRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineIssueLastPageResponse = (function () {
              function e(e) {
                if (((this.mangas = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.numberOfComments = 0),
                (e.prototype.nextMagazineIssue = null),
                (e.prototype.mangas = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(16).bool(e.isCommentEnabled),
                    null != e.numberOfComments &&
                      Object.hasOwnProperty.call(e, 'numberOfComments') &&
                      t.uint32(24).uint32(e.numberOfComments),
                    null != e.nextMagazineIssue &&
                      Object.hasOwnProperty.call(e, 'nextMagazineIssue') &&
                      s.v1.MagazineIssue.encode(
                        e.nextMagazineIssue,
                        t.uint32(34).fork()
                      ).ldelim(),
                    null != e.mangas && e.mangas.length)
                  )
                    for (var n = 0; n < e.mangas.length; ++n)
                      s.v1.Manga.encode(
                        e.mangas[n],
                        t.uint32(42).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineIssueLastPageResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        r.isCommentEnabled = e.bool()
                        break
                      case 3:
                        r.numberOfComments = e.uint32()
                        break
                      case 4:
                        r.nextMagazineIssue = s.v1.MagazineIssue.decode(
                          e,
                          e.uint32()
                        )
                        break
                      case 5:
                        ;(r.mangas && r.mangas.length) || (r.mangas = []),
                          r.mangas.push(s.v1.Manga.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineIssueShioriRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.magazineIssueId = 0),
                (e.prototype.shioriPage = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(16).uint32(e.magazineIssueId),
                    null != e.shioriPage &&
                      Object.hasOwnProperty.call(e, 'shioriPage') &&
                      t.uint32(24).uint32(e.shioriPage),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineIssueShioriRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineIssueId = e.uint32()
                        break
                      case 3:
                        r.shioriPage = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineIssueShioriResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineIssueShioriResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineListRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineListRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineListResponse = (function () {
              function e(e) {
                if (((this.magazines = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.magazines = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.magazines && e.magazines.length)
                  )
                    for (var n = 0; n < e.magazines.length; ++n)
                      s.v1.Magazine.encode(
                        e.magazines[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineListResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.magazines && r.magazines.length) ||
                          (r.magazines = []),
                          r.magazines.push(s.v1.Magazine.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineViewerRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.magazineIssueId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(16).uint32(e.magazineIssueId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineViewerRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineIssueId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineViewerResponse = (function () {
              function e(e) {
                if (((this.pages = []), (this.tableOfContents = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.viewerTitle = ''),
                (e.prototype.pages = i.emptyArray),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.sns = null),
                (e.prototype.tableOfContents = i.emptyArray),
                (e.prototype.shioriPage = 0),
                (e.prototype.scroll = 0),
                (e.prototype.userPoint = null),
                (e.prototype.isFirstPageBlank = !1),
                (e.prototype.shownMagazineIssue = null),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.viewerTitle &&
                      Object.hasOwnProperty.call(e, 'viewerTitle') &&
                      t.uint32(10).string(e.viewerTitle),
                    null != e.pages && e.pages.length)
                  )
                    for (var n = 0; n < e.pages.length; ++n)
                      s.v1.ViewerPage.encode(
                        e.pages[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (
                    (null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(24).bool(e.isCommentEnabled),
                    null != e.sns &&
                      Object.hasOwnProperty.call(e, 'sns') &&
                      s.v1.Sns.encode(e.sns, t.uint32(34).fork()).ldelim(),
                    null != e.tableOfContents && e.tableOfContents.length)
                  )
                    for (var r = 0; r < e.tableOfContents.length; ++r)
                      s.v1.MagazineViewerResponse.Content.encode(
                        e.tableOfContents[r],
                        t.uint32(42).fork()
                      ).ldelim()
                  return (
                    null != e.shioriPage &&
                      Object.hasOwnProperty.call(e, 'shioriPage') &&
                      t.uint32(48).uint32(e.shioriPage),
                    null != e.scroll &&
                      Object.hasOwnProperty.call(e, 'scroll') &&
                      t.uint32(56).int32(e.scroll),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(66).fork()
                      ).ldelim(),
                    null != e.isFirstPageBlank &&
                      Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
                      t.uint32(72).bool(e.isFirstPageBlank),
                    null != e.shownMagazineIssue &&
                      Object.hasOwnProperty.call(e, 'shownMagazineIssue') &&
                      s.v1.MagazineIssue.encode(
                        e.shownMagazineIssue,
                        t.uint32(82).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineViewerResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.viewerTitle = e.string()
                        break
                      case 2:
                        ;(r.pages && r.pages.length) || (r.pages = []),
                          r.pages.push(s.v1.ViewerPage.decode(e, e.uint32()))
                        break
                      case 3:
                        r.isCommentEnabled = e.bool()
                        break
                      case 4:
                        r.sns = s.v1.Sns.decode(e, e.uint32())
                        break
                      case 5:
                        ;(r.tableOfContents && r.tableOfContents.length) ||
                          (r.tableOfContents = []),
                          r.tableOfContents.push(
                            s.v1.MagazineViewerResponse.Content.decode(
                              e,
                              e.uint32()
                            )
                          )
                        break
                      case 6:
                        r.shioriPage = e.uint32()
                        break
                      case 7:
                        r.scroll = e.int32()
                        break
                      case 8:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 9:
                        r.isFirstPageBlank = e.bool()
                        break
                      case 10:
                        r.shownMagazineIssue = s.v1.MagazineIssue.decode(
                          e,
                          e.uint32()
                        )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Content = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.startPage = 0),
                    (e.prototype.mangaName = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.startPage &&
                          Object.hasOwnProperty.call(e, 'startPage') &&
                          t.uint32(8).uint32(e.startPage),
                        null != e.mangaName &&
                          Object.hasOwnProperty.call(e, 'mangaName') &&
                          t.uint32(18).string(e.mangaName),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.MagazineViewerResponse.Content();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.startPage = e.uint32()
                            break
                          case 2:
                            r.mangaName = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                (e.ScrollDirection = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (t[(e[0] = 'LEFT')] = 0), (t[(e[1] = 'RIGHT')] = 1), t
                })()),
                e
              )
            })()),
            (e.MagazineViewer2Request = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.magazineIssueId = 0),
                (e.prototype.purchaseRequest = !1),
                (e.prototype.consumePaidPoint = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(16).uint32(e.magazineIssueId),
                    null != e.purchaseRequest &&
                      Object.hasOwnProperty.call(e, 'purchaseRequest') &&
                      t.uint32(24).bool(e.purchaseRequest),
                    null != e.consumePaidPoint &&
                      Object.hasOwnProperty.call(e, 'consumePaidPoint') &&
                      t.uint32(32).uint32(e.consumePaidPoint),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineViewer2Request();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineIssueId = e.uint32()
                        break
                      case 3:
                        r.purchaseRequest = e.bool()
                        break
                      case 4:
                        r.consumePaidPoint = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MagazineViewer2Response = (function () {
              function e(e) {
                if (((this.pages = []), (this.tableOfContents = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.pages = i.emptyArray),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.sns = null),
                (e.prototype.tableOfContents = i.emptyArray),
                (e.prototype.shioriPage = 0),
                (e.prototype.scroll = 0),
                (e.prototype.userPoint = null),
                (e.prototype.isFirstPageBlank = !1),
                (e.prototype.magazineIssue = null),
                (e.prototype.cashBack = null),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()), null != e.pages && e.pages.length)
                  )
                    for (var n = 0; n < e.pages.length; ++n)
                      s.v1.ViewerPage.encode(
                        e.pages[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  if (
                    (null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(16).bool(e.isCommentEnabled),
                    null != e.sns &&
                      Object.hasOwnProperty.call(e, 'sns') &&
                      s.v1.Sns.encode(e.sns, t.uint32(26).fork()).ldelim(),
                    null != e.tableOfContents && e.tableOfContents.length)
                  )
                    for (var r = 0; r < e.tableOfContents.length; ++r)
                      s.v1.MagazineViewer2Response.Content.encode(
                        e.tableOfContents[r],
                        t.uint32(34).fork()
                      ).ldelim()
                  return (
                    null != e.shioriPage &&
                      Object.hasOwnProperty.call(e, 'shioriPage') &&
                      t.uint32(40).uint32(e.shioriPage),
                    null != e.scroll &&
                      Object.hasOwnProperty.call(e, 'scroll') &&
                      t.uint32(48).int32(e.scroll),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(58).fork()
                      ).ldelim(),
                    null != e.isFirstPageBlank &&
                      Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
                      t.uint32(64).bool(e.isFirstPageBlank),
                    null != e.magazineIssue &&
                      Object.hasOwnProperty.call(e, 'magazineIssue') &&
                      s.v1.MagazineIssue.encode(
                        e.magazineIssue,
                        t.uint32(74).fork()
                      ).ldelim(),
                    null != e.cashBack &&
                      Object.hasOwnProperty.call(e, 'cashBack') &&
                      s.v1.UserPoint.encode(
                        e.cashBack,
                        t.uint32(82).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MagazineViewer2Response();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.pages && r.pages.length) || (r.pages = []),
                          r.pages.push(s.v1.ViewerPage.decode(e, e.uint32()))
                        break
                      case 2:
                        r.isCommentEnabled = e.bool()
                        break
                      case 3:
                        r.sns = s.v1.Sns.decode(e, e.uint32())
                        break
                      case 4:
                        ;(r.tableOfContents && r.tableOfContents.length) ||
                          (r.tableOfContents = []),
                          r.tableOfContents.push(
                            s.v1.MagazineViewer2Response.Content.decode(
                              e,
                              e.uint32()
                            )
                          )
                        break
                      case 5:
                        r.shioriPage = e.uint32()
                        break
                      case 6:
                        r.scroll = e.int32()
                        break
                      case 7:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 8:
                        r.isFirstPageBlank = e.bool()
                        break
                      case 9:
                        r.magazineIssue = s.v1.MagazineIssue.decode(
                          e,
                          e.uint32()
                        )
                        break
                      case 10:
                        r.cashBack = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Content = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.startPage = 0),
                    (e.prototype.mangaName = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.startPage &&
                          Object.hasOwnProperty.call(e, 'startPage') &&
                          t.uint32(8).uint32(e.startPage),
                        null != e.mangaName &&
                          Object.hasOwnProperty.call(e, 'mangaName') &&
                          t.uint32(18).string(e.mangaName),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.MagazineViewer2Response.Content();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.startPage = e.uint32()
                            break
                          case 2:
                            r.mangaName = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                (e.ScrollDirection = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (t[(e[0] = 'LEFT')] = 0), (t[(e[1] = 'RIGHT')] = 1), t
                })()),
                e
              )
            })()),
            (e.MangaDetailRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.mangaId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.mangaId &&
                      Object.hasOwnProperty.call(e, 'mangaId') &&
                      t.uint32(16).uint32(e.mangaId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangaDetailRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.mangaId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MangaDetailResponse = (function () {
              function e(e) {
                if (
                  ((this.chapters = []),
                  (this.authorships = []),
                  (this.tags = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.manga = null),
                (e.prototype.chapters = i.emptyArray),
                (e.prototype.authorships = i.emptyArray),
                (e.prototype.nextUpdateInfo = ''),
                (e.prototype.isFavorite = !1),
                (e.prototype.tags = i.emptyArray),
                (e.prototype.sns = null),
                (e.prototype.viewButton = null),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.rewardUrl = ''),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.manga &&
                      Object.hasOwnProperty.call(e, 'manga') &&
                      s.v1.Manga.encode(e.manga, t.uint32(18).fork()).ldelim(),
                    null != e.chapters && e.chapters.length)
                  )
                    for (var n = 0; n < e.chapters.length; ++n)
                      s.v1.ChapterGroup.encode(
                        e.chapters[n],
                        t.uint32(26).fork()
                      ).ldelim()
                  if (null != e.authorships && e.authorships.length)
                    for (var r = 0; r < e.authorships.length; ++r)
                      s.v1.Authorship.encode(
                        e.authorships[r],
                        t.uint32(34).fork()
                      ).ldelim()
                  if (
                    (null != e.nextUpdateInfo &&
                      Object.hasOwnProperty.call(e, 'nextUpdateInfo') &&
                      t.uint32(42).string(e.nextUpdateInfo),
                    null != e.isFavorite &&
                      Object.hasOwnProperty.call(e, 'isFavorite') &&
                      t.uint32(48).bool(e.isFavorite),
                    null != e.tags && e.tags.length)
                  )
                    for (var o = 0; o < e.tags.length; ++o)
                      s.v1.Tag.encode(e.tags[o], t.uint32(58).fork()).ldelim()
                  return (
                    null != e.sns &&
                      Object.hasOwnProperty.call(e, 'sns') &&
                      s.v1.Sns.encode(e.sns, t.uint32(66).fork()).ldelim(),
                    null != e.viewButton &&
                      Object.hasOwnProperty.call(e, 'viewButton') &&
                      s.v1.MangaDetailResponse.ViewButton.encode(
                        e.viewButton,
                        t.uint32(74).fork()
                      ).ldelim(),
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(80).bool(e.isCommentEnabled),
                    null != e.rewardUrl &&
                      Object.hasOwnProperty.call(e, 'rewardUrl') &&
                      t.uint32(90).string(e.rewardUrl),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangaDetailResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        r.manga = s.v1.Manga.decode(e, e.uint32())
                        break
                      case 3:
                        ;(r.chapters && r.chapters.length) || (r.chapters = []),
                          r.chapters.push(
                            s.v1.ChapterGroup.decode(e, e.uint32())
                          )
                        break
                      case 4:
                        ;(r.authorships && r.authorships.length) ||
                          (r.authorships = []),
                          r.authorships.push(
                            s.v1.Authorship.decode(e, e.uint32())
                          )
                        break
                      case 5:
                        r.nextUpdateInfo = e.string()
                        break
                      case 6:
                        r.isFavorite = e.bool()
                        break
                      case 7:
                        ;(r.tags && r.tags.length) || (r.tags = []),
                          r.tags.push(s.v1.Tag.decode(e, e.uint32()))
                        break
                      case 8:
                        r.sns = s.v1.Sns.decode(e, e.uint32())
                        break
                      case 9:
                        r.viewButton =
                          s.v1.MangaDetailResponse.ViewButton.decode(
                            e,
                            e.uint32()
                          )
                        break
                      case 10:
                        r.isCommentEnabled = e.bool()
                        break
                      case 11:
                        r.rewardUrl = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.ViewButton = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.chapter = null),
                    (e.prototype.buttonTitle = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.chapter &&
                          Object.hasOwnProperty.call(e, 'chapter') &&
                          s.v1.Chapter.encode(
                            e.chapter,
                            t.uint32(10).fork()
                          ).ldelim(),
                        null != e.buttonTitle &&
                          Object.hasOwnProperty.call(e, 'buttonTitle') &&
                          t.uint32(18).string(e.buttonTitle),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.MangaDetailResponse.ViewButton();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.chapter = s.v1.Chapter.decode(e, e.uint32())
                            break
                          case 2:
                            r.buttonTitle = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.MangaFavoriteRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.mangaId = 0),
                (e.prototype.favorite = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.mangaId &&
                      Object.hasOwnProperty.call(e, 'mangaId') &&
                      t.uint32(16).uint32(e.mangaId),
                    null != e.favorite &&
                      Object.hasOwnProperty.call(e, 'favorite') &&
                      t.uint32(24).bool(e.favorite),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangaFavoriteRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.mangaId = e.uint32()
                        break
                      case 3:
                        r.favorite = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MangaFavoriteResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangaFavoriteResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MangaListRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.tagId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.tagId &&
                      Object.hasOwnProperty.call(e, 'tagId') &&
                      t.uint32(16).uint32(e.tagId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangaListRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.tagId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MangaListResponse = (function () {
              function e(e) {
                if (
                  ((this.mangaWithChapter = []),
                  (this.mangaWithBookIssue = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.mangaWithChapter = i.emptyArray),
                (e.prototype.mangaWithBookIssue = i.emptyArray),
                (e.prototype.tag = null),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.mangaWithChapter && e.mangaWithChapter.length)
                  )
                    for (var n = 0; n < e.mangaWithChapter.length; ++n)
                      s.v1.Manga.encode(
                        e.mangaWithChapter[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  if (
                    null != e.mangaWithBookIssue &&
                    e.mangaWithBookIssue.length
                  )
                    for (var r = 0; r < e.mangaWithBookIssue.length; ++r)
                      s.v1.Book.encode(
                        e.mangaWithBookIssue[r],
                        t.uint32(18).fork()
                      ).ldelim()
                  return (
                    null != e.tag &&
                      Object.hasOwnProperty.call(e, 'tag') &&
                      s.v1.Tag.encode(e.tag, t.uint32(26).fork()).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangaListResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.mangaWithChapter && r.mangaWithChapter.length) ||
                          (r.mangaWithChapter = []),
                          r.mangaWithChapter.push(
                            s.v1.Manga.decode(e, e.uint32())
                          )
                        break
                      case 2:
                        ;(r.mangaWithBookIssue &&
                          r.mangaWithBookIssue.length) ||
                          (r.mangaWithBookIssue = []),
                          r.mangaWithBookIssue.push(
                            s.v1.Book.decode(e, e.uint32())
                          )
                        break
                      case 3:
                        r.tag = s.v1.Tag.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MangaViewerRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.chapterId = 0),
                (e.prototype.useTicket = !1),
                (e.prototype.consumePoint = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.chapterId &&
                      Object.hasOwnProperty.call(e, 'chapterId') &&
                      t.uint32(16).uint32(e.chapterId),
                    null != e.useTicket &&
                      Object.hasOwnProperty.call(e, 'useTicket') &&
                      t.uint32(24).bool(e.useTicket),
                    null != e.consumePoint &&
                      Object.hasOwnProperty.call(e, 'consumePoint') &&
                      s.v1.UserPoint.encode(
                        e.consumePoint,
                        t.uint32(34).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangaViewerRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.chapterId = e.uint32()
                        break
                      case 3:
                        r.useTicket = e.bool()
                        break
                      case 4:
                        r.consumePoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.MangaViewerResponse = (function () {
              function e(e) {
                if (((this.pages = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.viewerTitle = ''),
                (e.prototype.pages = i.emptyArray),
                (e.prototype.isCommentEnabled = !1),
                (e.prototype.sns = null),
                (e.prototype.scroll = 0),
                (e.prototype.isFirstPageBlank = !1),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.viewerTitle &&
                      Object.hasOwnProperty.call(e, 'viewerTitle') &&
                      t.uint32(18).string(e.viewerTitle),
                    null != e.pages && e.pages.length)
                  )
                    for (var n = 0; n < e.pages.length; ++n)
                      s.v1.ViewerPage.encode(
                        e.pages[n],
                        t.uint32(26).fork()
                      ).ldelim()
                  return (
                    null != e.isCommentEnabled &&
                      Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                      t.uint32(32).bool(e.isCommentEnabled),
                    null != e.sns &&
                      Object.hasOwnProperty.call(e, 'sns') &&
                      s.v1.Sns.encode(e.sns, t.uint32(42).fork()).ldelim(),
                    null != e.scroll &&
                      Object.hasOwnProperty.call(e, 'scroll') &&
                      t.uint32(48).int32(e.scroll),
                    null != e.isFirstPageBlank &&
                      Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
                      t.uint32(64).bool(e.isFirstPageBlank),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangaViewerResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        r.viewerTitle = e.string()
                        break
                      case 3:
                        ;(r.pages && r.pages.length) || (r.pages = []),
                          r.pages.push(s.v1.ViewerPage.decode(e, e.uint32()))
                        break
                      case 4:
                        r.isCommentEnabled = e.bool()
                        break
                      case 5:
                        r.sns = s.v1.Sns.decode(e, e.uint32())
                        break
                      case 6:
                        r.scroll = e.int32()
                        break
                      case 8:
                        r.isFirstPageBlank = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.ScrollDirection = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'LEFT')] = 0),
                    (t[(e[1] = 'RIGHT')] = 1),
                    (t[(e[2] = 'VERTICAL')] = 2),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.MangasByDayOfWeekRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.dayOfWeek = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.dayOfWeek &&
                      Object.hasOwnProperty.call(e, 'dayOfWeek') &&
                      t.uint32(16).int32(e.dayOfWeek),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangasByDayOfWeekRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.dayOfWeek = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.DayOfWeek = (function () {
                  var e = {},
                    t = Object.create(e)
                  return (
                    (t[(e[0] = 'ALL')] = 0),
                    (t[(e[1] = 'MONDAY')] = 1),
                    (t[(e[2] = 'TUESDAY')] = 2),
                    (t[(e[3] = 'WEDNESDAY')] = 3),
                    (t[(e[4] = 'THURSDAY')] = 4),
                    (t[(e[5] = 'FRIDAY')] = 5),
                    (t[(e[6] = 'SATURDAY')] = 6),
                    (t[(e[7] = 'SUNDAY')] = 7),
                    t
                  )
                })()),
                e
              )
            })()),
            (e.MangasByDayOfWeekResponse = (function () {
              function e(e) {
                if (((this.mangas = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.mangas = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()), null != e.mangas && e.mangas.length)
                  )
                    for (var n = 0; n < e.mangas.length; ++n)
                      s.v1.Manga.encode(
                        e.mangas[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.MangasByDayOfWeekResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.mangas && r.mangas.length) || (r.mangas = []),
                          r.mangas.push(s.v1.Manga.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.NewsRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.NewsRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.NewsResponse = (function () {
              function e(e) {
                if (((this.news = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.news = i.emptyArray),
                (e.encode = function (e, t) {
                  if ((t || (t = a.create()), null != e.news && e.news.length))
                    for (var n = 0; n < e.news.length; ++n)
                      s.v1.News.encode(e.news[n], t.uint32(10).fork()).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.NewsResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.news && r.news.length) || (r.news = []),
                          r.news.push(s.v1.News.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PasswordChangeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.currentPassword = ''),
                (e.prototype.newPassword = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.currentPassword &&
                      Object.hasOwnProperty.call(e, 'currentPassword') &&
                      t.uint32(18).string(e.currentPassword),
                    null != e.newPassword &&
                      Object.hasOwnProperty.call(e, 'newPassword') &&
                      t.uint32(26).string(e.newPassword),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PasswordChangeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.currentPassword = e.string()
                        break
                      case 3:
                        r.newPassword = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PasswordChangeResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PasswordChangeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PasswordResetRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.email = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.email &&
                      Object.hasOwnProperty.call(e, 'email') &&
                      t.uint32(18).string(e.email),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PasswordResetRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.email = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PasswordResetResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PasswordResetResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PasswordResetCompleteRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.token = ''),
                (e.prototype.password = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.token &&
                      Object.hasOwnProperty.call(e, 'token') &&
                      t.uint32(18).string(e.token),
                    null != e.password &&
                      Object.hasOwnProperty.call(e, 'password') &&
                      t.uint32(26).string(e.password),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PasswordResetCompleteRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.token = e.string()
                        break
                      case 3:
                        r.password = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PasswordResetCompleteResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.error = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.error &&
                      Object.hasOwnProperty.call(e, 'error') &&
                      s.v1.Error.encode(e.error, t.uint32(10).fork()).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PasswordResetCompleteResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.error = s.v1.Error.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseOnPlayStoreRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.receipt = ''),
                (e.prototype.signature = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.receipt &&
                      Object.hasOwnProperty.call(e, 'receipt') &&
                      t.uint32(18).string(e.receipt),
                    null != e.signature &&
                      Object.hasOwnProperty.call(e, 'signature') &&
                      t.uint32(26).string(e.signature),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseOnPlayStoreRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.receipt = e.string()
                        break
                      case 3:
                        r.signature = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseOnPlayStoreResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.result = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.result &&
                      Object.hasOwnProperty.call(e, 'result') &&
                      t.uint32(8).int32(e.result),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseOnPlayStoreResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.result = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.RestoreSubscriptionOnPlayStoreRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.receipt = ''),
                (e.prototype.signature = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.receipt &&
                      Object.hasOwnProperty.call(e, 'receipt') &&
                      t.uint32(18).string(e.receipt),
                    null != e.signature &&
                      Object.hasOwnProperty.call(e, 'signature') &&
                      t.uint32(26).string(e.signature),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.RestoreSubscriptionOnPlayStoreRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.receipt = e.string()
                        break
                      case 3:
                        r.signature = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.RestoreSubscriptionOnPlayStoreResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.result = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.result &&
                      Object.hasOwnProperty.call(e, 'result') &&
                      t.uint32(8).int32(e.result),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.RestoreSubscriptionOnPlayStoreResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.result = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PointRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PointRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PointResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PointResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PointHistoryRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PointHistoryRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PointHistoryResponse = (function () {
              function e(e) {
                if (((this.logs = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.logs = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.logs && e.logs.length)
                  )
                    for (var n = 0; n < e.logs.length; ++n)
                      s.v1.PointHistory.encode(
                        e.logs[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PointHistoryResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        ;(r.logs && r.logs.length) || (r.logs = []),
                          r.logs.push(s.v1.PointHistory.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PrefetchMangaViewerRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PrefetchMangaViewerRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PrefetchMangaViewerResponse = (function () {
              function e(e) {
                if (((this.pages = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.pages = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()), null != e.pages && e.pages.length)
                  )
                    for (var n = 0; n < e.pages.length; ++n)
                      s.v1.ViewerPage.encode(
                        e.pages[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PrefetchMangaViewerResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.pages && r.pages.length) || (r.pages = []),
                          r.pages.push(s.v1.ViewerPage.decode(e, e.uint32()))
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseBookIssueRequest = (function () {
              function e(e) {
                if (((this.bookIssueIds = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.bookIssueIds = i.emptyArray),
                (e.prototype.consumePaidPoint = 0),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.bookIssueIds && e.bookIssueIds.length)
                  ) {
                    t.uint32(18).fork()
                    for (var n = 0; n < e.bookIssueIds.length; ++n)
                      t.uint32(e.bookIssueIds[n])
                    t.ldelim()
                  }
                  return (
                    null != e.consumePaidPoint &&
                      Object.hasOwnProperty.call(e, 'consumePaidPoint') &&
                      t.uint32(24).uint32(e.consumePaidPoint),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseBookIssueRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        if (
                          ((r.bookIssueIds && r.bookIssueIds.length) ||
                            (r.bookIssueIds = []),
                          2 === (7 & a))
                        )
                          for (var i = e.uint32() + e.pos; e.pos < i; )
                            r.bookIssueIds.push(e.uint32())
                        else r.bookIssueIds.push(e.uint32())
                        break
                      case 3:
                        r.consumePaidPoint = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseBookIssueResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.cashBack = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.cashBack &&
                      Object.hasOwnProperty.call(e, 'cashBack') &&
                      s.v1.UserPoint.encode(
                        e.cashBack,
                        t.uint32(18).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseBookIssueResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        r.cashBack = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseMagazineIssueRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.magazineIssueId = 0),
                (e.prototype.consumePaidPoint = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.magazineIssueId &&
                      Object.hasOwnProperty.call(e, 'magazineIssueId') &&
                      t.uint32(16).uint32(e.magazineIssueId),
                    null != e.consumePaidPoint &&
                      Object.hasOwnProperty.call(e, 'consumePaidPoint') &&
                      t.uint32(24).uint32(e.consumePaidPoint),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseMagazineIssueRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.magazineIssueId = e.uint32()
                        break
                      case 3:
                        r.consumePaidPoint = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseMagazineIssueResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseMagazineIssueResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.RegisterRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.deviceToken = ''),
                (e.prototype.securityKey = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.deviceToken &&
                      Object.hasOwnProperty.call(e, 'deviceToken') &&
                      t.uint32(18).string(e.deviceToken),
                    null != e.securityKey &&
                      Object.hasOwnProperty.call(e, 'securityKey') &&
                      t.uint32(26).string(e.securityKey),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.RegisterRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.deviceToken = e.string()
                        break
                      case 3:
                        r.securityKey = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.RegisterResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.RegisterResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseBillingItemOnSbpsRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.itemId = ''),
                (e.prototype.token = ''),
                (e.prototype.tokenKey = ''),
                (e.prototype.custManageFlg = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.itemId &&
                      Object.hasOwnProperty.call(e, 'itemId') &&
                      t.uint32(10).string(e.itemId),
                    null != e.token &&
                      Object.hasOwnProperty.call(e, 'token') &&
                      t.uint32(18).string(e.token),
                    null != e.tokenKey &&
                      Object.hasOwnProperty.call(e, 'tokenKey') &&
                      t.uint32(26).string(e.tokenKey),
                    null != e.custManageFlg &&
                      Object.hasOwnProperty.call(e, 'custManageFlg') &&
                      t.uint32(32).bool(e.custManageFlg),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseBillingItemOnSbpsRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.itemId = e.string()
                        break
                      case 2:
                        r.token = e.string()
                        break
                      case 3:
                        r.tokenKey = e.string()
                        break
                      case 4:
                        r.custManageFlg = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseBillingItemOnSbpsResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.result = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.result &&
                      Object.hasOwnProperty.call(e, 'result') &&
                      t.uint32(8).int32(e.result),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseBillingItemOnSbpsResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.result = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseSubscriptionItemOnSbpsRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.itemId = ''),
                (e.prototype.token = ''),
                (e.prototype.tokenKey = ''),
                (e.prototype.custManageFlg = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.itemId &&
                      Object.hasOwnProperty.call(e, 'itemId') &&
                      t.uint32(10).string(e.itemId),
                    null != e.token &&
                      Object.hasOwnProperty.call(e, 'token') &&
                      t.uint32(18).string(e.token),
                    null != e.tokenKey &&
                      Object.hasOwnProperty.call(e, 'tokenKey') &&
                      t.uint32(26).string(e.tokenKey),
                    null != e.custManageFlg &&
                      Object.hasOwnProperty.call(e, 'custManageFlg') &&
                      t.uint32(32).bool(e.custManageFlg),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseSubscriptionItemOnSbpsRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.itemId = e.string()
                        break
                      case 2:
                        r.token = e.string()
                        break
                      case 3:
                        r.tokenKey = e.string()
                        break
                      case 4:
                        r.custManageFlg = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.PurchaseSubscriptionItemOnSbpsResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.result = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.result &&
                      Object.hasOwnProperty.call(e, 'result') &&
                      t.uint32(8).int32(e.result),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.PurchaseSubscriptionItemOnSbpsResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.result = e.int32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SbpsSubscriptionCancelRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.productId = ''),
                (e.prototype.continue = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.productId &&
                      Object.hasOwnProperty.call(e, 'productId') &&
                      t.uint32(18).string(e.productId),
                    null != e.continue &&
                      Object.hasOwnProperty.call(e, 'continue') &&
                      t.uint32(24).bool(e.continue),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SbpsSubscriptionCancelRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.productId = e.string()
                        break
                      case 3:
                        r.continue = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SbpsSubscriptionCancelResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.result = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.result &&
                      Object.hasOwnProperty.call(e, 'result') &&
                      t.uint32(8).bool(e.result),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SbpsSubscriptionCancelResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.result = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SearchRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.query = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.query &&
                      Object.hasOwnProperty.call(e, 'query') &&
                      t.uint32(18).string(e.query),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SearchRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.query = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SearchResponse = (function () {
              function e(e) {
                if (
                  ((this.suggests = []),
                  (this.mangas = []),
                  (this.books = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              var t
              return (
                (e.prototype.suggests = i.emptyArray),
                (e.prototype.mangas = i.emptyArray),
                (e.prototype.books = i.emptyArray),
                (e.prototype.magazineList = null),
                (e.prototype.magazineIssueList = null),
                Object.defineProperty(
                  e.prototype,
                  'searchResultsForMagazines',
                  {
                    get: i.oneOfGetter(
                      (t = ['magazineList', 'magazineIssueList'])
                    ),
                    set: i.oneOfSetter(t),
                  }
                ),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.suggests && e.suggests.length)
                  )
                    for (var n = 0; n < e.suggests.length; ++n)
                      s.v1.SearchResponse.Suggest.encode(
                        e.suggests[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  if (null != e.mangas && e.mangas.length)
                    for (var r = 0; r < e.mangas.length; ++r)
                      s.v1.Manga.encode(
                        e.mangas[r],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (null != e.books && e.books.length)
                    for (var o = 0; o < e.books.length; ++o)
                      s.v1.Book.encode(e.books[o], t.uint32(26).fork()).ldelim()
                  return (
                    null != e.magazineList &&
                      Object.hasOwnProperty.call(e, 'magazineList') &&
                      s.v1.SearchResponse.MagazineList.encode(
                        e.magazineList,
                        t.uint32(34).fork()
                      ).ldelim(),
                    null != e.magazineIssueList &&
                      Object.hasOwnProperty.call(e, 'magazineIssueList') &&
                      s.v1.SearchResponse.MagazineIssueList.encode(
                        e.magazineIssueList,
                        t.uint32(42).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SearchResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.suggests && r.suggests.length) || (r.suggests = []),
                          r.suggests.push(
                            s.v1.SearchResponse.Suggest.decode(e, e.uint32())
                          )
                        break
                      case 2:
                        ;(r.mangas && r.mangas.length) || (r.mangas = []),
                          r.mangas.push(s.v1.Manga.decode(e, e.uint32()))
                        break
                      case 3:
                        ;(r.books && r.books.length) || (r.books = []),
                          r.books.push(s.v1.Book.decode(e, e.uint32()))
                        break
                      case 4:
                        r.magazineList =
                          s.v1.SearchResponse.MagazineList.decode(e, e.uint32())
                        break
                      case 5:
                        r.magazineIssueList =
                          s.v1.SearchResponse.MagazineIssueList.decode(
                            e,
                            e.uint32()
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Suggest = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.keyword = ''),
                    (e.prototype.mangaId = 0),
                    (e.prototype.mangaName = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.keyword &&
                          Object.hasOwnProperty.call(e, 'keyword') &&
                          t.uint32(10).string(e.keyword),
                        null != e.mangaId &&
                          Object.hasOwnProperty.call(e, 'mangaId') &&
                          t.uint32(16).uint32(e.mangaId),
                        null != e.mangaName &&
                          Object.hasOwnProperty.call(e, 'mangaName') &&
                          t.uint32(26).string(e.mangaName),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.SearchResponse.Suggest();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.keyword = e.string()
                            break
                          case 2:
                            r.mangaId = e.uint32()
                            break
                          case 3:
                            r.mangaName = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                (e.MagazineList = (function () {
                  function e(e) {
                    if (((this.magazines = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.magazines = i.emptyArray),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.magazines && e.magazines.length)
                      )
                        for (var n = 0; n < e.magazines.length; ++n)
                          s.v1.Magazine.encode(
                            e.magazines[n],
                            t.uint32(10).fork()
                          ).ldelim()
                      return t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.SearchResponse.MagazineList();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            ;(r.magazines && r.magazines.length) ||
                              (r.magazines = []),
                              r.magazines.push(
                                s.v1.Magazine.decode(e, e.uint32())
                              )
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                (e.MagazineIssueList = (function () {
                  function e(e) {
                    if (((this.magazineIssues = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.magazineIssues = i.emptyArray),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.magazineIssues && e.magazineIssues.length)
                      )
                        for (var n = 0; n < e.magazineIssues.length; ++n)
                          s.v1.MagazineIssue.encode(
                            e.magazineIssues[n],
                            t.uint32(10).fork()
                          ).ldelim()
                      return t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.SearchResponse.MagazineIssueList();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            ;(r.magazineIssues && r.magazineIssues.length) ||
                              (r.magazineIssues = []),
                              r.magazineIssues.push(
                                s.v1.MagazineIssue.decode(e, e.uint32())
                              )
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.ShelfRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ShelfRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ShelfResponse = (function () {
              function e(e) {
                if (
                  ((this.historyMangas = []),
                  (this.favoriteUpdatedMangas = []),
                  (this.favoriteOtherMangas = []),
                  (this.purchasedMagazines = []),
                  (this.purchasedBooks = []),
                  (this.wishBookIssues = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.historyMangas = i.emptyArray),
                (e.prototype.favoriteUpdatedMangas = i.emptyArray),
                (e.prototype.favoriteOtherMangas = i.emptyArray),
                (e.prototype.purchasedMagazines = i.emptyArray),
                (e.prototype.purchasedBooks = i.emptyArray),
                (e.prototype.wishBookIssues = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.historyMangas && e.historyMangas.length)
                  )
                    for (var n = 0; n < e.historyMangas.length; ++n)
                      s.v1.Manga.encode(
                        e.historyMangas[n],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (
                    null != e.favoriteUpdatedMangas &&
                    e.favoriteUpdatedMangas.length
                  )
                    for (var r = 0; r < e.favoriteUpdatedMangas.length; ++r)
                      s.v1.Manga.encode(
                        e.favoriteUpdatedMangas[r],
                        t.uint32(26).fork()
                      ).ldelim()
                  if (
                    null != e.favoriteOtherMangas &&
                    e.favoriteOtherMangas.length
                  )
                    for (var o = 0; o < e.favoriteOtherMangas.length; ++o)
                      s.v1.Manga.encode(
                        e.favoriteOtherMangas[o],
                        t.uint32(34).fork()
                      ).ldelim()
                  if (
                    null != e.purchasedMagazines &&
                    e.purchasedMagazines.length
                  )
                    for (var i = 0; i < e.purchasedMagazines.length; ++i)
                      s.v1.Magazine.encode(
                        e.purchasedMagazines[i],
                        t.uint32(42).fork()
                      ).ldelim()
                  if (null != e.purchasedBooks && e.purchasedBooks.length)
                    for (var c = 0; c < e.purchasedBooks.length; ++c)
                      s.v1.Book.encode(
                        e.purchasedBooks[c],
                        t.uint32(50).fork()
                      ).ldelim()
                  if (null != e.wishBookIssues && e.wishBookIssues.length)
                    for (var u = 0; u < e.wishBookIssues.length; ++u)
                      s.v1.BookIssue.encode(
                        e.wishBookIssues[u],
                        t.uint32(58).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ShelfResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        ;(r.historyMangas && r.historyMangas.length) ||
                          (r.historyMangas = []),
                          r.historyMangas.push(s.v1.Manga.decode(e, e.uint32()))
                        break
                      case 3:
                        ;(r.favoriteUpdatedMangas &&
                          r.favoriteUpdatedMangas.length) ||
                          (r.favoriteUpdatedMangas = []),
                          r.favoriteUpdatedMangas.push(
                            s.v1.Manga.decode(e, e.uint32())
                          )
                        break
                      case 4:
                        ;(r.favoriteOtherMangas &&
                          r.favoriteOtherMangas.length) ||
                          (r.favoriteOtherMangas = []),
                          r.favoriteOtherMangas.push(
                            s.v1.Manga.decode(e, e.uint32())
                          )
                        break
                      case 5:
                        ;(r.purchasedMagazines &&
                          r.purchasedMagazines.length) ||
                          (r.purchasedMagazines = []),
                          r.purchasedMagazines.push(
                            s.v1.Magazine.decode(e, e.uint32())
                          )
                        break
                      case 6:
                        ;(r.purchasedBooks && r.purchasedBooks.length) ||
                          (r.purchasedBooks = []),
                          r.purchasedBooks.push(s.v1.Book.decode(e, e.uint32()))
                        break
                      case 7:
                        ;(r.wishBookIssues && r.wishBookIssues.length) ||
                          (r.wishBookIssues = []),
                          r.wishBookIssues.push(
                            s.v1.BookIssue.decode(e, e.uint32())
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SignInRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.email = ''),
                (e.prototype.password = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.email &&
                      Object.hasOwnProperty.call(e, 'email') &&
                      t.uint32(18).string(e.email),
                    null != e.password &&
                      Object.hasOwnProperty.call(e, 'password') &&
                      t.uint32(26).string(e.password),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SignInRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.email = e.string()
                        break
                      case 3:
                        r.password = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SignInResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.success = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.success &&
                      Object.hasOwnProperty.call(e, 'success') &&
                      t.uint32(8).bool(e.success),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SignInResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.success = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SignOutRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SignOutRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SignOutResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SignOutResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SignUpRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.email = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.email &&
                      Object.hasOwnProperty.call(e, 'email') &&
                      t.uint32(18).string(e.email),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SignUpRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.email = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SignUpResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.success = !1),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.success &&
                      Object.hasOwnProperty.call(e, 'success') &&
                      t.uint32(8).bool(e.success),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SignUpResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.success = e.bool()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SignUpCompleteRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.token = ''),
                (e.prototype.password = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.token &&
                      Object.hasOwnProperty.call(e, 'token') &&
                      t.uint32(18).string(e.token),
                    null != e.password &&
                      Object.hasOwnProperty.call(e, 'password') &&
                      t.uint32(26).string(e.password),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SignUpCompleteRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.token = e.string()
                        break
                      case 3:
                        r.password = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SignUpCompleteResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.error = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.error &&
                      Object.hasOwnProperty.call(e, 'error') &&
                      s.v1.Error.encode(e.error, t.uint32(10).fork()).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SignUpCompleteResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.error = s.v1.Error.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SpecialRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.specialId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.specialId &&
                      Object.hasOwnProperty.call(e, 'specialId') &&
                      t.uint32(16).uint32(e.specialId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SpecialRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.specialId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SpecialResponse = (function () {
              function e(e) {
                if (((this.images = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.images = i.emptyArray),
                (e.prototype.name = ''),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()), null != e.images && e.images.length)
                  )
                    for (var n = 0; n < e.images.length; ++n)
                      s.v1.SpecialImage.encode(
                        e.images[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return (
                    null != e.name &&
                      Object.hasOwnProperty.call(e, 'name') &&
                      t.uint32(18).string(e.name),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SpecialResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.images && r.images.length) || (r.images = []),
                          r.images.push(s.v1.SpecialImage.decode(e, e.uint32()))
                        break
                      case 2:
                        r.name = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.StoreRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.StoreRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.StoreResponse = (function () {
              function e(e) {
                if (
                  ((this.topBanners = []),
                  (this.newBookIssues = []),
                  (this.newMagazineIssues = []),
                  (this.rankingBookIssues = []),
                  (this.booksByTagList = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.topBanners = i.emptyArray),
                (e.prototype.newBookIssues = i.emptyArray),
                (e.prototype.newMagazineIssueBanner = null),
                (e.prototype.newMagazineIssues = i.emptyArray),
                (e.prototype.rankingBookIssues = i.emptyArray),
                (e.prototype.booksByTagList = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.topBanners && e.topBanners.length)
                  )
                    for (var n = 0; n < e.topBanners.length; ++n)
                      s.v1.Banner.encode(
                        e.topBanners[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  if (null != e.newBookIssues && e.newBookIssues.length)
                    for (var r = 0; r < e.newBookIssues.length; ++r)
                      s.v1.BookIssue.encode(
                        e.newBookIssues[r],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (
                    (null != e.newMagazineIssueBanner &&
                      Object.hasOwnProperty.call(e, 'newMagazineIssueBanner') &&
                      s.v1.Banner.encode(
                        e.newMagazineIssueBanner,
                        t.uint32(26).fork()
                      ).ldelim(),
                    null != e.newMagazineIssues && e.newMagazineIssues.length)
                  )
                    for (var o = 0; o < e.newMagazineIssues.length; ++o)
                      s.v1.MagazineIssue.encode(
                        e.newMagazineIssues[o],
                        t.uint32(34).fork()
                      ).ldelim()
                  if (null != e.rankingBookIssues && e.rankingBookIssues.length)
                    for (var i = 0; i < e.rankingBookIssues.length; ++i)
                      s.v1.BookIssue.encode(
                        e.rankingBookIssues[i],
                        t.uint32(42).fork()
                      ).ldelim()
                  if (null != e.booksByTagList && e.booksByTagList.length)
                    for (var c = 0; c < e.booksByTagList.length; ++c)
                      s.v1.StoreResponse.BooksByTag.encode(
                        e.booksByTagList[c],
                        t.uint32(50).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.StoreResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.topBanners && r.topBanners.length) ||
                          (r.topBanners = []),
                          r.topBanners.push(s.v1.Banner.decode(e, e.uint32()))
                        break
                      case 2:
                        ;(r.newBookIssues && r.newBookIssues.length) ||
                          (r.newBookIssues = []),
                          r.newBookIssues.push(
                            s.v1.BookIssue.decode(e, e.uint32())
                          )
                        break
                      case 3:
                        r.newMagazineIssueBanner = s.v1.Banner.decode(
                          e,
                          e.uint32()
                        )
                        break
                      case 4:
                        ;(r.newMagazineIssues && r.newMagazineIssues.length) ||
                          (r.newMagazineIssues = []),
                          r.newMagazineIssues.push(
                            s.v1.MagazineIssue.decode(e, e.uint32())
                          )
                        break
                      case 5:
                        ;(r.rankingBookIssues && r.rankingBookIssues.length) ||
                          (r.rankingBookIssues = []),
                          r.rankingBookIssues.push(
                            s.v1.BookIssue.decode(e, e.uint32())
                          )
                        break
                      case 6:
                        ;(r.booksByTagList && r.booksByTagList.length) ||
                          (r.booksByTagList = []),
                          r.booksByTagList.push(
                            s.v1.StoreResponse.BooksByTag.decode(e, e.uint32())
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.BooksByTag = (function () {
                  function e(e) {
                    if (((this.books = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.tag = null),
                    (e.prototype.books = i.emptyArray),
                    (e.prototype.thumbnailUrl = ''),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.tag &&
                          Object.hasOwnProperty.call(e, 'tag') &&
                          s.v1.Tag.encode(e.tag, t.uint32(10).fork()).ldelim(),
                        null != e.books && e.books.length)
                      )
                        for (var n = 0; n < e.books.length; ++n)
                          s.v1.Book.encode(
                            e.books[n],
                            t.uint32(18).fork()
                          ).ldelim()
                      return (
                        null != e.thumbnailUrl &&
                          Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                          t.uint32(26).string(e.thumbnailUrl),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.StoreResponse.BooksByTag();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.tag = s.v1.Tag.decode(e, e.uint32())
                            break
                          case 2:
                            ;(r.books && r.books.length) || (r.books = []),
                              r.books.push(s.v1.Book.decode(e, e.uint32()))
                            break
                          case 3:
                            r.thumbnailUrl = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.SubscriptionItemListRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SubscriptionItemListRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.SubscriptionItemListResponse = (function () {
              function e(e) {
                if (((this.courses = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.userPoint = null),
                (e.prototype.topBanner = null),
                (e.prototype.courses = i.emptyArray),
                (e.prototype.webTopBannerSp = null),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.topBanner &&
                      Object.hasOwnProperty.call(e, 'topBanner') &&
                      s.v1.Banner.encode(
                        e.topBanner,
                        t.uint32(18).fork()
                      ).ldelim(),
                    null != e.courses && e.courses.length)
                  )
                    for (var n = 0; n < e.courses.length; ++n)
                      s.v1.SubscriptionCourse.encode(
                        e.courses[n],
                        t.uint32(26).fork()
                      ).ldelim()
                  return (
                    null != e.webTopBannerSp &&
                      Object.hasOwnProperty.call(e, 'webTopBannerSp') &&
                      s.v1.Banner.encode(
                        e.webTopBannerSp,
                        t.uint32(34).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.SubscriptionItemListResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      case 2:
                        r.topBanner = s.v1.Banner.decode(e, e.uint32())
                        break
                      case 3:
                        ;(r.courses && r.courses.length) || (r.courses = []),
                          r.courses.push(
                            s.v1.SubscriptionCourse.decode(e, e.uint32())
                          )
                        break
                      case 4:
                        r.webTopBannerSp = s.v1.Banner.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.TrackingRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.TrackingRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.TrackingResponse = (function () {
              function e(e) {
                if (((this.events = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.events = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()), null != e.events && e.events.length)
                  )
                    for (var n = 0; n < e.events.length; ++n)
                      s.v1.TrackingResponse.TrackingEvent.encode(
                        e.events[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.TrackingResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.events && r.events.length) || (r.events = []),
                          r.events.push(
                            s.v1.TrackingResponse.TrackingEvent.decode(
                              e,
                              e.uint32()
                            )
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.TrackingEvent = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.appsflyer = !1),
                    (e.prototype.firebase = !1),
                    (e.prototype.name = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.appsflyer &&
                          Object.hasOwnProperty.call(e, 'appsflyer') &&
                          t.uint32(8).bool(e.appsflyer),
                        null != e.firebase &&
                          Object.hasOwnProperty.call(e, 'firebase') &&
                          t.uint32(16).bool(e.firebase),
                        null != e.name &&
                          Object.hasOwnProperty.call(e, 'name') &&
                          t.uint32(26).string(e.name),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.TrackingResponse.TrackingEvent();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.appsflyer = e.bool()
                            break
                          case 2:
                            r.firebase = e.bool()
                            break
                          case 3:
                            r.name = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.WebBillingItemInfoRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.productId = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.productId &&
                      Object.hasOwnProperty.call(e, 'productId') &&
                      t.uint32(10).string(e.productId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebBillingItemInfoRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.productId = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.WebBillingItemInfoResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.item = null),
                (e.prototype.creditCard = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.item &&
                      Object.hasOwnProperty.call(e, 'item') &&
                      s.v1.BillingItem.encode(
                        e.item,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.creditCard &&
                      Object.hasOwnProperty.call(e, 'creditCard') &&
                      s.v1.WebBillingItemInfoResponse.CreditCard.encode(
                        e.creditCard,
                        t.uint32(18).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebBillingItemInfoResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.item = s.v1.BillingItem.decode(e, e.uint32())
                        break
                      case 2:
                        r.creditCard =
                          s.v1.WebBillingItemInfoResponse.CreditCard.decode(
                            e,
                            e.uint32()
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.CreditCard = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.cardNumber = ''),
                    (e.prototype.cardExpiration = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.cardNumber &&
                          Object.hasOwnProperty.call(e, 'cardNumber') &&
                          t.uint32(10).string(e.cardNumber),
                        null != e.cardExpiration &&
                          Object.hasOwnProperty.call(e, 'cardExpiration') &&
                          t.uint32(18).string(e.cardExpiration),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.WebBillingItemInfoResponse.CreditCard();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.cardNumber = e.string()
                            break
                          case 2:
                            r.cardExpiration = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.WebHomeRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebHomeRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.WebHomeResponse = (function () {
              function e(e) {
                if (
                  ((this.topBanners = []),
                  (this.updatedMangas = []),
                  (this.rankings = []),
                  (this.mangasByTagList = []),
                  e)
                )
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.topBanners = i.emptyArray),
                (e.prototype.updatedMangas = i.emptyArray),
                (e.prototype.rankings = i.emptyArray),
                (e.prototype.mangasByTagList = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.topBanners && e.topBanners.length)
                  )
                    for (var n = 0; n < e.topBanners.length; ++n)
                      s.v1.Banner.encode(
                        e.topBanners[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  if (null != e.updatedMangas && e.updatedMangas.length)
                    for (var r = 0; r < e.updatedMangas.length; ++r)
                      s.v1.Manga.encode(
                        e.updatedMangas[r],
                        t.uint32(18).fork()
                      ).ldelim()
                  if (null != e.rankings && e.rankings.length)
                    for (var o = 0; o < e.rankings.length; ++o)
                      s.v1.Manga.encode(
                        e.rankings[o],
                        t.uint32(26).fork()
                      ).ldelim()
                  if (null != e.mangasByTagList && e.mangasByTagList.length)
                    for (var i = 0; i < e.mangasByTagList.length; ++i)
                      s.v1.WebHomeResponse.MangasByTag.encode(
                        e.mangasByTagList[i],
                        t.uint32(34).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebHomeResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.topBanners && r.topBanners.length) ||
                          (r.topBanners = []),
                          r.topBanners.push(s.v1.Banner.decode(e, e.uint32()))
                        break
                      case 2:
                        ;(r.updatedMangas && r.updatedMangas.length) ||
                          (r.updatedMangas = []),
                          r.updatedMangas.push(s.v1.Manga.decode(e, e.uint32()))
                        break
                      case 3:
                        ;(r.rankings && r.rankings.length) || (r.rankings = []),
                          r.rankings.push(s.v1.Manga.decode(e, e.uint32()))
                        break
                      case 4:
                        ;(r.mangasByTagList && r.mangasByTagList.length) ||
                          (r.mangasByTagList = []),
                          r.mangasByTagList.push(
                            s.v1.WebHomeResponse.MangasByTag.decode(
                              e,
                              e.uint32()
                            )
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.MangasByTag = (function () {
                  function e(e) {
                    if (((this.mangas = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.tag = null),
                    (e.prototype.mangas = i.emptyArray),
                    (e.prototype.thumbnailUrl = ''),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.tag &&
                          Object.hasOwnProperty.call(e, 'tag') &&
                          s.v1.Tag.encode(e.tag, t.uint32(10).fork()).ldelim(),
                        null != e.mangas && e.mangas.length)
                      )
                        for (var n = 0; n < e.mangas.length; ++n)
                          s.v1.Manga.encode(
                            e.mangas[n],
                            t.uint32(18).fork()
                          ).ldelim()
                      return (
                        null != e.thumbnailUrl &&
                          Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                          t.uint32(26).string(e.thumbnailUrl),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.WebHomeResponse.MangasByTag();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.tag = s.v1.Tag.decode(e, e.uint32())
                            break
                          case 2:
                            ;(r.mangas && r.mangas.length) || (r.mangas = []),
                              r.mangas.push(s.v1.Manga.decode(e, e.uint32()))
                            break
                          case 3:
                            r.thumbnailUrl = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.WebMangaRankingRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebMangaRankingRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.WebMangaRankingResponse = (function () {
              function e(e) {
                if (((this.rankings = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.rankings = i.emptyArray),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()),
                    null != e.rankings && e.rankings.length)
                  )
                    for (var n = 0; n < e.rankings.length; ++n)
                      s.v1.WebMangaRankingResponse.Ranking.encode(
                        e.rankings[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebMangaRankingResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.rankings && r.rankings.length) || (r.rankings = []),
                          r.rankings.push(
                            s.v1.WebMangaRankingResponse.Ranking.decode(
                              e,
                              e.uint32()
                            )
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.Ranking = (function () {
                  function e(e) {
                    if (((this.mangas = []), e))
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.name = ''),
                    (e.prototype.mangas = i.emptyArray),
                    (e.encode = function (e, t) {
                      if (
                        (t || (t = a.create()),
                        null != e.name &&
                          Object.hasOwnProperty.call(e, 'name') &&
                          t.uint32(10).string(e.name),
                        null != e.mangas && e.mangas.length)
                      )
                        for (var n = 0; n < e.mangas.length; ++n)
                          s.v1.Manga.encode(
                            e.mangas[n],
                            t.uint32(18).fork()
                          ).ldelim()
                      return t
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r = new s.v1.WebMangaRankingResponse.Ranking();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.name = e.string()
                            break
                          case 2:
                            ;(r.mangas && r.mangas.length) || (r.mangas = []),
                              r.mangas.push(s.v1.Manga.decode(e, e.uint32()))
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.WebMypageRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebMypageRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.WebMypageResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.mailAddress = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.mailAddress &&
                      Object.hasOwnProperty.call(e, 'mailAddress') &&
                      t.uint32(10).string(e.mailAddress),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebMypageResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.mailAddress = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.WebSubscribedItemListRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebSubscribedItemListRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.WebSubscribedItemListResponse = (function () {
              function e(e) {
                if (((this.item = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.item = i.emptyArray),
                (e.encode = function (e, t) {
                  if ((t || (t = a.create()), null != e.item && e.item.length))
                    for (var n = 0; n < e.item.length; ++n)
                      s.v1.SubscriptionItem.encode(
                        e.item[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebSubscribedItemListResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.item && r.item.length) || (r.item = []),
                          r.item.push(
                            s.v1.SubscriptionItem.decode(e, e.uint32())
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.WebSubscriptionItemInfoRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.productId = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.productId &&
                      Object.hasOwnProperty.call(e, 'productId') &&
                      t.uint32(10).string(e.productId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebSubscriptionItemInfoRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.productId = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.WebSubscriptionItemInfoResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.item = null),
                (e.prototype.creditCard = null),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.item &&
                      Object.hasOwnProperty.call(e, 'item') &&
                      s.v1.SubscriptionItem.encode(
                        e.item,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.creditCard &&
                      Object.hasOwnProperty.call(e, 'creditCard') &&
                      s.v1.WebSubscriptionItemInfoResponse.CreditCard.encode(
                        e.creditCard,
                        t.uint32(18).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.WebSubscriptionItemInfoResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.item = s.v1.SubscriptionItem.decode(e, e.uint32())
                        break
                      case 2:
                        r.creditCard =
                          s.v1.WebSubscriptionItemInfoResponse.CreditCard.decode(
                            e,
                            e.uint32()
                          )
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                (e.CreditCard = (function () {
                  function e(e) {
                    if (e)
                      for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                        null != e[t[n]] && (this[t[n]] = e[t[n]])
                  }
                  return (
                    (e.prototype.cardNumber = ''),
                    (e.prototype.cardExpiration = ''),
                    (e.encode = function (e, t) {
                      return (
                        t || (t = a.create()),
                        null != e.cardNumber &&
                          Object.hasOwnProperty.call(e, 'cardNumber') &&
                          t.uint32(10).string(e.cardNumber),
                        null != e.cardExpiration &&
                          Object.hasOwnProperty.call(e, 'cardExpiration') &&
                          t.uint32(18).string(e.cardExpiration),
                        t
                      )
                    }),
                    (e.decode = function (e, t) {
                      e instanceof o || (e = o.create(e))
                      for (
                        var n = void 0 === t ? e.len : e.pos + t,
                          r =
                            new s.v1.WebSubscriptionItemInfoResponse.CreditCard();
                        e.pos < n;

                      ) {
                        var a = e.uint32()
                        switch (a >>> 3) {
                          case 1:
                            r.cardNumber = e.string()
                            break
                          case 2:
                            r.cardExpiration = e.string()
                            break
                          default:
                            e.skipType(7 & a)
                        }
                      }
                      return r
                    }),
                    e
                  )
                })()),
                e
              )
            })()),
            (e.YellListRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.authorId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.authorId &&
                      Object.hasOwnProperty.call(e, 'authorId') &&
                      t.uint32(16).uint32(e.authorId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.YellListRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.authorId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.YellListResponse = (function () {
              function e(e) {
                if (((this.yell = []), (this.yellPoints = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.yell = i.emptyArray),
                (e.prototype.author = null),
                (e.prototype.yellPoints = i.emptyArray),
                (e.prototype.userPoint = null),
                (e.encode = function (e, t) {
                  if ((t || (t = a.create()), null != e.yell && e.yell.length))
                    for (var n = 0; n < e.yell.length; ++n)
                      s.v1.Yell.encode(e.yell[n], t.uint32(10).fork()).ldelim()
                  if (
                    (null != e.author &&
                      Object.hasOwnProperty.call(e, 'author') &&
                      s.v1.Author.encode(
                        e.author,
                        t.uint32(18).fork()
                      ).ldelim(),
                    null != e.yellPoints && e.yellPoints.length)
                  ) {
                    t.uint32(26).fork()
                    for (var r = 0; r < e.yellPoints.length; ++r)
                      t.uint32(e.yellPoints[r])
                    t.ldelim()
                  }
                  return (
                    null != e.userPoint &&
                      Object.hasOwnProperty.call(e, 'userPoint') &&
                      s.v1.UserPoint.encode(
                        e.userPoint,
                        t.uint32(34).fork()
                      ).ldelim(),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.YellListResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.yell && r.yell.length) || (r.yell = []),
                          r.yell.push(s.v1.Yell.decode(e, e.uint32()))
                        break
                      case 2:
                        r.author = s.v1.Author.decode(e, e.uint32())
                        break
                      case 3:
                        if (
                          ((r.yellPoints && r.yellPoints.length) ||
                            (r.yellPoints = []),
                          2 === (7 & a))
                        )
                          for (var i = e.uint32() + e.pos; e.pos < i; )
                            r.yellPoints.push(e.uint32())
                        else r.yellPoints.push(e.uint32())
                        break
                      case 4:
                        r.userPoint = s.v1.UserPoint.decode(e, e.uint32())
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ReportYellRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.yellId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.yellId &&
                      Object.hasOwnProperty.call(e, 'yellId') &&
                      t.uint32(16).uint32(e.yellId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ReportYellRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.yellId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.ReportYellResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.ReportYellResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.YellRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.authorId = 0),
                (e.prototype.paidPoint = 0),
                (e.prototype.handleName = ''),
                (e.prototype.message = ''),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.authorId &&
                      Object.hasOwnProperty.call(e, 'authorId') &&
                      t.uint32(16).uint32(e.authorId),
                    null != e.paidPoint &&
                      Object.hasOwnProperty.call(e, 'paidPoint') &&
                      t.uint32(24).uint32(e.paidPoint),
                    null != e.handleName &&
                      Object.hasOwnProperty.call(e, 'handleName') &&
                      t.uint32(34).string(e.handleName),
                    null != e.message &&
                      Object.hasOwnProperty.call(e, 'message') &&
                      t.uint32(42).string(e.message),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.YellRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.authorId = e.uint32()
                        break
                      case 3:
                        r.paidPoint = e.uint32()
                        break
                      case 4:
                        r.handleName = e.string()
                        break
                      case 5:
                        r.message = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.YellResponse = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.encode = function (e, t) {
                  return t || (t = a.create()), t
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.YellResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    e.skipType(7 & a)
                  }
                  return r
                }),
                e
              )
            })()),
            (e.YellBonusViewerRequest = (function () {
              function e(e) {
                if (e)
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.deviceInfo = null),
                (e.prototype.authorId = 0),
                (e.encode = function (e, t) {
                  return (
                    t || (t = a.create()),
                    null != e.deviceInfo &&
                      Object.hasOwnProperty.call(e, 'deviceInfo') &&
                      s.v1.DeviceInfo.encode(
                        e.deviceInfo,
                        t.uint32(10).fork()
                      ).ldelim(),
                    null != e.authorId &&
                      Object.hasOwnProperty.call(e, 'authorId') &&
                      t.uint32(16).uint32(e.authorId),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.YellBonusViewerRequest();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        r.deviceInfo = s.v1.DeviceInfo.decode(e, e.uint32())
                        break
                      case 2:
                        r.authorId = e.uint32()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            (e.YellBonusViewerResponse = (function () {
              function e(e) {
                if (((this.pages = []), e))
                  for (var t = Object.keys(e), n = 0; n < t.length; ++n)
                    null != e[t[n]] && (this[t[n]] = e[t[n]])
              }
              return (
                (e.prototype.pages = i.emptyArray),
                (e.prototype.viewerTitle = ''),
                (e.encode = function (e, t) {
                  if (
                    (t || (t = a.create()), null != e.pages && e.pages.length)
                  )
                    for (var n = 0; n < e.pages.length; ++n)
                      s.v1.ViewerPage.encode(
                        e.pages[n],
                        t.uint32(10).fork()
                      ).ldelim()
                  return (
                    null != e.viewerTitle &&
                      Object.hasOwnProperty.call(e, 'viewerTitle') &&
                      t.uint32(18).string(e.viewerTitle),
                    t
                  )
                }),
                (e.decode = function (e, t) {
                  e instanceof o || (e = o.create(e))
                  for (
                    var n = void 0 === t ? e.len : e.pos + t,
                      r = new s.v1.YellBonusViewerResponse();
                    e.pos < n;

                  ) {
                    var a = e.uint32()
                    switch (a >>> 3) {
                      case 1:
                        ;(r.pages && r.pages.length) || (r.pages = []),
                          r.pages.push(s.v1.ViewerPage.decode(e, e.uint32()))
                        break
                      case 2:
                        r.viewerTitle = e.string()
                        break
                      default:
                        e.skipType(7 & a)
                    }
                  }
                  return r
                }),
                e
              )
            })()),
            e
          )
        })()))

    return s
  }
})()
