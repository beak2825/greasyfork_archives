// ==UserScript==
// @name               Douban Info Class
// @description        parse douban info
// @version            0.0.51
// @author             Secant(TYT@NexusHD)

// config cache encryption or compression
gs.config.ttl = 43200;
gs.config.encrypt = true;
gs.config.encrypter = (data) => LZString.compress(data);
gs.config.decrypter = (encryptedString) => LZString.decompress(encryptedString);

class MInfo {
  get info() {
    return (async () => {
      let info = {};
      for (let key in this) {
        info[key] = await this[key];
      }
      return info;
    })();
  }

  promisedGetterLazify(fun, propertyName, isEnumarable = true) {
    return {
      configurable: true,
      enumerable: isEnumarable,
      get: function () {
        Object.defineProperty(this, propertyName, {
          writable: false,
          enumerable: isEnumarable,
          value: fun(),
        });
        return this[propertyName];
      },
    };
  }

  async getResponseText(url, options = { headers: {} }, cacheConfig = {}) {
    let responseText = null;
    responseText = gs.get(url, cacheConfig);
    if (responseText) {
      return (async () => responseText)();
    } else {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          headers: options.headers,
          timeout: options.timeout,
          onload: (resp) => {
            const { status, statusText, responseText } = resp;
            if (status === 200) {
              resolve(responseText);
              gs.set(url, responseText, cacheConfig);
            } else {
              console.warn(statusText);
              resolve(null);
            }
          },
          ontimeout: (e) => {
            console.warn(e);
            resolve(null);
          },
          onerror: (e) => {
            console.warn(e);
            resolve(null);
          },
        });
      });
    }
  }

  flushCache(force = false) {
    gs.flush(force);
  }
}

class DoubanInfo extends MInfo {
  static origin = "https://movie.douban.com";
  static timeout = 6000;
  static cacheConfig = {
    ttl: 43200,
    encrypt: true,
    encrypter: (data) => LZString.compress(data),
    decrypter: (encryptedString) => LZString.decompress(encryptedString),
  };

  constructor(id) {
    super();
    // define promised lazy getters
    Object.defineProperties(this, {
      id: this.promisedGetterLazify(async () => {
        return id;
      }, "id"),
      subjectPathname: this.promisedGetterLazify(
        async () => {
          const subjectPathname = `/subject/${await this.id}/`;
          return subjectPathname;
        },
        "subjectPathname",
        false
      ),
      awardPathname: this.promisedGetterLazify(
        async () => {
          const awardPathname = `/subject/${await this.id}/awards/`;
          return awardPathname;
        },
        "awardPathname",
        false
      ),
      celebrityPathname: this.promisedGetterLazify(
        async () => {
          const celebrityPathname = `/subject/${await this.id}/celebrities`;
          return celebrityPathname;
        },
        "celebrityPathname",
        false
      ),
      subjectDoc: this.promisedGetterLazify(
        async () => {
          const currentURL = new URL(window.location.href);
          let doc = null;
          if (
            currentURL.origin === DoubanInfo.origin &&
            currentURL.pathname === (await this.subjectPathname)
          ) {
            doc = document;
          } else {
            const url = new URL(
              await this.subjectPathname,
              DoubanInfo.origin
            ).toString();
            const options = {
              headers: {
                referrer: DoubanInfo.origin,
              },
              timeout: DoubanInfo.timeout,
            };
            const cacheConfig = DoubanInfo.cacheConfig;
            const responseText = await this.getResponseText(
              url,
              options,
              cacheConfig
            );
            if (responseText) {
              try {
                doc = new DOMParser().parseFromString(
                  responseText,
                  "text/html"
                );
              } catch (e) {
                console.warn(e);
              }
            } else {
              console.warn("no response text");
            }
          }
          return doc;
        },
        "subjectDoc",
        false
      ),
      awardDoc: this.promisedGetterLazify(
        async () => {
          const currentURL = new URL(window.location.href);
          let doc = null;
          if (
            currentURL.origin === DoubanInfo.origin &&
            currentURL.pathname === (await this.awardPathname)
          ) {
            doc = document;
          } else {
            const url = new URL(
              await this.awardPathname,
              DoubanInfo.origin
            ).toString();
            const options = {
              headers: {
                referrer: DoubanInfo.origin,
              },
              timeout: DoubanInfo.timeout,
            };
            const cacheConfig = DoubanInfo.cacheConfig;
            const responseText = await this.getResponseText(
              url,
              options,
              cacheConfig
            );
            if (responseText) {
              try {
                doc = new DOMParser().parseFromString(
                  responseText,
                  "text/html"
                );
              } catch (e) {
                console.warn(e);
              }
            } else {
              console.warn("no response text");
            }
          }
          return doc;
        },
        "awardDoc",
        false
      ),
      celebrityDoc: this.promisedGetterLazify(
        async () => {
          const currentURL = new URL(window.location.href);
          let doc = null;
          if (
            currentURL.origin === DoubanInfo.origin &&
            currentURL.pathname === (await this.celebrityPathname)
          ) {
            doc = document;
          } else {
            const url = new URL(
              await this.celebrityPathname,
              DoubanInfo.origin
            ).toString();
            const options = {
              headers: {
                referrer: DoubanInfo.origin,
              },
              timeout: DoubanInfo.timeout,
            };
            const cacheConfig = DoubanInfo.cacheConfig;
            const responseText = await this.getResponseText(
              url,
              options,
              cacheConfig
            );
            if (responseText) {
              try {
                doc = new DOMParser().parseFromString(
                  responseText,
                  "text/html"
                );
              } catch (e) {
                console.warn(e);
              }
            } else {
              console.warn("no response text");
            }
          }
          return doc;
        },
        "celebrityDoc",
        false
      ),
      linkingData: this.promisedGetterLazify(
        async () => {
          const doc = await this.subjectDoc;
          const ld =
            dirtyJson.parse(
              htmlEntities.decode(
                doc?.querySelector("head>script[type='application/ld+json']")
                  ?.textContent
              )
            ) || null;
          return ld;
        },
        "linkingData",
        false
      ),
      type: this.promisedGetterLazify(async () => {
        const ld = await this.linkingData;
        const type = ld?.["@type"]?.toLowerCase() || null;
        return type;
      }, "type"),
      poster: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        const ld = await this.linkingData;
        const posterFromDoc =
          doc?.querySelector("body #mainpic img")?.src || null;
        const posterFromMeta =
          doc?.querySelector("head>meta[property='og:image']")?.content || null;
        const posterFromLD = ld?.image || null;
        const poster =
          (posterFromDoc || posterFromMeta || posterFromLD)
            ?.replace("s_ratio_poster", "l_ratio_poster")
            .replace(/img\d+\.doubanio\.com/, "img9.doubanio.com")
            .replace(/\.webp$/i, ".jpg") || null;
        return poster;
      }, "poster"),
      title: this.promisedGetterLazify(
        async () => {
          const doc = await this.subjectDoc;
          const ld = await this.linkingData;
          const titleFromDoc =
            doc?.querySelector("body #content h1>span[property]")
              ?.textContent || null;
          const titleFromMeta =
            doc?.querySelector("head>meta[property='og:title']")?.content ||
            null;
          const titleFromLD = ld?.name || null;
          const title = titleFromDoc || titleFromMeta || titleFromLD;
          return title;
        },
        "title",
        false
      ),
      year: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        const year =
          parseInt(
            doc
              ?.querySelector("body #content>h1>span.year")
              ?.textContent.slice(1, -1) || 0,
            10
          ) || null;
        return year;
      }, "year"),
      chineseTitle: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        const chineseTitle = doc?.title?.slice(0, -5);
        return chineseTitle;
      }, "chineseTitle"),
      originalTitle: this.promisedGetterLazify(async () => {
        let originalTitle;
        if (await this.isChinese) {
          originalTitle = await this.chineseTitle;
        } else {
          originalTitle = (await this.title)
            ?.replace(await this.chineseTitle, "")
            .trim();
        }
        return originalTitle;
      }, "originalTitle"),
      aka: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        const priority = (t) =>
          /\(港.?台\)/.test(t) ? 1 : /\((?:[港台]|香港|台湾)\)/.test(t) ? 2 : 3;
        let aka =
          [...(doc?.querySelectorAll("body #info span.pl") || [])]
            .find((n) => n.textContent.includes("又名"))
            ?.nextSibling?.textContent.split("/")
            .map((t) => t.trim())
            .sort((t1, t2) => priority(t1) - priority(t2)) || [];
        if (aka.length === 0) {
          aka = null;
        }
        return aka;
      }, "aka"),
      isChinese: this.promisedGetterLazify(
        async () => {
          let isChinese = false;
          if ((await this.title) === (await this.chineseTitle)) {
            isChinese = true;
          }
          return isChinese;
        },
        "isChinese",
        false
      ),
      region: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        let region =
          [...(doc?.querySelectorAll("body #info span.pl") || [])]
            .find((n) => n.textContent.includes("制片国家/地区"))
            ?.nextSibling?.textContent.split("/")
            .map((r) => r.trim()) || [];
        if (region.length === 0) {
          region = null;
        }
        return region;
      }, "region"),
      language: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        let language =
          [...(doc?.querySelectorAll("body #info span.pl") || [])]
            .find((n) => n.textContent.includes("语言"))
            ?.nextSibling?.textContent.split("/")
            .map((l) => l.trim()) || [];
        if (language.length === 0) {
          language = null;
        }
        return language;
      }, "language"),
      genre: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        const ld = await this.linkingData;
        let genreFromDoc = [
          ...(doc?.querySelectorAll('body #info span[property="v:genre"]') ||
            []),
        ].map((g) => g.textContent.trim());
        if (genreFromDoc.length === 0) {
          genreFromDoc = null;
        }
        let genreFromLD = ld?.genre || [];
        if (genreFromLD.length === 0) {
          genreFromLD = null;
        }
        const genre = genreFromDoc || genreFromLD;
        return genre;
      }, "genre"),
      duration: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        const ld = await this.linkingData;
        const type = await this.type;
        let movieDurationFromDoc = null,
          episodeDurationFromDoc = null;
        if (type === "movie") {
          let durationString = "";
          let node =
            doc?.querySelector('body span[property="v:runtime"]') || null;
          while (node && node.nodeName !== "BR") {
            durationString += node.textContent;
            node = node.nextSibling;
          }
          if (durationString !== "") {
            movieDurationFromDoc = durationString
              .split("/")
              .map((str) => {
                str = str.trim();
                const strOI = splitOI(str);
                const duration = parseInt(strOI.o || 0, 10) * 60 || null;
                const whereabouts = strOI.i || null;
                return {
                  duration,
                  whereabouts,
                };
              })
              .filter((d) => d.duration);
            if (movieDurationFromDoc.length === 0) {
              movieDurationFromDoc = null;
            }
          }
        } else if (type === "tvseries") {
          const episodeDurationSecondsFromDoc =
            parseInt(
              [...(doc?.querySelectorAll("body #info span.pl") || [])]
                .find((n) => n.textContent.includes("单集片长"))
                ?.nextSibling?.textContent.trim() || 0,
              10
            ) * 60 || null;
          if (episodeDurationSecondsFromDoc) {
            episodeDurationFromDoc = [
              {
                duration: episodeDurationSecondsFromDoc,
                whereabouts: null,
              },
            ];
          }
        }
        let durationFromMeta = null;
        const durationSecondsFromMeta =
          parseInt(
            doc?.querySelector("head>meta[property='video:duration']")
              ?.content || 0,
            10
          ) || null;
        if (durationSecondsFromMeta) {
          durationFromMeta = [
            {
              duration: durationSecondsFromMeta,
              whereabouts: null,
            },
          ];
        }
        let durationFromLD = null;
        const durationSecondsFromLD =
          parseInt(
            ld?.duration?.replace(
              /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/,
              (_, p1, p2, p3) => {
                return (
                  parseInt(p1 || 0, 10) * 3600 +
                  parseInt(p2 || 0, 10) * 60 +
                  parseInt(p3 || 0, 10)
                ).toString();
              }
            ) || 0,
            10
          ) || null;
        if (durationSecondsFromLD) {
          durationFromLD = [
            {
              duration: durationSecondsFromLD,
              whereabouts: null,
            },
          ];
        }
        const duration =
          movieDurationFromDoc ||
          episodeDurationFromDoc ||
          durationFromMeta ||
          durationFromLD;
        return duration;
      }, "duration"),
      datePublished: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        const ld = await this.linkingData;
        let datePublishedFromDoc = [
          ...(doc?.querySelectorAll(
            'body #info span[property="v:initialReleaseDate"]'
          ) || []),
        ]
          .map((e) => {
            const str = e.textContent.trim();
            const strOI = splitOI(str);
            if (!strOI.o) {
              return null;
            } else {
              return {
                date: new Date(strOI.o),
                whereabouts: strOI.i || null,
              };
            }
          })
          .filter((e) => !!e)
          .sort((d1, d2) => {
            d1.date - d2.date;
          });
        if (datePublishedFromDoc.length === 0) {
          datePublishedFromDoc = null;
        }
        const datePublishedStringFromLD = ld?.datePublished || null;
        let datePublishedFromLD = null;
        if (datePublishedStringFromLD) {
          datePublishedFromLD = [
            { date: new Date(datePublishedStringFromLD), whereabouts: null },
          ];
        }
        const datePublished = datePublishedFromDoc || datePublishedFromLD;
        return datePublished;
      }, "datePublished"),
      episodeCount: this.promisedGetterLazify(async () => {
        if ((await this.type) === "tvseries") {
          const doc = await this.subjectDoc;
          const episodeCount =
            parseInt(
              [...(doc?.querySelectorAll("body #info span.pl") || [])]
                .find((n) => n.textContent.includes("集数"))
                ?.nextSibling?.textContent.trim() || 0,
              10
            ) || null;
          return episodeCount;
        } else {
          return null;
        }
      }, "episodeCount"),
      tag: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        let tag = [
          ...(doc?.querySelectorAll("body div.tags-body>a") || []),
        ].map((t) => t.textContent);
        if (tag.length === 0) {
          tag = null;
        }
        return tag;
      }, "tag"),
      rating: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        let ratingFromDoc = null;
        let countFromDoc =
          parseInt(
            doc?.querySelector('body #interest_sectl [property="v:votes"]')
              ?.textContent || 0,
            10
          ) || null;
        let valueFromDoc =
          parseFloat(
            doc?.querySelector('body #interest_sectl [property="v:average"]')
              ?.textContent || 0
          ) || null;
        if (countFromDoc && valueFromDoc) {
          ratingFromDoc = {
            count: countFromDoc,
            value: valueFromDoc,
            max: 10,
          };
        }
        const ld = await this.linkingData;
        let ratingFromLD = null;
        let countFromLD =
          parseInt(ld?.aggregateRating?.ratingCount || 0, 10) || null;
        let valueFromLD =
          parseFloat(ld?.aggregateRating?.ratingValue || 0) || null;
        if (countFromLD && valueFromLD) {
          ratingFromLD = {
            count: countFromLD,
            value: valueFromLD,
            max: 10,
          };
        }
        const rating = ratingFromDoc || ratingFromLD;
        return rating;
      }, "rating"),
      description: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        const ld = await this.linkingData;
        const descriptionFromDoc =
          [
            ...(doc?.querySelector(
              'body #link-report>[property="v:summary"],body #link-report>span.all.hidden'
            )?.childNodes || []),
          ]
            .filter((e) => e.nodeType === 3)
            .map((e) => e.textContent.trim())
            .join("\n") || null;
        const descriptionFromMeta =
          doc?.querySelector("head>meta[property='og:description']")?.content ||
          null;
        const descriptionFromLD = ld?.description || null;
        const description =
          descriptionFromDoc || descriptionFromMeta || descriptionFromLD;
        return description;
      }, "description"),
      imdbId: this.promisedGetterLazify(async () => {
        const doc = await this.subjectDoc;
        let imdbId = null;
        if (
          doc?.querySelector("body #season option:checked")?.textContent !==
            "1" ||
          false
        ) {
          const doubanId =
            doc.querySelector("body #season option:first-of-type")?.value ||
            null;
          if (doubanId) {
            const firstSeasonDoubanInfo = new DoubanInfo(doubanId);
            imdbId = await firstSeasonDoubanInfo.imdbId;
          }
        } else {
          imdbId =
            [...(doc?.querySelectorAll("body #info span.pl") || [])]
              .find((n) => n.textContent.includes("IMDb:"))
              ?.nextSibling?.textContent.match(/tt(\d+)/)?.[1] || null;
        }
        return imdbId;
      }, "imdbId"),
      awardData: this.promisedGetterLazify(async () => {
        const doc = await this.awardDoc;
        let awardData = [...(doc?.querySelectorAll("body div.awards") || [])]
          .map((awardNode) => {
            const event =
              awardNode?.querySelector(".hd>h2 a")?.textContent.trim() || null;
            const year =
              parseInt(
                awardNode
                  ?.querySelector(".hd>h2 .year")
                  ?.textContent.match(/\d+/)?.[0] || 0,
                10
              ) || null;
            let award = [...(awardNode?.querySelectorAll(".award") || [])]
              .map((a) => {
                const name =
                  a.querySelector("li:first-of-type")?.textContent.trim() ||
                  null;
                let recipient = a
                  .querySelector("li:nth-of-type(2)")
                  ?.textContent.split("/")
                  .map((p) => p.trim() || null)
                  .filter((p) => !!p);
                if (recipient.length === 0) {
                  recipient = null;
                }
                if (name) {
                  return {
                    name,
                    recipient,
                  };
                } else {
                  return null;
                }
              })
              .filter((a) => !!a);
            if (award.length === 0) {
              award = null;
            }
            if (event) {
              return {
                event,
                year,
                award,
              };
            } else {
              return null;
            }
          })
          .filter((a) => !!a);
        if (awardData.length === 0) {
          awardData = null;
        }
        return awardData;
      }, "awardData"),
      celebrityData: this.promisedGetterLazify(async () => {
        const doc = await this.celebrityDoc;
        let celebrityData = [
          ...(doc?.querySelectorAll("body #celebrities>div.list-wrapper") ||
            []),
        ]
          .map((o) => {
            const occupation =
              o.querySelector("h2")?.textContent.trim() || null;
            let occupationCh = null;
            let occupationEn = null;
            if (occupation) {
              const occupationSplitted = splitChEn(occupation);
              occupationCh = occupationSplitted.ch;
              occupationEn = occupationSplitted.en;
            }
            const celebrities = [...(o.querySelectorAll("li.celebrity") || [])]
              .map((c) => {
                const name =
                  c.querySelector(".info>.name")?.textContent.trim() || null;
                let nameCh = null;
                let nameEn = null;
                if (name) {
                  const nameSplitted = splitChEn(name);
                  nameCh = nameSplitted.ch;
                  nameEn = nameSplitted.en;
                }
                const creditAndAttribute =
                  c.querySelector(".info>.role")?.textContent.trim() || null;
                let credit = null;
                let attribute = null;
                let creditCh = null;
                let creditEn = null;
                if (creditAndAttribute) {
                  const creditAndAttributeSplitted =
                    splitOI(creditAndAttribute);
                  credit = creditAndAttributeSplitted.o;
                  attribute = creditAndAttributeSplitted.i;
                  if (credit) {
                    const creditSplitted = splitChEn(credit);
                    creditCh = creditSplitted.ch;
                    creditEn = creditSplitted.en;
                  }
                }
                if (!credit && occupation) {
                  credit = occupation;
                  creditCh = occupationCh;
                  creditEn = occupationEn;
                }
                if (!occupation && !name && !credit && !attribute) {
                  return null;
                } else {
                  return {
                    occupation: {
                      value: occupation,
                      ch: occupationCh,
                      en: occupationEn,
                    },
                    name: {
                      value: name,
                      ch: nameCh,
                      en: nameEn,
                    },
                    credit: {
                      value: credit,
                      ch: creditCh,
                      en: creditEn,
                    },
                    attribute: {
                      value: attribute,
                    },
                  };
                }
              })
              .filter((c) => !!c);
            return celebrities;
          })
          .flat();
        if (celebrityData.length === 0) {
          celebrityData = null;
        }
        return celebrityData;
      }, "celebrityData"),
    });
  }
}

class IMDbInfo extends MInfo {
  static originalOrigin = "https://www.imdb.com";
  static originalPluginOrigin = "http://p.media-imdb.com";
  static proxyOrigin = "https://proxy.secant.workers.dev";
  static isProxified = true;
  static origin = IMDbInfo.isProxified
    ? IMDbInfo.proxyOrigin
    : IMDbInfo.originalOrigin;
  static pluginOrigin = IMDbInfo.isProxified
    ? IMDbInfo.proxyOrigin
    : IMDbInfo.originalPluginOrigin;
  static timeout = 6000;
  static cacheConfig = {
    ttl: 43200,
    encrypt: true,
    encrypter: (data) => LZString.compress(data),
    decrypter: (encryptedString) => LZString.decompress(encryptedString),
  };

  constructor(id) {
    super();
    // define promised lazy getters
    Object.defineProperties(this, {
      id: this.promisedGetterLazify(async () => {
        return id;
      }, "id"),
      titlePathname: this.promisedGetterLazify(
        async () => {
          let titlePathname;
          if (IMDbInfo.isProxified) {
            titlePathname = `/worker/proxy/www.imdb.com/title/tt${await this
              .id}/`;
          } else {
            titlePathname = `/title/tt${await this.id}/`;
          }
          return titlePathname;
        },
        "titlePathname",
        false
      ),
      releaseInfoPathname: this.promisedGetterLazify(
        async () => {
          let releaseInfoPathname;
          if (IMDbInfo.isProxified) {
            releaseInfoPathname = `/worker/proxy/www.imdb.com/title/tt${await this
              .id}/releaseinfo`;
          } else {
            releaseInfoPathname = `/title/tt${await this.id}/releaseinfo`;
          }
          return releaseInfoPathname;
        },
        "releaseInfoPathname",
        false
      ),
      pluginPathname: this.promisedGetterLazify(
        async () => {
          let pluginPathname;
          if (IMDbInfo.isProxified) {
            pluginPathname = `/worker/proxy/p.media-imdb.com/static-content/documents/v1/title/tt${await this
              .id}/ratings%253Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`;
          } else {
            pluginPathname = `/static-content/documents/v1/title/tt${await this
              .id}/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`;
          }
          return pluginPathname;
        },
        "pluginPathname",
        false
      ),
      titleDoc: this.promisedGetterLazify(
        async () => {
          const currentURL = new URL(window.location.href);
          let doc = null;
          if (
            currentURL.origin === IMDbInfo.origin &&
            currentURL.pathname === (await this.titlePathname)
          ) {
            doc = document;
          } else {
            const url = new URL(
              await this.titlePathname,
              IMDbInfo.origin
            ).toString();
            const options = {
              headers: {
                referrer: IMDbInfo.origin,
              },
              timeout: IMDbInfo.timeout,
            };
            const cacheConfig = IMDbInfo.cacheConfig;
            const responseText = await this.getResponseText(
              url,
              options,
              cacheConfig
            );
            if (responseText) {
              try {
                doc = new DOMParser().parseFromString(
                  responseText,
                  "text/html"
                );
              } catch (e) {
                console.warn(e);
              }
            } else {
              console.warn("no response text");
            }
          }
          return doc;
        },
        "titleDoc",
        false
      ),
      releaseInfoDoc: this.promisedGetterLazify(
        async () => {
          const currentURL = new URL(window.location.href);
          let doc = null;
          if (
            currentURL.origin === IMDbInfo.origin &&
            currentURL.pathname === (await this.releaseInfoPathname)
          ) {
            doc = document;
          } else {
            const url = new URL(
              await this.releaseInfoPathname,
              IMDbInfo.origin
            ).toString();
            const options = {
              headers: {
                referrer: IMDbInfo.origin,
              },
              timeout: IMDbInfo.timeout,
            };
            const cacheConfig = IMDbInfo.cacheConfig;
            const responseText = await this.getResponseText(
              url,
              options,
              cacheConfig
            );
            if (responseText) {
              try {
                doc = new DOMParser().parseFromString(
                  responseText,
                  "text/html"
                );
              } catch (e) {
                console.warn(e);
              }
            } else {
              console.warn("no response text");
            }
          }
          return doc;
        },
        "titleDoc",
        false
      ),
      pluginResponseText: this.promisedGetterLazify(
        async () => {
          let responseText = null;
          const url = new URL(
            await this.pluginPathname,
            IMDbInfo.pluginOrigin
          ).toString();
          const options = {
            headers: {
              referrer: IMDbInfo.pluginOrigin,
            },
            timeout: IMDbInfo.timeout,
          };
          const cacheConfig = IMDbInfo.cacheConfig;
          const pluginResponseText = await this.getResponseText(
            url,
            options,
            cacheConfig
          );
          if (!pluginResponseText) {
            console.warn("no response text");
          }
          return pluginResponseText;
        },
        "pluginResponseText",
        false
      ),
      linkingData: this.promisedGetterLazify(
        async () => {
          const doc = await this.titleDoc;
          const ld =
            dirtyJson.parse(
              htmlEntities.decode(
                doc?.querySelector("head>script[type='application/ld+json']")
                  ?.textContent
              )
            ) || null;
          return ld;
        },
        "linkingData",
        false
      ),
    });
  }
}

class MtimeInfo extends MInfo {
  constructor(id) {
    super();
    // define promised lazy getters
    Object.defineProperties(this, {
      id: this.promisedGetterLazify(async () => {
        return id;
      }, "id"),
    });
  }
}

function splitOI(word) {
  word = word.trim();
  const splitOIRegExp = /^(?<o>.*?)(?:\((?<i>[^\(]*?)\))?$/;
  let { o = null, i = null } = word.match(splitOIRegExp)?.groups || {};
  return {
    o: o ? o.trim() : o,
    i: i ? i.trim() : i,
  };
}

function splitChEn(word) {
  word = word.trim();
  const splitChEnRegExp =
    /^(?<ch>.*\p{Script=Han}[^\s\p{Script=Han}]*)(?: +(?<en1>[^\p{Script=Han}]*))?$|^(?<en2>[^\p{Script=Han}]*)$/u;
  const splitEnEnRegExp = /^(?<en>[^\p{Script=Han}]*?) +\k<en>$/u;
  let {
    ch = null,
    en1 = null,
    en2 = null,
  } = word.match(splitChEnRegExp)?.groups || {};
  let en = (en1 || en2)?.trim() || null;
  if (ch === null) {
    en = en.match(splitEnEnRegExp)?.groups.en || en;
  }
  return {
    ch: ch ? ch.trim() : ch,
    en: en ? en.trim() : en,
  };
}
