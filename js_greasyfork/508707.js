;(function () {
  'use strict'
  window.getApi = getApi
  function getApi() {
      'use strict';
      var r = {
        Z: function (e, t) {
            return null != t &&
            'undefined' !== typeof Symbol &&
            t[Symbol.hasInstance] ? !!t[Symbol.hasInstance](e) : e instanceof t
        }
      },
      o = protobuf,
      a = o.Reader,
      i = o.Writer,
      s = o.util,
      c = o.roots.default ||
      (o.roots.default = {}),
      u = (
        c.v0 = function () {
          var e = {};
          return e.Request = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.secret = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.secret &&
              Object.hasOwnProperty.call(e, 'secret') &&
              t.uint32(10).string(e.secret),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v0.Request; e.pos < n; ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.secret = e.string();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PackedResponse = function () {
            var e = function (e) {
              if (
                this.firstBanners = [],
                this.secondBanners = [],
                this.updatedMangas = [],
                this.mangas = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.firstBanners = s.emptyArray,
            e.prototype.secondBanners = s.emptyArray,
            e.prototype.updatedMangas = s.emptyArray,
            e.prototype.mangas = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v0.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.firstBanners &&
                e.firstBanners.length
              ) for (var n = 0; n < e.firstBanners.length; ++n) c.v0.Banner.encode(e.firstBanners[n], t.uint32(18).fork()).ldelim();
              if (null != e.secondBanners && e.secondBanners.length) for (var r = 0; r < e.secondBanners.length; ++r) c.v0.Banner.encode(e.secondBanners[r], t.uint32(26).fork()).ldelim();
              if (null != e.updatedMangas && e.updatedMangas.length) for (var o = 0; o < e.updatedMangas.length; ++o) c.v0.Manga.encode(e.updatedMangas[o], t.uint32(34).fork()).ldelim();
              if (null != e.mangas && e.mangas.length) for (var a = 0; a < e.mangas.length; ++a) c.v0.Manga.encode(e.mangas[a], t.uint32(42).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v0.PackedResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v0.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.firstBanners &&
                    o.firstBanners.length ||
                    (o.firstBanners = []),
                    o.firstBanners.push(c.v0.Banner.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.secondBanners &&
                    o.secondBanners.length ||
                    (o.secondBanners = []),
                    o.secondBanners.push(c.v0.Banner.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.updatedMangas &&
                    o.updatedMangas.length ||
                    (o.updatedMangas = []),
                    o.updatedMangas.push(c.v0.Manga.decode(e, e.uint32()));
                    break;
                  case 5:
                    o.mangas &&
                    o.mangas.length ||
                    (o.mangas = []),
                    o.mangas.push(c.v0.Manga.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.StreamedResponseHeader = function () {
            var e = function (e) {
              if (this.updatedMangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.updatedMangas = s.emptyArray,
            e.prototype.numFirstBanners = 0,
            e.prototype.numSecondBanners = 0,
            e.prototype.numMangas = 0,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v0.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.updatedMangas &&
                e.updatedMangas.length
              ) for (var n = 0; n < e.updatedMangas.length; ++n) c.v0.Manga.encode(e.updatedMangas[n], t.uint32(18).fork()).ldelim();
              return null != e.numFirstBanners &&
              Object.hasOwnProperty.call(e, 'numFirstBanners') &&
              t.uint32(24).uint32(e.numFirstBanners),
              null != e.numSecondBanners &&
              Object.hasOwnProperty.call(e, 'numSecondBanners') &&
              t.uint32(32).uint32(e.numSecondBanners),
              null != e.numMangas &&
              Object.hasOwnProperty.call(e, 'numMangas') &&
              t.uint32(40).uint32(e.numMangas),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v0.StreamedResponseHeader;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v0.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.updatedMangas &&
                    o.updatedMangas.length ||
                    (o.updatedMangas = []),
                    o.updatedMangas.push(c.v0.Manga.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.numFirstBanners = e.uint32();
                    break;
                  case 4:
                    o.numSecondBanners = e.uint32();
                    break;
                  case 5:
                    o.numMangas = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.UserPoint = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.free = 0,
            e.prototype.paid = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.free &&
              Object.hasOwnProperty.call(e, 'free') &&
              t.uint32(8).uint32(e.free),
              null != e.paid &&
              Object.hasOwnProperty.call(e, 'paid') &&
              t.uint32(16).uint32(e.paid),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v0.UserPoint; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.free = e.uint32();
                    break;
                  case 2:
                    o.paid = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Banner = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.id = 0,
            e.prototype.imageUrl = '',
            e.prototype.urlScheme = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v0.Banner; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.id = e.uint32();
                    break;
                  case 2:
                    o.imageUrl = e.string();
                    break;
                  case 3:
                    o.urlScheme = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Author = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.id = 0,
            e.prototype.name = '',
            e.prototype.nameKana = '',
            e.prototype.role = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v0.Author; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.id = e.uint32();
                    break;
                  case 2:
                    o.name = e.string();
                    break;
                  case 3:
                    o.nameKana = e.string();
                    break;
                  case 4:
                    o.role = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Manga = function () {
            var e = function (e) {
              if (this.authors = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.id = 0,
            e.prototype.title = '',
            e.prototype.titleKana = '',
            e.prototype.authors = s.emptyArray,
            e.prototype.singleListThumbnailUrl = '',
            e.prototype.spreadListThumbnailUrl = '',
            e.prototype.shortDescription = '',
            e.prototype.campaign = '',
            e.prototype.numberOfLikes = 0,
            e.prototype.lastUpdated = '',
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.id &&
                Object.hasOwnProperty.call(e, 'id') &&
                t.uint32(8).uint32(e.id),
                null != e.title &&
                Object.hasOwnProperty.call(e, 'title') &&
                t.uint32(18).string(e.title),
                null != e.titleKana &&
                Object.hasOwnProperty.call(e, 'titleKana') &&
                t.uint32(26).string(e.titleKana),
                null != e.authors &&
                e.authors.length
              ) for (var n = 0; n < e.authors.length; ++n) c.v0.Author.encode(e.authors[n], t.uint32(34).fork()).ldelim();
              return null != e.singleListThumbnailUrl &&
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v0.Manga; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.id = e.uint32();
                    break;
                  case 2:
                    o.title = e.string();
                    break;
                  case 3:
                    o.titleKana = e.string();
                    break;
                  case 4:
                    o.authors &&
                    o.authors.length ||
                    (o.authors = []),
                    o.authors.push(c.v0.Author.decode(e, e.uint32()));
                    break;
                  case 5:
                    o.singleListThumbnailUrl = e.string();
                    break;
                  case 6:
                    o.spreadListThumbnailUrl = e.string();
                    break;
                  case 7:
                    o.shortDescription = e.string();
                    break;
                  case 8:
                    o.campaign = e.string();
                    break;
                  case 9:
                    o.numberOfLikes = e.uint32();
                    break;
                  case 10:
                    o.lastUpdated = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Magazine = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.id = 0,
            e.prototype.name = '',
            e.prototype.nameKana = '',
            e.prototype.issue = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v0.Magazine; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.id = e.uint32();
                    break;
                  case 2:
                    o.name = e.string();
                    break;
                  case 3:
                    o.nameKana = e.string();
                    break;
                  case 4:
                    o.issue = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e
        }(),
        c.v1 = function () {
          var e = {};
          return e.DeviceInfo = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.secret = '',
            e.prototype.appVer = '',
            e.prototype.deviceType = 0,
            e.prototype.osVer = '',
            e.prototype.isTablet = !1,
            e.prototype.imageQuality = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
              null != e.imageQuality &&
              Object.hasOwnProperty.call(e, 'imageQuality') &&
              t.uint32(48).int32(e.imageQuality),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.DeviceInfo; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.secret = e.string();
                    break;
                  case 2:
                    o.appVer = e.string();
                    break;
                  case 3:
                    o.deviceType = e.int32();
                    break;
                  case 4:
                    o.osVer = e.string();
                    break;
                  case 5:
                    o.isTablet = e.bool();
                    break;
                  case 6:
                    o.imageQuality = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.DeviceType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'IOS'] = 0,
              t[e[1] = 'ANDROID'] = 1,
              t[e[2] = 'BROWSER'] = 2,
              t
            }(),
            e.ImageQuality = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NORMAL'] = 0,
              t[e[1] = 'HIGH'] = 1,
              t
            }(),
            e
          }(),
          e.Author = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.authorId = 0,
            e.prototype.authorName = '',
            e.prototype.authorNameKana = '',
            e.prototype.imageUrl = '',
            e.prototype.isYellEnabled = !1,
            e.prototype.isYellBonusOffered = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Author; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.authorId = e.uint32();
                    break;
                  case 2:
                    o.authorName = e.string();
                    break;
                  case 3:
                    o.authorNameKana = e.string();
                    break;
                  case 4:
                    o.imageUrl = e.string();
                    break;
                  case 5:
                    o.isYellEnabled = e.bool();
                    break;
                  case 6:
                    o.isYellBonusOffered = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Authorship = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.author = null,
            e.prototype.role = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.author &&
              Object.hasOwnProperty.call(e, 'author') &&
              c.v1.Author.encode(e.author, t.uint32(10).fork()).ldelim(),
              null != e.role &&
              Object.hasOwnProperty.call(e, 'role') &&
              t.uint32(18).string(e.role),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Authorship; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.author = c.v1.Author.decode(e, e.uint32());
                    break;
                  case 2:
                    o.role = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Banner = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.bannerId = 0,
            e.prototype.imageUrl = '',
            e.prototype.urlScheme = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Banner; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.bannerId = e.uint32();
                    break;
                  case 2:
                    o.imageUrl = e.string();
                    break;
                  case 3:
                    o.urlScheme = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BillingItem = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.productId = '',
            e.prototype.item = null,
            e.prototype.label = '',
            e.prototype.price = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.productId &&
              Object.hasOwnProperty.call(e, 'productId') &&
              t.uint32(10).string(e.productId),
              null != e.item &&
              Object.hasOwnProperty.call(e, 'item') &&
              c.v1.UserPoint.encode(e.item, t.uint32(18).fork()).ldelim(),
              null != e.label &&
              Object.hasOwnProperty.call(e, 'label') &&
              t.uint32(26).string(e.label),
              null != e.price &&
              Object.hasOwnProperty.call(e, 'price') &&
              t.uint32(32).uint32(e.price),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.BillingItem; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.productId = e.string();
                    break;
                  case 2:
                    o.item = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 3:
                    o.label = e.string();
                    break;
                  case 4:
                    o.price = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Manga = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.mangaId = 0,
            e.prototype.mangaName = '',
            e.prototype.mangaNameKana = '',
            e.prototype.mainThumbnailUrl = '',
            e.prototype.singleListThumbnailUrl = '',
            e.prototype.shortDescription = '',
            e.prototype.campaign = '',
            e.prototype.numberOfTotalChapterLikes = 0,
            e.prototype.numberOfFavorites = 0,
            e.prototype.badge = 0,
            e.prototype.isTicketAvailable = !1,
            e.prototype.isChargeNeeded = !1,
            e.prototype.longDescription = '',
            e.prototype.latestUpdatedDate = '',
            e.prototype.isFavorite = !1,
            e.prototype.isOriginal = !1,
            e.prototype.chargeStatus = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
              Object.hasOwnProperty.call(e, 'numberOfTotalChapterLikes') &&
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
              null != e.isFavorite &&
              Object.hasOwnProperty.call(e, 'isFavorite') &&
              t.uint32(128).bool(e.isFavorite),
              null != e.isOriginal &&
              Object.hasOwnProperty.call(e, 'isOriginal') &&
              t.uint32(136).bool(e.isOriginal),
              null != e.chargeStatus &&
              Object.hasOwnProperty.call(e, 'chargeStatus') &&
              t.uint32(146).string(e.chargeStatus),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Manga; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.mangaId = e.uint32();
                    break;
                  case 2:
                    o.mangaName = e.string();
                    break;
                  case 3:
                    o.mangaNameKana = e.string();
                    break;
                  case 4:
                    o.mainThumbnailUrl = e.string();
                    break;
                  case 5:
                    o.singleListThumbnailUrl = e.string();
                    break;
                  case 6:
                    o.shortDescription = e.string();
                    break;
                  case 7:
                    o.campaign = e.string();
                    break;
                  case 8:
                    o.numberOfTotalChapterLikes = e.uint32();
                    break;
                  case 9:
                    o.numberOfFavorites = e.uint32();
                    break;
                  case 10:
                    o.badge = e.int32();
                    break;
                  case 12:
                    o.isTicketAvailable = e.bool();
                    break;
                  case 13:
                    o.isChargeNeeded = e.bool();
                    break;
                  case 14:
                    o.longDescription = e.string();
                    break;
                  case 15:
                    o.latestUpdatedDate = e.string();
                    break;
                  case 16:
                    o.isFavorite = e.bool();
                    break;
                  case 17:
                    o.isOriginal = e.bool();
                    break;
                  case 18:
                    o.chargeStatus = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Badge = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NONE'] = 0,
              t[e[1] = 'NEW'] = 1,
              t[e[2] = 'UPDATE'] = 2,
              t
            }(),
            e
          }(),
          e.Chapter = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.chapterId = 0,
            e.prototype.chapterMainName = '',
            e.prototype.chapterSubName = '',
            e.prototype.thumbnailUrl = '',
            e.prototype.pointConsumption = null,
            e.prototype.numberOfComments = 0,
            e.prototype.numberOfLikes = 0,
            e.prototype.updatedDate = '',
            e.prototype.isRead = !1,
            e.prototype.endOfRentalPeriod = '',
            e.prototype.firstPageImageUrl = '',
            e.prototype.badge = 0,
            e.prototype.releaseEndDate = '',
            e.prototype.campaign = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
              c.v1.Chapter.PointConsumption.encode(e.pointConsumption, t.uint32(42).fork()).ldelim(),
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
              null != e.releaseEndDate &&
              Object.hasOwnProperty.call(e, 'releaseEndDate') &&
              t.uint32(106).string(e.releaseEndDate),
              null != e.campaign &&
              Object.hasOwnProperty.call(e, 'campaign') &&
              t.uint32(114).string(e.campaign),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Chapter; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.chapterId = e.uint32();
                    break;
                  case 2:
                    o.chapterMainName = e.string();
                    break;
                  case 3:
                    o.chapterSubName = e.string();
                    break;
                  case 4:
                    o.thumbnailUrl = e.string();
                    break;
                  case 5:
                    o.pointConsumption = c.v1.Chapter.PointConsumption.decode(e, e.uint32());
                    break;
                  case 6:
                    o.numberOfComments = e.uint32();
                    break;
                  case 7:
                    o.numberOfLikes = e.uint32();
                    break;
                  case 8:
                    o.updatedDate = e.string();
                    break;
                  case 9:
                    o.isRead = e.bool();
                    break;
                  case 10:
                    o.endOfRentalPeriod = e.string();
                    break;
                  case 11:
                    o.firstPageImageUrl = e.string();
                    break;
                  case 12:
                    o.badge = e.int32();
                    break;
                  case 13:
                    o.releaseEndDate = e.string();
                    break;
                  case 14:
                    o.campaign = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Badge = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NONE'] = 0,
              t[e[1] = 'UPDATE'] = 1,
              t[e[2] = 'ADVANCE'] = 2,
              t[e[3] = 'SPECIAL'] = 3,
              t
            }(),
            e.PointConsumption = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.type = 0,
              e.prototype.amount = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.type &&
                Object.hasOwnProperty.call(e, 'type') &&
                t.uint32(8).int32(e.type),
                null != e.amount &&
                Object.hasOwnProperty.call(e, 'amount') &&
                t.uint32(16).uint32(e.amount),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.Chapter.PointConsumption;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.type = e.int32();
                      break;
                    case 2:
                      o.amount = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e.Type = function () {
                var e = {},
                t = Object.create(e);
                return t[e[0] = 'ANY_ITEMS'] = 0,
                t[e[1] = 'EVENT_OR_PAID'] = 1,
                t[e[2] = 'PAID_ONLY'] = 2,
                t
              }(),
              e
            }(),
            e
          }(),
          e.Book = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.bookName = '',
            e.prototype.latestBookIssueId = 0,
            e.prototype.thumbnailUrl = '',
            e.prototype.campaign = '',
            e.prototype.shelfBadge = 0,
            e.prototype.bookNameKana = '',
            e.prototype.publishedDate = '',
            e.prototype.latestBookIssueName = '',
            e.prototype.longDescription = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Book; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.bookName = e.string();
                    break;
                  case 2:
                    o.latestBookIssueId = e.uint32();
                    break;
                  case 3:
                    o.thumbnailUrl = e.string();
                    break;
                  case 4:
                    o.campaign = e.string();
                    break;
                  case 5:
                    o.shelfBadge = e.int32();
                    break;
                  case 6:
                    o.bookNameKana = e.string();
                    break;
                  case 8:
                    o.publishedDate = e.string();
                    break;
                  case 9:
                    o.latestBookIssueName = e.string();
                    break;
                  case 10:
                    o.longDescription = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ShelfBadge = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NONE'] = 0,
              t[e[1] = 'LIMITED'] = 1,
              t[e[2] = 'ENDED'] = 2,
              t[e[3] = 'NOT_PURCHASED_ALL'] = 3,
              t
            }(),
            e
          }(),
          e.BookIssue = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.bookIssueId = 0,
            e.prototype.bookIssueName = '',
            e.prototype.thumbnailUrl = '',
            e.prototype.paidPoint = 0,
            e.prototype.campaignPaidPoint = 0,
            e.prototype.isDiscountCampaign = !1,
            e.prototype.isFreeCampaign = !1,
            e.prototype.numberOfSamplePages = 0,
            e.prototype.numberOfComments = 0,
            e.prototype.updatedDate = '',
            e.prototype.purchaseStatus = 0,
            e.prototype.expirationDateOfFreeCampaign = '',
            e.prototype.firstPageImageUrl = '',
            e.prototype.campaign = '',
            e.prototype.longDescription = '',
            e.prototype.bookName = '',
            e.prototype.cashBack = null,
            e.prototype.isRead = !1,
            e.prototype.releaseEndDate = '',
            e.prototype.title = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
              Object.hasOwnProperty.call(e, 'expirationDateOfFreeCampaign') &&
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
              c.v1.UserPoint.encode(e.cashBack, t.uint32(138).fork()).ldelim(),
              null != e.isRead &&
              Object.hasOwnProperty.call(e, 'isRead') &&
              t.uint32(144).bool(e.isRead),
              null != e.releaseEndDate &&
              Object.hasOwnProperty.call(e, 'releaseEndDate') &&
              t.uint32(154).string(e.releaseEndDate),
              null != e.title &&
              Object.hasOwnProperty.call(e, 'title') &&
              t.uint32(162).string(e.title),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.BookIssue; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.bookIssueId = e.uint32();
                    break;
                  case 2:
                    o.bookIssueName = e.string();
                    break;
                  case 3:
                    o.thumbnailUrl = e.string();
                    break;
                  case 4:
                    o.paidPoint = e.uint32();
                    break;
                  case 5:
                    o.campaignPaidPoint = e.uint32();
                    break;
                  case 6:
                    o.isDiscountCampaign = e.bool();
                    break;
                  case 7:
                    o.isFreeCampaign = e.bool();
                    break;
                  case 8:
                    o.numberOfSamplePages = e.uint32();
                    break;
                  case 9:
                    o.numberOfComments = e.uint32();
                    break;
                  case 10:
                    o.updatedDate = e.string();
                    break;
                  case 11:
                    o.purchaseStatus = e.int32();
                    break;
                  case 12:
                    o.expirationDateOfFreeCampaign = e.string();
                    break;
                  case 13:
                    o.firstPageImageUrl = e.string();
                    break;
                  case 14:
                    o.campaign = e.string();
                    break;
                  case 15:
                    o.longDescription = e.string();
                    break;
                  case 16:
                    o.bookName = e.string();
                    break;
                  case 17:
                    o.cashBack = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 18:
                    o.isRead = e.bool();
                    break;
                  case 19:
                    o.releaseEndDate = e.string();
                    break;
                  case 20:
                    o.title = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.PurchaseStatus = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NONE'] = 0,
              t[e[1] = 'WISHED'] = 1,
              t[e[2] = 'PURCHASED'] = 2,
              t
            }(),
            e
          }(),
          e.ChapterGroup = function () {
            var e = function (e) {
              if (this.chapters = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.bookIssueHeader = null,
            e.prototype.chapters = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.bookIssueHeader &&
                Object.hasOwnProperty.call(e, 'bookIssueHeader') &&
                c.v1.ChapterGroup.BookIssueHeader.encode(e.bookIssueHeader, t.uint32(10).fork()).ldelim(),
                null != e.chapters &&
                e.chapters.length
              ) for (var n = 0; n < e.chapters.length; ++n) c.v1.Chapter.encode(e.chapters[n], t.uint32(18).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.ChapterGroup; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.bookIssueHeader = c.v1.ChapterGroup.BookIssueHeader.decode(e, e.uint32());
                    break;
                  case 2:
                    o.chapters &&
                    o.chapters.length ||
                    (o.chapters = []),
                    o.chapters.push(c.v1.Chapter.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.BookIssueHeader = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.bookIssueId = '',
              e.prototype.headerImageUrl = '',
              e.prototype.text = '',
              e.prototype.publishedDate = '',
              e.prototype.campaign = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
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
                null != e.campaign &&
                Object.hasOwnProperty.call(e, 'campaign') &&
                t.uint32(42).string(e.campaign),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.ChapterGroup.BookIssueHeader;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.bookIssueId = e.string();
                      break;
                    case 2:
                      o.headerImageUrl = e.string();
                      break;
                    case 3:
                      o.text = e.string();
                      break;
                    case 4:
                      o.publishedDate = e.string();
                      break;
                    case 5:
                      o.campaign = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.Magazine = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.magazineId = 0,
            e.prototype.magazineName = '',
            e.prototype.magazineNameKana = '',
            e.prototype.thumbnailUrl = '',
            e.prototype.shortDescription = '',
            e.prototype.campaign = '',
            e.prototype.lastUpdatedDate = '',
            e.prototype.productId = '',
            e.prototype.lastUpdatedIssueName = '',
            e.prototype.shelfBadge = 0,
            e.prototype.latestMagazineIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Magazine; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.magazineId = e.uint32();
                    break;
                  case 2:
                    o.magazineName = e.string();
                    break;
                  case 3:
                    o.magazineNameKana = e.string();
                    break;
                  case 4:
                    o.thumbnailUrl = e.string();
                    break;
                  case 5:
                    o.shortDescription = e.string();
                    break;
                  case 6:
                    o.campaign = e.string();
                    break;
                  case 7:
                    o.lastUpdatedDate = e.string();
                    break;
                  case 8:
                    o.productId = e.string();
                    break;
                  case 9:
                    o.lastUpdatedIssueName = e.string();
                    break;
                  case 10:
                    o.shelfBadge = e.int32();
                    break;
                  case 11:
                    o.latestMagazineIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ShelfBadge = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NONE'] = 0,
              t[e[1] = 'LIMITED'] = 1,
              t[e[2] = 'ENDED'] = 2,
              t[e[3] = 'NOT_PURCHASED_ALL'] = 3,
              t[e[4] = 'SUBSCRIBED'] = 4,
              t
            }(),
            e
          }(),
          e.MagazineIssue = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.magazineIssueId = 0,
            e.prototype.magazineIssueName = '',
            e.prototype.thumbnailUrl = '',
            e.prototype.paidPoint = 0,
            e.prototype.campaignPaidPoint = 0,
            e.prototype.isDiscountCampaign = !1,
            e.prototype.isFreeCampaign = !1,
            e.prototype.numberOfSamplePages = 0,
            e.prototype.numberOfComments = 0,
            e.prototype.updatedDate = '',
            e.prototype.endDate = '',
            e.prototype.isPurchased = !1,
            e.prototype.isSubscribed = !1,
            e.prototype.firstPageImageUrl = '',
            e.prototype.campaign = '',
            e.prototype.longDescription = '',
            e.prototype.magazineName = '',
            e.prototype.cashBack = null,
            e.prototype.isRead = !1,
            e.prototype.releaseEndDate = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
              c.v1.UserPoint.encode(e.cashBack, t.uint32(146).fork()).ldelim(),
              null != e.isRead &&
              Object.hasOwnProperty.call(e, 'isRead') &&
              t.uint32(152).bool(e.isRead),
              null != e.releaseEndDate &&
              Object.hasOwnProperty.call(e, 'releaseEndDate') &&
              t.uint32(162).string(e.releaseEndDate),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineIssue;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.magazineIssueId = e.uint32();
                    break;
                  case 2:
                    o.magazineIssueName = e.string();
                    break;
                  case 3:
                    o.thumbnailUrl = e.string();
                    break;
                  case 4:
                    o.paidPoint = e.uint32();
                    break;
                  case 5:
                    o.campaignPaidPoint = e.uint32();
                    break;
                  case 6:
                    o.isDiscountCampaign = e.bool();
                    break;
                  case 7:
                    o.isFreeCampaign = e.bool();
                    break;
                  case 8:
                    o.numberOfSamplePages = e.uint32();
                    break;
                  case 9:
                    o.numberOfComments = e.uint32();
                    break;
                  case 10:
                    o.updatedDate = e.string();
                    break;
                  case 11:
                    o.endDate = e.string();
                    break;
                  case 12:
                    o.isPurchased = e.bool();
                    break;
                  case 13:
                    o.isSubscribed = e.bool();
                    break;
                  case 14:
                    o.firstPageImageUrl = e.string();
                    break;
                  case 15:
                    o.campaign = e.string();
                    break;
                  case 16:
                    o.longDescription = e.string();
                    break;
                  case 17:
                    o.magazineName = e.string();
                    break;
                  case 18:
                    o.cashBack = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 19:
                    o.isRead = e.bool();
                    break;
                  case 20:
                    o.releaseEndDate = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Comment = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.commentId = 0,
            e.prototype.index = 0,
            e.prototype.isMyComment = !1,
            e.prototype.alreadyLiked = !1,
            e.prototype.numberOfLikes = 0,
            e.prototype.body = '',
            e.prototype.created = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Comment; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.commentId = e.uint32();
                    break;
                  case 2:
                    o.index = e.uint32();
                    break;
                  case 3:
                    o.isMyComment = e.bool();
                    break;
                  case 4:
                    o.alreadyLiked = e.bool();
                    break;
                  case 5:
                    o.numberOfLikes = e.uint32();
                    break;
                  case 6:
                    o.body = e.string();
                    break;
                  case 7:
                    o.created = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ViewerPage = function () {
            var e,
            t = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.image = null,
            t.prototype.webview = null,
            t.prototype.lastPage = null,
            Object.defineProperty(
              t.prototype,
              'content',
              {
                get: s.oneOfGetter(e = [
                  'image',
                  'webview',
                  'lastPage'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.image &&
              Object.hasOwnProperty.call(e, 'image') &&
              c.v1.ViewerPage.Image.encode(e.image, t.uint32(10).fork()).ldelim(),
              null != e.webview &&
              Object.hasOwnProperty.call(e, 'webview') &&
              c.v1.ViewerPage.WebView.encode(e.webview, t.uint32(18).fork()).ldelim(),
              null != e.lastPage &&
              Object.hasOwnProperty.call(e, 'lastPage') &&
              c.v1.ViewerPage.LastPage.encode(e.lastPage, t.uint32(26).fork()).ldelim(),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.ViewerPage; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.image = c.v1.ViewerPage.Image.decode(e, e.uint32());
                    break;
                  case 2:
                    o.webview = c.v1.ViewerPage.WebView.decode(e, e.uint32());
                    break;
                  case 3:
                    o.lastPage = c.v1.ViewerPage.LastPage.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.Image = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.imageUrl = '',
              e.prototype.urlScheme = '',
              e.prototype.iv = '',
              e.prototype.encryptionKey = '',
              e.prototype.imageWidth = 0,
              e.prototype.imageHeight = 0,
              e.prototype.isExtraPage = !1,
              e.prototype.extraId = 0,
              e.prototype.extraIndex = 0,
              e.prototype.extraSlotId = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
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
                null != e.imageWidth &&
                Object.hasOwnProperty.call(e, 'imageWidth') &&
                t.uint32(40).uint32(e.imageWidth),
                null != e.imageHeight &&
                Object.hasOwnProperty.call(e, 'imageHeight') &&
                t.uint32(48).uint32(e.imageHeight),
                null != e.isExtraPage &&
                Object.hasOwnProperty.call(e, 'isExtraPage') &&
                t.uint32(56).bool(e.isExtraPage),
                null != e.extraId &&
                Object.hasOwnProperty.call(e, 'extraId') &&
                t.uint32(64).uint32(e.extraId),
                null != e.extraIndex &&
                Object.hasOwnProperty.call(e, 'extraIndex') &&
                t.uint32(72).uint32(e.extraIndex),
                null != e.extraSlotId &&
                Object.hasOwnProperty.call(e, 'extraSlotId') &&
                t.uint32(80).uint32(e.extraSlotId),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.ViewerPage.Image;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.imageUrl = e.string();
                      break;
                    case 2:
                      o.urlScheme = e.string();
                      break;
                    case 3:
                      o.iv = e.string();
                      break;
                    case 4:
                      o.encryptionKey = e.string();
                      break;
                    case 5:
                      o.imageWidth = e.uint32();
                      break;
                    case 6:
                      o.imageHeight = e.uint32();
                      break;
                    case 7:
                      o.isExtraPage = e.bool();
                      break;
                    case 8:
                      o.extraId = e.uint32();
                      break;
                    case 9:
                      o.extraIndex = e.uint32();
                      break;
                    case 10:
                      o.extraSlotId = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t.WebView = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.url = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.url &&
                Object.hasOwnProperty.call(e, 'url') &&
                t.uint32(10).string(e.url),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.ViewerPage.WebView;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.url = e.string();
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            t.LastPage = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.ViewerPage.LastPage;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            t
          }(),
          e.PointHistory = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.detail = '',
            e.prototype.item = null,
            e.prototype.acquiredTime = '',
            e.prototype.expirationDate = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.detail &&
              Object.hasOwnProperty.call(e, 'detail') &&
              t.uint32(10).string(e.detail),
              null != e.item &&
              Object.hasOwnProperty.call(e, 'item') &&
              c.v1.UserPoint.encode(e.item, t.uint32(18).fork()).ldelim(),
              null != e.acquiredTime &&
              Object.hasOwnProperty.call(e, 'acquiredTime') &&
              t.uint32(26).string(e.acquiredTime),
              null != e.expirationDate &&
              Object.hasOwnProperty.call(e, 'expirationDate') &&
              t.uint32(34).string(e.expirationDate),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.PointHistory; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.detail = e.string();
                    break;
                  case 2:
                    o.item = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 3:
                    o.acquiredTime = e.string();
                    break;
                  case 4:
                    o.expirationDate = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ExpiredPointHistory = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.item = null,
            e.prototype.expirationDate = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.item &&
              Object.hasOwnProperty.call(e, 'item') &&
              c.v1.UserPoint.encode(e.item, t.uint32(10).fork()).ldelim(),
              null != e.expirationDate &&
              Object.hasOwnProperty.call(e, 'expirationDate') &&
              t.uint32(18).string(e.expirationDate),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ExpiredPointHistory;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.item = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.expirationDate = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Popup = function () {
            var e,
            t = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.appDefault = null,
            t.prototype.reviewPopup = null,
            Object.defineProperty(
              t.prototype,
              'popup',
              {
                get: s.oneOfGetter(e = [
                  'appDefault',
                  'reviewPopup'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.appDefault &&
              Object.hasOwnProperty.call(e, 'appDefault') &&
              c.v1.Popup.AppDefaultPopup.encode(e.appDefault, t.uint32(10).fork()).ldelim(),
              null != e.reviewPopup &&
              Object.hasOwnProperty.call(e, 'reviewPopup') &&
              c.v1.Popup.ReviewPopup.encode(e.reviewPopup, t.uint32(18).fork()).ldelim(),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Popup; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.appDefault = c.v1.Popup.AppDefaultPopup.decode(e, e.uint32());
                    break;
                  case 2:
                    o.reviewPopup = c.v1.Popup.ReviewPopup.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.AppDefaultPopup = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.id = 0,
              e.prototype.personalPopupId = 0,
              e.prototype.subject = '',
              e.prototype.body = '',
              e.prototype.imageUrl = '',
              e.prototype.urlScheme = '',
              e.prototype.okButton = '',
              e.prototype.imageType = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
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
                null != e.imageType &&
                Object.hasOwnProperty.call(e, 'imageType') &&
                t.uint32(64).int32(e.imageType),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.Popup.AppDefaultPopup;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.id = e.uint32();
                      break;
                    case 2:
                      o.personalPopupId = e.uint32();
                      break;
                    case 3:
                      o.subject = e.string();
                      break;
                    case 4:
                      o.body = e.string();
                      break;
                    case 5:
                      o.imageUrl = e.string();
                      break;
                    case 6:
                      o.urlScheme = e.string();
                      break;
                    case 7:
                      o.okButton = e.string();
                      break;
                    case 8:
                      o.imageType = e.int32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t.ReviewPopup = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.Popup.ReviewPopup;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            t.ImageType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'Normal'] = 0,
              t[e[1] = 'Book'] = 1,
              t
            }(),
            t
          }(),
          e.Sns = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.body = '',
            e.prototype.url = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.body &&
              Object.hasOwnProperty.call(e, 'body') &&
              t.uint32(10).string(e.body),
              null != e.url &&
              Object.hasOwnProperty.call(e, 'url') &&
              t.uint32(18).string(e.url),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Sns; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.body = e.string();
                    break;
                  case 2:
                    o.url = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SpecialImage = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.id = 0,
            e.prototype.imageWidth = 0,
            e.prototype.imageHeight = 0,
            e.prototype.imageUrl = '',
            e.prototype.urlScheme = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.SpecialImage; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.id = e.uint32();
                    break;
                  case 2:
                    o.imageWidth = e.uint32();
                    break;
                  case 3:
                    o.imageHeight = e.uint32();
                    break;
                  case 4:
                    o.imageUrl = e.string();
                    break;
                  case 5:
                    o.urlScheme = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SubscriptionItem = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.productId = '',
            e.prototype.name = '',
            e.prototype.item = null,
            e.prototype.label = '',
            e.prototype.imageUrl = '',
            e.prototype.status = 0,
            e.prototype.monthlyPrice = 0,
            e.prototype.nextUpdateTiming = '',
            e.prototype.buttonText = '',
            e.prototype.cancelButtonState = 0,
            e.prototype.subscribedStartTime = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.productId &&
              Object.hasOwnProperty.call(e, 'productId') &&
              t.uint32(10).string(e.productId),
              null != e.name &&
              Object.hasOwnProperty.call(e, 'name') &&
              t.uint32(18).string(e.name),
              null != e.item &&
              Object.hasOwnProperty.call(e, 'item') &&
              c.v1.UserPoint.encode(e.item, t.uint32(26).fork()).ldelim(),
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
              null != e.subscribedStartTime &&
              Object.hasOwnProperty.call(e, 'subscribedStartTime') &&
              t.uint32(90).string(e.subscribedStartTime),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SubscriptionItem;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.productId = e.string();
                    break;
                  case 2:
                    o.name = e.string();
                    break;
                  case 3:
                    o.item = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 4:
                    o.label = e.string();
                    break;
                  case 5:
                    o.imageUrl = e.string();
                    break;
                  case 6:
                    o.status = e.int32();
                    break;
                  case 7:
                    o.monthlyPrice = e.uint32();
                    break;
                  case 8:
                    o.nextUpdateTiming = e.string();
                    break;
                  case 9:
                    o.buttonText = e.string();
                    break;
                  case 10:
                    o.cancelButtonState = e.int32();
                    break;
                  case 11:
                    o.subscribedStartTime = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Status = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'UNSUBSCRIBED'] = 0,
              t[e[1] = 'SUBSCRIBED'] = 1,
              t[e[2] = 'NOT_AVAILABLE'] = 2,
              t[e[3] = 'OTHER_PLATFORM'] = 3,
              t
            }(),
            e.CancelButtonState = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'HIDDEN'] = 0,
              t[e[1] = 'CANCELLABLE'] = 1,
              t[e[2] = 'RESUBSCRIBABLE'] = 2,
              t
            }(),
            e
          }(),
          e.SubscriptionCourse = function () {
            var e = function (e) {
              if (this.items = [], this.magazines = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.headerText = '',
            e.prototype.items = s.emptyArray,
            e.prototype.magazines = s.emptyArray,
            e.prototype.courseDescription = '',
            e.prototype.noteDescription_1 = '',
            e.prototype.noteDescription_2 = '',
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.headerText &&
                Object.hasOwnProperty.call(e, 'headerText') &&
                t.uint32(10).string(e.headerText),
                null != e.items &&
                e.items.length
              ) for (var n = 0; n < e.items.length; ++n) c.v1.SubscriptionItem.encode(e.items[n], t.uint32(18).fork()).ldelim();
              if (null != e.magazines && e.magazines.length) for (var r = 0; r < e.magazines.length; ++r) c.v1.Magazine.encode(e.magazines[r], t.uint32(26).fork()).ldelim();
              return null != e.courseDescription &&
              Object.hasOwnProperty.call(e, 'courseDescription') &&
              t.uint32(34).string(e.courseDescription),
              null != e.noteDescription_1 &&
              Object.hasOwnProperty.call(e, 'noteDescription_1') &&
              t.uint32(42).string(e.noteDescription_1),
              null != e.noteDescription_2 &&
              Object.hasOwnProperty.call(e, 'noteDescription_2') &&
              t.uint32(50).string(e.noteDescription_2),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SubscriptionCourse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.headerText = e.string();
                    break;
                  case 2:
                    o.items &&
                    o.items.length ||
                    (o.items = []),
                    o.items.push(c.v1.SubscriptionItem.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.magazines &&
                    o.magazines.length ||
                    (o.magazines = []),
                    o.magazines.push(c.v1.Magazine.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.courseDescription = e.string();
                    break;
                  case 5:
                    o.noteDescription_1 = e.string();
                    break;
                  case 6:
                    o.noteDescription_2 = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Tag = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.id = 0,
            e.prototype.name = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.id &&
              Object.hasOwnProperty.call(e, 'id') &&
              t.uint32(8).uint32(e.id),
              null != e.name &&
              Object.hasOwnProperty.call(e, 'name') &&
              t.uint32(18).string(e.name),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Tag; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.id = e.uint32();
                    break;
                  case 2:
                    o.name = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.UserPoint = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.event = 0,
            e.prototype.paid = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.event &&
              Object.hasOwnProperty.call(e, 'event') &&
              t.uint32(8).uint32(e.event),
              null != e.paid &&
              Object.hasOwnProperty.call(e, 'paid') &&
              t.uint32(16).uint32(e.paid),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.UserPoint; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.event = e.uint32();
                    break;
                  case 2:
                    o.paid = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Koma = function () {
            var e,
            t = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.komaId = 0,
            t.prototype.mangaId = 0,
            t.prototype.mangaName = '',
            t.prototype.imageUrl = '',
            t.prototype.shortDescription = '',
            t.prototype.longDescription = '',
            t.prototype.campaign = '',
            t.prototype.pickupName = '',
            t.prototype.normal = null,
            t.prototype.special = null,
            t.prototype.urlScheme = '',
            Object.defineProperty(
              t.prototype,
              'pickupDetail',
              {
                get: s.oneOfGetter(e = [
                  'normal',
                  'special'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
              null != e.pickupName &&
              Object.hasOwnProperty.call(e, 'pickupName') &&
              t.uint32(66).string(e.pickupName),
              null != e.normal &&
              Object.hasOwnProperty.call(e, 'normal') &&
              t.uint32(74).string(e.normal),
              null != e.special &&
              Object.hasOwnProperty.call(e, 'special') &&
              t.uint32(82).string(e.special),
              null != e.urlScheme &&
              Object.hasOwnProperty.call(e, 'urlScheme') &&
              t.uint32(90).string(e.urlScheme),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Koma; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.komaId = e.uint32();
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  case 3:
                    o.mangaName = e.string();
                    break;
                  case 4:
                    o.imageUrl = e.string();
                    break;
                  case 5:
                    o.shortDescription = e.string();
                    break;
                  case 6:
                    o.longDescription = e.string();
                    break;
                  case 7:
                    o.campaign = e.string();
                    break;
                  case 8:
                    o.pickupName = e.string();
                    break;
                  case 9:
                    o.normal = e.string();
                    break;
                  case 10:
                    o.special = e.string();
                    break;
                  case 11:
                    o.urlScheme = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t
          }(),
          e.News = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.newsId = 0,
            e.prototype.subject = '',
            e.prototype.body = '',
            e.prototype.published = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.News; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.newsId = e.uint32();
                    break;
                  case 2:
                    o.subject = e.string();
                    break;
                  case 3:
                    o.body = e.string();
                    break;
                  case 4:
                    o.published = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Contact = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.id = 0,
            e.prototype.body = '',
            e.prototype.contactType = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Contact; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.id = e.uint32();
                    break;
                  case 2:
                    o.body = e.string();
                    break;
                  case 3:
                    o.contactType = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ContactType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'FROM_USER'] = 0,
              t[e[1] = 'TO_USER'] = 1,
              t
            }(),
            e
          }(),
          e.Yell = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.id = 0,
            e.prototype.handleName = '',
            e.prototype.message = '',
            e.prototype.paidPoint = 0,
            e.prototype.isMyYell = !1,
            e.prototype.createdDate = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Yell; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.id = e.uint32();
                    break;
                  case 2:
                    o.handleName = e.string();
                    break;
                  case 3:
                    o.message = e.string();
                    break;
                  case 4:
                    o.paidPoint = e.uint32();
                    break;
                  case 5:
                    o.isMyYell = e.bool();
                    break;
                  case 6:
                    o.createdDate = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseResult = function () {
            var e = {},
            t = Object.create(e);
            return t[e[0] = 'VALID'] = 0,
            t[e[1] = 'INVALID'] = 1,
            t
          }(),
          e.Error = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.subject = '',
            e.prototype.body = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.subject &&
              Object.hasOwnProperty.call(e, 'subject') &&
              t.uint32(10).string(e.subject),
              null != e.body &&
              Object.hasOwnProperty.call(e, 'body') &&
              t.uint32(18).string(e.body),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Error; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.subject = e.string();
                    break;
                  case 2:
                    o.body = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ViewerMode = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.imageQuality = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.imageQuality &&
              Object.hasOwnProperty.call(e, 'imageQuality') &&
              t.uint32(8).int32(e.imageQuality),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.ViewerMode; e.pos < n; ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.imageQuality = e.int32();
                 else e.skipType(7 & i)
              }
              return o
            },
            e.ImageQuality = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NORMAL'] = 0,
              t[e[1] = 'HIGH'] = 1,
              t
            }(),
            e
          }(),
          e.NotificationItem = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.pushId = 0,
            e.prototype.title = '',
            e.prototype.pushStatus = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.pushId &&
              Object.hasOwnProperty.call(e, 'pushId') &&
              t.uint32(8).uint32(e.pushId),
              null != e.title &&
              Object.hasOwnProperty.call(e, 'title') &&
              t.uint32(18).string(e.title),
              null != e.pushStatus &&
              Object.hasOwnProperty.call(e, 'pushStatus') &&
              t.uint32(24).bool(e.pushStatus),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.NotificationItem;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.pushId = e.uint32();
                    break;
                  case 2:
                    o.title = e.string();
                    break;
                  case 3:
                    o.pushStatus = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.Mission = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.title = '',
            e.prototype.rewardPoint = null,
            e.prototype.description = '',
            e.prototype.progress = null,
            e.prototype.urlScheme = '',
            e.prototype.expiration = '',
            e.prototype.missionId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.title &&
              Object.hasOwnProperty.call(e, 'title') &&
              t.uint32(10).string(e.title),
              null != e.rewardPoint &&
              Object.hasOwnProperty.call(e, 'rewardPoint') &&
              c.v1.UserPoint.encode(e.rewardPoint, t.uint32(18).fork()).ldelim(),
              null != e.description &&
              Object.hasOwnProperty.call(e, 'description') &&
              t.uint32(26).string(e.description),
              null != e.progress &&
              Object.hasOwnProperty.call(e, 'progress') &&
              c.v1.Mission.Progress.encode(e.progress, t.uint32(42).fork()).ldelim(),
              null != e.urlScheme &&
              Object.hasOwnProperty.call(e, 'urlScheme') &&
              t.uint32(50).string(e.urlScheme),
              null != e.expiration &&
              Object.hasOwnProperty.call(e, 'expiration') &&
              t.uint32(58).string(e.expiration),
              null != e.missionId &&
              Object.hasOwnProperty.call(e, 'missionId') &&
              t.uint32(64).uint32(e.missionId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Mission; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.title = e.string();
                    break;
                  case 2:
                    o.rewardPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 3:
                    o.description = e.string();
                    break;
                  case 5:
                    o.progress = c.v1.Mission.Progress.decode(e, e.uint32());
                    break;
                  case 6:
                    o.urlScheme = e.string();
                    break;
                  case 7:
                    o.expiration = e.string();
                    break;
                  case 8:
                    o.missionId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Progress = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.currentValue = 0,
              e.prototype.maxValue = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.currentValue &&
                Object.hasOwnProperty.call(e, 'currentValue') &&
                t.uint32(8).uint32(e.currentValue),
                null != e.maxValue &&
                Object.hasOwnProperty.call(e, 'maxValue') &&
                t.uint32(16).uint32(e.maxValue),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.Mission.Progress;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.currentValue = e.uint32();
                      break;
                    case 2:
                      o.maxValue = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.Color = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.lightColorCode = '',
            e.prototype.darkColorCode = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.lightColorCode &&
              Object.hasOwnProperty.call(e, 'lightColorCode') &&
              t.uint32(10).string(e.lightColorCode),
              null != e.darkColorCode &&
              Object.hasOwnProperty.call(e, 'darkColorCode') &&
              t.uint32(18).string(e.darkColorCode),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.Color; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.lightColorCode = e.string();
                    break;
                  case 2:
                    o.darkColorCode = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MainService = function () {
            var e = function (e, t, n) {
              o.rpc.Service.call(this, e, t, n)
            };
            return (e.prototype = Object.create(o.rpc.Service.prototype)).constructor = e,
            Object.defineProperty(
              e.prototype.purchaseOnAppStore = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PurchaseOnAppStoreRequest,
                  c.v1.PurchaseOnAppStoreResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PurchaseOnAppStore'
              }
            ),
            Object.defineProperty(
              e.prototype.restoreSubscriptionOnAppStore = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.RestoreSubscriptionOnAppStoreRequest,
                  c.v1.RestoreSubscriptionOnAppStoreResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'RestoreSubscriptionOnAppStore'
              }
            ),
            Object.defineProperty(
              e.prototype.bookIssuesToPurchaseInBulk = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.BookIssuesToPurchaseInBulkRequest,
                  c.v1.BookIssuesToPurchaseInBulkResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'BookIssuesToPurchaseInBulk'
              }
            ),
            Object.defineProperty(
              e.prototype.home = function e(t, n) {
                return this.rpcCall(e, c.v1.HomeRequest, c.v1.HomeResponse, t, n)
              },
              'name',
              {
                value: 'Home'
              }
            ),
            Object.defineProperty(
              e.prototype.mangaList = function e(t, n) {
                return this.rpcCall(e, c.v1.MangaListRequest, c.v1.MangaListResponse, t, n)
              },
              'name',
              {
                value: 'MangaList'
              }
            ),
            Object.defineProperty(
              e.prototype.pointHistory = function e(t, n) {
                return this.rpcCall(e, c.v1.PointHistoryRequest, c.v1.PointHistoryResponse, t, n)
              },
              'name',
              {
                value: 'PointHistory'
              }
            ),
            Object.defineProperty(
              e.prototype.authorDetail = function e(t, n) {
                return this.rpcCall(e, c.v1.AuthorDetailRequest, c.v1.AuthorDetailResponse, t, n)
              },
              'name',
              {
                value: 'AuthorDetail'
              }
            ),
            Object.defineProperty(
              e.prototype.mangaViewer = function e(t, n) {
                return this.rpcCall(e, c.v1.MangaViewerRequest, c.v1.MangaViewerResponse, t, n)
              },
              'name',
              {
                value: 'MangaViewer'
              }
            ),
            Object.defineProperty(
              e.prototype.backgroundDownload = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.BackgroundDownloadRequest,
                  c.v1.BackgroundDownloadResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'BackgroundDownload'
              }
            ),
            Object.defineProperty(
              e.prototype.bookViewer = function e(t, n) {
                return this.rpcCall(e, c.v1.BookViewerRequest, c.v1.BookViewerResponse, t, n)
              },
              'name',
              {
                value: 'BookViewer'
              }
            ),
            Object.defineProperty(
              e.prototype.magazineIssueDetail = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.MagazineIssueDetailRequest,
                  c.v1.MagazineIssueDetailResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'MagazineIssueDetail'
              }
            ),
            Object.defineProperty(
              e.prototype.mangasByDayOfWeek = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.MangasByDayOfWeekRequest,
                  c.v1.MangasByDayOfWeekResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'MangasByDayOfWeek'
              }
            ),
            Object.defineProperty(
              e.prototype.register = function e(t, n) {
                return this.rpcCall(e, c.v1.RegisterRequest, c.v1.RegisterResponse, t, n)
              },
              'name',
              {
                value: 'Register'
              }
            ),
            Object.defineProperty(
              e.prototype.billingItemList = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.BillingItemListRequest,
                  c.v1.BillingItemListResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'BillingItemList'
              }
            ),
            Object.defineProperty(
              e.prototype.chapterLastPage = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.ChapterLastPageRequest,
                  c.v1.ChapterLastPageResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'ChapterLastPage'
              }
            ),
            Object.defineProperty(
              e.prototype.magazineIssueLastPage = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.MagazineIssueLastPageRequest,
                  c.v1.MagazineIssueLastPageResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'MagazineIssueLastPage'
              }
            ),
            Object.defineProperty(
              e.prototype.search = function e(t, n) {
                return this.rpcCall(e, c.v1.SearchRequest, c.v1.SearchResponse, t, n)
              },
              'name',
              {
                value: 'Search'
              }
            ),
            Object.defineProperty(
              e.prototype.bookIssueDetail = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.BookIssueDetailRequest,
                  c.v1.BookIssueDetailResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'BookIssueDetail'
              }
            ),
            Object.defineProperty(
              e.prototype.getChapterComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.GetChapterCommentRequest,
                  c.v1.GetChapterCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'GetChapterComment'
              }
            ),
            Object.defineProperty(
              e.prototype.postChapterComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PostChapterCommentRequest,
                  c.v1.PostChapterCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PostChapterComment'
              }
            ),
            Object.defineProperty(
              e.prototype.deleteChapterComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.DeleteChapterCommentRequest,
                  c.v1.DeleteChapterCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'DeleteChapterComment'
              }
            ),
            Object.defineProperty(
              e.prototype.getBookIssueComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.GetBookIssueCommentRequest,
                  c.v1.GetBookIssueCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'GetBookIssueComment'
              }
            ),
            Object.defineProperty(
              e.prototype.postBookIssueComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PostBookIssueCommentRequest,
                  c.v1.PostBookIssueCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PostBookIssueComment'
              }
            ),
            Object.defineProperty(
              e.prototype.deleteBookIssueComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.DeleteBookIssueCommentRequest,
                  c.v1.DeleteBookIssueCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'DeleteBookIssueComment'
              }
            ),
            Object.defineProperty(
              e.prototype.getMagazineIssueComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.GetMagazineIssueCommentRequest,
                  c.v1.GetMagazineIssueCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'GetMagazineIssueComment'
              }
            ),
            Object.defineProperty(
              e.prototype.postMagazineIssueComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PostMagazineIssueCommentRequest,
                  c.v1.PostMagazineIssueCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PostMagazineIssueComment'
              }
            ),
            Object.defineProperty(
              e.prototype.deleteMagazineIssueComment = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.DeleteMagazineIssueCommentRequest,
                  c.v1.DeleteMagazineIssueCommentResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'DeleteMagazineIssueComment'
              }
            ),
            Object.defineProperty(
              e.prototype.news = function e(t, n) {
                return this.rpcCall(e, c.v1.NewsRequest, c.v1.NewsResponse, t, n)
              },
              'name',
              {
                value: 'News'
              }
            ),
            Object.defineProperty(
              e.prototype.shelf = function e(t, n) {
                return this.rpcCall(e, c.v1.ShelfRequest, c.v1.ShelfResponse, t, n)
              },
              'name',
              {
                value: 'Shelf'
              }
            ),
            Object.defineProperty(
              e.prototype.bookIssueLastPage = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.BookIssueLastPageRequest,
                  c.v1.BookIssueLastPageResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'BookIssueLastPage'
              }
            ),
            Object.defineProperty(
              e.prototype.putChapterCommentLike = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PutChapterCommentLikeRequest,
                  c.v1.PutChapterCommentLikeResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PutChapterCommentLike'
              }
            ),
            Object.defineProperty(
              e.prototype.deleteChapterCommentLike = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.DeleteChapterCommentLikeRequest,
                  c.v1.DeleteChapterCommentLikeResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'DeleteChapterCommentLike'
              }
            ),
            Object.defineProperty(
              e.prototype.putBookIssueCommentLike = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PutBookIssueCommentLikeRequest,
                  c.v1.PutBookIssueCommentLikeResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PutBookIssueCommentLike'
              }
            ),
            Object.defineProperty(
              e.prototype.deleteBookIssueCommentLike = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.DeleteBookIssueCommentLikeRequest,
                  c.v1.DeleteBookIssueCommentLikeResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'DeleteBookIssueCommentLike'
              }
            ),
            Object.defineProperty(
              e.prototype.putMagazineIssueCommentLike = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PutMagazineIssueCommentLikeRequest,
                  c.v1.PutMagazineIssueCommentLikeResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PutMagazineIssueCommentLike'
              }
            ),
            Object.defineProperty(
              e.prototype.deleteMagazineIssueCommentLike = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.DeleteMagazineIssueCommentLikeRequest,
                  c.v1.DeleteMagazineIssueCommentLikeResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'DeleteMagazineIssueCommentLike'
              }
            ),
            Object.defineProperty(
              e.prototype.magazineViewer = function e(t, n) {
                return this.rpcCall(e, c.v1.MagazineViewerRequest, c.v1.MagazineViewerResponse, t, n)
              },
              'name',
              {
                value: 'MagazineViewer'
              }
            ),
            Object.defineProperty(
              e.prototype.purchaseOnPlayStore = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PurchaseOnPlayStoreRequest,
                  c.v1.PurchaseOnPlayStoreResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PurchaseOnPlayStore'
              }
            ),
            Object.defineProperty(
              e.prototype.restoreSubscriptionOnPlayStore = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.RestoreSubscriptionOnPlayStoreRequest,
                  c.v1.RestoreSubscriptionOnPlayStoreResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'RestoreSubscriptionOnPlayStore'
              }
            ),
            Object.defineProperty(
              e.prototype.special = function e(t, n) {
                return this.rpcCall(e, c.v1.SpecialRequest, c.v1.SpecialResponse, t, n)
              },
              'name',
              {
                value: 'Special'
              }
            ),
            Object.defineProperty(
              e.prototype.bookIssueRanking = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.BookIssueRankingRequest,
                  c.v1.BookIssueRankingResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'BookIssueRanking'
              }
            ),
            Object.defineProperty(
              e.prototype.contactUs = function e(t, n) {
                return this.rpcCall(e, c.v1.ContactUsRequest, c.v1.ContactUsResponse, t, n)
              },
              'name',
              {
                value: 'ContactUs'
              }
            ),
            Object.defineProperty(
              e.prototype.mangaDetail = function e(t, n) {
                return this.rpcCall(e, c.v1.MangaDetailRequest, c.v1.MangaDetailResponse, t, n)
              },
              'name',
              {
                value: 'MangaDetail'
              }
            ),
            Object.defineProperty(
              e.prototype.point = function e(t, n) {
                return this.rpcCall(e, c.v1.PointRequest, c.v1.PointResponse, t, n)
              },
              'name',
              {
                value: 'Point'
              }
            ),
            Object.defineProperty(
              e.prototype.store = function e(t, n) {
                return this.rpcCall(e, c.v1.StoreRequest, c.v1.StoreResponse, t, n)
              },
              'name',
              {
                value: 'Store'
              }
            ),
            Object.defineProperty(
              e.prototype.getYellList = function e(t, n) {
                return this.rpcCall(e, c.v1.YellListRequest, c.v1.YellListResponse, t, n)
              },
              'name',
              {
                value: 'GetYellList'
              }
            ),
            Object.defineProperty(
              e.prototype.reportYell = function e(t, n) {
                return this.rpcCall(e, c.v1.ReportYellRequest, c.v1.ReportYellResponse, t, n)
              },
              'name',
              {
                value: 'ReportYell'
              }
            ),
            Object.defineProperty(
              e.prototype.yell = function e(t, n) {
                return this.rpcCall(e, c.v1.YellRequest, c.v1.YellResponse, t, n)
              },
              'name',
              {
                value: 'Yell'
              }
            ),
            Object.defineProperty(
              e.prototype.purchaseMagazineIssue = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PurchaseMagazineIssueRequest,
                  c.v1.PurchaseMagazineIssueResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PurchaseMagazineIssue'
              }
            ),
            Object.defineProperty(
              e.prototype.purchaseBookIssue = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.PurchaseBookIssueRequest,
                  c.v1.PurchaseBookIssueResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'PurchaseBookIssue'
              }
            ),
            Object.defineProperty(
              e.prototype.subscriptionItemList = function e(t, n) {
                return this.rpcCall(
                  e,
                  c.v1.SubscriptionItemListRequest,
                  c.v1.SubscriptionItemListResponse,
                  t,
                  n
                )
              },
              'name',
              {
                value: 'SubscriptionItemList'
              }
            ),
            Object.defineProperty(
              e.prototype.setChapterLike = function e(t, n) {
                return this.rpcCall(e, c.v1.ChapterLikeRequest, c.v1.ChapterLikeResponse, t, n)
              },
              'name',
              {
                value: 'SetChapterLike'
              }
            ),
            Object.defineProperty(
              e.prototype.setMangaFavorite = function e(t, n) {
                return this.rpcCall(e, c.v1.MangaFavoriteRequest, c.v1.MangaFavoriteResponse, t, n)
              },
              'name',
              {
                value: 'SetMangaFavorite'
              }
            ),
            Object.defineProperty(
              e.prototype.setBookIssueWith = function e(t, n) {
                return this.rpcCall(e, c.v1.BookIssueWishRequest, c.v1.BookIssueWishResponse, t, n)
              },
              'name',
              {
                value: 'SetBookIssueWith'
              }
            ),
            e
          }(),
          e.BannerClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.location = 0,
            e.prototype.bannerId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BannerClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.location = e.int32();
                    break;
                  case 3:
                    o.bannerId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Location = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'TOP'] = 0,
              t[e[1] = 'TOP_SUB'] = 1,
              t[e[2] = 'STORE_TOP'] = 2,
              t[e[3] = 'STORE_NEW_MAGAZINE'] = 3,
              t
            }(),
            e
          }(),
          e.PickupKomaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.komaId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.komaId &&
              Object.hasOwnProperty.call(e, 'komaId') &&
              t.uint32(16).uint32(e.komaId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PickupKomaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.komaId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PopupClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.popupId = 0,
            e.prototype.personalPopupId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.popupId &&
              Object.hasOwnProperty.call(e, 'popupId') &&
              t.uint32(16).uint32(e.popupId),
              null != e.personalPopupId &&
              Object.hasOwnProperty.call(e, 'personalPopupId') &&
              t.uint32(24).uint32(e.personalPopupId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PopupClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.popupId = e.uint32();
                    break;
                  case 3:
                    o.personalPopupId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.TopAdvertisingMangaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.tagId = 0,
            e.prototype.mangaId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(16).uint32(e.tagId),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(24).uint32(e.mangaId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.TopAdvertisingMangaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.tagId = e.uint32();
                    break;
                  case 3:
                    o.mangaId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V2HomeBannerClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.bannerId = 0,
            e.prototype.bannerIndex = 0,
            e.prototype.type = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.bannerId &&
              Object.hasOwnProperty.call(e, 'bannerId') &&
              t.uint32(24).uint32(e.bannerId),
              null != e.bannerIndex &&
              Object.hasOwnProperty.call(e, 'bannerIndex') &&
              t.uint32(32).uint32(e.bannerIndex),
              null != e.type &&
              Object.hasOwnProperty.call(e, 'type') &&
              t.uint32(40).int32(e.type),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V2HomeBannerClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.bannerId = e.uint32();
                    break;
                  case 4:
                    o.bannerIndex = e.uint32();
                    break;
                  case 5:
                    o.type = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.LayoutType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'LARGE'] = 0,
              t[e[1] = 'MEDIUM'] = 1,
              t
            }(),
            e
          }(),
          e.V2HomeMangaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.mangaId = 0,
            e.prototype.tagId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(24).uint32(e.mangaId),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(32).uint32(e.tagId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(40).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V2HomeMangaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.mangaId = e.uint32();
                    break;
                  case 4:
                    o.tagId = e.uint32();
                    break;
                  case 5:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V2HomeBookIssueClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.bookIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(24).uint32(e.bookIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V2HomeBookIssueClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.bookIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V2HomePickupKomaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.komaId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.komaId &&
              Object.hasOwnProperty.call(e, 'komaId') &&
              t.uint32(24).uint32(e.komaId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V2HomePickupKomaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.komaId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V2HomeRankingClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.mangaId = 0,
            e.prototype.index = 0,
            e.prototype.tagId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(24).uint32(e.mangaId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(40).uint32(e.tagId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V2HomeRankingClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.mangaId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  case 5:
                    o.tagId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.RecommendMangaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.location = 0,
            e.prototype.index = 0,
            e.prototype.mangaId = 0,
            e.prototype.viewedMangaId = 0,
            e.prototype.type = 0,
            e.prototype.version = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.location &&
              Object.hasOwnProperty.call(e, 'location') &&
              t.uint32(16).int32(e.location),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(24).uint32(e.index),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(32).uint32(e.mangaId),
              null != e.viewedMangaId &&
              Object.hasOwnProperty.call(e, 'viewedMangaId') &&
              t.uint32(40).uint32(e.viewedMangaId),
              null != e.type &&
              Object.hasOwnProperty.call(e, 'type') &&
              t.uint32(48).int32(e.type),
              null != e.version &&
              Object.hasOwnProperty.call(e, 'version') &&
              t.uint32(56).uint32(e.version),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RecommendMangaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.location = e.int32();
                    break;
                  case 3:
                    o.index = e.uint32();
                    break;
                  case 4:
                    o.mangaId = e.uint32();
                    break;
                  case 5:
                    o.viewedMangaId = e.uint32();
                    break;
                  case 6:
                    o.type = e.int32();
                    break;
                  case 7:
                    o.version = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Location = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'CHAPTER_LAST_PAGE'] = 0,
              t[e[1] = 'BOOK_ISSUE_LAST_PAGE'] = 1,
              t
            }(),
            e.ActionType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'CLICK'] = 0,
              t[e[1] = 'VIEW_LATER'] = 1,
              t
            }(),
            e
          }(),
          e.RechargedMangaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.location = 0,
            e.prototype.index = 0,
            e.prototype.mangaId = 0,
            e.prototype.viewedMangaId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.location &&
              Object.hasOwnProperty.call(e, 'location') &&
              t.uint32(16).int32(e.location),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(24).uint32(e.index),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(32).uint32(e.mangaId),
              null != e.viewedMangaId &&
              Object.hasOwnProperty.call(e, 'viewedMangaId') &&
              t.uint32(40).uint32(e.viewedMangaId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RechargedMangaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.location = e.int32();
                    break;
                  case 3:
                    o.index = e.uint32();
                    break;
                  case 4:
                    o.mangaId = e.uint32();
                    break;
                  case 5:
                    o.viewedMangaId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Location = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'CHAPTER_LAST_PAGE'] = 0,
              t
            }(),
            e
          }(),
          e.SearchMangaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.index = 0,
            e.prototype.mangaId = 0,
            e.prototype.tagId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(24).uint32(e.index),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(32).uint32(e.mangaId),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(40).uint32(e.tagId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SearchMangaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.index = e.uint32();
                    break;
                  case 4:
                    o.mangaId = e.uint32();
                    break;
                  case 5:
                    o.tagId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V2HomeSectionMoreClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionType = 0,
            e.prototype.tagId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionType &&
              Object.hasOwnProperty.call(e, 'sectionType') &&
              t.uint32(16).int32(e.sectionType),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(24).uint32(e.tagId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V2HomeSectionMoreClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionType = e.int32();
                    break;
                  case 3:
                    o.tagId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.SectionType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'MANGA_SECTION'] = 0,
              t
            }(),
            e
          }(),
          e.V2HomeHeaderClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.componentType = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.componentType &&
              Object.hasOwnProperty.call(e, 'componentType') &&
              t.uint32(16).int32(e.componentType),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V2HomeHeaderClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.componentType = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ComponentType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'SEARCH_BAR'] = 0,
              t[e[1] = 'MISSION_LIST'] = 1,
              t
            }(),
            e
          }(),
          e.V2HomeRankingTabClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.tagId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(16).uint32(e.tagId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V2HomeRankingTabClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.tagId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.RecommendBookIssueClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.location = 0,
            e.prototype.index = 0,
            e.prototype.bookIssueId = 0,
            e.prototype.viewedBookIssueId = 0,
            e.prototype.type = 0,
            e.prototype.version = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.location &&
              Object.hasOwnProperty.call(e, 'location') &&
              t.uint32(16).int32(e.location),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(24).uint32(e.index),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(32).uint32(e.bookIssueId),
              null != e.viewedBookIssueId &&
              Object.hasOwnProperty.call(e, 'viewedBookIssueId') &&
              t.uint32(40).uint32(e.viewedBookIssueId),
              null != e.type &&
              Object.hasOwnProperty.call(e, 'type') &&
              t.uint32(48).int32(e.type),
              null != e.version &&
              Object.hasOwnProperty.call(e, 'version') &&
              t.uint32(56).uint32(e.version),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RecommendBookIssueClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.location = e.int32();
                    break;
                  case 3:
                    o.index = e.uint32();
                    break;
                  case 4:
                    o.bookIssueId = e.uint32();
                    break;
                  case 5:
                    o.viewedBookIssueId = e.uint32();
                    break;
                  case 6:
                    o.type = e.int32();
                    break;
                  case 7:
                    o.version = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Location = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'BOOK_ISSUE_DETAIL'] = 0,
              t
            }(),
            e.ActionType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'CLICK'] = 0,
              t
            }(),
            e
          }(),
          e.ViewerLastBillingItemClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.location = 0,
            e.prototype.productId = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.location &&
              Object.hasOwnProperty.call(e, 'location') &&
              t.uint32(16).int32(e.location),
              null != e.productId &&
              Object.hasOwnProperty.call(e, 'productId') &&
              t.uint32(26).string(e.productId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ViewerLastBillingItemClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.location = e.int32();
                    break;
                  case 3:
                    o.productId = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Location = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'MANGA_VIEWER'] = 0,
              t[e[1] = 'BOOK_VIEWER'] = 1,
              t[e[2] = 'MAGAZINE_VIEWER'] = 2,
              t
            }(),
            e
          }(),
          e.ViewerExtraClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.id = 0,
            e.prototype.location = 0,
            e.prototype.index = 0,
            e.prototype.extraId = 0,
            e.prototype.extraSlotId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.id &&
              Object.hasOwnProperty.call(e, 'id') &&
              t.uint32(16).uint32(e.id),
              null != e.location &&
              Object.hasOwnProperty.call(e, 'location') &&
              t.uint32(24).int32(e.location),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              null != e.extraId &&
              Object.hasOwnProperty.call(e, 'extraId') &&
              t.uint32(40).uint32(e.extraId),
              null != e.extraSlotId &&
              Object.hasOwnProperty.call(e, 'extraSlotId') &&
              t.uint32(48).uint32(e.extraSlotId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ViewerExtraClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.id = e.uint32();
                    break;
                  case 3:
                    o.location = e.int32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  case 5:
                    o.extraId = e.uint32();
                    break;
                  case 6:
                    o.extraSlotId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Location = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'MANGA_VIEWER'] = 0,
              t[e[1] = 'BOOK_VIEWER'] = 1,
              t[e[2] = 'MAGAZINE_VIEWER'] = 2,
              t
            }(),
            e
          }(),
          e.SnsShareClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.type = 0,
            e.prototype.id = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.type &&
              Object.hasOwnProperty.call(e, 'type') &&
              t.uint32(16).int32(e.type),
              null != e.id &&
              Object.hasOwnProperty.call(e, 'id') &&
              t.uint32(24).uint32(e.id),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SnsShareClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.type = e.int32();
                    break;
                  case 3:
                    o.id = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.IdType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'CHAPTER'] = 0,
              t[e[1] = 'MANGA'] = 1,
              t[e[2] = 'BOOK_ISSUE'] = 2,
              t[e[3] = 'MAGAZINE_ISSUE'] = 3,
              t
            }(),
            e
          }(),
          e.MangaDetailAuthorClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaId = 0,
            e.prototype.authorId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(16).uint32(e.mangaId),
              null != e.authorId &&
              Object.hasOwnProperty.call(e, 'authorId') &&
              t.uint32(24).uint32(e.authorId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaDetailAuthorClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  case 3:
                    o.authorId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaDetailTagClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaId = 0,
            e.prototype.tagId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(16).uint32(e.mangaId),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(24).uint32(e.tagId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaDetailTagClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  case 3:
                    o.tagId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaDetailSortClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaId = 0,
            e.prototype.type = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(16).uint32(e.mangaId),
              null != e.type &&
              Object.hasOwnProperty.call(e, 'type') &&
              t.uint32(24).int32(e.type),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaDetailSortClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  case 3:
                    o.type = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.SortType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'ASCENDING'] = 0,
              t[e[1] = 'DESCENDING'] = 1,
              t
            }(),
            e
          }(),
          e.MangaDetailReadButtonClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaId = 0,
            e.prototype.type = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(16).uint32(e.mangaId),
              null != e.type &&
              Object.hasOwnProperty.call(e, 'type') &&
              t.uint32(24).int32(e.type),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaDetailReadButtonClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  case 3:
                    o.type = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ReadButtonType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'FIRST'] = 0,
              t[e[1] = 'NEXT'] = 1,
              t[e[2] = 'LAST'] = 2,
              t
            }(),
            e
          }(),
          e.MangaDetailBookIssueSectionClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaId = 0,
            e.prototype.bookIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(16).uint32(e.mangaId),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(24).uint32(e.bookIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaDetailBookIssueSectionClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  case 3:
                    o.bookIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaDetailFavoriteClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaId = 0,
            e.prototype.type = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(16).uint32(e.mangaId),
              null != e.type &&
              Object.hasOwnProperty.call(e, 'type') &&
              t.uint32(24).int32(e.type),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaDetailFavoriteClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  case 3:
                    o.type = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ActionType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'ADD'] = 0,
              t[e[1] = 'REMOVE'] = 1,
              t
            }(),
            e
          }(),
          e.MagazineIssueDetailSubscriptionButtonClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.magazineIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineIssueDetailSubscriptionButtonClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookIssueDetailPurchaseInBulkButtonClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueDetailPurchaseInBulkButtonClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V3StoreNewBookIssueClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.bookIssueId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(24).uint32(e.bookIssueId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V3StoreNewBookIssueClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.bookIssueId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V3StoreSubscriptionButtonClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V3StoreSubscriptionButtonClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.V3StoreLatestMagazineIssueClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.magazineIssueId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(24).uint32(e.magazineIssueId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V3StoreLatestMagazineIssueClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.magazineIssueId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V3StoreRankingClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.bookIssueId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(24).uint32(e.bookIssueId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V3StoreRankingClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.bookIssueId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V3StoreBookClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionIndex = 0,
            e.prototype.bookIssueId = 0,
            e.prototype.tagId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionIndex &&
              Object.hasOwnProperty.call(e, 'sectionIndex') &&
              t.uint32(16).uint32(e.sectionIndex),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(24).uint32(e.bookIssueId),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(32).uint32(e.tagId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(40).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V3StoreBookClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionIndex = e.uint32();
                    break;
                  case 3:
                    o.bookIssueId = e.uint32();
                    break;
                  case 4:
                    o.tagId = e.uint32();
                    break;
                  case 5:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.V3StoreSectionMoreClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.sectionType = 0,
            e.prototype.tagId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.sectionType &&
              Object.hasOwnProperty.call(e, 'sectionType') &&
              t.uint32(16).int32(e.sectionType),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(24).uint32(e.tagId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V3StoreSectionMoreClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.sectionType = e.int32();
                    break;
                  case 3:
                    o.tagId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.SectionType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'RANKING'] = 0,
              t[e[1] = 'BOOK_SECTION'] = 1,
              t
            }(),
            e
          }(),
          e.V3StoreRankingListBookIssueClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.prototype.index = 0,
            e.prototype.tagId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(24).uint32(e.index),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(32).uint32(e.tagId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.V3StoreRankingListBookIssueClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  case 3:
                    o.index = e.uint32();
                    break;
                  case 4:
                    o.tagId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ItemShopLinkClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.linkType = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.linkType &&
              Object.hasOwnProperty.call(e, 'linkType') &&
              t.uint32(16).int32(e.linkType),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ItemShopLinkClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.linkType = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.LinkType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'MISSION_LIST'] = 0,
              t[e[1] = 'REWARD_WALL'] = 1,
              t
            }(),
            e
          }(),
          e.ItemShopTabClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.tabType = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.tabType &&
              Object.hasOwnProperty.call(e, 'tabType') &&
              t.uint32(16).int32(e.tabType),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ItemShopTabClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.tabType = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.TabType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'MEDAL'] = 0,
              t[e[1] = 'SUBSCRIPTION'] = 1,
              t
            }(),
            e
          }(),
          e.ShelfTabClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.tabType = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.tabType &&
              Object.hasOwnProperty.call(e, 'tabType') &&
              t.uint32(16).int32(e.tabType),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ShelfTabClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.tabType = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.TabType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'HISTORY'] = 0,
              t[e[1] = 'FAVORITE'] = 1,
              t[e[2] = 'PURCHASED'] = 2,
              t[e[3] = 'WISH_LIST'] = 3,
              t
            }(),
            e
          }(),
          e.ShelfMangaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.location = 0,
            e.prototype.mangaId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.location &&
              Object.hasOwnProperty.call(e, 'location') &&
              t.uint32(16).int32(e.location),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(24).uint32(e.mangaId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ShelfMangaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.location = e.int32();
                    break;
                  case 3:
                    o.mangaId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Location = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'HISTORY'] = 0,
              t[e[1] = 'FAVORITE'] = 1,
              t
            }(),
            e
          }(),
          e.ShelfPurchasedSearchBarClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ShelfPurchasedSearchBarClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.BottomBarTabClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.tabType = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.tabType &&
              Object.hasOwnProperty.call(e, 'tabType') &&
              t.uint32(16).int32(e.tabType),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BottomBarTabClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.tabType = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.TabType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'HOME'] = 0,
              t[e[1] = 'MANGAS_BY_DAY_OF_WEEK'] = 1,
              t[e[2] = 'BOOK_STORE'] = 2,
              t[e[3] = 'ITEM_SHOP'] = 3,
              t[e[4] = 'SHELF'] = 4,
              t
            }(),
            e
          }(),
          e.SpecialImageClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.specialImageId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.specialImageId &&
              Object.hasOwnProperty.call(e, 'specialImageId') &&
              t.uint32(16).uint32(e.specialImageId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(24).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SpecialImageClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.specialImageId = e.uint32();
                    break;
                  case 3:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaListTabClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.tabType = 0,
            e.prototype.tagId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.tabType &&
              Object.hasOwnProperty.call(e, 'tabType') &&
              t.uint32(16).int32(e.tabType),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(24).uint32(e.tagId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaListTabClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.tabType = e.int32();
                    break;
                  case 3:
                    o.tagId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.TabType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'MANGA'] = 0,
              t[e[1] = 'BOOK'] = 1,
              t
            }(),
            e
          }(),
          e.MissionChallengeClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.missionId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.missionId &&
              Object.hasOwnProperty.call(e, 'missionId') &&
              t.uint32(16).uint32(e.missionId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MissionChallengeClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.missionId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SearchTabClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.tabType = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.tabType &&
              Object.hasOwnProperty.call(e, 'tabType') &&
              t.uint32(16).int32(e.tabType),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SearchTabClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.tabType = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.TabType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'MANGA'] = 0,
              t[e[1] = 'BOOK'] = 1,
              t[e[2] = 'MAGAZINE'] = 2,
              t
            }(),
            e
          }(),
          e.MangasByDayOfWeekTabClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.dayOfWeek = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.dayOfWeek &&
              Object.hasOwnProperty.call(e, 'dayOfWeek') &&
              t.uint32(16).int32(e.dayOfWeek),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangasByDayOfWeekTabClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.dayOfWeek = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.DayOfWeek = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'ALL'] = 0,
              t[e[1] = 'MONDAY'] = 1,
              t[e[2] = 'TUESDAY'] = 2,
              t[e[3] = 'WEDNESDAY'] = 3,
              t[e[4] = 'THURSDAY'] = 4,
              t[e[5] = 'FRIDAY'] = 5,
              t[e[6] = 'SATURDAY'] = 6,
              t[e[7] = 'SUNDAY'] = 7,
              t
            }(),
            e
          }(),
          e.MangasByDayOfWeekMangaClickRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.dayOfWeek = 0,
            e.prototype.mangaId = 0,
            e.prototype.index = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.dayOfWeek &&
              Object.hasOwnProperty.call(e, 'dayOfWeek') &&
              t.uint32(16).int32(e.dayOfWeek),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(24).uint32(e.mangaId),
              null != e.index &&
              Object.hasOwnProperty.call(e, 'index') &&
              t.uint32(32).uint32(e.index),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangasByDayOfWeekMangaClickRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.dayOfWeek = e.int32();
                    break;
                  case 3:
                    o.mangaId = e.uint32();
                    break;
                  case 4:
                    o.index = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.DayOfWeek = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'ALL'] = 0,
              t[e[1] = 'MONDAY'] = 1,
              t[e[2] = 'TUESDAY'] = 2,
              t[e[3] = 'WEDNESDAY'] = 3,
              t[e[4] = 'THURSDAY'] = 4,
              t[e[5] = 'FRIDAY'] = 5,
              t[e[6] = 'SATURDAY'] = 6,
              t[e[7] = 'SUNDAY'] = 7,
              t
            }(),
            e
          }(),
          e.PurchaseOnAppStoreRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.receipt = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.receipt &&
              Object.hasOwnProperty.call(e, 'receipt') &&
              t.uint32(18).string(e.receipt),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseOnAppStoreRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.receipt = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseOnAppStoreResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.result = 0,
            e.prototype.alert = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.result &&
              Object.hasOwnProperty.call(e, 'result') &&
              t.uint32(8).int32(e.result),
              null != e.alert &&
              Object.hasOwnProperty.call(e, 'alert') &&
              c.v1.PurchaseOnAppStoreResponse.Alert.encode(e.alert, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseOnAppStoreResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.result = e.int32();
                    break;
                  case 2:
                    o.alert = c.v1.PurchaseOnAppStoreResponse.Alert.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Alert = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.subject = '',
              e.prototype.body = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.subject &&
                Object.hasOwnProperty.call(e, 'subject') &&
                t.uint32(10).string(e.subject),
                null != e.body &&
                Object.hasOwnProperty.call(e, 'body') &&
                t.uint32(18).string(e.body),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.PurchaseOnAppStoreResponse.Alert;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.subject = e.string();
                      break;
                    case 2:
                      o.body = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.RestoreSubscriptionOnAppStoreRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.receipt = '',
            e.prototype.signature = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.receipt &&
              Object.hasOwnProperty.call(e, 'receipt') &&
              t.uint32(18).string(e.receipt),
              null != e.signature &&
              Object.hasOwnProperty.call(e, 'signature') &&
              t.uint32(26).string(e.signature),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RestoreSubscriptionOnAppStoreRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.receipt = e.string();
                    break;
                  case 3:
                    o.signature = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.RestoreSubscriptionOnAppStoreResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.result = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.result &&
              Object.hasOwnProperty.call(e, 'result') &&
              t.uint32(8).int32(e.result),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RestoreSubscriptionOnAppStoreResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.result = e.int32();
                 else e.skipType(7 & i)
              }
              return o
            },
            e.RestoreResult = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'VALID'] = 0,
              t[e[1] = 'INVALID'] = 1,
              t[e[2] = 'NO_TARGE'] = 2,
              t
            }(),
            e
          }(),
          e.AuthorDetailRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.authorId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.authorId &&
              Object.hasOwnProperty.call(e, 'authorId') &&
              t.uint32(16).uint32(e.authorId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.AuthorDetailRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.authorId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.AuthorDetailResponse = function () {
            var e = function (e) {
              if (this.mangas = [], this.books = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.author = null,
            e.prototype.mangas = s.emptyArray,
            e.prototype.books = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.author &&
                Object.hasOwnProperty.call(e, 'author') &&
                c.v1.Author.encode(e.author, t.uint32(10).fork()).ldelim(),
                null != e.mangas &&
                e.mangas.length
              ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(18).fork()).ldelim();
              if (null != e.books && e.books.length) for (var r = 0; r < e.books.length; ++r) c.v1.Book.encode(e.books[r], t.uint32(26).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.AuthorDetailResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.author = c.v1.Author.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangas &&
                    o.mangas.length ||
                    (o.mangas = []),
                    o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.books &&
                    o.books.length ||
                    (o.books = []),
                    o.books.push(c.v1.Book.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BackgroundDownloadRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.viewerMode = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.viewerMode &&
              Object.hasOwnProperty.call(e, 'viewerMode') &&
              c.v1.ViewerMode.encode(e.viewerMode, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BackgroundDownloadRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.viewerMode = c.v1.ViewerMode.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BackgroundDownloadResponse = function () {
            var e = function (e) {
              if (this.imageUrls = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.imageUrls = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.imageUrls && e.imageUrls.length) for (var n = 0; n < e.imageUrls.length; ++n) t.uint32(10).string(e.imageUrls[n]);
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BackgroundDownloadResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.imageUrls &&
                o.imageUrls.length ||
                (o.imageUrls = []),
                o.imageUrls.push(e.string());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.BillingItemListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BillingItemListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.BillingItemListResponse = function () {
            var e = function (e) {
              if (this.billingItems = [], this.courses = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.billingItems = s.emptyArray,
            e.prototype.courses = s.emptyArray,
            e.prototype.rewardUrl = '',
            e.prototype.isProfileRegistered = !1,
            e.prototype.isMailAddressRegistered = !1,
            e.prototype.annualPriceText = '',
            e.prototype.limitedTimePoint = 0,
            e.prototype.expirationDate = '',
            e.prototype.expiringPoint = 0,
            e.prototype.hasAppLoggedin = !1,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.billingItems &&
                e.billingItems.length
              ) for (var n = 0; n < e.billingItems.length; ++n) c.v1.BillingItem.encode(e.billingItems[n], t.uint32(18).fork()).ldelim();
              if (null != e.courses && e.courses.length) for (var r = 0; r < e.courses.length; ++r) c.v1.SubscriptionCourse.encode(e.courses[r], t.uint32(26).fork()).ldelim();
              return null != e.rewardUrl &&
              Object.hasOwnProperty.call(e, 'rewardUrl') &&
              t.uint32(34).string(e.rewardUrl),
              null != e.isProfileRegistered &&
              Object.hasOwnProperty.call(e, 'isProfileRegistered') &&
              t.uint32(40).bool(e.isProfileRegistered),
              null != e.isMailAddressRegistered &&
              Object.hasOwnProperty.call(e, 'isMailAddressRegistered') &&
              t.uint32(48).bool(e.isMailAddressRegistered),
              null != e.annualPriceText &&
              Object.hasOwnProperty.call(e, 'annualPriceText') &&
              t.uint32(58).string(e.annualPriceText),
              null != e.limitedTimePoint &&
              Object.hasOwnProperty.call(e, 'limitedTimePoint') &&
              t.uint32(64).uint32(e.limitedTimePoint),
              null != e.expirationDate &&
              Object.hasOwnProperty.call(e, 'expirationDate') &&
              t.uint32(74).string(e.expirationDate),
              null != e.expiringPoint &&
              Object.hasOwnProperty.call(e, 'expiringPoint') &&
              t.uint32(80).uint32(e.expiringPoint),
              null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(88).bool(e.hasAppLoggedin),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BillingItemListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.billingItems &&
                    o.billingItems.length ||
                    (o.billingItems = []),
                    o.billingItems.push(c.v1.BillingItem.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.courses &&
                    o.courses.length ||
                    (o.courses = []),
                    o.courses.push(c.v1.SubscriptionCourse.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.rewardUrl = e.string();
                    break;
                  case 5:
                    o.isProfileRegistered = e.bool();
                    break;
                  case 6:
                    o.isMailAddressRegistered = e.bool();
                    break;
                  case 7:
                    o.annualPriceText = e.string();
                    break;
                  case 8:
                    o.limitedTimePoint = e.uint32();
                    break;
                  case 9:
                    o.expirationDate = e.string();
                    break;
                  case 10:
                    o.expiringPoint = e.uint32();
                    break;
                  case 11:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookIssueDetailRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueDetailRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookIssueDetailResponse = function () {
            var e,
            t = function (e) {
              if (
                this.bookIssues = [],
                this.authorships = [],
                this.tags = [],
                this.recommendedBookIssues = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.userPoint = null,
            t.prototype.bookName = '',
            t.prototype.pickupBookIssue = null,
            t.prototype.bookIssues = s.emptyArray,
            t.prototype.authorships = s.emptyArray,
            t.prototype.tags = s.emptyArray,
            t.prototype.isHideBulkPurchaseButton = !1,
            t.prototype.isCommentEnabled = !1,
            t.prototype.sns = null,
            t.prototype.recommendedBookIssues = s.emptyArray,
            t.prototype.mangaId = null,
            t.prototype.hasAppLoggedin = !1,
            Object.defineProperty(
              t.prototype,
              '_mangaId',
              {
                get: s.oneOfGetter(e = [
                  'mangaId'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.bookName &&
                Object.hasOwnProperty.call(e, 'bookName') &&
                t.uint32(18).string(e.bookName),
                null != e.pickupBookIssue &&
                Object.hasOwnProperty.call(e, 'pickupBookIssue') &&
                c.v1.BookIssue.encode(e.pickupBookIssue, t.uint32(26).fork()).ldelim(),
                null != e.bookIssues &&
                e.bookIssues.length
              ) for (var n = 0; n < e.bookIssues.length; ++n) c.v1.BookIssue.encode(e.bookIssues[n], t.uint32(34).fork()).ldelim();
              if (null != e.authorships && e.authorships.length) for (var r = 0; r < e.authorships.length; ++r) c.v1.Authorship.encode(e.authorships[r], t.uint32(42).fork()).ldelim();
              if (null != e.tags && e.tags.length) for (var o = 0; o < e.tags.length; ++o) c.v1.Tag.encode(e.tags[o], t.uint32(50).fork()).ldelim();
              if (
                null != e.isHideBulkPurchaseButton &&
                Object.hasOwnProperty.call(e, 'isHideBulkPurchaseButton') &&
                t.uint32(56).bool(e.isHideBulkPurchaseButton),
                null != e.isCommentEnabled &&
                Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                t.uint32(64).bool(e.isCommentEnabled),
                null != e.sns &&
                Object.hasOwnProperty.call(e, 'sns') &&
                c.v1.Sns.encode(e.sns, t.uint32(74).fork()).ldelim(),
                null != e.recommendedBookIssues &&
                e.recommendedBookIssues.length
              ) for (var a = 0; a < e.recommendedBookIssues.length; ++a) c.v1.BookIssueDetailResponse.BookIssueWithRecommendVersion.encode(e.recommendedBookIssues[a], t.uint32(82).fork()).ldelim();
              return null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(88).uint32(e.mangaId),
              null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(96).bool(e.hasAppLoggedin),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueDetailResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookName = e.string();
                    break;
                  case 3:
                    o.pickupBookIssue = c.v1.BookIssue.decode(e, e.uint32());
                    break;
                  case 4:
                    o.bookIssues &&
                    o.bookIssues.length ||
                    (o.bookIssues = []),
                    o.bookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                    break;
                  case 5:
                    o.authorships &&
                    o.authorships.length ||
                    (o.authorships = []),
                    o.authorships.push(c.v1.Authorship.decode(e, e.uint32()));
                    break;
                  case 6:
                    o.tags &&
                    o.tags.length ||
                    (o.tags = []),
                    o.tags.push(c.v1.Tag.decode(e, e.uint32()));
                    break;
                  case 7:
                    o.isHideBulkPurchaseButton = e.bool();
                    break;
                  case 8:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 9:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 10:
                    o.recommendedBookIssues &&
                    o.recommendedBookIssues.length ||
                    (o.recommendedBookIssues = []),
                    o.recommendedBookIssues.push(
                      c.v1.BookIssueDetailResponse.BookIssueWithRecommendVersion.decode(e, e.uint32())
                    );
                    break;
                  case 11:
                    o.mangaId = e.uint32();
                    break;
                  case 12:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.BookIssueWithRecommendVersion = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.bookIssue = null,
              e.prototype.version = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.bookIssue &&
                Object.hasOwnProperty.call(e, 'bookIssue') &&
                c.v1.BookIssue.encode(e.bookIssue, t.uint32(10).fork()).ldelim(),
                null != e.version &&
                Object.hasOwnProperty.call(e, 'version') &&
                t.uint32(16).uint32(e.version),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookIssueDetailResponse.BookIssueWithRecommendVersion;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.bookIssue = c.v1.BookIssue.decode(e, e.uint32());
                      break;
                    case 2:
                      o.version = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t
          }(),
          e.BookIssueLastPageRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueLastPageRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookIssueLastPageResponse = function () {
            var e,
            t = function (e) {
              if (
                this.authorships = [],
                this.recommendedMangasV2 = [],
                this.recommendedMangasV3 = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.userPoint = null,
            t.prototype.authorships = s.emptyArray,
            t.prototype.isCommentEnabled = !1,
            t.prototype.numberOfComments = 0,
            t.prototype.nextBookIssue = null,
            t.prototype.latestMagazineIssue = null,
            t.prototype.recommendedMangas = null,
            t.prototype.nextBookIssueV2 = null,
            t.prototype.latestMagazineIssueV2 = null,
            t.prototype.recommendedMangasV2 = s.emptyArray,
            t.prototype.mangaId = 0,
            t.prototype.recommendedMangasV3 = s.emptyArray,
            t.prototype.hasAppLoggedin = !1,
            Object.defineProperty(
              t.prototype,
              'lastPageContent',
              {
                get: s.oneOfGetter(
                  e = [
                    'nextBookIssue',
                    'latestMagazineIssue',
                    'recommendedMangas'
                  ]
                ),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.authorships &&
                e.authorships.length
              ) for (var n = 0; n < e.authorships.length; ++n) c.v1.Authorship.encode(e.authorships[n], t.uint32(18).fork()).ldelim();
              if (
                null != e.isCommentEnabled &&
                Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                t.uint32(24).bool(e.isCommentEnabled),
                null != e.numberOfComments &&
                Object.hasOwnProperty.call(e, 'numberOfComments') &&
                t.uint32(32).uint32(e.numberOfComments),
                null != e.nextBookIssue &&
                Object.hasOwnProperty.call(e, 'nextBookIssue') &&
                c.v1.BookIssue.encode(e.nextBookIssue, t.uint32(42).fork()).ldelim(),
                null != e.latestMagazineIssue &&
                Object.hasOwnProperty.call(e, 'latestMagazineIssue') &&
                c.v1.MagazineIssue.encode(e.latestMagazineIssue, t.uint32(50).fork()).ldelim(),
                null != e.recommendedMangas &&
                Object.hasOwnProperty.call(e, 'recommendedMangas') &&
                c.v1.BookIssueLastPageResponse.RecommendedMangas.encode(e.recommendedMangas, t.uint32(58).fork()).ldelim(),
                null != e.nextBookIssueV2 &&
                Object.hasOwnProperty.call(e, 'nextBookIssueV2') &&
                c.v1.BookIssue.encode(e.nextBookIssueV2, t.uint32(66).fork()).ldelim(),
                null != e.latestMagazineIssueV2 &&
                Object.hasOwnProperty.call(e, 'latestMagazineIssueV2') &&
                c.v1.MagazineIssue.encode(e.latestMagazineIssueV2, t.uint32(74).fork()).ldelim(),
                null != e.recommendedMangasV2 &&
                e.recommendedMangasV2.length
              ) for (var r = 0; r < e.recommendedMangasV2.length; ++r) c.v1.Manga.encode(e.recommendedMangasV2[r], t.uint32(82).fork()).ldelim();
              if (
                null != e.mangaId &&
                Object.hasOwnProperty.call(e, 'mangaId') &&
                t.uint32(88).uint32(e.mangaId),
                null != e.recommendedMangasV3 &&
                e.recommendedMangasV3.length
              ) for (var o = 0; o < e.recommendedMangasV3.length; ++o) c.v1.BookIssueLastPageResponse.MangaWithRecommendVersion.encode(e.recommendedMangasV3[o], t.uint32(98).fork()).ldelim();
              return null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(104).bool(e.hasAppLoggedin),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueLastPageResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.authorships &&
                    o.authorships.length ||
                    (o.authorships = []),
                    o.authorships.push(c.v1.Authorship.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 4:
                    o.numberOfComments = e.uint32();
                    break;
                  case 5:
                    o.nextBookIssue = c.v1.BookIssue.decode(e, e.uint32());
                    break;
                  case 6:
                    o.latestMagazineIssue = c.v1.MagazineIssue.decode(e, e.uint32());
                    break;
                  case 7:
                    o.recommendedMangas = c.v1.BookIssueLastPageResponse.RecommendedMangas.decode(e, e.uint32());
                    break;
                  case 8:
                    o.nextBookIssueV2 = c.v1.BookIssue.decode(e, e.uint32());
                    break;
                  case 9:
                    o.latestMagazineIssueV2 = c.v1.MagazineIssue.decode(e, e.uint32());
                    break;
                  case 10:
                    o.recommendedMangasV2 &&
                    o.recommendedMangasV2.length ||
                    (o.recommendedMangasV2 = []),
                    o.recommendedMangasV2.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 11:
                    o.mangaId = e.uint32();
                    break;
                  case 12:
                    o.recommendedMangasV3 &&
                    o.recommendedMangasV3.length ||
                    (o.recommendedMangasV3 = []),
                    o.recommendedMangasV3.push(
                      c.v1.BookIssueLastPageResponse.MangaWithRecommendVersion.decode(e, e.uint32())
                    );
                    break;
                  case 13:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.RecommendedMangas = function () {
              var e = function (e) {
                if (this.recommendedMangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.recommendedMangas = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.recommendedMangas &&
                  e.recommendedMangas.length
                ) for (var n = 0; n < e.recommendedMangas.length; ++n) c.v1.Manga.encode(e.recommendedMangas[n], t.uint32(10).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookIssueLastPageResponse.RecommendedMangas;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.recommendedMangas &&
                  o.recommendedMangas.length ||
                  (o.recommendedMangas = []),
                  o.recommendedMangas.push(c.v1.Manga.decode(e, e.uint32()));
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            t.MangaWithRecommendVersion = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.manga = null,
              e.prototype.version = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.manga &&
                Object.hasOwnProperty.call(e, 'manga') &&
                c.v1.Manga.encode(e.manga, t.uint32(10).fork()).ldelim(),
                null != e.version &&
                Object.hasOwnProperty.call(e, 'version') &&
                t.uint32(16).uint32(e.version),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookIssueLastPageResponse.MangaWithRecommendVersion;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.manga = c.v1.Manga.decode(e, e.uint32());
                      break;
                    case 2:
                      o.version = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t
          }(),
          e.BookIssueRankingRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueRankingRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.BookIssueRankingResponse = function () {
            var e = function (e) {
              if (this.rankings = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.rankings = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.rankings && e.rankings.length) for (var n = 0; n < e.rankings.length; ++n) c.v1.BookIssueRankingResponse.Ranking.encode(e.rankings[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueRankingResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.rankings &&
                o.rankings.length ||
                (o.rankings = []),
                o.rankings.push(c.v1.BookIssueRankingResponse.Ranking.decode(e, e.uint32()));
                 else e.skipType(7 & i)
              }
              return o
            },
            e.Ranking = function () {
              var e = function (e) {
                if (this.bookIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.name = '',
              e.prototype.bookIssues = s.emptyArray,
              e.prototype.tagId = 0,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.name &&
                  Object.hasOwnProperty.call(e, 'name') &&
                  t.uint32(10).string(e.name),
                  null != e.bookIssues &&
                  e.bookIssues.length
                ) for (var n = 0; n < e.bookIssues.length; ++n) c.v1.BookIssue.encode(e.bookIssues[n], t.uint32(18).fork()).ldelim();
                return null != e.tagId &&
                Object.hasOwnProperty.call(e, 'tagId') &&
                t.uint32(24).uint32(e.tagId),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookIssueRankingResponse.Ranking;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.name = e.string();
                      break;
                    case 2:
                      o.bookIssues &&
                      o.bookIssues.length ||
                      (o.bookIssues = []),
                      o.bookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.tagId = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.BookIssueShioriRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.prototype.shioriPage = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              null != e.shioriPage &&
              Object.hasOwnProperty.call(e, 'shioriPage') &&
              t.uint32(24).uint32(e.shioriPage),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueShioriRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  case 3:
                    o.shioriPage = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookIssueShioriResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueShioriResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.BookIssueWishRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.prototype.wished = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              null != e.wished &&
              Object.hasOwnProperty.call(e, 'wished') &&
              t.uint32(24).bool(e.wished),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueWishRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  case 3:
                    o.wished = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookIssueWishResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssueWishResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.BookIssuesToPurchaseInBulkRequest = function () {
            var e = function (e) {
              if (this.bookIssueIds = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueIds = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.deviceInfo &&
                Object.hasOwnProperty.call(e, 'deviceInfo') &&
                c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
                null != e.bookIssueIds &&
                e.bookIssueIds.length
              ) {
                t.uint32(18).fork();
                for (var n = 0; n < e.bookIssueIds.length; ++n) t.uint32(e.bookIssueIds[n]);
                t.ldelim()
              }
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssuesToPurchaseInBulkRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    if (
                      o.bookIssueIds &&
                      o.bookIssueIds.length ||
                      (o.bookIssueIds = []),
                      2 === (7 & i)
                    ) for (var s = e.uint32() + e.pos; e.pos < s; ) o.bookIssueIds.push(e.uint32());
                     else o.bookIssueIds.push(e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookIssuesToPurchaseInBulkResponse = function () {
            var e = function (e) {
              if (this.bookIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.bookIssues = s.emptyArray,
            e.prototype.userPoint = null,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.bookIssues && e.bookIssues.length) for (var n = 0; n < e.bookIssues.length; ++n) c.v1.BookIssue.encode(e.bookIssues[n], t.uint32(10).fork()).ldelim();
              return null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookIssuesToPurchaseInBulkResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.bookIssues &&
                    o.bookIssues.length ||
                    (o.bookIssues = []),
                    o.bookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookStoreV2Request = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookStoreV2Request;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.BookStoreV2Response = function () {
            var e = function (e) {
              if (this.sections = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.sections = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.sections && e.sections.length) for (var n = 0; n < e.sections.length; ++n) c.v1.BookStoreV2Response.BookStoreSection.encode(e.sections[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookStoreV2Response;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.sections &&
                o.sections.length ||
                (o.sections = []),
                o.sections.push(
                  c.v1.BookStoreV2Response.BookStoreSection.decode(e, e.uint32())
                );
                 else e.skipType(7 & i)
              }
              return o
            },
            e.BookStoreSection = function () {
              var e,
              t = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return t.prototype.bannerSection = null,
              t.prototype.bookIssueSection = null,
              t.prototype.bookSection = null,
              t.prototype.magazineSection = null,
              Object.defineProperty(
                t.prototype,
                'content',
                {
                  get: s.oneOfGetter(
                    e = [
                      'bannerSection',
                      'bookIssueSection',
                      'bookSection',
                      'magazineSection'
                    ]
                  ),
                  set: s.oneOfSetter(e)
                }
              ),
              t.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.bannerSection &&
                Object.hasOwnProperty.call(e, 'bannerSection') &&
                c.v1.BookStoreV2Response.BannerSection.encode(e.bannerSection, t.uint32(10).fork()).ldelim(),
                null != e.bookIssueSection &&
                Object.hasOwnProperty.call(e, 'bookIssueSection') &&
                c.v1.BookStoreV2Response.BookIssueSection.encode(e.bookIssueSection, t.uint32(18).fork()).ldelim(),
                null != e.bookSection &&
                Object.hasOwnProperty.call(e, 'bookSection') &&
                c.v1.BookStoreV2Response.BookSection.encode(e.bookSection, t.uint32(26).fork()).ldelim(),
                null != e.magazineSection &&
                Object.hasOwnProperty.call(e, 'magazineSection') &&
                c.v1.BookStoreV2Response.MagazineSection.encode(e.magazineSection, t.uint32(34).fork()).ldelim(),
                t
              },
              t.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV2Response.BookStoreSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.bannerSection = c.v1.BookStoreV2Response.BannerSection.decode(e, e.uint32());
                      break;
                    case 2:
                      o.bookIssueSection = c.v1.BookStoreV2Response.BookIssueSection.decode(e, e.uint32());
                      break;
                    case 3:
                      o.bookSection = c.v1.BookStoreV2Response.BookSection.decode(e, e.uint32());
                      break;
                    case 4:
                      o.magazineSection = c.v1.BookStoreV2Response.MagazineSection.decode(e, e.uint32());
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              t
            }(),
            e.BannerSection = function () {
              var e = function (e) {
                if (this.banners = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.banners = s.emptyArray,
              e.encode = function (e, t) {
                if (t || (t = i.create()), null != e.banners && e.banners.length) for (var n = 0; n < e.banners.length; ++n) c.v1.Banner.encode(e.banners[n], t.uint32(10).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV2Response.BannerSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.banners &&
                  o.banners.length ||
                  (o.banners = []),
                  o.banners.push(c.v1.Banner.decode(e, e.uint32()));
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            e.BookIssueSection = function () {
              var e = function (e) {
                if (this.bookIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.sectionName = '',
              e.prototype.bookIssues = s.emptyArray,
              e.prototype.destination = 0,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.bookIssues &&
                  e.bookIssues.length
                ) for (var n = 0; n < e.bookIssues.length; ++n) c.v1.BookIssue.encode(e.bookIssues[n], t.uint32(18).fork()).ldelim();
                return null != e.destination &&
                Object.hasOwnProperty.call(e, 'destination') &&
                t.uint32(24).int32(e.destination),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV2Response.BookIssueSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.bookIssues &&
                      o.bookIssues.length ||
                      (o.bookIssues = []),
                      o.bookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.destination = e.int32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.BookSection = function () {
              var e = function (e) {
                if (this.books = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.sectionName = '',
              e.prototype.books = s.emptyArray,
              e.prototype.tagId = 0,
              e.prototype.thumbnailUrl = '',
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.books &&
                  e.books.length
                ) for (var n = 0; n < e.books.length; ++n) c.v1.Book.encode(e.books[n], t.uint32(18).fork()).ldelim();
                return null != e.tagId &&
                Object.hasOwnProperty.call(e, 'tagId') &&
                t.uint32(24).uint32(e.tagId),
                null != e.thumbnailUrl &&
                Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                t.uint32(34).string(e.thumbnailUrl),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV2Response.BookSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.books &&
                      o.books.length ||
                      (o.books = []),
                      o.books.push(c.v1.Book.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.tagId = e.uint32();
                      break;
                    case 4:
                      o.thumbnailUrl = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.MagazineSection = function () {
              var e = function (e) {
                if (this.magazineIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.sectionName = '',
              e.prototype.magazineIssueBanner = null,
              e.prototype.magazineIssues = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.magazineIssueBanner &&
                  Object.hasOwnProperty.call(e, 'magazineIssueBanner') &&
                  c.v1.Banner.encode(e.magazineIssueBanner, t.uint32(18).fork()).ldelim(),
                  null != e.magazineIssues &&
                  e.magazineIssues.length
                ) for (var n = 0; n < e.magazineIssues.length; ++n) c.v1.MagazineIssue.encode(e.magazineIssues[n], t.uint32(26).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV2Response.MagazineSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.magazineIssueBanner = c.v1.Banner.decode(e, e.uint32());
                      break;
                    case 3:
                      o.magazineIssues &&
                      o.magazineIssues.length ||
                      (o.magazineIssues = []),
                      o.magazineIssues.push(c.v1.MagazineIssue.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.Destination = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NONE'] = 0,
              t[e[1] = 'BOOK_RANKING_LIST'] = 1,
              t
            }(),
            e
          }(),
          e.BookStoreV3Request = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookStoreV3Request;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.BookStoreV3Response = function () {
            var e = function (e) {
              if (this.sections = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.sections = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.sections && e.sections.length) for (var n = 0; n < e.sections.length; ++n) c.v1.BookStoreV3Response.BookStoreSection.encode(e.sections[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookStoreV3Response;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.sections &&
                o.sections.length ||
                (o.sections = []),
                o.sections.push(
                  c.v1.BookStoreV3Response.BookStoreSection.decode(e, e.uint32())
                );
                 else e.skipType(7 & i)
              }
              return o
            },
            e.BookStoreSection = function () {
              var e,
              t = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return t.prototype.carouselBanner = null,
              t.prototype.newBookIssue = null,
              t.prototype.latestMagazineIssue = null,
              t.prototype.ranking = null,
              t.prototype.book = null,
              Object.defineProperty(
                t.prototype,
                'content',
                {
                  get: s.oneOfGetter(
                    e = [
                      'carouselBanner',
                      'newBookIssue',
                      'latestMagazineIssue',
                      'ranking',
                      'book'
                    ]
                  ),
                  set: s.oneOfSetter(e)
                }
              ),
              t.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.carouselBanner &&
                Object.hasOwnProperty.call(e, 'carouselBanner') &&
                c.v1.BookStoreV3Response.CarouselBannerSection.encode(e.carouselBanner, t.uint32(10).fork()).ldelim(),
                null != e.newBookIssue &&
                Object.hasOwnProperty.call(e, 'newBookIssue') &&
                c.v1.BookStoreV3Response.NewBookIssueSection.encode(e.newBookIssue, t.uint32(18).fork()).ldelim(),
                null != e.latestMagazineIssue &&
                Object.hasOwnProperty.call(e, 'latestMagazineIssue') &&
                c.v1.BookStoreV3Response.LatestMagazineIssueSection.encode(e.latestMagazineIssue, t.uint32(26).fork()).ldelim(),
                null != e.ranking &&
                Object.hasOwnProperty.call(e, 'ranking') &&
                c.v1.BookStoreV3Response.RankingSection.encode(e.ranking, t.uint32(34).fork()).ldelim(),
                null != e.book &&
                Object.hasOwnProperty.call(e, 'book') &&
                c.v1.BookStoreV3Response.BookSection.encode(e.book, t.uint32(42).fork()).ldelim(),
                t
              },
              t.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV3Response.BookStoreSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.carouselBanner = c.v1.BookStoreV3Response.CarouselBannerSection.decode(e, e.uint32());
                      break;
                    case 2:
                      o.newBookIssue = c.v1.BookStoreV3Response.NewBookIssueSection.decode(e, e.uint32());
                      break;
                    case 3:
                      o.latestMagazineIssue = c.v1.BookStoreV3Response.LatestMagazineIssueSection.decode(e, e.uint32());
                      break;
                    case 4:
                      o.ranking = c.v1.BookStoreV3Response.RankingSection.decode(e, e.uint32());
                      break;
                    case 5:
                      o.book = c.v1.BookStoreV3Response.BookSection.decode(e, e.uint32());
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              t
            }(),
            e.CarouselBannerSection = function () {
              var e = function (e) {
                if (this.banners = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.banners = s.emptyArray,
              e.encode = function (e, t) {
                if (t || (t = i.create()), null != e.banners && e.banners.length) for (var n = 0; n < e.banners.length; ++n) c.v1.Banner.encode(e.banners[n], t.uint32(10).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV3Response.CarouselBannerSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.banners &&
                  o.banners.length ||
                  (o.banners = []),
                  o.banners.push(c.v1.Banner.decode(e, e.uint32()));
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            e.NewBookIssueSection = function () {
              var e,
              t = function (e) {
                if (this.bookIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return t.prototype.sectionName = '',
              t.prototype.bookIssues = s.emptyArray,
              t.prototype.backgroundColor = null,
              Object.defineProperty(
                t.prototype,
                '_backgroundColor',
                {
                  get: s.oneOfGetter(e = [
                    'backgroundColor'
                  ]),
                  set: s.oneOfSetter(e)
                }
              ),
              t.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.bookIssues &&
                  e.bookIssues.length
                ) for (var n = 0; n < e.bookIssues.length; ++n) c.v1.BookIssue.encode(e.bookIssues[n], t.uint32(18).fork()).ldelim();
                return null != e.backgroundColor &&
                Object.hasOwnProperty.call(e, 'backgroundColor') &&
                c.v1.Color.encode(e.backgroundColor, t.uint32(26).fork()).ldelim(),
                t
              },
              t.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV3Response.NewBookIssueSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.bookIssues &&
                      o.bookIssues.length ||
                      (o.bookIssues = []),
                      o.bookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.backgroundColor = c.v1.Color.decode(e, e.uint32());
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              t
            }(),
            e.LatestMagazineIssueSection = function () {
              var e,
              t = function (e) {
                if (this.magazineIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return t.prototype.sectionName = '',
              t.prototype.magazineIssueBanner = null,
              t.prototype.magazineIssues = s.emptyArray,
              t.prototype.magazineIssueBannerSp = null,
              t.prototype.backgroundColor = null,
              Object.defineProperty(
                t.prototype,
                '_backgroundColor',
                {
                  get: s.oneOfGetter(e = [
                    'backgroundColor'
                  ]),
                  set: s.oneOfSetter(e)
                }
              ),
              t.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.magazineIssueBanner &&
                  Object.hasOwnProperty.call(e, 'magazineIssueBanner') &&
                  c.v1.Banner.encode(e.magazineIssueBanner, t.uint32(18).fork()).ldelim(),
                  null != e.magazineIssues &&
                  e.magazineIssues.length
                ) for (var n = 0; n < e.magazineIssues.length; ++n) c.v1.MagazineIssue.encode(e.magazineIssues[n], t.uint32(26).fork()).ldelim();
                return null != e.magazineIssueBannerSp &&
                Object.hasOwnProperty.call(e, 'magazineIssueBannerSp') &&
                c.v1.Banner.encode(e.magazineIssueBannerSp, t.uint32(34).fork()).ldelim(),
                null != e.backgroundColor &&
                Object.hasOwnProperty.call(e, 'backgroundColor') &&
                c.v1.Color.encode(e.backgroundColor, t.uint32(42).fork()).ldelim(),
                t
              },
              t.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV3Response.LatestMagazineIssueSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.magazineIssueBanner = c.v1.Banner.decode(e, e.uint32());
                      break;
                    case 3:
                      o.magazineIssues &&
                      o.magazineIssues.length ||
                      (o.magazineIssues = []),
                      o.magazineIssues.push(c.v1.MagazineIssue.decode(e, e.uint32()));
                      break;
                    case 4:
                      o.magazineIssueBannerSp = c.v1.Banner.decode(e, e.uint32());
                      break;
                    case 5:
                      o.backgroundColor = c.v1.Color.decode(e, e.uint32());
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              t
            }(),
            e.RankingSection = function () {
              var e,
              t = function (e) {
                if (this.bookIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return t.prototype.sectionName = '',
              t.prototype.bookIssues = s.emptyArray,
              t.prototype.backgroundColor = null,
              Object.defineProperty(
                t.prototype,
                '_backgroundColor',
                {
                  get: s.oneOfGetter(e = [
                    'backgroundColor'
                  ]),
                  set: s.oneOfSetter(e)
                }
              ),
              t.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.bookIssues &&
                  e.bookIssues.length
                ) for (var n = 0; n < e.bookIssues.length; ++n) c.v1.BookIssue.encode(e.bookIssues[n], t.uint32(18).fork()).ldelim();
                return null != e.backgroundColor &&
                Object.hasOwnProperty.call(e, 'backgroundColor') &&
                c.v1.Color.encode(e.backgroundColor, t.uint32(26).fork()).ldelim(),
                t
              },
              t.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV3Response.RankingSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.bookIssues &&
                      o.bookIssues.length ||
                      (o.bookIssues = []),
                      o.bookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.backgroundColor = c.v1.Color.decode(e, e.uint32());
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              t
            }(),
            e.BookSection = function () {
              var e,
              t = function (e) {
                if (this.books = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return t.prototype.sectionName = '',
              t.prototype.books = s.emptyArray,
              t.prototype.tagId = 0,
              t.prototype.thumbnailUrl = '',
              t.prototype.backgroundColor = null,
              Object.defineProperty(
                t.prototype,
                '_backgroundColor',
                {
                  get: s.oneOfGetter(e = [
                    'backgroundColor'
                  ]),
                  set: s.oneOfSetter(e)
                }
              ),
              t.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.books &&
                  e.books.length
                ) for (var n = 0; n < e.books.length; ++n) c.v1.Book.encode(e.books[n], t.uint32(18).fork()).ldelim();
                return null != e.tagId &&
                Object.hasOwnProperty.call(e, 'tagId') &&
                t.uint32(24).uint32(e.tagId),
                null != e.thumbnailUrl &&
                Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                t.uint32(34).string(e.thumbnailUrl),
                null != e.backgroundColor &&
                Object.hasOwnProperty.call(e, 'backgroundColor') &&
                c.v1.Color.encode(e.backgroundColor, t.uint32(42).fork()).ldelim(),
                t
              },
              t.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.BookStoreV3Response.BookSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.books &&
                      o.books.length ||
                      (o.books = []),
                      o.books.push(c.v1.Book.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.tagId = e.uint32();
                      break;
                    case 4:
                      o.thumbnailUrl = e.string();
                      break;
                    case 5:
                      o.backgroundColor = c.v1.Color.decode(e, e.uint32());
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              t
            }(),
            e
          }(),
          e.BookViewerRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookViewerRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookViewerResponse = function () {
            var e = function (e) {
              if (this.pages = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.viewerTitle = '',
            e.prototype.pages = s.emptyArray,
            e.prototype.isCommentEnabled = !1,
            e.prototype.sns = null,
            e.prototype.shioriPage = 0,
            e.prototype.scroll = 0,
            e.prototype.userPoint = null,
            e.prototype.isFirstPageBlank = !1,
            e.prototype.shownBookIssue = null,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.viewerTitle &&
                Object.hasOwnProperty.call(e, 'viewerTitle') &&
                t.uint32(10).string(e.viewerTitle),
                null != e.pages &&
                e.pages.length
              ) for (var n = 0; n < e.pages.length; ++n) c.v1.ViewerPage.encode(e.pages[n], t.uint32(18).fork()).ldelim();
              return null != e.isCommentEnabled &&
              Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
              t.uint32(24).bool(e.isCommentEnabled),
              null != e.sns &&
              Object.hasOwnProperty.call(e, 'sns') &&
              c.v1.Sns.encode(e.sns, t.uint32(34).fork()).ldelim(),
              null != e.shioriPage &&
              Object.hasOwnProperty.call(e, 'shioriPage') &&
              t.uint32(40).uint32(e.shioriPage),
              null != e.scroll &&
              Object.hasOwnProperty.call(e, 'scroll') &&
              t.uint32(48).int32(e.scroll),
              null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(58).fork()).ldelim(),
              null != e.isFirstPageBlank &&
              Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
              t.uint32(64).bool(e.isFirstPageBlank),
              null != e.shownBookIssue &&
              Object.hasOwnProperty.call(e, 'shownBookIssue') &&
              c.v1.BookIssue.encode(e.shownBookIssue, t.uint32(74).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookViewerResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.viewerTitle = e.string();
                    break;
                  case 2:
                    o.pages &&
                    o.pages.length ||
                    (o.pages = []),
                    o.pages.push(c.v1.ViewerPage.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 4:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 5:
                    o.shioriPage = e.uint32();
                    break;
                  case 6:
                    o.scroll = e.int32();
                    break;
                  case 7:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 8:
                    o.isFirstPageBlank = e.bool();
                    break;
                  case 9:
                    o.shownBookIssue = c.v1.BookIssue.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ScrollDirection = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'LEFT'] = 0,
              t[e[1] = 'RIGHT'] = 1,
              t
            }(),
            e
          }(),
          e.BookViewer2Request = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.prototype.purchaseRequest = !1,
            e.prototype.consumePaidPoint = 0,
            e.prototype.viewerMode = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              null != e.purchaseRequest &&
              Object.hasOwnProperty.call(e, 'purchaseRequest') &&
              t.uint32(24).bool(e.purchaseRequest),
              null != e.consumePaidPoint &&
              Object.hasOwnProperty.call(e, 'consumePaidPoint') &&
              t.uint32(32).uint32(e.consumePaidPoint),
              null != e.viewerMode &&
              Object.hasOwnProperty.call(e, 'viewerMode') &&
              c.v1.ViewerMode.encode(e.viewerMode, t.uint32(42).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookViewer2Request;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  case 3:
                    o.purchaseRequest = e.bool();
                    break;
                  case 4:
                    o.consumePaidPoint = e.uint32();
                    break;
                  case 5:
                    o.viewerMode = c.v1.ViewerMode.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.BookViewer2Response = function () {
            var e = function (e) {
              if (this.pages = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.pages = s.emptyArray,
            e.prototype.isCommentEnabled = !1,
            e.prototype.sns = null,
            e.prototype.shioriPage = 0,
            e.prototype.scroll = 0,
            e.prototype.userPoint = null,
            e.prototype.isFirstPageBlank = !1,
            e.prototype.bookIssue = null,
            e.prototype.cashBack = null,
            e.prototype.isScreenshotable = !1,
            e.prototype.hasAppLoggedin = !1,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.pages && e.pages.length) for (var n = 0; n < e.pages.length; ++n) c.v1.ViewerPage.encode(e.pages[n], t.uint32(10).fork()).ldelim();
              return null != e.isCommentEnabled &&
              Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
              t.uint32(16).bool(e.isCommentEnabled),
              null != e.sns &&
              Object.hasOwnProperty.call(e, 'sns') &&
              c.v1.Sns.encode(e.sns, t.uint32(26).fork()).ldelim(),
              null != e.shioriPage &&
              Object.hasOwnProperty.call(e, 'shioriPage') &&
              t.uint32(32).uint32(e.shioriPage),
              null != e.scroll &&
              Object.hasOwnProperty.call(e, 'scroll') &&
              t.uint32(40).int32(e.scroll),
              null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(50).fork()).ldelim(),
              null != e.isFirstPageBlank &&
              Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
              t.uint32(56).bool(e.isFirstPageBlank),
              null != e.bookIssue &&
              Object.hasOwnProperty.call(e, 'bookIssue') &&
              c.v1.BookIssue.encode(e.bookIssue, t.uint32(66).fork()).ldelim(),
              null != e.cashBack &&
              Object.hasOwnProperty.call(e, 'cashBack') &&
              c.v1.UserPoint.encode(e.cashBack, t.uint32(74).fork()).ldelim(),
              null != e.isScreenshotable &&
              Object.hasOwnProperty.call(e, 'isScreenshotable') &&
              t.uint32(80).bool(e.isScreenshotable),
              null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(88).bool(e.hasAppLoggedin),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.BookViewer2Response;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.pages &&
                    o.pages.length ||
                    (o.pages = []),
                    o.pages.push(c.v1.ViewerPage.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 3:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 4:
                    o.shioriPage = e.uint32();
                    break;
                  case 5:
                    o.scroll = e.int32();
                    break;
                  case 6:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 7:
                    o.isFirstPageBlank = e.bool();
                    break;
                  case 8:
                    o.bookIssue = c.v1.BookIssue.decode(e, e.uint32());
                    break;
                  case 9:
                    o.cashBack = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 10:
                    o.isScreenshotable = e.bool();
                    break;
                  case 11:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ScrollDirection = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'LEFT'] = 0,
              t[e[1] = 'RIGHT'] = 1,
              t
            }(),
            e
          }(),
          e.OGPChapterRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.chapterId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.chapterId &&
              Object.hasOwnProperty.call(e, 'chapterId') &&
              t.uint32(8).uint32(e.chapterId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.OGPChapterRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.chapterId = e.uint32();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.OGPChapterResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.chapterMainName = '',
            e.prototype.chapterSubName = '',
            e.prototype.thumbnailUrl = '',
            e.prototype.mangaId = 0,
            e.prototype.mangaName = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.chapterMainName &&
              Object.hasOwnProperty.call(e, 'chapterMainName') &&
              t.uint32(10).string(e.chapterMainName),
              null != e.chapterSubName &&
              Object.hasOwnProperty.call(e, 'chapterSubName') &&
              t.uint32(18).string(e.chapterSubName),
              null != e.thumbnailUrl &&
              Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
              t.uint32(26).string(e.thumbnailUrl),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(32).uint32(e.mangaId),
              null != e.mangaName &&
              Object.hasOwnProperty.call(e, 'mangaName') &&
              t.uint32(42).string(e.mangaName),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.OGPChapterResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.chapterMainName = e.string();
                    break;
                  case 2:
                    o.chapterSubName = e.string();
                    break;
                  case 3:
                    o.thumbnailUrl = e.string();
                    break;
                  case 4:
                    o.mangaId = e.uint32();
                    break;
                  case 5:
                    o.mangaName = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ChapterLastPageRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.chapterId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.chapterId &&
              Object.hasOwnProperty.call(e, 'chapterId') &&
              t.uint32(16).uint32(e.chapterId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ChapterLastPageRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.chapterId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ChapterLastPageResponse = function () {
            var e,
            t = function (e) {
              if (
                this.authorships = [],
                this.recommendedMangasV2 = [],
                this.recommendedMangasV3 = [],
                this.rechargedMangas = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.userPoint = null,
            t.prototype.isTicketAvailable = !1,
            t.prototype.authorships = s.emptyArray,
            t.prototype.isCommentEnabled = !1,
            t.prototype.numberOfComments = 0,
            t.prototype.isFavorite = !1,
            t.prototype.numberOfFavorites = 0,
            t.prototype.isLiked = !1,
            t.prototype.numberOfLike = 0,
            t.prototype.mangaId = 0,
            t.prototype.rewardUrl = '',
            t.prototype.nextChapter = null,
            t.prototype.recommendedMangas = null,
            t.prototype.updateInfo = '',
            t.prototype.nextChapterV2 = null,
            t.prototype.recommendedMangasV2 = s.emptyArray,
            t.prototype.recommendedMangasV3 = s.emptyArray,
            t.prototype.billingItem = null,
            t.prototype.sns = null,
            t.prototype.rechargedMangas = s.emptyArray,
            t.prototype.hasAppLoggedin = !1,
            Object.defineProperty(
              t.prototype,
              'lastPageContent',
              {
                get: s.oneOfGetter(e = [
                  'nextChapter',
                  'recommendedMangas'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.isTicketAvailable &&
                Object.hasOwnProperty.call(e, 'isTicketAvailable') &&
                t.uint32(16).bool(e.isTicketAvailable),
                null != e.authorships &&
                e.authorships.length
              ) for (var n = 0; n < e.authorships.length; ++n) c.v1.Authorship.encode(e.authorships[n], t.uint32(26).fork()).ldelim();
              if (
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
                c.v1.Chapter.encode(e.nextChapter, t.uint32(90).fork()).ldelim(),
                null != e.recommendedMangas &&
                Object.hasOwnProperty.call(e, 'recommendedMangas') &&
                c.v1.ChapterLastPageResponse.RecommendedMangas.encode(e.recommendedMangas, t.uint32(106).fork()).ldelim(),
                null != e.rewardUrl &&
                Object.hasOwnProperty.call(e, 'rewardUrl') &&
                t.uint32(114).string(e.rewardUrl),
                null != e.updateInfo &&
                Object.hasOwnProperty.call(e, 'updateInfo') &&
                t.uint32(122).string(e.updateInfo),
                null != e.nextChapterV2 &&
                Object.hasOwnProperty.call(e, 'nextChapterV2') &&
                c.v1.Chapter.encode(e.nextChapterV2, t.uint32(130).fork()).ldelim(),
                null != e.recommendedMangasV2 &&
                e.recommendedMangasV2.length
              ) for (var r = 0; r < e.recommendedMangasV2.length; ++r) c.v1.Manga.encode(e.recommendedMangasV2[r], t.uint32(138).fork()).ldelim();
              if (null != e.recommendedMangasV3 && e.recommendedMangasV3.length) for (var o = 0; o < e.recommendedMangasV3.length; ++o) c.v1.ChapterLastPageResponse.MangaWithRecommendVersion.encode(e.recommendedMangasV3[o], t.uint32(146).fork()).ldelim();
              if (
                null != e.billingItem &&
                Object.hasOwnProperty.call(e, 'billingItem') &&
                c.v1.BillingItem.encode(e.billingItem, t.uint32(154).fork()).ldelim(),
                null != e.sns &&
                Object.hasOwnProperty.call(e, 'sns') &&
                c.v1.Sns.encode(e.sns, t.uint32(162).fork()).ldelim(),
                null != e.rechargedMangas &&
                e.rechargedMangas.length
              ) for (var a = 0; a < e.rechargedMangas.length; ++a) c.v1.Manga.encode(e.rechargedMangas[a], t.uint32(170).fork()).ldelim();
              return null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(176).bool(e.hasAppLoggedin),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ChapterLastPageResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.isTicketAvailable = e.bool();
                    break;
                  case 3:
                    o.authorships &&
                    o.authorships.length ||
                    (o.authorships = []),
                    o.authorships.push(c.v1.Authorship.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 5:
                    o.numberOfComments = e.uint32();
                    break;
                  case 6:
                    o.isFavorite = e.bool();
                    break;
                  case 7:
                    o.numberOfFavorites = e.uint32();
                    break;
                  case 8:
                    o.isLiked = e.bool();
                    break;
                  case 9:
                    o.numberOfLike = e.uint32();
                    break;
                  case 10:
                    o.mangaId = e.uint32();
                    break;
                  case 14:
                    o.rewardUrl = e.string();
                    break;
                  case 11:
                    o.nextChapter = c.v1.Chapter.decode(e, e.uint32());
                    break;
                  case 13:
                    o.recommendedMangas = c.v1.ChapterLastPageResponse.RecommendedMangas.decode(e, e.uint32());
                    break;
                  case 15:
                    o.updateInfo = e.string();
                    break;
                  case 16:
                    o.nextChapterV2 = c.v1.Chapter.decode(e, e.uint32());
                    break;
                  case 17:
                    o.recommendedMangasV2 &&
                    o.recommendedMangasV2.length ||
                    (o.recommendedMangasV2 = []),
                    o.recommendedMangasV2.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 18:
                    o.recommendedMangasV3 &&
                    o.recommendedMangasV3.length ||
                    (o.recommendedMangasV3 = []),
                    o.recommendedMangasV3.push(
                      c.v1.ChapterLastPageResponse.MangaWithRecommendVersion.decode(e, e.uint32())
                    );
                    break;
                  case 19:
                    o.billingItem = c.v1.BillingItem.decode(e, e.uint32());
                    break;
                  case 20:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 21:
                    o.rechargedMangas &&
                    o.rechargedMangas.length ||
                    (o.rechargedMangas = []),
                    o.rechargedMangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 22:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.RecommendedMangas = function () {
              var e = function (e) {
                if (this.recommendedMangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.updateInfo = '',
              e.prototype.recommendedMangas = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.updateInfo &&
                  Object.hasOwnProperty.call(e, 'updateInfo') &&
                  t.uint32(10).string(e.updateInfo),
                  null != e.recommendedMangas &&
                  e.recommendedMangas.length
                ) for (var n = 0; n < e.recommendedMangas.length; ++n) c.v1.Manga.encode(e.recommendedMangas[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.ChapterLastPageResponse.RecommendedMangas;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.updateInfo = e.string();
                      break;
                    case 2:
                      o.recommendedMangas &&
                      o.recommendedMangas.length ||
                      (o.recommendedMangas = []),
                      o.recommendedMangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t.MangaWithRecommendVersion = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.manga = null,
              e.prototype.version = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.manga &&
                Object.hasOwnProperty.call(e, 'manga') &&
                c.v1.Manga.encode(e.manga, t.uint32(10).fork()).ldelim(),
                null != e.version &&
                Object.hasOwnProperty.call(e, 'version') &&
                t.uint32(16).uint32(e.version),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.ChapterLastPageResponse.MangaWithRecommendVersion;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.manga = c.v1.Manga.decode(e, e.uint32());
                      break;
                    case 2:
                      o.version = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t
          }(),
          e.ChapterLikeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.chapterId = 0,
            e.prototype.like = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.chapterId &&
              Object.hasOwnProperty.call(e, 'chapterId') &&
              t.uint32(16).uint32(e.chapterId),
              null != e.like &&
              Object.hasOwnProperty.call(e, 'like') &&
              t.uint32(24).bool(e.like),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ChapterLikeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.chapterId = e.uint32();
                    break;
                  case 3:
                    o.like = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ChapterLikeResponse = function () {
            var e = function (e) {
              if (this.accomplishedMissions = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.accomplishedMissions = s.emptyArray,
            e.prototype.userPoint = null,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.accomplishedMissions &&
                e.accomplishedMissions.length
              ) for (var n = 0; n < e.accomplishedMissions.length; ++n) c.v1.Mission.encode(e.accomplishedMissions[n], t.uint32(10).fork()).ldelim();
              return null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ChapterLikeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.accomplishedMissions &&
                    o.accomplishedMissions.length ||
                    (o.accomplishedMissions = []),
                    o.accomplishedMissions.push(c.v1.Mission.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.GetChapterCommentRequest = function () {
            var e,
            t = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.deviceInfo = null,
            t.prototype.chapterId = 0,
            t.prototype.sortOrder = null,
            Object.defineProperty(
              t.prototype,
              '_sortOrder',
              {
                get: s.oneOfGetter(e = [
                  'sortOrder'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.chapterId &&
              Object.hasOwnProperty.call(e, 'chapterId') &&
              t.uint32(16).uint32(e.chapterId),
              null != e.sortOrder &&
              Object.hasOwnProperty.call(e, 'sortOrder') &&
              t.uint32(24).int32(e.sortOrder),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.GetChapterCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.chapterId = e.uint32();
                    break;
                  case 3:
                    o.sortOrder = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t
          }(),
          e.GetChapterCommentResponse = function () {
            var e = function (e) {
              if (this.comments = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.comments = s.emptyArray,
            e.prototype.canPost = !1,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.comments && e.comments.length) for (var n = 0; n < e.comments.length; ++n) c.v1.Comment.encode(e.comments[n], t.uint32(10).fork()).ldelim();
              return null != e.canPost &&
              Object.hasOwnProperty.call(e, 'canPost') &&
              t.uint32(16).bool(e.canPost),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.GetChapterCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.comments &&
                    o.comments.length ||
                    (o.comments = []),
                    o.comments.push(c.v1.Comment.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.canPost = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PostChapterCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.chapterId = 0,
            e.prototype.body = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.chapterId &&
              Object.hasOwnProperty.call(e, 'chapterId') &&
              t.uint32(16).uint32(e.chapterId),
              null != e.body &&
              Object.hasOwnProperty.call(e, 'body') &&
              t.uint32(26).string(e.body),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PostChapterCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.chapterId = e.uint32();
                    break;
                  case 3:
                    o.body = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PostChapterCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PostChapterCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.DeleteChapterCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteChapterCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeleteChapterCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteChapterCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.HideChapterCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.HideChapterCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.HideChapterCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.HideChapterCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.GetBookIssueCommentRequest = function () {
            var e,
            t = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.deviceInfo = null,
            t.prototype.bookIssueId = 0,
            t.prototype.sortOrder = null,
            Object.defineProperty(
              t.prototype,
              '_sortOrder',
              {
                get: s.oneOfGetter(e = [
                  'sortOrder'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              null != e.sortOrder &&
              Object.hasOwnProperty.call(e, 'sortOrder') &&
              t.uint32(24).int32(e.sortOrder),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.GetBookIssueCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  case 3:
                    o.sortOrder = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t
          }(),
          e.GetBookIssueCommentResponse = function () {
            var e = function (e) {
              if (this.comments = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.comments = s.emptyArray,
            e.prototype.canPost = !1,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.comments && e.comments.length) for (var n = 0; n < e.comments.length; ++n) c.v1.Comment.encode(e.comments[n], t.uint32(10).fork()).ldelim();
              return null != e.canPost &&
              Object.hasOwnProperty.call(e, 'canPost') &&
              t.uint32(16).bool(e.canPost),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.GetBookIssueCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.comments &&
                    o.comments.length ||
                    (o.comments = []),
                    o.comments.push(c.v1.Comment.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.canPost = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PostBookIssueCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueId = 0,
            e.prototype.body = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.bookIssueId &&
              Object.hasOwnProperty.call(e, 'bookIssueId') &&
              t.uint32(16).uint32(e.bookIssueId),
              null != e.body &&
              Object.hasOwnProperty.call(e, 'body') &&
              t.uint32(26).string(e.body),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PostBookIssueCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.bookIssueId = e.uint32();
                    break;
                  case 3:
                    o.body = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PostBookIssueCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PostBookIssueCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.DeleteBookIssueCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteBookIssueCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeleteBookIssueCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteBookIssueCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.HideBookIssueCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.HideBookIssueCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.HideBookIssueCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.HideBookIssueCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.GetMagazineIssueCommentRequest = function () {
            var e,
            t = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.deviceInfo = null,
            t.prototype.magazineIssueId = 0,
            t.prototype.sortOrder = null,
            Object.defineProperty(
              t.prototype,
              '_sortOrder',
              {
                get: s.oneOfGetter(e = [
                  'sortOrder'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              null != e.sortOrder &&
              Object.hasOwnProperty.call(e, 'sortOrder') &&
              t.uint32(24).int32(e.sortOrder),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.GetMagazineIssueCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  case 3:
                    o.sortOrder = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t
          }(),
          e.GetMagazineIssueCommentResponse = function () {
            var e = function (e) {
              if (this.comments = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.comments = s.emptyArray,
            e.prototype.canPost = !1,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.comments && e.comments.length) for (var n = 0; n < e.comments.length; ++n) c.v1.Comment.encode(e.comments[n], t.uint32(10).fork()).ldelim();
              return null != e.canPost &&
              Object.hasOwnProperty.call(e, 'canPost') &&
              t.uint32(16).bool(e.canPost),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.GetMagazineIssueCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.comments &&
                    o.comments.length ||
                    (o.comments = []),
                    o.comments.push(c.v1.Comment.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.canPost = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PostMagazineIssueCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.magazineIssueId = 0,
            e.prototype.body = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              null != e.body &&
              Object.hasOwnProperty.call(e, 'body') &&
              t.uint32(26).string(e.body),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PostMagazineIssueCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  case 3:
                    o.body = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PostMagazineIssueCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PostMagazineIssueCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.DeleteMagazineIssueCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteMagazineIssueCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeleteMagazineIssueCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteMagazineIssueCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.HideMagazineIssueCommentRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.HideMagazineIssueCommentRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.HideMagazineIssueCommentResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.HideMagazineIssueCommentResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.SortOrderType = function () {
            var e = {},
            t = Object.create(e);
            return t[e[0] = 'NEW'] = 0,
            t[e[1] = 'LIKE'] = 1,
            t
          }(),
          e.PutChapterCommentLikeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PutChapterCommentLikeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PutChapterCommentLikeResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PutChapterCommentLikeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.DeleteChapterCommentLikeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteChapterCommentLikeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeleteChapterCommentLikeResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteChapterCommentLikeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PutBookIssueCommentLikeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PutBookIssueCommentLikeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PutBookIssueCommentLikeResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PutBookIssueCommentLikeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.DeleteBookIssueCommentLikeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteBookIssueCommentLikeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeleteBookIssueCommentLikeResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteBookIssueCommentLikeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PutMagazineIssueCommentLikeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PutMagazineIssueCommentLikeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PutMagazineIssueCommentLikeResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PutMagazineIssueCommentLikeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.DeleteMagazineIssueCommentLikeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.commentId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.commentId &&
              Object.hasOwnProperty.call(e, 'commentId') &&
              t.uint32(16).uint32(e.commentId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteMagazineIssueCommentLikeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.commentId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeleteMagazineIssueCommentLikeResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteMagazineIssueCommentLikeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.ContactRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ContactRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.ContactResponse = function () {
            var e = function (e) {
              if (this.contacts = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.contacts = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.contacts && e.contacts.length) for (var n = 0; n < e.contacts.length; ++n) c.v1.Contact.encode(e.contacts[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ContactResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.contacts &&
                o.contacts.length ||
                (o.contacts = []),
                o.contacts.push(c.v1.Contact.decode(e, e.uint32()));
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PostContactRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.body = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.body &&
              Object.hasOwnProperty.call(e, 'body') &&
              t.uint32(18).string(e.body),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PostContactRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.body = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PostContactResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PostContactResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.ContactUsRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ContactUsRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.ContactUsResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.url = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.url &&
              Object.hasOwnProperty.call(e, 'url') &&
              t.uint32(10).string(e.url),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ContactUsResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.url = e.string();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.CurrentSubscribedItemListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.CurrentSubscribedItemListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.CurrentSubscribedItemListResponse = function () {
            var e = function (e) {
              if (this.item = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.item = s.emptyArray,
            e.prototype.noteDescription = '',
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.item && e.item.length) for (var n = 0; n < e.item.length; ++n) c.v1.SubscriptionItem.encode(e.item[n], t.uint32(10).fork()).ldelim();
              return null != e.noteDescription &&
              Object.hasOwnProperty.call(e, 'noteDescription') &&
              t.uint32(18).string(e.noteDescription),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.CurrentSubscribedItemListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.item &&
                    o.item.length ||
                    (o.item = []),
                    o.item.push(c.v1.SubscriptionItem.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.noteDescription = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeviceDataRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.advertisingId = '',
            e.prototype.appsflyerId = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.advertisingId &&
              Object.hasOwnProperty.call(e, 'advertisingId') &&
              t.uint32(18).string(e.advertisingId),
              null != e.appsflyerId &&
              Object.hasOwnProperty.call(e, 'appsflyerId') &&
              t.uint32(26).string(e.appsflyerId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeviceDataRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.advertisingId = e.string();
                    break;
                  case 3:
                    o.appsflyerId = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeviceDataResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeviceDataResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.EmailChangeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.newEmail = '',
            e.prototype.password = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.newEmail &&
              Object.hasOwnProperty.call(e, 'newEmail') &&
              t.uint32(18).string(e.newEmail),
              null != e.password &&
              Object.hasOwnProperty.call(e, 'password') &&
              t.uint32(26).string(e.password),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.EmailChangeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.newEmail = e.string();
                    break;
                  case 3:
                    o.password = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.EmailChangeResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.success = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.success &&
              Object.hasOwnProperty.call(e, 'success') &&
              t.uint32(8).bool(e.success),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.EmailChangeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.success = e.bool();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.FcmTokenRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.fcmToken = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.fcmToken &&
              Object.hasOwnProperty.call(e, 'fcmToken') &&
              t.uint32(18).string(e.fcmToken),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.FcmTokenRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.fcmToken = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.FcmTokenResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.FcmTokenResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.HomeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.HomeRequest; e.pos < n; ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.HomeResponse = function () {
            var e = function (e) {
              if (
                this.topBanners = [],
                this.topSubBanners = [],
                this.updatedMangas = [],
                this.rankings = [],
                this.newBookIssues = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.topBanners = s.emptyArray,
            e.prototype.topSubBanners = s.emptyArray,
            e.prototype.updatedMangas = s.emptyArray,
            e.prototype.pickupKoma = null,
            e.prototype.rankings = s.emptyArray,
            e.prototype.newBookIssues = s.emptyArray,
            e.prototype.popup = null,
            e.prototype.advertisingSection = null,
            e.prototype.isMissionUpdated = !1,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.topBanners && e.topBanners.length) for (var n = 0; n < e.topBanners.length; ++n) c.v1.Banner.encode(e.topBanners[n], t.uint32(10).fork()).ldelim();
              if (null != e.topSubBanners && e.topSubBanners.length) for (var r = 0; r < e.topSubBanners.length; ++r) c.v1.Banner.encode(e.topSubBanners[r], t.uint32(18).fork()).ldelim();
              if (null != e.updatedMangas && e.updatedMangas.length) for (var o = 0; o < e.updatedMangas.length; ++o) c.v1.Manga.encode(e.updatedMangas[o], t.uint32(26).fork()).ldelim();
              if (
                null != e.pickupKoma &&
                Object.hasOwnProperty.call(e, 'pickupKoma') &&
                c.v1.Koma.encode(e.pickupKoma, t.uint32(34).fork()).ldelim(),
                null != e.rankings &&
                e.rankings.length
              ) for (var a = 0; a < e.rankings.length; ++a) c.v1.HomeResponse.Ranking.encode(e.rankings[a], t.uint32(42).fork()).ldelim();
              if (null != e.newBookIssues && e.newBookIssues.length) for (var s = 0; s < e.newBookIssues.length; ++s) c.v1.BookIssue.encode(e.newBookIssues[s], t.uint32(50).fork()).ldelim();
              return null != e.popup &&
              Object.hasOwnProperty.call(e, 'popup') &&
              c.v1.Popup.encode(e.popup, t.uint32(58).fork()).ldelim(),
              null != e.advertisingSection &&
              Object.hasOwnProperty.call(e, 'advertisingSection') &&
              c.v1.HomeResponse.AdvertisingSection.encode(e.advertisingSection, t.uint32(66).fork()).ldelim(),
              null != e.isMissionUpdated &&
              Object.hasOwnProperty.call(e, 'isMissionUpdated') &&
              t.uint32(72).bool(e.isMissionUpdated),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.HomeResponse; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.topBanners &&
                    o.topBanners.length ||
                    (o.topBanners = []),
                    o.topBanners.push(c.v1.Banner.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.topSubBanners &&
                    o.topSubBanners.length ||
                    (o.topSubBanners = []),
                    o.topSubBanners.push(c.v1.Banner.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.updatedMangas &&
                    o.updatedMangas.length ||
                    (o.updatedMangas = []),
                    o.updatedMangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.pickupKoma = c.v1.Koma.decode(e, e.uint32());
                    break;
                  case 5:
                    o.rankings &&
                    o.rankings.length ||
                    (o.rankings = []),
                    o.rankings.push(c.v1.HomeResponse.Ranking.decode(e, e.uint32()));
                    break;
                  case 6:
                    o.newBookIssues &&
                    o.newBookIssues.length ||
                    (o.newBookIssues = []),
                    o.newBookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                    break;
                  case 7:
                    o.popup = c.v1.Popup.decode(e, e.uint32());
                    break;
                  case 8:
                    o.advertisingSection = c.v1.HomeResponse.AdvertisingSection.decode(e, e.uint32());
                    break;
                  case 9:
                    o.isMissionUpdated = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Ranking = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.name = '',
              e.prototype.mangas = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.name &&
                  Object.hasOwnProperty.call(e, 'name') &&
                  t.uint32(10).string(e.name),
                  null != e.mangas &&
                  e.mangas.length
                ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeResponse.Ranking;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.name = e.string();
                      break;
                    case 2:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.AdvertisingSection = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.tagId = 0,
              e.prototype.mangas = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.tagId &&
                  Object.hasOwnProperty.call(e, 'tagId') &&
                  t.uint32(8).uint32(e.tagId),
                  null != e.mangas &&
                  e.mangas.length
                ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeResponse.AdvertisingSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.tagId = e.uint32();
                      break;
                    case 2:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.HomeV2Request = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.HomeV2Request;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.HomeV2Response = function () {
            var e,
            t = function (e) {
              if (this.sections = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.sections = s.emptyArray,
            t.prototype.popup = null,
            t.prototype.isMissionUpdated = !1,
            Object.defineProperty(
              t.prototype,
              '_popup',
              {
                get: s.oneOfGetter(e = [
                  'popup'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              if (t || (t = i.create()), null != e.sections && e.sections.length) for (var n = 0; n < e.sections.length; ++n) c.v1.HomeV2Response.HomeSection.encode(e.sections[n], t.uint32(10).fork()).ldelim();
              return null != e.popup &&
              Object.hasOwnProperty.call(e, 'popup') &&
              c.v1.Popup.encode(e.popup, t.uint32(18).fork()).ldelim(),
              null != e.isMissionUpdated &&
              Object.hasOwnProperty.call(e, 'isMissionUpdated') &&
              t.uint32(24).bool(e.isMissionUpdated),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.HomeV2Response;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.sections &&
                    o.sections.length ||
                    (o.sections = []),
                    o.sections.push(c.v1.HomeV2Response.HomeSection.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.popup = c.v1.Popup.decode(e, e.uint32());
                    break;
                  case 3:
                    o.isMissionUpdated = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.HomeSection = function () {
              var e,
              t = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return t.prototype.carouselBanner = null,
              t.prototype.manga = null,
              t.prototype.bookIssue = null,
              t.prototype.koma = null,
              t.prototype.ranking = null,
              t.prototype.book = null,
              Object.defineProperty(
                t.prototype,
                'content',
                {
                  get: s.oneOfGetter(
                    e = [
                      'carouselBanner',
                      'manga',
                      'bookIssue',
                      'koma',
                      'ranking',
                      'book'
                    ]
                  ),
                  set: s.oneOfSetter(e)
                }
              ),
              t.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.carouselBanner &&
                Object.hasOwnProperty.call(e, 'carouselBanner') &&
                c.v1.HomeV2Response.CarouselBannerSection.encode(e.carouselBanner, t.uint32(10).fork()).ldelim(),
                null != e.manga &&
                Object.hasOwnProperty.call(e, 'manga') &&
                c.v1.HomeV2Response.MangaSection.encode(e.manga, t.uint32(18).fork()).ldelim(),
                null != e.bookIssue &&
                Object.hasOwnProperty.call(e, 'bookIssue') &&
                c.v1.HomeV2Response.BookIssueSection.encode(e.bookIssue, t.uint32(26).fork()).ldelim(),
                null != e.koma &&
                Object.hasOwnProperty.call(e, 'koma') &&
                c.v1.HomeV2Response.KomaSection.encode(e.koma, t.uint32(34).fork()).ldelim(),
                null != e.ranking &&
                Object.hasOwnProperty.call(e, 'ranking') &&
                c.v1.HomeV2Response.RankingSection.encode(e.ranking, t.uint32(42).fork()).ldelim(),
                null != e.book &&
                Object.hasOwnProperty.call(e, 'book') &&
                c.v1.HomeV2Response.BookSection.encode(e.book, t.uint32(50).fork()).ldelim(),
                t
              },
              t.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeV2Response.HomeSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.carouselBanner = c.v1.HomeV2Response.CarouselBannerSection.decode(e, e.uint32());
                      break;
                    case 2:
                      o.manga = c.v1.HomeV2Response.MangaSection.decode(e, e.uint32());
                      break;
                    case 3:
                      o.bookIssue = c.v1.HomeV2Response.BookIssueSection.decode(e, e.uint32());
                      break;
                    case 4:
                      o.koma = c.v1.HomeV2Response.KomaSection.decode(e, e.uint32());
                      break;
                    case 5:
                      o.ranking = c.v1.HomeV2Response.RankingSection.decode(e, e.uint32());
                      break;
                    case 6:
                      o.book = c.v1.HomeV2Response.BookSection.decode(e, e.uint32());
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              t
            }(),
            t.CarouselBannerSection = function () {
              var e = function (e) {
                if (this.banners = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.banners = s.emptyArray,
              e.prototype.type = 0,
              e.encode = function (e, t) {
                if (t || (t = i.create()), null != e.banners && e.banners.length) for (var n = 0; n < e.banners.length; ++n) c.v1.Banner.encode(e.banners[n], t.uint32(10).fork()).ldelim();
                return null != e.type &&
                Object.hasOwnProperty.call(e, 'type') &&
                t.uint32(16).int32(e.type),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeV2Response.CarouselBannerSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.banners &&
                      o.banners.length ||
                      (o.banners = []),
                      o.banners.push(c.v1.Banner.decode(e, e.uint32()));
                      break;
                    case 2:
                      o.type = e.int32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e.LayoutType = function () {
                var e = {},
                t = Object.create(e);
                return t[e[0] = 'LARGE'] = 0,
                t[e[1] = 'MEDIUM'] = 1,
                t
              }(),
              e
            }(),
            t.MangaSection = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.tagId = 0,
              e.prototype.sectionName = '',
              e.prototype.mangas = s.emptyArray,
              e.prototype.destination = 0,
              e.prototype.type = 0,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.tagId &&
                  Object.hasOwnProperty.call(e, 'tagId') &&
                  t.uint32(8).uint32(e.tagId),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(18).string(e.sectionName),
                  null != e.mangas &&
                  e.mangas.length
                ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(26).fork()).ldelim();
                return null != e.destination &&
                Object.hasOwnProperty.call(e, 'destination') &&
                t.uint32(32).int32(e.destination),
                null != e.type &&
                Object.hasOwnProperty.call(e, 'type') &&
                t.uint32(40).int32(e.type),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeV2Response.MangaSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.tagId = e.uint32();
                      break;
                    case 2:
                      o.sectionName = e.string();
                      break;
                    case 3:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    case 4:
                      o.destination = e.int32();
                      break;
                    case 5:
                      o.type = e.int32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e.LayoutType = function () {
                var e = {},
                t = Object.create(e);
                return t[e[0] = 'GRID'] = 0,
                t[e[1] = 'GRID_WITH_LARGE_ITEM'] = 1,
                t
              }(),
              e
            }(),
            t.BookIssueSection = function () {
              var e = function (e) {
                if (this.bookIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.sectionName = '',
              e.prototype.bookIssues = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.bookIssues &&
                  e.bookIssues.length
                ) for (var n = 0; n < e.bookIssues.length; ++n) c.v1.BookIssue.encode(e.bookIssues[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeV2Response.BookIssueSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.bookIssues &&
                      o.bookIssues.length ||
                      (o.bookIssues = []),
                      o.bookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t.BookSection = function () {
              var e = function (e) {
                if (this.books = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.sectionName = '',
              e.prototype.books = s.emptyArray,
              e.prototype.tagId = 0,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.sectionName &&
                  Object.hasOwnProperty.call(e, 'sectionName') &&
                  t.uint32(10).string(e.sectionName),
                  null != e.books &&
                  e.books.length
                ) for (var n = 0; n < e.books.length; ++n) c.v1.Book.encode(e.books[n], t.uint32(18).fork()).ldelim();
                return null != e.tagId &&
                Object.hasOwnProperty.call(e, 'tagId') &&
                t.uint32(24).uint32(e.tagId),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeV2Response.BookSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.sectionName = e.string();
                      break;
                    case 2:
                      o.books &&
                      o.books.length ||
                      (o.books = []),
                      o.books.push(c.v1.Book.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.tagId = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t.KomaSection = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.koma = null,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.koma &&
                Object.hasOwnProperty.call(e, 'koma') &&
                c.v1.Koma.encode(e.koma, t.uint32(10).fork()).ldelim(),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeV2Response.KomaSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.koma = c.v1.Koma.decode(e, e.uint32());
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            t.RankingSection = function () {
              var e = function (e) {
                if (this.rankings = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.rankings = s.emptyArray,
              e.encode = function (e, t) {
                if (t || (t = i.create()), null != e.rankings && e.rankings.length) for (var n = 0; n < e.rankings.length; ++n) c.v1.HomeV2Response.Ranking.encode(e.rankings[n], t.uint32(10).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeV2Response.RankingSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.rankings &&
                  o.rankings.length ||
                  (o.rankings = []),
                  o.rankings.push(c.v1.HomeV2Response.Ranking.decode(e, e.uint32()));
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            t.Ranking = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.name = '',
              e.prototype.mangas = s.emptyArray,
              e.prototype.tagId = 0,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.name &&
                  Object.hasOwnProperty.call(e, 'name') &&
                  t.uint32(10).string(e.name),
                  null != e.mangas &&
                  e.mangas.length
                ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(18).fork()).ldelim();
                return null != e.tagId &&
                Object.hasOwnProperty.call(e, 'tagId') &&
                t.uint32(24).uint32(e.tagId),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.HomeV2Response.Ranking;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.name = e.string();
                      break;
                    case 2:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.tagId = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t.Destination = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NONE'] = 0,
              t[e[1] = 'MANGA_LIST'] = 1,
              t[e[2] = 'DAY_OF_WEEK'] = 2,
              t
            }(),
            t
          }(),
          e.MagazineIssueDetailRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.magazineIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineIssueDetailRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MagazineIssueDetailResponse = function () {
            var e = function (e) {
              if (this.magazineIssues = [], this.endedOfSaleMagazineIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.magazineName = '',
            e.prototype.pickupMagazineIssue = null,
            e.prototype.magazineIssues = s.emptyArray,
            e.prototype.endedOfSaleMagazineIssues = s.emptyArray,
            e.prototype.isCommentEnabled = !1,
            e.prototype.sns = null,
            e.prototype.hasAppLoggedin = !1,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.magazineName &&
                Object.hasOwnProperty.call(e, 'magazineName') &&
                t.uint32(18).string(e.magazineName),
                null != e.pickupMagazineIssue &&
                Object.hasOwnProperty.call(e, 'pickupMagazineIssue') &&
                c.v1.MagazineIssue.encode(e.pickupMagazineIssue, t.uint32(26).fork()).ldelim(),
                null != e.magazineIssues &&
                e.magazineIssues.length
              ) for (var n = 0; n < e.magazineIssues.length; ++n) c.v1.MagazineIssue.encode(e.magazineIssues[n], t.uint32(34).fork()).ldelim();
              if (
                null != e.endedOfSaleMagazineIssues &&
                e.endedOfSaleMagazineIssues.length
              ) for (var r = 0; r < e.endedOfSaleMagazineIssues.length; ++r) c.v1.MagazineIssue.encode(e.endedOfSaleMagazineIssues[r], t.uint32(42).fork()).ldelim();
              return null != e.isCommentEnabled &&
              Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
              t.uint32(48).bool(e.isCommentEnabled),
              null != e.sns &&
              Object.hasOwnProperty.call(e, 'sns') &&
              c.v1.Sns.encode(e.sns, t.uint32(58).fork()).ldelim(),
              null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(64).bool(e.hasAppLoggedin),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineIssueDetailResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineName = e.string();
                    break;
                  case 3:
                    o.pickupMagazineIssue = c.v1.MagazineIssue.decode(e, e.uint32());
                    break;
                  case 4:
                    o.magazineIssues &&
                    o.magazineIssues.length ||
                    (o.magazineIssues = []),
                    o.magazineIssues.push(c.v1.MagazineIssue.decode(e, e.uint32()));
                    break;
                  case 5:
                    o.endedOfSaleMagazineIssues &&
                    o.endedOfSaleMagazineIssues.length ||
                    (o.endedOfSaleMagazineIssues = []),
                    o.endedOfSaleMagazineIssues.push(c.v1.MagazineIssue.decode(e, e.uint32()));
                    break;
                  case 6:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 7:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 8:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MagazineIssueLastPageRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.magazineIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineIssueLastPageRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MagazineIssueLastPageResponse = function () {
            var e = function (e) {
              if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.isCommentEnabled = !1,
            e.prototype.numberOfComments = 0,
            e.prototype.nextMagazineIssue = null,
            e.prototype.mangas = s.emptyArray,
            e.prototype.hasAppLoggedin = !1,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.isCommentEnabled &&
                Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                t.uint32(16).bool(e.isCommentEnabled),
                null != e.numberOfComments &&
                Object.hasOwnProperty.call(e, 'numberOfComments') &&
                t.uint32(24).uint32(e.numberOfComments),
                null != e.nextMagazineIssue &&
                Object.hasOwnProperty.call(e, 'nextMagazineIssue') &&
                c.v1.MagazineIssue.encode(e.nextMagazineIssue, t.uint32(34).fork()).ldelim(),
                null != e.mangas &&
                e.mangas.length
              ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(42).fork()).ldelim();
              return null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(48).bool(e.hasAppLoggedin),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineIssueLastPageResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 3:
                    o.numberOfComments = e.uint32();
                    break;
                  case 4:
                    o.nextMagazineIssue = c.v1.MagazineIssue.decode(e, e.uint32());
                    break;
                  case 5:
                    o.mangas &&
                    o.mangas.length ||
                    (o.mangas = []),
                    o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 6:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MagazineIssueShioriRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.magazineIssueId = 0,
            e.prototype.shioriPage = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              null != e.shioriPage &&
              Object.hasOwnProperty.call(e, 'shioriPage') &&
              t.uint32(24).uint32(e.shioriPage),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineIssueShioriRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  case 3:
                    o.shioriPage = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MagazineIssueShioriResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineIssueShioriResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.MagazineListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.MagazineListResponse = function () {
            var e = function (e) {
              if (this.magazines = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.magazines = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.magazines && e.magazines.length) for (var n = 0; n < e.magazines.length; ++n) c.v1.Magazine.encode(e.magazines[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.magazines &&
                o.magazines.length ||
                (o.magazines = []),
                o.magazines.push(c.v1.Magazine.decode(e, e.uint32()));
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.MagazineViewerRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.magazineIssueId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineViewerRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MagazineViewerResponse = function () {
            var e = function (e) {
              if (this.pages = [], this.tableOfContents = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.viewerTitle = '',
            e.prototype.pages = s.emptyArray,
            e.prototype.isCommentEnabled = !1,
            e.prototype.sns = null,
            e.prototype.tableOfContents = s.emptyArray,
            e.prototype.shioriPage = 0,
            e.prototype.scroll = 0,
            e.prototype.userPoint = null,
            e.prototype.isFirstPageBlank = !1,
            e.prototype.shownMagazineIssue = null,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.viewerTitle &&
                Object.hasOwnProperty.call(e, 'viewerTitle') &&
                t.uint32(10).string(e.viewerTitle),
                null != e.pages &&
                e.pages.length
              ) for (var n = 0; n < e.pages.length; ++n) c.v1.ViewerPage.encode(e.pages[n], t.uint32(18).fork()).ldelim();
              if (
                null != e.isCommentEnabled &&
                Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                t.uint32(24).bool(e.isCommentEnabled),
                null != e.sns &&
                Object.hasOwnProperty.call(e, 'sns') &&
                c.v1.Sns.encode(e.sns, t.uint32(34).fork()).ldelim(),
                null != e.tableOfContents &&
                e.tableOfContents.length
              ) for (var r = 0; r < e.tableOfContents.length; ++r) c.v1.MagazineViewerResponse.Content.encode(e.tableOfContents[r], t.uint32(42).fork()).ldelim();
              return null != e.shioriPage &&
              Object.hasOwnProperty.call(e, 'shioriPage') &&
              t.uint32(48).uint32(e.shioriPage),
              null != e.scroll &&
              Object.hasOwnProperty.call(e, 'scroll') &&
              t.uint32(56).int32(e.scroll),
              null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(66).fork()).ldelim(),
              null != e.isFirstPageBlank &&
              Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
              t.uint32(72).bool(e.isFirstPageBlank),
              null != e.shownMagazineIssue &&
              Object.hasOwnProperty.call(e, 'shownMagazineIssue') &&
              c.v1.MagazineIssue.encode(e.shownMagazineIssue, t.uint32(82).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineViewerResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.viewerTitle = e.string();
                    break;
                  case 2:
                    o.pages &&
                    o.pages.length ||
                    (o.pages = []),
                    o.pages.push(c.v1.ViewerPage.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 4:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 5:
                    o.tableOfContents &&
                    o.tableOfContents.length ||
                    (o.tableOfContents = []),
                    o.tableOfContents.push(c.v1.MagazineViewerResponse.Content.decode(e, e.uint32()));
                    break;
                  case 6:
                    o.shioriPage = e.uint32();
                    break;
                  case 7:
                    o.scroll = e.int32();
                    break;
                  case 8:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 9:
                    o.isFirstPageBlank = e.bool();
                    break;
                  case 10:
                    o.shownMagazineIssue = c.v1.MagazineIssue.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Content = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.startPage = 0,
              e.prototype.mangaName = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.startPage &&
                Object.hasOwnProperty.call(e, 'startPage') &&
                t.uint32(8).uint32(e.startPage),
                null != e.mangaName &&
                Object.hasOwnProperty.call(e, 'mangaName') &&
                t.uint32(18).string(e.mangaName),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.MagazineViewerResponse.Content;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.startPage = e.uint32();
                      break;
                    case 2:
                      o.mangaName = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.ScrollDirection = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'LEFT'] = 0,
              t[e[1] = 'RIGHT'] = 1,
              t
            }(),
            e
          }(),
          e.MagazineViewer2Request = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.magazineIssueId = 0,
            e.prototype.purchaseRequest = !1,
            e.prototype.consumePaidPoint = 0,
            e.prototype.viewerMode = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              null != e.purchaseRequest &&
              Object.hasOwnProperty.call(e, 'purchaseRequest') &&
              t.uint32(24).bool(e.purchaseRequest),
              null != e.consumePaidPoint &&
              Object.hasOwnProperty.call(e, 'consumePaidPoint') &&
              t.uint32(32).uint32(e.consumePaidPoint),
              null != e.viewerMode &&
              Object.hasOwnProperty.call(e, 'viewerMode') &&
              c.v1.ViewerMode.encode(e.viewerMode, t.uint32(42).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineViewer2Request;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  case 3:
                    o.purchaseRequest = e.bool();
                    break;
                  case 4:
                    o.consumePaidPoint = e.uint32();
                    break;
                  case 5:
                    o.viewerMode = c.v1.ViewerMode.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MagazineViewer2Response = function () {
            var e = function (e) {
              if (this.pages = [], this.tableOfContents = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.pages = s.emptyArray,
            e.prototype.isCommentEnabled = !1,
            e.prototype.sns = null,
            e.prototype.tableOfContents = s.emptyArray,
            e.prototype.shioriPage = 0,
            e.prototype.scroll = 0,
            e.prototype.userPoint = null,
            e.prototype.isFirstPageBlank = !1,
            e.prototype.magazineIssue = null,
            e.prototype.cashBack = null,
            e.prototype.isScreenshotable = !1,
            e.prototype.hasAppLoggedin = !1,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.pages && e.pages.length) for (var n = 0; n < e.pages.length; ++n) c.v1.ViewerPage.encode(e.pages[n], t.uint32(10).fork()).ldelim();
              if (
                null != e.isCommentEnabled &&
                Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                t.uint32(16).bool(e.isCommentEnabled),
                null != e.sns &&
                Object.hasOwnProperty.call(e, 'sns') &&
                c.v1.Sns.encode(e.sns, t.uint32(26).fork()).ldelim(),
                null != e.tableOfContents &&
                e.tableOfContents.length
              ) for (var r = 0; r < e.tableOfContents.length; ++r) c.v1.MagazineViewer2Response.Content.encode(e.tableOfContents[r], t.uint32(34).fork()).ldelim();
              return null != e.shioriPage &&
              Object.hasOwnProperty.call(e, 'shioriPage') &&
              t.uint32(40).uint32(e.shioriPage),
              null != e.scroll &&
              Object.hasOwnProperty.call(e, 'scroll') &&
              t.uint32(48).int32(e.scroll),
              null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(58).fork()).ldelim(),
              null != e.isFirstPageBlank &&
              Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
              t.uint32(64).bool(e.isFirstPageBlank),
              null != e.magazineIssue &&
              Object.hasOwnProperty.call(e, 'magazineIssue') &&
              c.v1.MagazineIssue.encode(e.magazineIssue, t.uint32(74).fork()).ldelim(),
              null != e.cashBack &&
              Object.hasOwnProperty.call(e, 'cashBack') &&
              c.v1.UserPoint.encode(e.cashBack, t.uint32(82).fork()).ldelim(),
              null != e.isScreenshotable &&
              Object.hasOwnProperty.call(e, 'isScreenshotable') &&
              t.uint32(88).bool(e.isScreenshotable),
              null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(96).bool(e.hasAppLoggedin),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MagazineViewer2Response;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.pages &&
                    o.pages.length ||
                    (o.pages = []),
                    o.pages.push(c.v1.ViewerPage.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 3:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 4:
                    o.tableOfContents &&
                    o.tableOfContents.length ||
                    (o.tableOfContents = []),
                    o.tableOfContents.push(c.v1.MagazineViewer2Response.Content.decode(e, e.uint32()));
                    break;
                  case 5:
                    o.shioriPage = e.uint32();
                    break;
                  case 6:
                    o.scroll = e.int32();
                    break;
                  case 7:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 8:
                    o.isFirstPageBlank = e.bool();
                    break;
                  case 9:
                    o.magazineIssue = c.v1.MagazineIssue.decode(e, e.uint32());
                    break;
                  case 10:
                    o.cashBack = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 11:
                    o.isScreenshotable = e.bool();
                    break;
                  case 12:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Content = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.startPage = 0,
              e.prototype.mangaName = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.startPage &&
                Object.hasOwnProperty.call(e, 'startPage') &&
                t.uint32(8).uint32(e.startPage),
                null != e.mangaName &&
                Object.hasOwnProperty.call(e, 'mangaName') &&
                t.uint32(18).string(e.mangaName),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.MagazineViewer2Response.Content;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.startPage = e.uint32();
                      break;
                    case 2:
                      o.mangaName = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.ScrollDirection = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'LEFT'] = 0,
              t[e[1] = 'RIGHT'] = 1,
              t
            }(),
            e
          }(),
          e.DeleteMangaHistoryRequest = function () {
            var e = function (e) {
              if (this.mangaIds = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaIds = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.deviceInfo &&
                Object.hasOwnProperty.call(e, 'deviceInfo') &&
                c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
                null != e.mangaIds &&
                e.mangaIds.length
              ) {
                t.uint32(18).fork();
                for (var n = 0; n < e.mangaIds.length; ++n) t.uint32(e.mangaIds[n]);
                t.ldelim()
              }
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteMangaHistoryRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    if (o.mangaIds && o.mangaIds.length || (o.mangaIds = []), 2 === (7 & i)) for (var s = e.uint32() + e.pos; e.pos < s; ) o.mangaIds.push(e.uint32());
                     else o.mangaIds.push(e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.DeleteMangaHistoryResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.DeleteMangaHistoryResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.MangaDetailRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(16).uint32(e.mangaId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaDetailRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaDetailResponse = function () {
            var e = function (e) {
              if (this.chapters = [], this.authorships = [], this.tags = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.manga = null,
            e.prototype.chapters = s.emptyArray,
            e.prototype.authorships = s.emptyArray,
            e.prototype.nextUpdateInfo = '',
            e.prototype.isFavorite = !1,
            e.prototype.tags = s.emptyArray,
            e.prototype.sns = null,
            e.prototype.viewButton = null,
            e.prototype.isCommentEnabled = !1,
            e.prototype.rewardUrl = '',
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.manga &&
                Object.hasOwnProperty.call(e, 'manga') &&
                c.v1.Manga.encode(e.manga, t.uint32(18).fork()).ldelim(),
                null != e.chapters &&
                e.chapters.length
              ) for (var n = 0; n < e.chapters.length; ++n) c.v1.ChapterGroup.encode(e.chapters[n], t.uint32(26).fork()).ldelim();
              if (null != e.authorships && e.authorships.length) for (var r = 0; r < e.authorships.length; ++r) c.v1.Authorship.encode(e.authorships[r], t.uint32(34).fork()).ldelim();
              if (
                null != e.nextUpdateInfo &&
                Object.hasOwnProperty.call(e, 'nextUpdateInfo') &&
                t.uint32(42).string(e.nextUpdateInfo),
                null != e.isFavorite &&
                Object.hasOwnProperty.call(e, 'isFavorite') &&
                t.uint32(48).bool(e.isFavorite),
                null != e.tags &&
                e.tags.length
              ) for (var o = 0; o < e.tags.length; ++o) c.v1.Tag.encode(e.tags[o], t.uint32(58).fork()).ldelim();
              return null != e.sns &&
              Object.hasOwnProperty.call(e, 'sns') &&
              c.v1.Sns.encode(e.sns, t.uint32(66).fork()).ldelim(),
              null != e.viewButton &&
              Object.hasOwnProperty.call(e, 'viewButton') &&
              c.v1.MangaDetailResponse.ViewButton.encode(e.viewButton, t.uint32(74).fork()).ldelim(),
              null != e.isCommentEnabled &&
              Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
              t.uint32(80).bool(e.isCommentEnabled),
              null != e.rewardUrl &&
              Object.hasOwnProperty.call(e, 'rewardUrl') &&
              t.uint32(90).string(e.rewardUrl),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaDetailResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.manga = c.v1.Manga.decode(e, e.uint32());
                    break;
                  case 3:
                    o.chapters &&
                    o.chapters.length ||
                    (o.chapters = []),
                    o.chapters.push(c.v1.ChapterGroup.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.authorships &&
                    o.authorships.length ||
                    (o.authorships = []),
                    o.authorships.push(c.v1.Authorship.decode(e, e.uint32()));
                    break;
                  case 5:
                    o.nextUpdateInfo = e.string();
                    break;
                  case 6:
                    o.isFavorite = e.bool();
                    break;
                  case 7:
                    o.tags &&
                    o.tags.length ||
                    (o.tags = []),
                    o.tags.push(c.v1.Tag.decode(e, e.uint32()));
                    break;
                  case 8:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 9:
                    o.viewButton = c.v1.MangaDetailResponse.ViewButton.decode(e, e.uint32());
                    break;
                  case 10:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 11:
                    o.rewardUrl = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ViewButton = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.chapter = null,
              e.prototype.buttonTitle = '',
              e.prototype.type = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.chapter &&
                Object.hasOwnProperty.call(e, 'chapter') &&
                c.v1.Chapter.encode(e.chapter, t.uint32(10).fork()).ldelim(),
                null != e.buttonTitle &&
                Object.hasOwnProperty.call(e, 'buttonTitle') &&
                t.uint32(18).string(e.buttonTitle),
                null != e.type &&
                Object.hasOwnProperty.call(e, 'type') &&
                t.uint32(24).int32(e.type),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.MangaDetailResponse.ViewButton;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.chapter = c.v1.Chapter.decode(e, e.uint32());
                      break;
                    case 2:
                      o.buttonTitle = e.string();
                      break;
                    case 3:
                      o.type = e.int32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e.ReadButtonType = function () {
                var e = {},
                t = Object.create(e);
                return t[e[0] = 'FIRST'] = 0,
                t[e[1] = 'NEXT'] = 1,
                t[e[2] = 'LAST'] = 2,
                t
              }(),
              e
            }(),
            e
          }(),
          e.MangaFavoriteRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.mangaId = 0,
            e.prototype.favorite = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.mangaId &&
              Object.hasOwnProperty.call(e, 'mangaId') &&
              t.uint32(16).uint32(e.mangaId),
              null != e.favorite &&
              Object.hasOwnProperty.call(e, 'favorite') &&
              t.uint32(24).bool(e.favorite),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaFavoriteRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.mangaId = e.uint32();
                    break;
                  case 3:
                    o.favorite = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaFavoriteResponse = function () {
            var e = function (e) {
              if (this.accomplishedMissions = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.accomplishedMissions = s.emptyArray,
            e.prototype.userPoint = null,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.accomplishedMissions &&
                e.accomplishedMissions.length
              ) for (var n = 0; n < e.accomplishedMissions.length; ++n) c.v1.Mission.encode(e.accomplishedMissions[n], t.uint32(10).fork()).ldelim();
              return null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaFavoriteResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.accomplishedMissions &&
                    o.accomplishedMissions.length ||
                    (o.accomplishedMissions = []),
                    o.accomplishedMissions.push(c.v1.Mission.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.tagId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.tagId &&
              Object.hasOwnProperty.call(e, 'tagId') &&
              t.uint32(16).uint32(e.tagId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.tagId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaListResponse = function () {
            var e = function (e) {
              if (this.mangaWithChapter = [], this.mangaWithBookIssue = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.mangaWithChapter = s.emptyArray,
            e.prototype.mangaWithBookIssue = s.emptyArray,
            e.prototype.tag = null,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.mangaWithChapter &&
                e.mangaWithChapter.length
              ) for (var n = 0; n < e.mangaWithChapter.length; ++n) c.v1.Manga.encode(e.mangaWithChapter[n], t.uint32(10).fork()).ldelim();
              if (null != e.mangaWithBookIssue && e.mangaWithBookIssue.length) for (var r = 0; r < e.mangaWithBookIssue.length; ++r) c.v1.Book.encode(e.mangaWithBookIssue[r], t.uint32(18).fork()).ldelim();
              return null != e.tag &&
              Object.hasOwnProperty.call(e, 'tag') &&
              c.v1.Tag.encode(e.tag, t.uint32(26).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.mangaWithChapter &&
                    o.mangaWithChapter.length ||
                    (o.mangaWithChapter = []),
                    o.mangaWithChapter.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.mangaWithBookIssue &&
                    o.mangaWithBookIssue.length ||
                    (o.mangaWithBookIssue = []),
                    o.mangaWithBookIssue.push(c.v1.Book.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.tag = c.v1.Tag.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaViewerRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.chapterId = 0,
            e.prototype.useTicket = !1,
            e.prototype.consumePoint = null,
            e.prototype.viewerMode = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.chapterId &&
              Object.hasOwnProperty.call(e, 'chapterId') &&
              t.uint32(16).uint32(e.chapterId),
              null != e.useTicket &&
              Object.hasOwnProperty.call(e, 'useTicket') &&
              t.uint32(24).bool(e.useTicket),
              null != e.consumePoint &&
              Object.hasOwnProperty.call(e, 'consumePoint') &&
              c.v1.UserPoint.encode(e.consumePoint, t.uint32(34).fork()).ldelim(),
              null != e.viewerMode &&
              Object.hasOwnProperty.call(e, 'viewerMode') &&
              c.v1.ViewerMode.encode(e.viewerMode, t.uint32(42).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaViewerRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.chapterId = e.uint32();
                    break;
                  case 3:
                    o.useTicket = e.bool();
                    break;
                  case 4:
                    o.consumePoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 5:
                    o.viewerMode = c.v1.ViewerMode.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MangaViewerResponse = function () {
            var e = function (e) {
              if (this.pages = [], this.accomplishedMissions = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.viewerTitle = '',
            e.prototype.pages = s.emptyArray,
            e.prototype.isCommentEnabled = !1,
            e.prototype.sns = null,
            e.prototype.scroll = 0,
            e.prototype.isFirstPageBlank = !1,
            e.prototype.scrollOption = 0,
            e.prototype.mangaId = 0,
            e.prototype.accomplishedMissions = s.emptyArray,
            e.prototype.isScreenshotable = !1,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.viewerTitle &&
                Object.hasOwnProperty.call(e, 'viewerTitle') &&
                t.uint32(18).string(e.viewerTitle),
                null != e.pages &&
                e.pages.length
              ) for (var n = 0; n < e.pages.length; ++n) c.v1.ViewerPage.encode(e.pages[n], t.uint32(26).fork()).ldelim();
              if (
                null != e.isCommentEnabled &&
                Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                t.uint32(32).bool(e.isCommentEnabled),
                null != e.sns &&
                Object.hasOwnProperty.call(e, 'sns') &&
                c.v1.Sns.encode(e.sns, t.uint32(42).fork()).ldelim(),
                null != e.scroll &&
                Object.hasOwnProperty.call(e, 'scroll') &&
                t.uint32(48).int32(e.scroll),
                null != e.isFirstPageBlank &&
                Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
                t.uint32(64).bool(e.isFirstPageBlank),
                null != e.scrollOption &&
                Object.hasOwnProperty.call(e, 'scrollOption') &&
                t.uint32(72).int32(e.scrollOption),
                null != e.mangaId &&
                Object.hasOwnProperty.call(e, 'mangaId') &&
                t.uint32(80).uint32(e.mangaId),
                null != e.accomplishedMissions &&
                e.accomplishedMissions.length
              ) for (var r = 0; r < e.accomplishedMissions.length; ++r) c.v1.Mission.encode(e.accomplishedMissions[r], t.uint32(90).fork()).ldelim();
              return null != e.isScreenshotable &&
              Object.hasOwnProperty.call(e, 'isScreenshotable') &&
              t.uint32(96).bool(e.isScreenshotable),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangaViewerResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.viewerTitle = e.string();
                    break;
                  case 3:
                    o.pages &&
                    o.pages.length ||
                    (o.pages = []),
                    o.pages.push(c.v1.ViewerPage.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 5:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 6:
                    o.scroll = e.int32();
                    break;
                  case 8:
                    o.isFirstPageBlank = e.bool();
                    break;
                  case 9:
                    o.scrollOption = e.int32();
                    break;
                  case 10:
                    o.mangaId = e.uint32();
                    break;
                  case 11:
                    o.accomplishedMissions &&
                    o.accomplishedMissions.length ||
                    (o.accomplishedMissions = []),
                    o.accomplishedMissions.push(c.v1.Mission.decode(e, e.uint32()));
                    break;
                  case 12:
                    o.isScreenshotable = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.ScrollDirection = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'LEFT'] = 0,
              t[e[1] = 'RIGHT'] = 1,
              t[e[2] = 'VERTICAL'] = 2,
              t[e[3] = 'NONE'] = 3,
              t
            }(),
            e
          }(),
          e.MangasByDayOfWeekRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.dayOfWeek = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.dayOfWeek &&
              Object.hasOwnProperty.call(e, 'dayOfWeek') &&
              t.uint32(16).int32(e.dayOfWeek),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangasByDayOfWeekRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.dayOfWeek = e.int32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.DayOfWeek = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'ALL'] = 0,
              t[e[1] = 'MONDAY'] = 1,
              t[e[2] = 'TUESDAY'] = 2,
              t[e[3] = 'WEDNESDAY'] = 3,
              t[e[4] = 'THURSDAY'] = 4,
              t[e[5] = 'FRIDAY'] = 5,
              t[e[6] = 'SATURDAY'] = 6,
              t[e[7] = 'SUNDAY'] = 7,
              t
            }(),
            e
          }(),
          e.MangasByDayOfWeekResponse = function () {
            var e = function (e) {
              if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.mangas = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.mangas && e.mangas.length) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MangasByDayOfWeekResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.mangas &&
                o.mangas.length ||
                (o.mangas = []),
                o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.MissionListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.isCompleted = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.isCompleted &&
              Object.hasOwnProperty.call(e, 'isCompleted') &&
              t.uint32(16).bool(e.isCompleted),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MissionListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.isCompleted = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.MissionListResponse = function () {
            var e = function (e) {
              if (this.missionsByTag = [], this.otherMissions = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.missionsByTag = s.emptyArray,
            e.prototype.otherMissions = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.missionsByTag &&
                e.missionsByTag.length
              ) for (var n = 0; n < e.missionsByTag.length; ++n) c.v1.MissionListResponse.MissionsByTag.encode(e.missionsByTag[n], t.uint32(10).fork()).ldelim();
              if (null != e.otherMissions && e.otherMissions.length) for (var r = 0; r < e.otherMissions.length; ++r) c.v1.Mission.encode(e.otherMissions[r], t.uint32(18).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MissionListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.missionsByTag &&
                    o.missionsByTag.length ||
                    (o.missionsByTag = []),
                    o.missionsByTag.push(c.v1.MissionListResponse.MissionsByTag.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.otherMissions &&
                    o.otherMissions.length ||
                    (o.otherMissions = []),
                    o.otherMissions.push(c.v1.Mission.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.MissionsByTag = function () {
              var e = function (e) {
                if (this.missions = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.tag = null,
              e.prototype.missions = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.tag &&
                  Object.hasOwnProperty.call(e, 'tag') &&
                  c.v1.Tag.encode(e.tag, t.uint32(10).fork()).ldelim(),
                  null != e.missions &&
                  e.missions.length
                ) for (var n = 0; n < e.missions.length; ++n) c.v1.Mission.encode(e.missions[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.MissionListResponse.MissionsByTag;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.tag = c.v1.Tag.decode(e, e.uint32());
                      break;
                    case 2:
                      o.missions &&
                      o.missions.length ||
                      (o.missions = []),
                      o.missions.push(c.v1.Mission.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.MissionList2Request = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MissionList2Request;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.MissionList2Response = function () {
            var e = function (e) {
              if (this.missionsByType = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.missionsByType = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.missionsByType &&
                e.missionsByType.length
              ) for (var n = 0; n < e.missionsByType.length; ++n) c.v1.MissionList2Response.MissionsByType.encode(e.missionsByType[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.MissionList2Response;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.missionsByType &&
                o.missionsByType.length ||
                (o.missionsByType = []),
                o.missionsByType.push(
                  c.v1.MissionList2Response.MissionsByType.decode(e, e.uint32())
                );
                 else e.skipType(7 & i)
              }
              return o
            },
            e.MissionsByType = function () {
              var e = function (e) {
                if (this.missionsByTag = [], this.missionsWithoutTag = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.missionType = 0,
              e.prototype.badge = !1,
              e.prototype.missionsByTag = s.emptyArray,
              e.prototype.missionsWithoutTag = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.missionType &&
                  Object.hasOwnProperty.call(e, 'missionType') &&
                  t.uint32(8).int32(e.missionType),
                  null != e.badge &&
                  Object.hasOwnProperty.call(e, 'badge') &&
                  t.uint32(16).bool(e.badge),
                  null != e.missionsByTag &&
                  e.missionsByTag.length
                ) for (var n = 0; n < e.missionsByTag.length; ++n) c.v1.MissionList2Response.MissionsByTag.encode(e.missionsByTag[n], t.uint32(26).fork()).ldelim();
                if (null != e.missionsWithoutTag && e.missionsWithoutTag.length) for (var r = 0; r < e.missionsWithoutTag.length; ++r) c.v1.MissionList2Response.MissionWithoutTag.encode(e.missionsWithoutTag[r], t.uint32(34).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.MissionList2Response.MissionsByType;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.missionType = e.int32();
                      break;
                    case 2:
                      o.badge = e.bool();
                      break;
                    case 3:
                      o.missionsByTag &&
                      o.missionsByTag.length ||
                      (o.missionsByTag = []),
                      o.missionsByTag.push(c.v1.MissionList2Response.MissionsByTag.decode(e, e.uint32()));
                      break;
                    case 4:
                      o.missionsWithoutTag &&
                      o.missionsWithoutTag.length ||
                      (o.missionsWithoutTag = []),
                      o.missionsWithoutTag.push(
                        c.v1.MissionList2Response.MissionWithoutTag.decode(e, e.uint32())
                      );
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.MissionsByTag = function () {
              var e = function (e) {
                if (this.missions = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.tag = null,
              e.prototype.missions = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.tag &&
                  Object.hasOwnProperty.call(e, 'tag') &&
                  c.v1.Tag.encode(e.tag, t.uint32(10).fork()).ldelim(),
                  null != e.missions &&
                  e.missions.length
                ) for (var n = 0; n < e.missions.length; ++n) c.v1.Mission.encode(e.missions[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.MissionList2Response.MissionsByTag;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.tag = c.v1.Tag.decode(e, e.uint32());
                      break;
                    case 2:
                      o.missions &&
                      o.missions.length ||
                      (o.missions = []),
                      o.missions.push(c.v1.Mission.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.MissionWithoutTag = function () {
              var e = function (e) {
                if (this.missions = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.missionCategory = 0,
              e.prototype.missions = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.missionCategory &&
                  Object.hasOwnProperty.call(e, 'missionCategory') &&
                  t.uint32(8).int32(e.missionCategory),
                  null != e.missions &&
                  e.missions.length
                ) for (var n = 0; n < e.missions.length; ++n) c.v1.Mission.encode(e.missions[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.MissionList2Response.MissionWithoutTag;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.missionCategory = e.int32();
                      break;
                    case 2:
                      o.missions &&
                      o.missions.length ||
                      (o.missions = []),
                      o.missions.push(c.v1.Mission.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.MissionType = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'NORMAL'] = 0,
              t[e[1] = 'LIMITED_TIME'] = 1,
              t[e[2] = 'COMPLETED'] = 2,
              t
            }(),
            e.MissionCategory = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'DAILY'] = 0,
              t[e[1] = 'WEEK'] = 1,
              t[e[2] = 'NONE'] = 2,
              t
            }(),
            e
          }(),
          e.NewsRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.NewsRequest; e.pos < n; ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.NewsResponse = function () {
            var e = function (e) {
              if (this.news = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.news = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.news && e.news.length) for (var n = 0; n < e.news.length; ++n) c.v1.News.encode(e.news[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.NewsResponse; e.pos < n; ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.news &&
                o.news.length ||
                (o.news = []),
                o.news.push(c.v1.News.decode(e, e.uint32()));
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PasswordChangeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.currentPassword = '',
            e.prototype.newPassword = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.currentPassword &&
              Object.hasOwnProperty.call(e, 'currentPassword') &&
              t.uint32(18).string(e.currentPassword),
              null != e.newPassword &&
              Object.hasOwnProperty.call(e, 'newPassword') &&
              t.uint32(26).string(e.newPassword),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PasswordChangeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.currentPassword = e.string();
                    break;
                  case 3:
                    o.newPassword = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PasswordChangeResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PasswordChangeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PasswordResetRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.email = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.email &&
              Object.hasOwnProperty.call(e, 'email') &&
              t.uint32(18).string(e.email),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PasswordResetRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.email = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PasswordResetResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PasswordResetResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PasswordResetCompleteRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.token = '',
            e.prototype.password = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.token &&
              Object.hasOwnProperty.call(e, 'token') &&
              t.uint32(18).string(e.token),
              null != e.password &&
              Object.hasOwnProperty.call(e, 'password') &&
              t.uint32(26).string(e.password),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PasswordResetCompleteRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.token = e.string();
                    break;
                  case 3:
                    o.password = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PasswordResetCompleteResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.error = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.error &&
              Object.hasOwnProperty.call(e, 'error') &&
              c.v1.Error.encode(e.error, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PasswordResetCompleteResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.error = c.v1.Error.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PurchaseOnPlayStoreRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.receipt = '',
            e.prototype.signature = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.receipt &&
              Object.hasOwnProperty.call(e, 'receipt') &&
              t.uint32(18).string(e.receipt),
              null != e.signature &&
              Object.hasOwnProperty.call(e, 'signature') &&
              t.uint32(26).string(e.signature),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseOnPlayStoreRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.receipt = e.string();
                    break;
                  case 3:
                    o.signature = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseOnPlayStoreResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.result = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.result &&
              Object.hasOwnProperty.call(e, 'result') &&
              t.uint32(8).int32(e.result),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseOnPlayStoreResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.result = e.int32();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.RestoreSubscriptionOnPlayStoreRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.receipt = '',
            e.prototype.signature = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.receipt &&
              Object.hasOwnProperty.call(e, 'receipt') &&
              t.uint32(18).string(e.receipt),
              null != e.signature &&
              Object.hasOwnProperty.call(e, 'signature') &&
              t.uint32(26).string(e.signature),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RestoreSubscriptionOnPlayStoreRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.receipt = e.string();
                    break;
                  case 3:
                    o.signature = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.RestoreSubscriptionOnPlayStoreResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.result = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.result &&
              Object.hasOwnProperty.call(e, 'result') &&
              t.uint32(8).int32(e.result),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RestoreSubscriptionOnPlayStoreResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.result = e.int32();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PointRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.PointRequest; e.pos < n; ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PointResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PointResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PointHistoryRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PointHistoryRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.ExpiredPointHistoryRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ExpiredPointHistoryRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PointHistoryResponse = function () {
            var e = function (e) {
              if (this.logs = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.logs = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.logs &&
                e.logs.length
              ) for (var n = 0; n < e.logs.length; ++n) c.v1.PointHistory.encode(e.logs[n], t.uint32(18).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PointHistoryResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.logs &&
                    o.logs.length ||
                    (o.logs = []),
                    o.logs.push(c.v1.PointHistory.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ExpiredPointHistoryResponse = function () {
            var e = function (e) {
              if (this.logs = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.logs = s.emptyArray,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.logs &&
                e.logs.length
              ) for (var n = 0; n < e.logs.length; ++n) c.v1.ExpiredPointHistory.encode(e.logs[n], t.uint32(18).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ExpiredPointHistoryResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.logs &&
                    o.logs.length ||
                    (o.logs = []),
                    o.logs.push(c.v1.ExpiredPointHistory.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PrefetchMangaViewerRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.viewerMode = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.viewerMode &&
              Object.hasOwnProperty.call(e, 'viewerMode') &&
              c.v1.ViewerMode.encode(e.viewerMode, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PrefetchMangaViewerRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.viewerMode = c.v1.ViewerMode.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PrefetchMangaViewerResponse = function () {
            var e = function (e) {
              if (this.pages = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.pages = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.pages && e.pages.length) for (var n = 0; n < e.pages.length; ++n) c.v1.ViewerPage.encode(e.pages[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PrefetchMangaViewerResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.pages &&
                o.pages.length ||
                (o.pages = []),
                o.pages.push(c.v1.ViewerPage.decode(e, e.uint32()));
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PurchaseBookIssueRequest = function () {
            var e = function (e) {
              if (this.bookIssueIds = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.bookIssueIds = s.emptyArray,
            e.prototype.consumePaidPoint = 0,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.deviceInfo &&
                Object.hasOwnProperty.call(e, 'deviceInfo') &&
                c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
                null != e.bookIssueIds &&
                e.bookIssueIds.length
              ) {
                t.uint32(18).fork();
                for (var n = 0; n < e.bookIssueIds.length; ++n) t.uint32(e.bookIssueIds[n]);
                t.ldelim()
              }
              return null != e.consumePaidPoint &&
              Object.hasOwnProperty.call(e, 'consumePaidPoint') &&
              t.uint32(24).uint32(e.consumePaidPoint),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseBookIssueRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    if (
                      o.bookIssueIds &&
                      o.bookIssueIds.length ||
                      (o.bookIssueIds = []),
                      2 === (7 & i)
                    ) for (var s = e.uint32() + e.pos; e.pos < s; ) o.bookIssueIds.push(e.uint32());
                     else o.bookIssueIds.push(e.uint32());
                    break;
                  case 3:
                    o.consumePaidPoint = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseBookIssueResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.cashBack = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
              null != e.cashBack &&
              Object.hasOwnProperty.call(e, 'cashBack') &&
              c.v1.UserPoint.encode(e.cashBack, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseBookIssueResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.cashBack = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseMagazineIssueRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.magazineIssueId = 0,
            e.prototype.consumePaidPoint = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.magazineIssueId &&
              Object.hasOwnProperty.call(e, 'magazineIssueId') &&
              t.uint32(16).uint32(e.magazineIssueId),
              null != e.consumePaidPoint &&
              Object.hasOwnProperty.call(e, 'consumePaidPoint') &&
              t.uint32(24).uint32(e.consumePaidPoint),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseMagazineIssueRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.magazineIssueId = e.uint32();
                    break;
                  case 3:
                    o.consumePaidPoint = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseMagazineIssueResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseMagazineIssueResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PushNotificationListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PushNotificationListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PushNotificationListResponse = function () {
            var e = function (e) {
              if (this.items = [], this.itemGroup = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.items = s.emptyArray,
            e.prototype.itemGroup = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.items && e.items.length) for (var n = 0; n < e.items.length; ++n) c.v1.NotificationItem.encode(e.items[n], t.uint32(10).fork()).ldelim();
              if (null != e.itemGroup && e.itemGroup.length) for (var r = 0; r < e.itemGroup.length; ++r) c.v1.PushNotificationListResponse.NotificationItemGroup.encode(e.itemGroup[r], t.uint32(18).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PushNotificationListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.items &&
                    o.items.length ||
                    (o.items = []),
                    o.items.push(c.v1.NotificationItem.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.itemGroup &&
                    o.itemGroup.length ||
                    (o.itemGroup = []),
                    o.itemGroup.push(
                      c.v1.PushNotificationListResponse.NotificationItemGroup.decode(e, e.uint32())
                    );
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.NotificationItemGroup = function () {
              var e = function (e) {
                if (this.items = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.headerName = '',
              e.prototype.items = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.headerName &&
                  Object.hasOwnProperty.call(e, 'headerName') &&
                  t.uint32(10).string(e.headerName),
                  null != e.items &&
                  e.items.length
                ) for (var n = 0; n < e.items.length; ++n) c.v1.NotificationItem.encode(e.items[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.PushNotificationListResponse.NotificationItemGroup;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.headerName = e.string();
                      break;
                    case 2:
                      o.items &&
                      o.items.length ||
                      (o.items = []),
                      o.items.push(c.v1.NotificationItem.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.PushNotificationUpdateRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.pushId = 0,
            e.prototype.pushStatus = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.pushId &&
              Object.hasOwnProperty.call(e, 'pushId') &&
              t.uint32(16).uint32(e.pushId),
              null != e.pushStatus &&
              Object.hasOwnProperty.call(e, 'pushStatus') &&
              t.uint32(24).bool(e.pushStatus),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PushNotificationUpdateRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.pushId = e.uint32();
                    break;
                  case 3:
                    o.pushStatus = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PushNotificationUpdateResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PushNotificationUpdateResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.RegisterRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.deviceToken = '',
            e.prototype.securityKey = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.deviceToken &&
              Object.hasOwnProperty.call(e, 'deviceToken') &&
              t.uint32(18).string(e.deviceToken),
              null != e.securityKey &&
              Object.hasOwnProperty.call(e, 'securityKey') &&
              t.uint32(26).string(e.securityKey),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RegisterRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.deviceToken = e.string();
                    break;
                  case 3:
                    o.securityKey = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.RegisterResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.RegisterResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.PurchaseBillingItemOnSbpsRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.itemId = '',
            e.prototype.token = '',
            e.prototype.tokenKey = '',
            e.prototype.custManageFlg = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseBillingItemOnSbpsRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.itemId = e.string();
                    break;
                  case 2:
                    o.token = e.string();
                    break;
                  case 3:
                    o.tokenKey = e.string();
                    break;
                  case 4:
                    o.custManageFlg = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseBillingItemOnSbpsResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.result = 0,
            e.prototype.errorMessage = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.result &&
              Object.hasOwnProperty.call(e, 'result') &&
              t.uint32(8).int32(e.result),
              null != e.errorMessage &&
              Object.hasOwnProperty.call(e, 'errorMessage') &&
              t.uint32(18).string(e.errorMessage),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseBillingItemOnSbpsResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.result = e.int32();
                    break;
                  case 2:
                    o.errorMessage = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseSubscriptionItemOnSbpsRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.itemId = '',
            e.prototype.token = '',
            e.prototype.tokenKey = '',
            e.prototype.custManageFlg = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseSubscriptionItemOnSbpsRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.itemId = e.string();
                    break;
                  case 2:
                    o.token = e.string();
                    break;
                  case 3:
                    o.tokenKey = e.string();
                    break;
                  case 4:
                    o.custManageFlg = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.PurchaseSubscriptionItemOnSbpsResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.result = 0,
            e.prototype.errorMessage = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.result &&
              Object.hasOwnProperty.call(e, 'result') &&
              t.uint32(8).int32(e.result),
              null != e.errorMessage &&
              Object.hasOwnProperty.call(e, 'errorMessage') &&
              t.uint32(18).string(e.errorMessage),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.PurchaseSubscriptionItemOnSbpsResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.result = e.int32();
                    break;
                  case 2:
                    o.errorMessage = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ChangeSubscriptionItemOnSbpsRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.itemId = '',
            e.prototype.token = '',
            e.prototype.tokenKey = '',
            e.prototype.custManageFlg = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ChangeSubscriptionItemOnSbpsRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.itemId = e.string();
                    break;
                  case 2:
                    o.token = e.string();
                    break;
                  case 3:
                    o.tokenKey = e.string();
                    break;
                  case 4:
                    o.custManageFlg = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ChangeSubscriptionItemOnSbpsResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.result = 0,
            e.prototype.errorMessage = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.result &&
              Object.hasOwnProperty.call(e, 'result') &&
              t.uint32(8).int32(e.result),
              null != e.errorMessage &&
              Object.hasOwnProperty.call(e, 'errorMessage') &&
              t.uint32(18).string(e.errorMessage),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ChangeSubscriptionItemOnSbpsResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.result = e.int32();
                    break;
                  case 2:
                    o.errorMessage = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SbpsSubscriptionCancelRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.productId = '',
            e.prototype.continue = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.productId &&
              Object.hasOwnProperty.call(e, 'productId') &&
              t.uint32(18).string(e.productId),
              null != e.continue &&
              Object.hasOwnProperty.call(e, 'continue') &&
              t.uint32(24).bool(e.continue),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SbpsSubscriptionCancelRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.productId = e.string();
                    break;
                  case 3:
                    o.continue = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SbpsSubscriptionCancelResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.result = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.result &&
              Object.hasOwnProperty.call(e, 'result') &&
              t.uint32(8).bool(e.result),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SbpsSubscriptionCancelResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.result = e.bool();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.SearchRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.query = '',
            e.prototype.pageIndexOfMangas = 0,
            e.prototype.pageIndexOfBooks = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.query &&
              Object.hasOwnProperty.call(e, 'query') &&
              t.uint32(18).string(e.query),
              null != e.pageIndexOfMangas &&
              Object.hasOwnProperty.call(e, 'pageIndexOfMangas') &&
              t.uint32(32).uint32(e.pageIndexOfMangas),
              null != e.pageIndexOfBooks &&
              Object.hasOwnProperty.call(e, 'pageIndexOfBooks') &&
              t.uint32(40).uint32(e.pageIndexOfBooks),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SearchRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.query = e.string();
                    break;
                  case 4:
                    o.pageIndexOfMangas = e.uint32();
                    break;
                  case 5:
                    o.pageIndexOfBooks = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SearchResponse = function () {
            var e,
            t = function (e) {
              if (
                this.suggests = [],
                this.mangas = [],
                this.books = [],
                this.mangasByTags = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.suggests = s.emptyArray,
            t.prototype.mangas = s.emptyArray,
            t.prototype.books = s.emptyArray,
            t.prototype.magazineList = null,
            t.prototype.magazineIssueList = null,
            t.prototype.pageCountOfMangas = 0,
            t.prototype.pageCountOfBooks = 0,
            t.prototype.mangasByTags = s.emptyArray,
            Object.defineProperty(
              t.prototype,
              'searchResultsForMagazines',
              {
                get: s.oneOfGetter(e = [
                  'magazineList',
                  'magazineIssueList'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              if (t || (t = i.create()), null != e.suggests && e.suggests.length) for (var n = 0; n < e.suggests.length; ++n) c.v1.SearchResponse.Suggest.encode(e.suggests[n], t.uint32(10).fork()).ldelim();
              if (null != e.mangas && e.mangas.length) for (var r = 0; r < e.mangas.length; ++r) c.v1.Manga.encode(e.mangas[r], t.uint32(18).fork()).ldelim();
              if (null != e.books && e.books.length) for (var o = 0; o < e.books.length; ++o) c.v1.Book.encode(e.books[o], t.uint32(26).fork()).ldelim();
              if (
                null != e.magazineList &&
                Object.hasOwnProperty.call(e, 'magazineList') &&
                c.v1.SearchResponse.MagazineList.encode(e.magazineList, t.uint32(34).fork()).ldelim(),
                null != e.magazineIssueList &&
                Object.hasOwnProperty.call(e, 'magazineIssueList') &&
                c.v1.SearchResponse.MagazineIssueList.encode(e.magazineIssueList, t.uint32(42).fork()).ldelim(),
                null != e.pageCountOfMangas &&
                Object.hasOwnProperty.call(e, 'pageCountOfMangas') &&
                t.uint32(48).uint32(e.pageCountOfMangas),
                null != e.pageCountOfBooks &&
                Object.hasOwnProperty.call(e, 'pageCountOfBooks') &&
                t.uint32(56).uint32(e.pageCountOfBooks),
                null != e.mangasByTags &&
                e.mangasByTags.length
              ) for (var a = 0; a < e.mangasByTags.length; ++a) c.v1.SearchResponse.MangasByTag.encode(e.mangasByTags[a], t.uint32(66).fork()).ldelim();
              return t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SearchResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.suggests &&
                    o.suggests.length ||
                    (o.suggests = []),
                    o.suggests.push(c.v1.SearchResponse.Suggest.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.mangas &&
                    o.mangas.length ||
                    (o.mangas = []),
                    o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.books &&
                    o.books.length ||
                    (o.books = []),
                    o.books.push(c.v1.Book.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.magazineList = c.v1.SearchResponse.MagazineList.decode(e, e.uint32());
                    break;
                  case 5:
                    o.magazineIssueList = c.v1.SearchResponse.MagazineIssueList.decode(e, e.uint32());
                    break;
                  case 6:
                    o.pageCountOfMangas = e.uint32();
                    break;
                  case 7:
                    o.pageCountOfBooks = e.uint32();
                    break;
                  case 8:
                    o.mangasByTags &&
                    o.mangasByTags.length ||
                    (o.mangasByTags = []),
                    o.mangasByTags.push(c.v1.SearchResponse.MangasByTag.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.Suggest = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.keyword = '',
              e.prototype.mangaId = 0,
              e.prototype.mangaName = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
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
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.SearchResponse.Suggest;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.keyword = e.string();
                      break;
                    case 2:
                      o.mangaId = e.uint32();
                      break;
                    case 3:
                      o.mangaName = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t.MagazineList = function () {
              var e = function (e) {
                if (this.magazines = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.magazines = s.emptyArray,
              e.encode = function (e, t) {
                if (t || (t = i.create()), null != e.magazines && e.magazines.length) for (var n = 0; n < e.magazines.length; ++n) c.v1.Magazine.encode(e.magazines[n], t.uint32(10).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.SearchResponse.MagazineList;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.magazines &&
                  o.magazines.length ||
                  (o.magazines = []),
                  o.magazines.push(c.v1.Magazine.decode(e, e.uint32()));
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            t.MagazineIssueList = function () {
              var e = function (e) {
                if (this.magazineIssues = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.magazineIssues = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.magazineIssues &&
                  e.magazineIssues.length
                ) for (var n = 0; n < e.magazineIssues.length; ++n) c.v1.MagazineIssue.encode(e.magazineIssues[n], t.uint32(10).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.SearchResponse.MagazineIssueList;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.magazineIssues &&
                  o.magazineIssues.length ||
                  (o.magazineIssues = []),
                  o.magazineIssues.push(c.v1.MagazineIssue.decode(e, e.uint32()));
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            t.MangasByTag = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.tag = null,
              e.prototype.mangas = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.tag &&
                  Object.hasOwnProperty.call(e, 'tag') &&
                  c.v1.Tag.encode(e.tag, t.uint32(10).fork()).ldelim(),
                  null != e.mangas &&
                  e.mangas.length
                ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.SearchResponse.MangasByTag;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.tag = c.v1.Tag.decode(e, e.uint32());
                      break;
                    case 2:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t
          }(),
          e.ShelfRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.ShelfRequest; e.pos < n; ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.ShelfResponse = function () {
            var e = function (e) {
              if (
                this.historyMangas = [],
                this.favoriteUpdatedMangas = [],
                this.favoriteOtherMangas = [],
                this.purchasedMagazines = [],
                this.purchasedBooks = [],
                this.wishBookIssues = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.historyMangas = s.emptyArray,
            e.prototype.favoriteUpdatedMangas = s.emptyArray,
            e.prototype.favoriteOtherMangas = s.emptyArray,
            e.prototype.purchasedMagazines = s.emptyArray,
            e.prototype.purchasedBooks = s.emptyArray,
            e.prototype.wishBookIssues = s.emptyArray,
            e.prototype.hasAppLoggedin = !1,
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.historyMangas &&
                e.historyMangas.length
              ) for (var n = 0; n < e.historyMangas.length; ++n) c.v1.Manga.encode(e.historyMangas[n], t.uint32(18).fork()).ldelim();
              if (
                null != e.favoriteUpdatedMangas &&
                e.favoriteUpdatedMangas.length
              ) for (var r = 0; r < e.favoriteUpdatedMangas.length; ++r) c.v1.Manga.encode(e.favoriteUpdatedMangas[r], t.uint32(26).fork()).ldelim();
              if (null != e.favoriteOtherMangas && e.favoriteOtherMangas.length) for (var o = 0; o < e.favoriteOtherMangas.length; ++o) c.v1.Manga.encode(e.favoriteOtherMangas[o], t.uint32(34).fork()).ldelim();
              if (null != e.purchasedMagazines && e.purchasedMagazines.length) for (var a = 0; a < e.purchasedMagazines.length; ++a) c.v1.Magazine.encode(e.purchasedMagazines[a], t.uint32(42).fork()).ldelim();
              if (null != e.purchasedBooks && e.purchasedBooks.length) for (var s = 0; s < e.purchasedBooks.length; ++s) c.v1.Book.encode(e.purchasedBooks[s], t.uint32(50).fork()).ldelim();
              if (null != e.wishBookIssues && e.wishBookIssues.length) for (var u = 0; u < e.wishBookIssues.length; ++u) c.v1.BookIssue.encode(e.wishBookIssues[u], t.uint32(58).fork()).ldelim();
              return null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(64).bool(e.hasAppLoggedin),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ShelfResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.historyMangas &&
                    o.historyMangas.length ||
                    (o.historyMangas = []),
                    o.historyMangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.favoriteUpdatedMangas &&
                    o.favoriteUpdatedMangas.length ||
                    (o.favoriteUpdatedMangas = []),
                    o.favoriteUpdatedMangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.favoriteOtherMangas &&
                    o.favoriteOtherMangas.length ||
                    (o.favoriteOtherMangas = []),
                    o.favoriteOtherMangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 5:
                    o.purchasedMagazines &&
                    o.purchasedMagazines.length ||
                    (o.purchasedMagazines = []),
                    o.purchasedMagazines.push(c.v1.Magazine.decode(e, e.uint32()));
                    break;
                  case 6:
                    o.purchasedBooks &&
                    o.purchasedBooks.length ||
                    (o.purchasedBooks = []),
                    o.purchasedBooks.push(c.v1.Book.decode(e, e.uint32()));
                    break;
                  case 7:
                    o.wishBookIssues &&
                    o.wishBookIssues.length ||
                    (o.wishBookIssues = []),
                    o.wishBookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                    break;
                  case 8:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SignInRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.email = '',
            e.prototype.password = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.email &&
              Object.hasOwnProperty.call(e, 'email') &&
              t.uint32(18).string(e.email),
              null != e.password &&
              Object.hasOwnProperty.call(e, 'password') &&
              t.uint32(26).string(e.password),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SignInRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.email = e.string();
                    break;
                  case 3:
                    o.password = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SignInResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.success = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.success &&
              Object.hasOwnProperty.call(e, 'success') &&
              t.uint32(8).bool(e.success),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SignInResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.success = e.bool();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.SignOutRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SignOutRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.SignOutResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SignOutResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.SignUpRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.email = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.email &&
              Object.hasOwnProperty.call(e, 'email') &&
              t.uint32(18).string(e.email),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SignUpRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.email = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SignUpResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.success = !1,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.success &&
              Object.hasOwnProperty.call(e, 'success') &&
              t.uint32(8).bool(e.success),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SignUpResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.success = e.bool();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.SignUpCompleteRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.token = '',
            e.prototype.password = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.token &&
              Object.hasOwnProperty.call(e, 'token') &&
              t.uint32(18).string(e.token),
              null != e.password &&
              Object.hasOwnProperty.call(e, 'password') &&
              t.uint32(26).string(e.password),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SignUpCompleteRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.token = e.string();
                    break;
                  case 3:
                    o.password = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SignUpCompleteResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.error = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.error &&
              Object.hasOwnProperty.call(e, 'error') &&
              c.v1.Error.encode(e.error, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SignUpCompleteResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.error = c.v1.Error.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.SpecialRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.specialId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.specialId &&
              Object.hasOwnProperty.call(e, 'specialId') &&
              t.uint32(16).uint32(e.specialId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SpecialRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.specialId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.SpecialResponse = function () {
            var e = function (e) {
              if (this.images = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.images = s.emptyArray,
            e.prototype.name = '',
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.images && e.images.length) for (var n = 0; n < e.images.length; ++n) c.v1.SpecialImage.encode(e.images[n], t.uint32(10).fork()).ldelim();
              return null != e.name &&
              Object.hasOwnProperty.call(e, 'name') &&
              t.uint32(18).string(e.name),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SpecialResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.images &&
                    o.images.length ||
                    (o.images = []),
                    o.images.push(c.v1.SpecialImage.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.name = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.StoreRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.StoreRequest; e.pos < n; ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.StoreResponse = function () {
            var e = function (e) {
              if (
                this.topBanners = [],
                this.newBookIssues = [],
                this.newMagazineIssues = [],
                this.rankingBookIssues = [],
                this.booksByTagList = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.topBanners = s.emptyArray,
            e.prototype.newBookIssues = s.emptyArray,
            e.prototype.newMagazineIssueBanner = null,
            e.prototype.newMagazineIssues = s.emptyArray,
            e.prototype.rankingBookIssues = s.emptyArray,
            e.prototype.booksByTagList = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.topBanners && e.topBanners.length) for (var n = 0; n < e.topBanners.length; ++n) c.v1.Banner.encode(e.topBanners[n], t.uint32(10).fork()).ldelim();
              if (null != e.newBookIssues && e.newBookIssues.length) for (var r = 0; r < e.newBookIssues.length; ++r) c.v1.BookIssue.encode(e.newBookIssues[r], t.uint32(18).fork()).ldelim();
              if (
                null != e.newMagazineIssueBanner &&
                Object.hasOwnProperty.call(e, 'newMagazineIssueBanner') &&
                c.v1.Banner.encode(e.newMagazineIssueBanner, t.uint32(26).fork()).ldelim(),
                null != e.newMagazineIssues &&
                e.newMagazineIssues.length
              ) for (var o = 0; o < e.newMagazineIssues.length; ++o) c.v1.MagazineIssue.encode(e.newMagazineIssues[o], t.uint32(34).fork()).ldelim();
              if (null != e.rankingBookIssues && e.rankingBookIssues.length) for (var a = 0; a < e.rankingBookIssues.length; ++a) c.v1.BookIssue.encode(e.rankingBookIssues[a], t.uint32(42).fork()).ldelim();
              if (null != e.booksByTagList && e.booksByTagList.length) for (var s = 0; s < e.booksByTagList.length; ++s) c.v1.StoreResponse.BooksByTag.encode(e.booksByTagList[s], t.uint32(50).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.StoreResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.topBanners &&
                    o.topBanners.length ||
                    (o.topBanners = []),
                    o.topBanners.push(c.v1.Banner.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.newBookIssues &&
                    o.newBookIssues.length ||
                    (o.newBookIssues = []),
                    o.newBookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.newMagazineIssueBanner = c.v1.Banner.decode(e, e.uint32());
                    break;
                  case 4:
                    o.newMagazineIssues &&
                    o.newMagazineIssues.length ||
                    (o.newMagazineIssues = []),
                    o.newMagazineIssues.push(c.v1.MagazineIssue.decode(e, e.uint32()));
                    break;
                  case 5:
                    o.rankingBookIssues &&
                    o.rankingBookIssues.length ||
                    (o.rankingBookIssues = []),
                    o.rankingBookIssues.push(c.v1.BookIssue.decode(e, e.uint32()));
                    break;
                  case 6:
                    o.booksByTagList &&
                    o.booksByTagList.length ||
                    (o.booksByTagList = []),
                    o.booksByTagList.push(c.v1.StoreResponse.BooksByTag.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.BooksByTag = function () {
              var e = function (e) {
                if (this.books = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.tag = null,
              e.prototype.books = s.emptyArray,
              e.prototype.thumbnailUrl = '',
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.tag &&
                  Object.hasOwnProperty.call(e, 'tag') &&
                  c.v1.Tag.encode(e.tag, t.uint32(10).fork()).ldelim(),
                  null != e.books &&
                  e.books.length
                ) for (var n = 0; n < e.books.length; ++n) c.v1.Book.encode(e.books[n], t.uint32(18).fork()).ldelim();
                return null != e.thumbnailUrl &&
                Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                t.uint32(26).string(e.thumbnailUrl),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.StoreResponse.BooksByTag;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.tag = c.v1.Tag.decode(e, e.uint32());
                      break;
                    case 2:
                      o.books &&
                      o.books.length ||
                      (o.books = []),
                      o.books.push(c.v1.Book.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.thumbnailUrl = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.SubscriptionItemListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SubscriptionItemListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.SubscriptionItemListResponse = function () {
            var e = function (e) {
              if (this.courses = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.userPoint = null,
            e.prototype.topBanner = null,
            e.prototype.courses = s.emptyArray,
            e.prototype.webTopBannerSp = null,
            e.prototype.annualPriceText = '',
            e.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.topBanner &&
                Object.hasOwnProperty.call(e, 'topBanner') &&
                c.v1.Banner.encode(e.topBanner, t.uint32(18).fork()).ldelim(),
                null != e.courses &&
                e.courses.length
              ) for (var n = 0; n < e.courses.length; ++n) c.v1.SubscriptionCourse.encode(e.courses[n], t.uint32(26).fork()).ldelim();
              return null != e.webTopBannerSp &&
              Object.hasOwnProperty.call(e, 'webTopBannerSp') &&
              c.v1.Banner.encode(e.webTopBannerSp, t.uint32(34).fork()).ldelim(),
              null != e.annualPriceText &&
              Object.hasOwnProperty.call(e, 'annualPriceText') &&
              t.uint32(42).string(e.annualPriceText),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.SubscriptionItemListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.topBanner = c.v1.Banner.decode(e, e.uint32());
                    break;
                  case 3:
                    o.courses &&
                    o.courses.length ||
                    (o.courses = []),
                    o.courses.push(c.v1.SubscriptionCourse.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.webTopBannerSp = c.v1.Banner.decode(e, e.uint32());
                    break;
                  case 5:
                    o.annualPriceText = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.TrackingRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.TrackingRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.TrackingResponse = function () {
            var e = function (e) {
              if (this.events = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.events = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.events && e.events.length) for (var n = 0; n < e.events.length; ++n) c.v1.TrackingResponse.TrackingEvent.encode(e.events[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.TrackingResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.events &&
                o.events.length ||
                (o.events = []),
                o.events.push(c.v1.TrackingResponse.TrackingEvent.decode(e, e.uint32()));
                 else e.skipType(7 & i)
              }
              return o
            },
            e.TrackingEvent = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.appsflyer = !1,
              e.prototype.firebase = !1,
              e.prototype.name = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
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
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.TrackingResponse.TrackingEvent;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.appsflyer = e.bool();
                      break;
                    case 2:
                      o.firebase = e.bool();
                      break;
                    case 3:
                      o.name = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.WebBillingItemInfoRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.productId = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.productId &&
              Object.hasOwnProperty.call(e, 'productId') &&
              t.uint32(10).string(e.productId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebBillingItemInfoRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.productId = e.string();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebBillingItemInfoResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.item = null,
            e.prototype.creditCard = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.item &&
              Object.hasOwnProperty.call(e, 'item') &&
              c.v1.BillingItem.encode(e.item, t.uint32(10).fork()).ldelim(),
              null != e.creditCard &&
              Object.hasOwnProperty.call(e, 'creditCard') &&
              c.v1.WebBillingItemInfoResponse.CreditCard.encode(e.creditCard, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebBillingItemInfoResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.item = c.v1.BillingItem.decode(e, e.uint32());
                    break;
                  case 2:
                    o.creditCard = c.v1.WebBillingItemInfoResponse.CreditCard.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.CreditCard = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.cardNumber = '',
              e.prototype.cardExpiration = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.cardNumber &&
                Object.hasOwnProperty.call(e, 'cardNumber') &&
                t.uint32(10).string(e.cardNumber),
                null != e.cardExpiration &&
                Object.hasOwnProperty.call(e, 'cardExpiration') &&
                t.uint32(18).string(e.cardExpiration),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebBillingItemInfoResponse.CreditCard;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.cardNumber = e.string();
                      break;
                    case 2:
                      o.cardExpiration = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.WebChangeSettlementRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.productId = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.productId &&
              Object.hasOwnProperty.call(e, 'productId') &&
              t.uint32(10).string(e.productId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebChangeSettlementRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.productId = e.string();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebChangeSettlementResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.item = null,
            e.prototype.settlement = 0,
            e.prototype.ccNumber = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.item &&
              Object.hasOwnProperty.call(e, 'item') &&
              c.v1.SubscriptionItem.encode(e.item, t.uint32(10).fork()).ldelim(),
              null != e.settlement &&
              Object.hasOwnProperty.call(e, 'settlement') &&
              t.uint32(16).int32(e.settlement),
              null != e.ccNumber &&
              Object.hasOwnProperty.call(e, 'ccNumber') &&
              t.uint32(26).string(e.ccNumber),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebChangeSettlementResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.item = c.v1.SubscriptionItem.decode(e, e.uint32());
                    break;
                  case 2:
                    o.settlement = e.int32();
                    break;
                  case 3:
                    o.ccNumber = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.Settlement = function () {
              var e = {},
              t = Object.create(e);
              return t[e[0] = 'AU'] = 0,
              t[e[1] = 'DOCOMO'] = 1,
              t[e[2] = 'SOFTBANK'] = 2,
              t[e[3] = 'CREDIT'] = 3,
              t
            }(),
            e
          }(),
          e.WebHomeRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebHomeRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebHomeResponse = function () {
            var e = function (e) {
              if (
                this.topBanners = [],
                this.updatedMangas = [],
                this.rankings = [],
                this.mangasByTagList = [],
                e
              ) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.topBanners = s.emptyArray,
            e.prototype.updatedMangas = s.emptyArray,
            e.prototype.rankings = s.emptyArray,
            e.prototype.mangasByTagList = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.topBanners && e.topBanners.length) for (var n = 0; n < e.topBanners.length; ++n) c.v1.Banner.encode(e.topBanners[n], t.uint32(10).fork()).ldelim();
              if (null != e.updatedMangas && e.updatedMangas.length) for (var r = 0; r < e.updatedMangas.length; ++r) c.v1.Manga.encode(e.updatedMangas[r], t.uint32(18).fork()).ldelim();
              if (null != e.rankings && e.rankings.length) for (var o = 0; o < e.rankings.length; ++o) c.v1.Manga.encode(e.rankings[o], t.uint32(26).fork()).ldelim();
              if (null != e.mangasByTagList && e.mangasByTagList.length) for (var a = 0; a < e.mangasByTagList.length; ++a) c.v1.WebHomeResponse.MangasByTag.encode(e.mangasByTagList[a], t.uint32(34).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebHomeResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.topBanners &&
                    o.topBanners.length ||
                    (o.topBanners = []),
                    o.topBanners.push(c.v1.Banner.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.updatedMangas &&
                    o.updatedMangas.length ||
                    (o.updatedMangas = []),
                    o.updatedMangas.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.rankings &&
                    o.rankings.length ||
                    (o.rankings = []),
                    o.rankings.push(c.v1.Manga.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.mangasByTagList &&
                    o.mangasByTagList.length ||
                    (o.mangasByTagList = []),
                    o.mangasByTagList.push(c.v1.WebHomeResponse.MangasByTag.decode(e, e.uint32()));
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.MangasByTag = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.tag = null,
              e.prototype.mangas = s.emptyArray,
              e.prototype.thumbnailUrl = '',
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.tag &&
                  Object.hasOwnProperty.call(e, 'tag') &&
                  c.v1.Tag.encode(e.tag, t.uint32(10).fork()).ldelim(),
                  null != e.mangas &&
                  e.mangas.length
                ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(18).fork()).ldelim();
                return null != e.thumbnailUrl &&
                Object.hasOwnProperty.call(e, 'thumbnailUrl') &&
                t.uint32(26).string(e.thumbnailUrl),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebHomeResponse.MangasByTag;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.tag = c.v1.Tag.decode(e, e.uint32());
                      break;
                    case 2:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.thumbnailUrl = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.WebHomeV2Request = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebHomeV2Request;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebHomeV2Response = function () {
            var e = function (e) {
              if (this.topBanners = [], this.topSubBanners = [], this.sections = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.topBanners = s.emptyArray,
            e.prototype.topSubBanners = s.emptyArray,
            e.prototype.sections = s.emptyArray,
            e.prototype.youtubeSection = null,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.topBanners && e.topBanners.length) for (var n = 0; n < e.topBanners.length; ++n) c.v1.Banner.encode(e.topBanners[n], t.uint32(10).fork()).ldelim();
              if (null != e.topSubBanners && e.topSubBanners.length) for (var r = 0; r < e.topSubBanners.length; ++r) c.v1.Banner.encode(e.topSubBanners[r], t.uint32(18).fork()).ldelim();
              if (null != e.sections && e.sections.length) for (var o = 0; o < e.sections.length; ++o) c.v1.WebHomeV2Response.HomeSection.encode(e.sections[o], t.uint32(26).fork()).ldelim();
              return null != e.youtubeSection &&
              Object.hasOwnProperty.call(e, 'youtubeSection') &&
              c.v1.WebHomeV2Response.YoutubeSection.encode(e.youtubeSection, t.uint32(34).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebHomeV2Response;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.topBanners &&
                    o.topBanners.length ||
                    (o.topBanners = []),
                    o.topBanners.push(c.v1.Banner.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.topSubBanners &&
                    o.topSubBanners.length ||
                    (o.topSubBanners = []),
                    o.topSubBanners.push(c.v1.Banner.decode(e, e.uint32()));
                    break;
                  case 3:
                    o.sections &&
                    o.sections.length ||
                    (o.sections = []),
                    o.sections.push(c.v1.WebHomeV2Response.HomeSection.decode(e, e.uint32()));
                    break;
                  case 4:
                    o.youtubeSection = c.v1.WebHomeV2Response.YoutubeSection.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.HomeSection = function () {
              var e,
              t = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return t.prototype.updatedMangasSection = null,
              t.prototype.rankingSection = null,
              t.prototype.mangasByTagSection = null,
              t.prototype.storeContentSection = null,
              Object.defineProperty(
                t.prototype,
                'content',
                {
                  get: s.oneOfGetter(
                    e = [
                      'updatedMangasSection',
                      'rankingSection',
                      'mangasByTagSection',
                      'storeContentSection'
                    ]
                  ),
                  set: s.oneOfSetter(e)
                }
              ),
              t.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.updatedMangasSection &&
                Object.hasOwnProperty.call(e, 'updatedMangasSection') &&
                c.v1.WebHomeV2Response.UpdatedMangasSection.encode(e.updatedMangasSection, t.uint32(10).fork()).ldelim(),
                null != e.rankingSection &&
                Object.hasOwnProperty.call(e, 'rankingSection') &&
                c.v1.WebHomeV2Response.RankingSection.encode(e.rankingSection, t.uint32(18).fork()).ldelim(),
                null != e.mangasByTagSection &&
                Object.hasOwnProperty.call(e, 'mangasByTagSection') &&
                c.v1.WebHomeV2Response.MangasByTagSection.encode(e.mangasByTagSection, t.uint32(26).fork()).ldelim(),
                null != e.storeContentSection &&
                Object.hasOwnProperty.call(e, 'storeContentSection') &&
                c.v1.WebHomeV2Response.StoreContentSection.encode(e.storeContentSection, t.uint32(34).fork()).ldelim(),
                t
              },
              t.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebHomeV2Response.HomeSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.updatedMangasSection = c.v1.WebHomeV2Response.UpdatedMangasSection.decode(e, e.uint32());
                      break;
                    case 2:
                      o.rankingSection = c.v1.WebHomeV2Response.RankingSection.decode(e, e.uint32());
                      break;
                    case 3:
                      o.mangasByTagSection = c.v1.WebHomeV2Response.MangasByTagSection.decode(e, e.uint32());
                      break;
                    case 4:
                      o.storeContentSection = c.v1.WebHomeV2Response.StoreContentSection.decode(e, e.uint32());
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              t
            }(),
            e.UpdatedMangasSection = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.mangas = s.emptyArray,
              e.encode = function (e, t) {
                if (t || (t = i.create()), null != e.mangas && e.mangas.length) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(10).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebHomeV2Response.UpdatedMangasSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  if (i >>> 3 === 1) o.mangas &&
                  o.mangas.length ||
                  (o.mangas = []),
                  o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                   else e.skipType(7 & i)
                }
                return o
              },
              e
            }(),
            e.RankingSection = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.mangas = s.emptyArray,
              e.prototype.tagId = 0,
              e.encode = function (e, t) {
                if (t || (t = i.create()), null != e.mangas && e.mangas.length) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(10).fork()).ldelim();
                return null != e.tagId &&
                Object.hasOwnProperty.call(e, 'tagId') &&
                t.uint32(16).uint32(e.tagId),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebHomeV2Response.RankingSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    case 2:
                      o.tagId = e.uint32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.MangasByTagSection = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.tag = null,
              e.prototype.mangas = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.tag &&
                  Object.hasOwnProperty.call(e, 'tag') &&
                  c.v1.Tag.encode(e.tag, t.uint32(10).fork()).ldelim(),
                  null != e.mangas &&
                  e.mangas.length
                ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebHomeV2Response.MangasByTagSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.tag = c.v1.Tag.decode(e, e.uint32());
                      break;
                    case 2:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.StoreContentSection = function () {
              var e = function (e) {
                if (this.magazineIssueList = [], this.bookIssueList = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.magazineBannerPc = null,
              e.prototype.magazineBannerSp = null,
              e.prototype.magazineIssueList = s.emptyArray,
              e.prototype.bookIssueList = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.magazineBannerPc &&
                  Object.hasOwnProperty.call(e, 'magazineBannerPc') &&
                  c.v1.Banner.encode(e.magazineBannerPc, t.uint32(10).fork()).ldelim(),
                  null != e.magazineBannerSp &&
                  Object.hasOwnProperty.call(e, 'magazineBannerSp') &&
                  c.v1.Banner.encode(e.magazineBannerSp, t.uint32(18).fork()).ldelim(),
                  null != e.magazineIssueList &&
                  e.magazineIssueList.length
                ) for (var n = 0; n < e.magazineIssueList.length; ++n) c.v1.MagazineIssue.encode(e.magazineIssueList[n], t.uint32(26).fork()).ldelim();
                if (null != e.bookIssueList && e.bookIssueList.length) for (var r = 0; r < e.bookIssueList.length; ++r) c.v1.BookIssue.encode(e.bookIssueList[r], t.uint32(34).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebHomeV2Response.StoreContentSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.magazineBannerPc = c.v1.Banner.decode(e, e.uint32());
                      break;
                    case 2:
                      o.magazineBannerSp = c.v1.Banner.decode(e, e.uint32());
                      break;
                    case 3:
                      o.magazineIssueList &&
                      o.magazineIssueList.length ||
                      (o.magazineIssueList = []),
                      o.magazineIssueList.push(c.v1.MagazineIssue.decode(e, e.uint32()));
                      break;
                    case 4:
                      o.bookIssueList &&
                      o.bookIssueList.length ||
                      (o.bookIssueList = []),
                      o.bookIssueList.push(c.v1.BookIssue.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e.YoutubeSection = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.channelIconImgUrl = '',
              e.prototype.videoTitle = '',
              e.prototype.videoId = '',
              e.prototype.channelId = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.channelIconImgUrl &&
                Object.hasOwnProperty.call(e, 'channelIconImgUrl') &&
                t.uint32(10).string(e.channelIconImgUrl),
                null != e.videoTitle &&
                Object.hasOwnProperty.call(e, 'videoTitle') &&
                t.uint32(18).string(e.videoTitle),
                null != e.videoId &&
                Object.hasOwnProperty.call(e, 'videoId') &&
                t.uint32(26).string(e.videoId),
                null != e.channelId &&
                Object.hasOwnProperty.call(e, 'channelId') &&
                t.uint32(34).string(e.channelId),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebHomeV2Response.YoutubeSection;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.channelIconImgUrl = e.string();
                      break;
                    case 2:
                      o.videoTitle = e.string();
                      break;
                    case 3:
                      o.videoId = e.string();
                      break;
                    case 4:
                      o.channelId = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.WebMangaRankingRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebMangaRankingRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebMangaRankingResponse = function () {
            var e = function (e) {
              if (this.rankings = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.rankings = s.emptyArray,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.rankings && e.rankings.length) for (var n = 0; n < e.rankings.length; ++n) c.v1.WebMangaRankingResponse.Ranking.encode(e.rankings[n], t.uint32(10).fork()).ldelim();
              return t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebMangaRankingResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.rankings &&
                o.rankings.length ||
                (o.rankings = []),
                o.rankings.push(c.v1.WebMangaRankingResponse.Ranking.decode(e, e.uint32()));
                 else e.skipType(7 & i)
              }
              return o
            },
            e.Ranking = function () {
              var e = function (e) {
                if (this.mangas = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.name = '',
              e.prototype.mangas = s.emptyArray,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.name &&
                  Object.hasOwnProperty.call(e, 'name') &&
                  t.uint32(10).string(e.name),
                  null != e.mangas &&
                  e.mangas.length
                ) for (var n = 0; n < e.mangas.length; ++n) c.v1.Manga.encode(e.mangas[n], t.uint32(18).fork()).ldelim();
                return t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebMangaRankingResponse.Ranking;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.name = e.string();
                      break;
                    case 2:
                      o.mangas &&
                      o.mangas.length ||
                      (o.mangas = []),
                      o.mangas.push(c.v1.Manga.decode(e, e.uint32()));
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.WebMangaViewerRequest = function () {
            var e,
            t = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.deviceInfo = null,
            t.prototype.useTicket = !1,
            t.prototype.consumePoint = null,
            t.prototype.chapterId = null,
            t.prototype.chapterArgument = null,
            Object.defineProperty(
              t.prototype,
              'chapterInterface',
              {
                get: s.oneOfGetter(e = [
                  'chapterId',
                  'chapterArgument'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.useTicket &&
              Object.hasOwnProperty.call(e, 'useTicket') &&
              t.uint32(16).bool(e.useTicket),
              null != e.consumePoint &&
              Object.hasOwnProperty.call(e, 'consumePoint') &&
              c.v1.UserPoint.encode(e.consumePoint, t.uint32(26).fork()).ldelim(),
              null != e.chapterId &&
              Object.hasOwnProperty.call(e, 'chapterId') &&
              t.uint32(32).uint32(e.chapterId),
              null != e.chapterArgument &&
              Object.hasOwnProperty.call(e, 'chapterArgument') &&
              c.v1.WebMangaViewerRequest.ChapterArgument.encode(e.chapterArgument, t.uint32(42).fork()).ldelim(),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebMangaViewerRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.useTicket = e.bool();
                    break;
                  case 3:
                    o.consumePoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 4:
                    o.chapterId = e.uint32();
                    break;
                  case 5:
                    o.chapterArgument = c.v1.WebMangaViewerRequest.ChapterArgument.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.ChapterArgument = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.mangaId = 0,
              e.prototype.position = 0,
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.mangaId &&
                Object.hasOwnProperty.call(e, 'mangaId') &&
                t.uint32(8).uint32(e.mangaId),
                null != e.position &&
                Object.hasOwnProperty.call(e, 'position') &&
                t.uint32(16).int32(e.position),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebMangaViewerRequest.ChapterArgument;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.mangaId = e.uint32();
                      break;
                    case 2:
                      o.position = e.int32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e.Position = function () {
                var e = {},
                t = Object.create(e);
                return t[e[0] = 'FIRST'] = 0,
                t[e[1] = 'LAST'] = 1,
                t[e[2] = 'DETAIL'] = 2,
                t
              }(),
              e
            }(),
            t
          }(),
          e.WebMangaViewerResponse = function () {
            var e,
            t = function (e) {
              if (this.chapters = [], this.authorships = [], this.tags = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return t.prototype.userPoint = null,
            t.prototype.viewerData = null,
            t.prototype.isCommentEnabled = !1,
            t.prototype.sns = null,
            t.prototype.chapters = s.emptyArray,
            t.prototype.authorships = s.emptyArray,
            t.prototype.nextUpdateInfo = '',
            t.prototype.isFavorite = !1,
            t.prototype.tags = s.emptyArray,
            t.prototype.rewardUrl = '',
            t.prototype.manga = null,
            t.prototype.chapterId = null,
            t.prototype.viewButton = null,
            t.prototype.hasAppLoggedin = !1,
            Object.defineProperty(
              t.prototype,
              '_viewerData',
              {
                get: s.oneOfGetter(e = [
                  'viewerData'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            Object.defineProperty(
              t.prototype,
              '_chapterId',
              {
                get: s.oneOfGetter(e = [
                  'chapterId'
                ]),
                set: s.oneOfSetter(e)
              }
            ),
            t.encode = function (e, t) {
              if (
                t ||
                (t = i.create()),
                null != e.userPoint &&
                Object.hasOwnProperty.call(e, 'userPoint') &&
                c.v1.UserPoint.encode(e.userPoint, t.uint32(10).fork()).ldelim(),
                null != e.viewerData &&
                Object.hasOwnProperty.call(e, 'viewerData') &&
                c.v1.WebMangaViewerResponse.ViewerData.encode(e.viewerData, t.uint32(18).fork()).ldelim(),
                null != e.isCommentEnabled &&
                Object.hasOwnProperty.call(e, 'isCommentEnabled') &&
                t.uint32(24).bool(e.isCommentEnabled),
                null != e.sns &&
                Object.hasOwnProperty.call(e, 'sns') &&
                c.v1.Sns.encode(e.sns, t.uint32(34).fork()).ldelim(),
                null != e.chapters &&
                e.chapters.length
              ) for (var n = 0; n < e.chapters.length; ++n) c.v1.ChapterGroup.encode(e.chapters[n], t.uint32(42).fork()).ldelim();
              if (null != e.authorships && e.authorships.length) for (var r = 0; r < e.authorships.length; ++r) c.v1.Authorship.encode(e.authorships[r], t.uint32(50).fork()).ldelim();
              if (
                null != e.nextUpdateInfo &&
                Object.hasOwnProperty.call(e, 'nextUpdateInfo') &&
                t.uint32(58).string(e.nextUpdateInfo),
                null != e.isFavorite &&
                Object.hasOwnProperty.call(e, 'isFavorite') &&
                t.uint32(64).bool(e.isFavorite),
                null != e.tags &&
                e.tags.length
              ) for (var o = 0; o < e.tags.length; ++o) c.v1.Tag.encode(e.tags[o], t.uint32(74).fork()).ldelim();
              return null != e.rewardUrl &&
              Object.hasOwnProperty.call(e, 'rewardUrl') &&
              t.uint32(82).string(e.rewardUrl),
              null != e.manga &&
              Object.hasOwnProperty.call(e, 'manga') &&
              c.v1.Manga.encode(e.manga, t.uint32(90).fork()).ldelim(),
              null != e.chapterId &&
              Object.hasOwnProperty.call(e, 'chapterId') &&
              t.uint32(96).uint32(e.chapterId),
              null != e.viewButton &&
              Object.hasOwnProperty.call(e, 'viewButton') &&
              c.v1.WebMangaViewerResponse.ViewButton.encode(e.viewButton, t.uint32(106).fork()).ldelim(),
              null != e.hasAppLoggedin &&
              Object.hasOwnProperty.call(e, 'hasAppLoggedin') &&
              t.uint32(112).bool(e.hasAppLoggedin),
              t
            },
            t.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebMangaViewerResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 2:
                    o.viewerData = c.v1.WebMangaViewerResponse.ViewerData.decode(e, e.uint32());
                    break;
                  case 3:
                    o.isCommentEnabled = e.bool();
                    break;
                  case 4:
                    o.sns = c.v1.Sns.decode(e, e.uint32());
                    break;
                  case 5:
                    o.chapters &&
                    o.chapters.length ||
                    (o.chapters = []),
                    o.chapters.push(c.v1.ChapterGroup.decode(e, e.uint32()));
                    break;
                  case 6:
                    o.authorships &&
                    o.authorships.length ||
                    (o.authorships = []),
                    o.authorships.push(c.v1.Authorship.decode(e, e.uint32()));
                    break;
                  case 7:
                    o.nextUpdateInfo = e.string();
                    break;
                  case 8:
                    o.isFavorite = e.bool();
                    break;
                  case 9:
                    o.tags &&
                    o.tags.length ||
                    (o.tags = []),
                    o.tags.push(c.v1.Tag.decode(e, e.uint32()));
                    break;
                  case 10:
                    o.rewardUrl = e.string();
                    break;
                  case 11:
                    o.manga = c.v1.Manga.decode(e, e.uint32());
                    break;
                  case 12:
                    o.chapterId = e.uint32();
                    break;
                  case 13:
                    o.viewButton = c.v1.WebMangaViewerResponse.ViewButton.decode(e, e.uint32());
                    break;
                  case 14:
                    o.hasAppLoggedin = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            t.ViewerData = function () {
              var e = function (e) {
                if (this.pages = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.viewerTitle = '',
              e.prototype.pages = s.emptyArray,
              e.prototype.scroll = 0,
              e.prototype.isFirstPageBlank = !1,
              e.prototype.scrollOption = 0,
              e.encode = function (e, t) {
                if (
                  t ||
                  (t = i.create()),
                  null != e.viewerTitle &&
                  Object.hasOwnProperty.call(e, 'viewerTitle') &&
                  t.uint32(10).string(e.viewerTitle),
                  null != e.pages &&
                  e.pages.length
                ) for (var n = 0; n < e.pages.length; ++n) c.v1.ViewerPage.encode(e.pages[n], t.uint32(18).fork()).ldelim();
                return null != e.scroll &&
                Object.hasOwnProperty.call(e, 'scroll') &&
                t.uint32(24).int32(e.scroll),
                null != e.isFirstPageBlank &&
                Object.hasOwnProperty.call(e, 'isFirstPageBlank') &&
                t.uint32(32).bool(e.isFirstPageBlank),
                null != e.scrollOption &&
                Object.hasOwnProperty.call(e, 'scrollOption') &&
                t.uint32(40).int32(e.scrollOption),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebMangaViewerResponse.ViewerData;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.viewerTitle = e.string();
                      break;
                    case 2:
                      o.pages &&
                      o.pages.length ||
                      (o.pages = []),
                      o.pages.push(c.v1.ViewerPage.decode(e, e.uint32()));
                      break;
                    case 3:
                      o.scroll = e.int32();
                      break;
                    case 4:
                      o.isFirstPageBlank = e.bool();
                      break;
                    case 5:
                      o.scrollOption = e.int32();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e.ScrollDirection = function () {
                var e = {},
                t = Object.create(e);
                return t[e[0] = 'LEFT'] = 0,
                t[e[1] = 'RIGHT'] = 1,
                t[e[2] = 'VERTICAL'] = 2,
                t[e[3] = 'NONE'] = 3,
                t
              }(),
              e
            }(),
            t.ViewButton = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.chapter = null,
              e.prototype.buttonTitle = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.chapter &&
                Object.hasOwnProperty.call(e, 'chapter') &&
                c.v1.Chapter.encode(e.chapter, t.uint32(10).fork()).ldelim(),
                null != e.buttonTitle &&
                Object.hasOwnProperty.call(e, 'buttonTitle') &&
                t.uint32(18).string(e.buttonTitle),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebMangaViewerResponse.ViewButton;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.chapter = c.v1.Chapter.decode(e, e.uint32());
                      break;
                    case 2:
                      o.buttonTitle = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            t
          }(),
          e.WebMypageRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebMypageRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebMypageResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.mailAddress = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.mailAddress &&
              Object.hasOwnProperty.call(e, 'mailAddress') &&
              t.uint32(10).string(e.mailAddress),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebMypageResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.mailAddress = e.string();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebSubscribedItemListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebSubscribedItemListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebSubscribedItemListResponse = function () {
            var e = function (e) {
              if (this.item = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.item = s.emptyArray,
            e.prototype.noteDescription_1 = '',
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.item && e.item.length) for (var n = 0; n < e.item.length; ++n) c.v1.SubscriptionItem.encode(e.item[n], t.uint32(10).fork()).ldelim();
              return null != e.noteDescription_1 &&
              Object.hasOwnProperty.call(e, 'noteDescription_1') &&
              t.uint32(18).string(e.noteDescription_1),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebSubscribedItemListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.item &&
                    o.item.length ||
                    (o.item = []),
                    o.item.push(c.v1.SubscriptionItem.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.noteDescription_1 = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.WebSubscriptionItemInfoRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.productId = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.productId &&
              Object.hasOwnProperty.call(e, 'productId') &&
              t.uint32(10).string(e.productId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebSubscriptionItemInfoRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                if (i >>> 3 === 1) o.productId = e.string();
                 else e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.WebSubscriptionItemInfoResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.item = null,
            e.prototype.creditCard = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.item &&
              Object.hasOwnProperty.call(e, 'item') &&
              c.v1.SubscriptionItem.encode(e.item, t.uint32(10).fork()).ldelim(),
              null != e.creditCard &&
              Object.hasOwnProperty.call(e, 'creditCard') &&
              c.v1.WebSubscriptionItemInfoResponse.CreditCard.encode(e.creditCard, t.uint32(18).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.WebSubscriptionItemInfoResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.item = c.v1.SubscriptionItem.decode(e, e.uint32());
                    break;
                  case 2:
                    o.creditCard = c.v1.WebSubscriptionItemInfoResponse.CreditCard.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e.CreditCard = function () {
              var e = function (e) {
                if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
                (this[t[n]] = e[t[n]])
              };
              return e.prototype.cardNumber = '',
              e.prototype.cardExpiration = '',
              e.encode = function (e, t) {
                return t ||
                (t = i.create()),
                null != e.cardNumber &&
                Object.hasOwnProperty.call(e, 'cardNumber') &&
                t.uint32(10).string(e.cardNumber),
                null != e.cardExpiration &&
                Object.hasOwnProperty.call(e, 'cardExpiration') &&
                t.uint32(18).string(e.cardExpiration),
                t
              },
              e.decode = function (e, t) {
                (0, r.Z) (e, a) ||
                (e = a.create(e));
                for (
                  var n = void 0 === t ? e.len : e.pos + t,
                  o = new c.v1.WebSubscriptionItemInfoResponse.CreditCard;
                  e.pos < n;
                ) {
                  var i = e.uint32();
                  switch (i >>> 3) {
                    case 1:
                      o.cardNumber = e.string();
                      break;
                    case 2:
                      o.cardExpiration = e.string();
                      break;
                    default:
                      e.skipType(7 & i)
                  }
                }
                return o
              },
              e
            }(),
            e
          }(),
          e.YellListRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.authorId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.authorId &&
              Object.hasOwnProperty.call(e, 'authorId') &&
              t.uint32(16).uint32(e.authorId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.YellListRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.authorId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.YellListResponse = function () {
            var e = function (e) {
              if (this.yell = [], this.yellPoints = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.yell = s.emptyArray,
            e.prototype.author = null,
            e.prototype.yellPoints = s.emptyArray,
            e.prototype.userPoint = null,
            e.prototype.releaseEndDate = '',
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.yell && e.yell.length) for (var n = 0; n < e.yell.length; ++n) c.v1.Yell.encode(e.yell[n], t.uint32(10).fork()).ldelim();
              if (
                null != e.author &&
                Object.hasOwnProperty.call(e, 'author') &&
                c.v1.Author.encode(e.author, t.uint32(18).fork()).ldelim(),
                null != e.yellPoints &&
                e.yellPoints.length
              ) {
                t.uint32(26).fork();
                for (var r = 0; r < e.yellPoints.length; ++r) t.uint32(e.yellPoints[r]);
                t.ldelim()
              }
              return null != e.userPoint &&
              Object.hasOwnProperty.call(e, 'userPoint') &&
              c.v1.UserPoint.encode(e.userPoint, t.uint32(34).fork()).ldelim(),
              null != e.releaseEndDate &&
              Object.hasOwnProperty.call(e, 'releaseEndDate') &&
              t.uint32(42).string(e.releaseEndDate),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.YellListResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.yell &&
                    o.yell.length ||
                    (o.yell = []),
                    o.yell.push(c.v1.Yell.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.author = c.v1.Author.decode(e, e.uint32());
                    break;
                  case 3:
                    if (
                      o.yellPoints &&
                      o.yellPoints.length ||
                      (o.yellPoints = []),
                      2 === (7 & i)
                    ) for (var s = e.uint32() + e.pos; e.pos < s; ) o.yellPoints.push(e.uint32());
                     else o.yellPoints.push(e.uint32());
                    break;
                  case 4:
                    o.userPoint = c.v1.UserPoint.decode(e, e.uint32());
                    break;
                  case 5:
                    o.releaseEndDate = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ReportYellRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.yellId = 0,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.yellId &&
              Object.hasOwnProperty.call(e, 'yellId') &&
              t.uint32(16).uint32(e.yellId),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ReportYellRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.yellId = e.uint32();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.ReportYellResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.ReportYellResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.YellRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.authorId = 0,
            e.prototype.paidPoint = 0,
            e.prototype.handleName = '',
            e.prototype.message = '',
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
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
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.YellRequest; e.pos < n; ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.authorId = e.uint32();
                    break;
                  case 3:
                    o.paidPoint = e.uint32();
                    break;
                  case 4:
                    o.handleName = e.string();
                    break;
                  case 5:
                    o.message = e.string();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.YellResponse = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (var n = void 0 === t ? e.len : e.pos + t, o = new c.v1.YellResponse; e.pos < n; ) {
                var i = e.uint32();
                e.skipType(7 & i)
              }
              return o
            },
            e
          }(),
          e.YellBonusViewerRequest = function () {
            var e = function (e) {
              if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.deviceInfo = null,
            e.prototype.authorId = 0,
            e.prototype.viewerMode = null,
            e.encode = function (e, t) {
              return t ||
              (t = i.create()),
              null != e.deviceInfo &&
              Object.hasOwnProperty.call(e, 'deviceInfo') &&
              c.v1.DeviceInfo.encode(e.deviceInfo, t.uint32(10).fork()).ldelim(),
              null != e.authorId &&
              Object.hasOwnProperty.call(e, 'authorId') &&
              t.uint32(16).uint32(e.authorId),
              null != e.viewerMode &&
              Object.hasOwnProperty.call(e, 'viewerMode') &&
              c.v1.ViewerMode.encode(e.viewerMode, t.uint32(26).fork()).ldelim(),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.YellBonusViewerRequest;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.deviceInfo = c.v1.DeviceInfo.decode(e, e.uint32());
                    break;
                  case 2:
                    o.authorId = e.uint32();
                    break;
                  case 3:
                    o.viewerMode = c.v1.ViewerMode.decode(e, e.uint32());
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e.YellBonusViewerResponse = function () {
            var e = function (e) {
              if (this.pages = [], e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] &&
              (this[t[n]] = e[t[n]])
            };
            return e.prototype.pages = s.emptyArray,
            e.prototype.viewerTitle = '',
            e.prototype.isScreenshotable = !1,
            e.encode = function (e, t) {
              if (t || (t = i.create()), null != e.pages && e.pages.length) for (var n = 0; n < e.pages.length; ++n) c.v1.ViewerPage.encode(e.pages[n], t.uint32(10).fork()).ldelim();
              return null != e.viewerTitle &&
              Object.hasOwnProperty.call(e, 'viewerTitle') &&
              t.uint32(18).string(e.viewerTitle),
              null != e.isScreenshotable &&
              Object.hasOwnProperty.call(e, 'isScreenshotable') &&
              t.uint32(24).bool(e.isScreenshotable),
              t
            },
            e.decode = function (e, t) {
              (0, r.Z) (e, a) ||
              (e = a.create(e));
              for (
                var n = void 0 === t ? e.len : e.pos + t,
                o = new c.v1.YellBonusViewerResponse;
                e.pos < n;
              ) {
                var i = e.uint32();
                switch (i >>> 3) {
                  case 1:
                    o.pages &&
                    o.pages.length ||
                    (o.pages = []),
                    o.pages.push(c.v1.ViewerPage.decode(e, e.uint32()));
                    break;
                  case 2:
                    o.viewerTitle = e.string();
                    break;
                  case 3:
                    o.isScreenshotable = e.bool();
                    break;
                  default:
                    e.skipType(7 & i)
                }
              }
              return o
            },
            e
          }(),
          e
        }()
      );
      return c;
    }
})()